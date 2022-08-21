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

package Typeface::Controller::Feed;

use strict;
use warnings;
use base 'Catalyst::Controller';
use XML::Feed;
use Text::Textile qw(textile);

sub comments : Local {
    my ( $self, $c, $subject ) = @_;

    my $feed = XML::Feed->new('RSS');
    $feed->title( $c->config->{name} . ' RSS' );
    $feed->link( $c->uri_for('/') );
    $feed->description($c->config->{name} . ' RSS Feed');

    my @comments;
    if ( !defined $subject ) {
        @comments =
          $c->model('Typeface::Comments')->all();
    }
    else {
        @comments =
          $c->model('Typeface::Articles')
          ->search(
            { subject => { like => $c->nifty_url_to_query($subject) } } )
          ->first()->comments();
    }

    for ( my $i = 0 ; $i < scalar(@comments) ; $i++ ) {
        my $feed_entry = XML::Feed::Entry->new('RSS');
        $feed_entry->title( $comments[$i]->name()
              . "'s comment "
              . $comments[$i]->created_at->ymd() );
        my $url = $c->nifty_txt_to_url( $comments[$i]->article()->subject() );
        $feed_entry->link( $c->uri_for('/view/' . $url . '#comments') );
        $feed_entry->summary(
            textile( $comments[$i]->comment() ) );
        $feed_entry->issued( $comments[$i]->created_at() );
        $feed->add_entry($feed_entry);
    }

    $c->res->content_type('application/rss+xml');
    $c->res->body( $feed->as_xml );
}

sub articles : Local {
    my ( $self, $c, $cat ) = @_;

    my $feed = XML::Feed->new('RSS');
    $feed->title( $c->config->{name} . ' RSS' );
    $feed->link( $c->uri_for('/') );
    $feed->description($c->config->{name} . ' RSS Feed');

    my @articles;
    if ( !defined $cat ) {
        @articles = $c->model('Typeface::Articles')->get_latest_articles();
    }
    else {
        @articles =
          $c->model('Typeface::Categories')
          ->search( { name => { like => $c->nifty_url_to_query($cat) } } )
          ->first()->articles();
    }

    for ( my $i = 0 ; $i < scalar(@articles) ; $i++ ) {
        my $feed_entry = XML::Feed::Entry->new('RSS');
        $feed_entry->title( $articles[$i]->subject() );
        my $url = $c->nifty_txt_to_url( $articles[$i]->subject() );
        $feed_entry->link( $c->uri_for( '/view', $url ) );
        $feed_entry->summary( textile( $articles[$i]->body() ) );
        $feed_entry->issued( $articles[$i]->created_at() );
        $feed->add_entry($feed_entry);
    }

    $c->res->content_type('application/rss+xml');
    $c->res->body( $feed->as_xml );
}

1;
