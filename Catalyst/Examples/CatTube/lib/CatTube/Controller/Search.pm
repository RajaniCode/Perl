package CatTube::Controller::Search;

use strict;
use warnings;
use base 'Catalyst::Controller';

=head1 NAME

CatTube::Controller::Search - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index 

=cut

sub index : Private {
    my ( $self, $c ) = @_;

    my @videos = ();
    if ( $c->req->param('tags') ) {
        @videos = $c->model('YouTube')->list_by_tag($c->req->param('tags'));
    } else {
        @videos = $c->model('YouTube')->list_featured;
    }
    $c->stash->{videos} = \@videos;
}


=head1 AUTHOR

A clever guy

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
