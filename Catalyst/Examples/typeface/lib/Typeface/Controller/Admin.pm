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

package Typeface::Controller::Admin;

use strict;
use warnings;
use base 'Catalyst::Controller::FormBuilder';

sub auto : Private {
    my ( $self, $c ) = @_;
    $c->res->redirect('/') unless ( $c->user );

    return 0 unless ( $c->user );
}

sub clear : Local {
    my ( $self, $c, $id ) = @_;

    my $article = $c->model('Typeface::Articles')->find($id);
    $c->forward( 'submit', 'cache_refresh', [$article] );
    $c->res->body( '<p>cleared cache for ' . $article->subject . '</p>' );
}

sub clear_page : Local {
    my ( $self, $c, $id ) = @_;
    
    my $page = $c->model('Typeface::Pages')->find($id);
    $c->forward( 'submit', 'cache_refresh', [$page] );
    $c->res->body( '<p>cleared cache for ' . $page->name . '</p>' );
}


sub create_page_form : Local Form {
    my ( $self, $c  , $form ) = @_;

    my ( $name, $id, $body, $display_sidebar, $display_in_drawer ) = "";
    if ( defined $c->stash->{page} ) {
        $name = $c->stash->{page}->name();
        $id   = $c->stash->{page}->id();
        if ( $c->stash->{page}->display_sidebar() == 1 ) {
            $display_sidebar = 'Yes';
        }
        else {
            $display_sidebar = 'No';
        }
        if ( $c->stash->{page}->display_in_drawer() == 1 ) {
            $display_in_drawer = 'Yes';
        }
        else {
            $display_in_drawer = 'No';
        }

        $body = $c->stash->{page}->body();
    }

    $form->field(
        name     => 'name',
        required => 1,
        label    => 'Page Name',
        size     => 40,
        value    => $name
    );

    $form->field(
        name     => 'display_sidebar',
        required => 1,
        label    => 'Display the sidebar?',
        type     => 'radio',
        options  => [qw/Yes No/],
        value    => $display_sidebar,
    );

    $form->field(
        name     => 'display_in_drawer',
        required => 1,
        label    => 'Display in the drawer?',
        type     => 'radio',
        options  => [qw/Yes No/],
        value    => $display_in_drawer,
    );

    $form->field(
        name     => 'body',
        required => 1,
        label    => 'Page Content',
        type     => 'textarea',
        cols     => 60,
        rows     => 20,
        value    => $body,
    );

    # make sure no trailing slashes happen.
    $id = '/' . $id if length($id)>0;
    $form->action( '/admin/page_commit' . $id );
    $form->method('post');

}

sub create_category_form : Local Form {
    my ( $self, $c, $form ) = @_;

    my ( $name, $id ) = "";
    if ( defined $c->stash->{category} ) {
        $name = $c->stash->{category}->name;
        $id   = $c->stash->{category}->id;
    }

    $form->field(
        name     => 'name',
        required => 1,
        label    => 'Category Name',
        size     => 40,
        value    => $name
    );

    # make sure no trailing slashes happen.
    $id = '/' . $id if length($id)>0;
    $form->action( '/admin/category_commit' . $id );
    $form->method('post');
}

sub create_link_form : Local Form {
    my ( $self, $c , $form ) = @_;

    my ( $name, $id,$url,$description ) = "";
    if ( defined $c->stash->{link} ) {
        $name = $c->stash->{link}->name;
        $url  = $c->stash->{link}->url;
        $description = $c->stash->{link}->description;
        $id   = $c->stash->{link}->id;
    }

    $form->field(
        name     => 'name',
        required => 1,
        label    => 'Displayed Name',
        size     => 40,
        value    => $name
    );
    
    $form->field(
        name     => 'url',
        required => 1,
        label    => 'Url',
        size     => 40,
        value    => $url
    );
    
    $form->field(
        name     => 'description',
        required => 1,
        label    => 'Description',
        size     => 40,
        value    => $description
    );

    # make sure no trailing slashes happen.
    
    $id = '/' . $id if length($id)>0;
    $form->action( '/admin/link_commit' . $id );
    $form->method('post');
}


sub create_user_form : Local Form {
    my ( $self, $c , $form ) = @_;
    my ( $name, $password, $website, $email, $id ) = "";
    if ( defined $c->stash->{user} ) {
        $name     = $c->stash->{user}->name;
        $password = $c->stash->{user}->password;
        $website  = $c->stash->{user}->website;
        $email    = $c->stash->{user}->email;
        $id       = $c->stash->{user}->id;
    }

    # $self->formbuilder->field(
    # 	name		=> 'picture',
    # 	required 	=> 0,
    # 	label		=> 'User Picture',
    # 	type		=> 'file',
    # );
    $form->field(
        name     => 'name',
        required => 1,
        label    => 'User Name',
        size     => 25,
        value    => $name
    );
    $form->field(
        name     => 'password',
        required => 1,
        type     => 'password',
        label    => 'Password',
        size     => 25,
        value    => $password
    );
    $form->field(
        name     => 'website',
        required => 1,
        label    => 'Website',
        size     => 25,
        value    => $website
    );
    $form->field(
        name     => 'email',
        required => 1,
        label    => 'E-Mail',
        validate => 'EMAIL',
        size     => 25,
        value    => $email
    );
    $form->enctype('multipart/form-data');
    # make sure no trailing slashes happen.
    $id = '/' . $id if length($id)>0;
    $form->action( '/admin/user_commit' . $id );
    $form->method('post');
}

sub create_submit_form : Local Form {
    my ( $self, $c , $form ) = @_;

    my ( $subject, $body, $id, @selected_cat, @selected_blog ) = "";
    if ( defined $c->stash->{article} ) {
        $subject = $c->stash->{article}->subject();
        $body    = $c->stash->{article}->body();
        $id      = $c->stash->{article}->id();
        foreach my $cat ( $c->stash->{article}->categories ) {
            push @selected_cat, $cat->name;
        }
    }

    my @cats = ();
    foreach my $cat ( @{ $c->stash->{categories} } ) {
        push @cats, $cat->name;
    }

    # my @blogs = ();
    # foreach my $blog ( $c->user->blogs ) {
    #     push @blogs, $blog->name;
    # }

    $form->field(
        name     => 'subject',
        label    => 'Subject',
        size     => 40,
		required => 1,
        value    => $subject,
    );
    $form->field(
        name     => 'categories',
        required => 1,
        label    => 'Categories',
        multiple => 1,
        options  => \@cats,
        value    => \@selected_cat,
    );

    #     $self->formbuilder->field(
    #         name     => 'blogs',
    #         required => 1,
    #         label    => 'Blogs',
    #         multiple => 1,
    #         options  => \@blogs,
    # value 	 => \@selected_blog,
    #     );
    $form->field(
        name                 => 'body',
        required             => 1,
        type                 => 'textarea',
        label                => 'Body',
        value                => $body
    );
    # make sure no trailing slashes happen.
    $id = '/' . $id if length($id)>0;
    $form->action( '/admin/commit' . $id );
    $form->method('post');
}

sub category : Local Form {
    my ( $self, $c, $id ) = @_;
    if ( defined $id ) {
        $c->stash->{category} = $c->model('Typeface::Categories')->find($id);
    }
    $c->forward('/admin/create_category_form',[$self->formbuilder]);
    $c->stash->{template} = 'category.tt2';
}

sub page_commit : Local Form {
    my ( $self, $c, $id ) = @_;

    if ( $self->formbuilder->validate ) {
        my $page;
        if ( defined $id ) {
            $page = $c->model('Typeface::Pages')->find($id);
        }
        else {
            $page = $c->model('Typeface::Pages')->new( {} );
        }
        $page->name( $c->req->params->{name} );
        $page->body( $c->req->params->{body} );

        if ( $c->req->params->{display_sidebar} eq "Yes" ) {
            $page->display_sidebar(1);
        }
        else {
            $page->display_sidebar(0);
        }

        if ( $c->req->params->{display_in_drawer} eq "Yes" ) {
            $page->display_in_drawer(1);
        }
        else {
            $page->display_in_drawer(0);
        }

        $page->insert_or_update();

        $c->res->redirect('/admin');
    }
}

sub category_commit : Local Form {
    my ( $self, $c, $id ) = @_;

    if ( $self->formbuilder->validate && $self->formbuilder->submitted ) {
        my $category;
        if ( defined $id ) {
            $category = $c->model('Typeface::Categories')->find($id);
        }
        else {
            $category = $c->model('Typeface::Categories')->new( {} );
        }
        $category->name( $c->req->params->{name} );
        $category->insert_or_update();

        $c->res->redirect('/admin');
    }
}

sub link_commit : Local Form {
    my ( $self, $c, $id ) = @_;

    if ( $self->formbuilder->validate && $self->formbuilder->submitted ) {
        my $link;
        if ( defined $id ) {
            $link = $c->model('Typeface::Links')->find($id);
        }
        else {
            $link = $c->model('Typeface::Links')->new( {} );
        }
        $link->name( $c->req->params->{name} );
        $link->url( $c->req->params->{url} );
        $link->description( $c->req->params->{description} );
        $link->insert_or_update();

        $c->res->redirect('/admin');
    }
}

sub page : Local Form {
    my ( $self, $c, $id ) = @_;
    if ( defined $id ) {
        $c->stash->{page} = $c->model('Typeface::Pages')->find($id);
    }

    $c->forward('/admin/create_page_form',[$self->formbuilder]);
    $c->stash->{template} = 'page.tt2';
}

sub link : Local Form {
    my ( $self, $c, $id ) = @_;
    if ( defined $id ) {
        $c->stash->{link} = $c->model('Typeface::Links')->find($id);
    }

    $c->forward('/admin/create_link_form',[$self->formbuilder]);
    $c->stash->{template} = 'link.tt2';
}

sub user : Local Form {
    my ( $self, $c, $id ) = @_;
    if ( defined $id ) {
        $c->stash->{user} = $c->model('Typeface::Users')->find($id);
    }
    
    $c->forward('/admin/create_user_form',[$self->formbuilder]);
    $c->stash->{template} = 'user.tt2';
}

sub user_commit : Local Form {
    my ( $self, $c, $id ) = @_;

    if ( $self->formbuilder->validate && $self->formbuilder->submitted ) {
        my $user;

# my $home = $c->config->{home};
# my $file = $c->req->params->{picture};
# my $username = $c->user->name;
# $c->req->uploads->{picture}->copy_to("$home/root/static/users/$username.jpg");
#
#
# my $t = new Image::Thumbnail(
#                 module     => 'GD',
#                 size       => 55,
#                 create     => 1,
#                 input      => "$home/root/static/users/$username.jpg",
#                 outputpath => "$home/root/static/users/thumb_$username.jpg",
#         );
#

        if ( defined $id ) {
            $user = $c->model('Typeface::Users')->find($id);
        }
        else {
            $user = $c->model('Typeface::Users')->new( {} );
        }
        $user->name( $c->req->params->{name} );
        $user->password( $c->req->params->{password} );
        $user->email( $c->req->params->{email} );
        $user->website( $c->req->params->{website} );
        $user->insert_or_update();

        $c->res->redirect('/admin');
    }
}

sub index : Local Form {
    my ( $self, $c ) = @_;

    #$c->log->info('HOME ' . $c->config->{home});
    my @articles = $c->model('Typeface::Articles')->get_latest_articles();
    my @categories =
      $c->model('Typeface::Categories')->all();
    my @users = $c->model('Typeface::Users')->all();
    my @pages = $c->model('Typeface::Pages')->all();
    my @links = $c->model('Typeface::Links')->all();

    #my @blogs = $c->user->blogs->all();

    $c->stash->{articles}   = [@articles];
    $c->stash->{categories} = [@categories];
    $c->stash->{users}      = [@users];
    $c->stash->{alinks} = [@links];
    $c->stash->{apages} = [@pages];

    # $c->stash->{blogs}      = [@blogs];

    $c->forward('/admin/create_submit_form',[$self->formbuilder]);
    $c->stash->{template} = 'index.tt2';
}

sub edit : Local Form {
    my ( $self, $c, $id ) = @_;

    $c->stash->{article} = $c->model('Typeface::Articles')->find($id);
    $c->stash->{categories} =
      [ $c->model('Typeface::Categories')->all() ];

    $c->forward('/admin/create_submit_form',[$self->formbuilder]);
    $c->stash->{template} = 'entry.tt2';
}

sub destroy : Local {
    my ( $self, $c, $obj, $id ) = @_;

    $c->model( 'Typeface::' . $obj )->find($id)->delete();
    $c->forward( 'submit', 'cache_refresh' );

    $c->flash->{notice} = "Deleted.";
    $c->res->redirect('/admin');
    $c->stash->{template} = 'index.tt2';
}

sub commit : Local Form {
    my ( $self, $c, $id ) = @_;
    if ( $self->formbuilder->validate && $self->formbuilder->submitted) {
        $c->stash->{template} = 'commit.tt2';
        $self->save_article(
            $c,
            {
                id         => $id,
                subject    => $c->req->params->{subject},
                body       => $c->req->params->{body},
                categories => $c->req->params->{categories},
            }
        );
        $c->res->redirect('/admin');
    }
    else {
        $c->res->redirect('/admin');
    }

    $c->res->body('stub');
}

sub attach_article_to_categories {
    my ( $self, $c, $article, $categories ) = @_;

    my @final_list = ();

    # if its an array do a scan if not , just grab the name
    if ( ref($categories) eq 'ARRAY' ) {
        for my $a (@$categories) {
            for my $cat ($a) {
                my $category =
                  $c->model('Typeface::Categories')->search( name => $cat )
                  ->first();
                push @final_list, $category;

               #$article->add_to_categories($category) if ( defined $category );
            }
        }
    }
    else {
        my $category =
          $c->model('Typeface::Categories')->search( name => $categories )
          ->first();
        push @final_list, $category if ( defined $category );
    }
    $article->set_categories(@final_list) if scalar(@final_list);
}

sub save_article : Local {
    my ( $self, $c, $contents ) = @_;

    my $commit;
    if ( defined $contents->{id} ) {
        $commit = $c->model('Typeface::Articles')->find( $contents->{id} );
    }
    else {
        $commit = $c->model('Typeface::Articles')->new( {} );
    }
    $commit->subject( $contents->{subject} );
    $commit->body( $contents->{body} );
    my $user =
      $c->model('Typeface::User')->search( { name => $c->user->name } )
      ->first();
    $commit->user($user);
    $commit->insert_or_update();
    $self->attach_article_to_categories( $c, $commit, $contents->{categories} );

    $c->forward( 'submit', 'cache_refresh', [$commit] );

    return $commit;
}

sub end : Private {
    my ( $self, $c ) = @_;
    
    return 1 if $c->req->method eq 'HEAD';
    return 1 if length( $c->response->body );
    return 1 if scalar @{ $c->error } && !$c->stash->{template};
    return 1 if $c->response->status =~ /^(?:204|3\d\d)$/;
    
    $c->forward('ADMIN');
}


1;
