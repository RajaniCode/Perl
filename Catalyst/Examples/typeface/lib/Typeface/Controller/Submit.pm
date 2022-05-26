# Copyright (C) 2006  name of Victor Igumnov
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

package Typeface::Controller::Submit;

use strict;
use warnings;
use base 'Catalyst::Controller::FormBuilder::DBIC';

sub captcha : Local {
    my ( $self, $c ) = @_;
    $c->create_captcha();
}

sub test : Local Form {
    my ( $self, $c, $id ) = @_;
    $id = 0 unless defined $id;
    
    if($self->formbuilder->validate && $self->formbuilder->submitted) {
    }
    else {
        my $article = $c->model('Typeface::Articles')->find_or_new({id=>$id});
        $self->create_form({
            object  => $article,
            action  => '/submit'
        });
    }
    
    $c->stash->{template} = 'test.tt2';
}


sub create_comment_form : Local Form {
    my ( $self, $c, $form , $id ) = @_;

    $form->field(
        name     => 'name',
        required => 1,
        label    => 'Name',
        size     => 25
    );
    $form->field( name => 'email', label => 'Email',   size => 25 );
    $form->field( name => 'url',   label => 'Website', size => 25 );
  
  	$form->field(
        name     => 'comment',
        type     => 'textarea',
        required => 1,
        label    => 'Body',
        cols     => 30,
        rows     => 10
    );

    $form->field(
        name     => 'verification',
        label    => 'Verification',
        size     => 25,
        required => 1
    );
    # make sure no trailing slashes happen.
    $id = '/' . $id;
    $form->action( '/submit/comment' . $id );
    $form->method('post');

}

sub view : Global Form {
    my ( $self, $c, $id ) = @_;


    my $article =
      $c->model('Typeface::Articles')
      ->search( { 'subject' => { like => $c->nifty_url_to_query($id) } } )
      ->first();

    $c->stash->{articles} = $article;
    $c->stash->{title} = $article->subject();
    $c->stash->{comments} = [ $article->comments->all() ];
    
    $c->forward('/submit/create_comment_form',[$self->formbuilder,$article->id]);

    # re-using my index view, might as well
    #to keep a consistent view through out the site.
	$c->stash->{template} = 'index.tt2';
}

sub comment : Local Form {
    my ( $self, $c, $from, $id ) = @_;

    my $commit;
    my $article = $c->model('Typeface::Articles')->find($from);
    if (   $self->formbuilder->validate
        && $c->validate_captcha( $c->req->param('verification') ) )
    {
        if ( defined $id ) {
            $commit = $c->model('Typeface::Comments')->find($id);
        }
        else {
            $commit = $c->model('Typeface::Comments')->new( {} );
            $commit->article($article);
        }
        $commit->name( $c->req->params->{name} );
        $commit->email( $c->req->params->{email} );
		if ($c->req->params->{url} !~ /http/i)
		{
			$commit->url( 'http://' . $c->req->params->{url} );
		} else {
        	$commit->url( $c->req->params->{url} );
		}
        $commit->comment( $c->req->params->{comment} );
        $commit->insert_or_update();

        $self->cache_refresh( $c, $article );
        $c->res->redirect(
            '/view/' . $c->nifty_txt_to_url( $article->subject ) );
    }
    else {
        $c->flash->{notice}='Incorrect verification'
          if ( !$c->validate_captcha( $c->req->param('verification') ) && $c->user);
          $c->res->redirect(
            '/view/' . $c->nifty_txt_to_url( $article->subject ) );
    }

    $c->res->body('stub');
}

sub cache_refresh {
    my ( $self, $c, $item ) = @_;

    #$c->cache->remove('front_page_articles');
    $c->clear_cached_page('/');
    if ( ref($item) eq "Typeface::Model::Typeface::Articles" ) {
        $c->clear_cached_page(
            '/view/' . $c->nifty_txt_to_url( $item->subject ) );
    }
    if ( ref($item) eq "Typeface::Model::Typeface::Pages" ) {
        $c->clear_cached_page(
            '/page/' . $c->nifty_txt_to_url( $item->name ) );
    }
}

1;
