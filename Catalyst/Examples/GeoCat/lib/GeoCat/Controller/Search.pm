package GeoCat::Controller::Search;

use strict;
use warnings;
use base 'Catalyst::Controller';

=head1 NAME

GeoCat::Controller::Search - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 base

Start the search chain, all actions in search should bind here

=cut

sub base : Chained('/base') : PathPart('search') : CaptureArgs(0) {
    my ( $self, $c ) = @_;
}

=head2 root

The default controller for /search

=cut

sub root : Chained('base') : PathPart('') : Args(0) {
    my ( $self, $c ) = @_;
    if ( $c->req->params->{location} ) {
        $c->stash->{location} = $c->model('Geocode')
            ->geocode( $c->req->params->{location});
    }
    $c->forward('View::JSON')
}


=head1 AUTHOR

A clever guy

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
