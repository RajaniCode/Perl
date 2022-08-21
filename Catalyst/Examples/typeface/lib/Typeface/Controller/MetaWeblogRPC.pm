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

package Typeface::Controller::MetaWeblogRPC;

use strict;
use warnings;
use base 'Catalyst::Controller';

sub getBlogPosts : XMLRPCPath('/metaWeblog/getRecentPosts') {
    my ( $self, $c, $blogid, $login, $password, $number_of_posts ) = @_;

    if ( $c->login( $login, $password ) ) {

        my @articles =
          $c->model('Typeface::Articles')->get_latest_articles($number_of_posts);

        my @returnXML;
        for ( my $i = 0 ; $i < scalar(@articles) ; $i++ ) {
            my $url = $c->nifty_txt_to_url( $articles[$i]->subject() );
            $url = $c->uri_for( 'view', $url );

            my @cats = ();
            foreach my $cat ( $articles[$i]->categories ) {
                push @cats, $cat->name;
            }

            my %post = (
                title       => $articles[$i]->subject,
                description => $articles[$i]->body,
                userid      => $articles[$i]->user->name,
                'link'      => $url,
                categories  => [@cats],
                postid      => $articles[$i]->id,
                dateCreated => $articles[$i]->created_at->datetime,
            );

            push @returnXML, \%post;
        }
        $c->stash->{xmlrpc} = [@returnXML];
    }

    $c->res->body('stub');
}

sub getBlogCategories : XMLRPCPath('/metaWeblog/getCategories') {
    my ( $self, $c, $blogid, $login, $password ) = @_;

    my @returnXML;
    if ( $c->login( $login, $password ) ) {
        my @cat =
          $c->model('Typeface::Categories')->search( undef, {} )->all();
        for ( my $i = 0 ; $i < scalar(@cat) ; $i++ ) {
            my $url = $cat[$i]->name();
            $url = $c->nifty_txt_to_url($url);

            # FIXME: $url = $c->uri_for( 'view', $url ); clean it up
            $url = $c->uri_for ("category/" . $url);

            my %category = (
                categoryId   => $cat[$i]->id,
                categoryName => $cat[$i]->name,
                description  => $cat[$i]->name,
                htmlUrl      => $url,
            );
            push @returnXML, \%category;
        }

        $c->stash->{xmlrpc} = [@returnXML];
    }

    $c->res->body('stub');
}

sub getUsersBlogs : XMLRPCPath('/blogger/getUsersBlogs') {
    my ( $self, $c, $hash, $login, $password ) = @_;

    $c->stash->{xmlrpc} = [
        {
            url      => $c->uri_for('/'),
            blogid   => 1,
            blogName => $c->uri_for('/'),
            isAdmin  => 1
        }
    ];

    $c->res->body('stub');
}

sub deletePost : XMLRPCPath('/blogger/deletePost') {
    my ( $self, $c, $hash, $post_to_delete, $login, $password, $blogid ) = @_;
    if ( $c->login( $login, $password ) ) {
        $c->log->info( 'post to delete: ' . $post_to_delete );
        $c->model('Typeface::Articles')->find($post_to_delete)->delete();
        $c->forward( 'submit', 'cache_refresh' );   # send it off to clear cache
    }
    $c->res->body('stub');
}

sub newPost : XMLRPCPath('/metaWeblog/newPost') {
    my ( $self, $c, $blogid, $login, $password, $post ) = @_;

    if ( $c->login( $login, $password ) ) {
        $c->log->info('Posting...');
        my $article = $c->forward(
            'admin',
            'save_article',
            [
                {
                    subject    => $post->{title},
                    body       => $post->{description},
                    categories => $post->{categories},
                }
            ]
        );
        $c->stash->{xmlrpc} = $article->id();
    }

    $c->res->body('stub');
}

sub getPost : XMLRPCPath('/metaWeblog/getPost') {
    my ( $self, $c, $postid, $login, $password ) = @_;

    if ( $c->login( $login, $password ) ) {
        my $article = $c->model('Typeface::Articles')->find($postid);

        my $url = $c->nifty_txt_to_url( $article->subject() );
        $url = $c->uri_for( 'view', $url );
        $c->stash->{xmlrpc} = {
            title       => $article->subject,
            description => $article->body,
            userid      => $article->user->name,
            'link'      => $url,
            postid      => $article->id,
            dateCreated => $article->created_at->datetime
        };
    }
    $c->res->body('stub');
}

sub getUserInfo : XMLRPCPath('/blogger/getUserInfo') {
    my ( $self, $c, $appkey, $login, $password ) = @_;

    if ( $c->login( $login, $password ) ) {
        $c->stash->{xmlrpc} = {
            nickname  => $c->user->name,
            userid    => $c->user->id,
            email     => $c->user->name,
            url       => $c->uri_for($c->user->name),
            lastname  => $c->user->name,
            firstname => $c->user->name,
        };
    }
    $c->res->body('stub');
}

sub editPost : XMLRPCPath('/metaWeblog/editPost') {
    my ( $self, $c, $postid, $login, $password, $post ) = @_;

    if ( $c->login( $login, $password ) ) {
        my $article = $c->forward(
            'admin',
            'save_article',
            [
                {
                    id         => $postid,
                    subject    => $post->{title},
                    body       => $post->{description},
                    categories => $post->{categories},
                }
            ]
        );
		$c->stash->{xmlrpc} = $article->id();
    }

    $c->res->body('stub');
}

1;
