package Cheer::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

=head1 NAME

Cheer::Controller::Root - Root Controller for Cheer

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=cut

=head2 default

=cut

sub default : Private {
    my ( $self, $c ) = @_;
    $c->res->status(404);
    $c->stash->{template}='404.tt';
}

=head2 index

=cut

sub index : Private {
    my ($self, $c) = @_;
    $c->stash->{days_till_xmas} = $c->model('Now')->days_till_xmas();
    $c->stash->{template} = 'hi_there.tt';
}

=head2 end

Attempt to render a view, if needed.

=cut 

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

Kieren Diment

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
