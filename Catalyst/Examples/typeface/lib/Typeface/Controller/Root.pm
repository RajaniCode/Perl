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

package Typeface::Controller::Root;
use strict;
use warnings;
use base 'Catalyst::Controller::FormBuilder';
use HTML::CalendarMonthSimple;

__PACKAGE__->config->{namespace} = '';

sub begin : Private {
    my ( $self, $c ) = @_;

    $c->stash->{pages} =
       [ $c->model('Typeface::Pages')->search( display_in_drawer => 1 )->all() ];
    $c->stash->{activelink} =
      { home => 'activelink' };    # set it to home unless overridden.

	$c->stash->{sidebar} = 1;
	
	$c->stash->{xmlrpc}=undef;
}


sub category : Local {
    my ( $self, $c, $category ) = @_;

    my $cat =
      $c->model('Typeface::Categories')
      ->search( { name => { like => $c->nifty_url_to_query($category) } } )
      ->first();
    $c->stash->{articles} = [ $cat->articles() ];
	$c->stash->{template} = 'index.tt2';
    $c->stash->{rss}      = $cat->name();
}

sub page : Local {
    my ( $self, $c, $what ) = @_;

    my $page =
      $c->model('Typeface::Pages')
      ->search( { name => { like => $c->nifty_url_to_query($what) } } )
      ->first();

    $c->stash->{sidebar} = undef unless $page->display_sidebar();
    $c->stash->{page} = $page;
    $c->stash->{title} = $page->name;
    my $name = $c->nifty_txt_to_url( $page->name );
    $c->stash->{activelink} = { $name => 'activelink' };
	$c->stash->{template} = 'page.tt2';
}

sub blog : Local {
    my ( $self, $c, $blog ) = @_;

    #TODO add blog/some_group_blog
    $c->res->body('Not implemented yet.');
}

sub blogs : Local {
    my ( $self, $c ) = @_;

    my @blogs = $c->model('Typeface::Blogs')->all();
    $c->stash->{blogs}    = [@blogs];
	$c->stash->{template} = 'blogs.tt2';
    $c->forward( $c->view('REMOTE') );

    #$c->res->body('<p>Multi User Blogs not implemented yet.</p>')
}

sub archived : Local {
    my ( $self, $c, $year, $month, $day ) = @_;
    my @articles =
      $c->model('Typeface::Articles')->archived( $year, $month, $day );

    $c->stash->{articles} = [@articles];
	$c->stash->{template} = 'index.tt2';
}

sub default : Local {
    my ( $self, $c ) = @_;
	
    my @articles = $c->model('Typeface::Articles')->get_latest_articles();

    $c->stash->{articles} = [@articles];
	$c->stash->{template} = 'index.tt2';
}

sub categories : Local {
    my ( $self, $c ) = @_;

    my @categories =
      $c->model('Typeface::Categories')->all();
    $c->stash->{categories} = [@categories];
}

sub links : Local {
    my ( $self, $c ) = @_;
    my @links =
      $c->model('Typeface::Links')
      ->search( undef, { order_by => 'id desc' } )->all();


    $c->stash->{links} = [@links];
}

sub calendar : Local {
    my ( $self, $c ) = @_;

    
	my $dt = DateTime->now();
    my $cal = new HTML::CalendarMonthSimple(
        'year'  => $dt->year,
        'month' => $dt->month
    );
    $cal->border(0);
    $cal->width(50);
	$cal->headerclass('month_date');
    $cal->showweekdayheaders(0);
    
    my @articles =
      $c->model('Typeface::Articles')->from_month( $dt->month );
      
    foreach my $article (@articles) {
        my $location = '/archived/' . $article->created_at->year() . '/' 
                                    . $article->created_at->month() . '/' 
                                    . $article->created_at->mday();
        $cal->setdatehref( $article->created_at->mday() , $location );
    }

    $c->stash->{calendar} = $cal->as_HTML;
}

sub archives : Local {
    my ( $self, $c ) = @_;

    my @articles =
      $c->model('Typeface::Articles')->all();

    unless (@articles) {
        $c->stash->{archives} = "<p>No Articles in Archive!</p>";
        return;
    }

    my $months;
    foreach my $article (@articles) {
        my $month = $article->created_at()->month_name();
        my $year  = $article->created_at()->year();
        my $key   = "$year $month";
        if ( (defined $months->{$key}->{count}) && ($months->{$key}->{count} > 0) ) {
            $months->{$key}->{count} += 1;
        }
        else {
            $months->{$key}->{count} = 1;
            $months->{$key}->{year} = $year;
            $months->{$key}->{month} = $article->created_at()->month();
        }
    }

    my @out;
    while ( my ( $key, $value ) = each(%{$months}) ) {
        push @out,"<li><a href='/archived/$value->{year}/$value->{month}'>$key</a> <span class='special_text'>($value->{count})</span></li>";
    }
    $c->stash->{archives} = join(' ',@out);
}


sub test : Local Form {
    my ( $self, $c ) = @_;
    #$self->formbuilder->fields([qw/blah blah2/]);
    $self->formbuilder->field(name => 'blah', label=>'eh', required=>1);
    $c->stash->{sidebar} = 0;
    # $c->stash->{template} = 'page.tt2';
    $c->stash->{template} = 'index.tt2';
    # $c->stash->{template} = 'page.tt2';
}




sub enable_sidebar : Local {
    my ( $self, $c ) = @_;

	$c->forward('/categories');
	$c->forward('/archives');
	$c->forward('/links');
	$c->forward('/calendar');
}

sub auto : Private {
    my ( $self, $c ) = @_;

    $c->set_nifty_params(
        [
            [ 'ul#error_content h3', 'top' ]
        ]
    );


    return 1;
}

sub end : Private {
    my ( $self, $c ) = @_;
    
    return 1 if $c->req->method eq 'HEAD';
    return 1 if length( $c->response->body );
    return 1 if scalar @{ $c->error } && !$c->stash->{template};
    return 1 if $c->response->status =~ /^(?:204|3\d\d)$/;

	$c->forward('/enable_sidebar') if $c->stash->{sidebar};
    $c->forward('TT');
}

1;
