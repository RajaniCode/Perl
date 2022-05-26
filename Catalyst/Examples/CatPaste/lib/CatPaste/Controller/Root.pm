package CatPaste::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller::BindLex';

use XML::Feed;

# Just used for keeping track of the syntax highlighter meta-information.
# It desperately needs to get moved into a Model class.
our $VALID_TYPES;
our %VALID_TYPES_HASH;

# What weight (sort order) do we want for the languages?
our %WEIGHT = (
    Perl        => 100,
    JavaScript  => 90,
    PHP_PHP     => 80,
    PHP_HTML    => 70,
    SQL_MySQL   => 60 
);

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

# Add C<my $foo : Param> support to BindLex
__PACKAGE__->config->{bindlex}{Param} = sub { $_[0]->req->params };

=head1 NAME

CatPaste::Controller::Root - Root Controller for CatPaste

=head1 DESCRIPTION

The root controller encapsulates all the actions for CatPaste.  It's just not
that complex of an application

=head1 METHODS

=cut

=head2 base

The base level chain, this is similar to "auto" and all other actions attach
to it.

=cut

sub base : Chained('/') PathPart('') CaptureArgs(0) {
    my $page : Stashed;
    $page ||= {
        links   => [],
        scripts => [],
        stylesheets => []
    };

}

=head2 root

Root action, displays the paste

=cut

sub root : Chained('base') PathPart('') Args(0) {
    my ( $self, $c ) = @_;
    
    $c->forward('valid_types');

    # TODO 0.02: Categories not in use in 0.01
    #my $categories : Stashed = $c->model('Schema::Category');
}

=head2 post

Post a new paste to store

=cut

sub post : Chained('base') PathPart('post') Args(0) {
    my ( $self, $c ) = @_;
    
    my $paste  : Param;
    my $title  : Param;
    my $type   : Param;
    my $author : Param;

    unless ( $c->req->method eq 'POST' and $paste ) {
        $c->res->redirect( $c->uri_for( $c->controller->action_for('root' ) ) );
        $c->detach;
    }
    $c->forward('valid_types');
    
    my $pk1;

    my $create_txn = sub {
        my $entry : Stashed = $c->model('Schema::Paste')->create( {
            category_pk1 => $c->model('Schema::Category')
                ->find_or_create({ label => 'General' })->pk1,
            title    => $title || 'Untitled Paste',
            author   => $author || 'Anonymous Coward',
            ip_address => $c->req->address,
            type     => exists $VALID_TYPES_HASH{$type} ?
                $type : 'Plain'
        });
        my $file = File::Spec->catfile(
            $c->config->{bucket}->{path}, $entry->pk1);
        $c->log->debug("Opening $file") if $c->debug;
        open( my $fh, ">$file" ) or die "Unable to open $file";
        print $fh $paste;
        close( $fh );

        $pk1 = $entry->pk1;

        $c->model('IKC')->notify(
            "Paste: $title at "  .
            $c->uri_for( $c->controller->action_for('paste'), $pk1 )
        );
        $c->model('IKC')->notify(
            "Paste: " .
                $entry->title . " from " .
                $entry->author . "(" . $entry->ip_address . ") at "  .
                $c->uri_for( $c->controller->action_for('paste'), $pk1 )
        );
    };
    $c->model('Schema')->schema->txn_do( $create_txn );
    
    if ( $pk1 ) {
        $c->res->redirect(
            $c->uri_for( $c->controller->action_for('paste'), $pk1 )
        );
        $c->detach;
    } else {
        my $template : Stashed = 'paste/root.tt';
        my $error    : Stashed =
            'Sorry, there was a problem creating your paste';
    }
}

=head2 paste/${paste_id}

Display a paste from the database.  The template will take care of rendering
a not found message (not good practice).

=cut

sub paste : Chained('base') PathPart('') Args(1) {
    my ( $self, $c, $paste_id ) = @_;
    my $paste : Stashed = $c->model('Schema::Paste')->find( int($paste_id) );
}

=head2 feed

Generate the RSS feed of the last 50 pastes.

=cut

sub feed : Chained('base') PathPart('current.rss')  Args(0) {
    my ( $self, $c ) = @_;

    my $feed = XML::Feed->new('RSS');
    my $entries : Stashed = $c->model('Schema::Paste')->search(
        undef, { page => 1, rows => 50 } );

    $feed->title( 'CatPaste RSS Feed' );
    $feed->link( $c->req->base );
    $feed->description( 'Where the pastes are.' );

    while ( my $entry = $entries->next ) {
        my $feed_entry = XML::Feed::Entry->new('RSS');
        $feed_entry->title( $entry->title );
        $feed_entry->link(
            $c->uri_for( $c->controller->action_for('paste'), $entry->id ) );
        $feed_entry->issued( $entry->t_created );
        $feed->add_entry( $feed_entry );
    }

    $c->res->content_type('application/rss+xml');
    $c->res->body( $feed->as_xml );

}

=head1 PRIVATE ACTIONS 

=head2 valid_types

Populate the stash key "types" with valid syntax highlighting types.

This code would be better served out of a module that loads the information at
startup, rather than first request.

=cut

sub valid_types : Private {
    unless ( $VALID_TYPES ) {
        my $finder = Module::Pluggable::Object->new(
            search_path => 'Syntax::Highlight::Engine::Kate'
        );
        %VALID_TYPES_HASH =
            map { s/Syntax::Highlight::Engine::Kate:://; $_ => 1 ; }
            $finder->plugins;

        $VALID_TYPES = [
            sort { ( $WEIGHT{$b} || 1 ) <=> ( $WEIGHT{$a} || 1 ) }
            keys %VALID_TYPES_HASH
        ];
    }
    my $types : Stashed = $VALID_TYPES;
}


=head2 end

Attempt to render a view, if needed.

=cut 

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

J. Shirley <jshirley@gmail.com>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
