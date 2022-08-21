package GeoCat::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

=head1 NAME

GeoCat::Controller::Root - Root Controller for GeoCat

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=cut

=head2 default

=cut

sub default : Private {
    my ( $self, $c ) = @_;

    $c->response->status(404);
    $c->response->body( qq|404: Not found!| );
}

=head2 base

This gets called for any sub chain (everything should start by binding to this
action)

=cut

sub base : Chained('/') : PathPart('') : CaptureArgs(0) {

}

=head2 root

The root controller, if a user just visits "/"

=cut

sub root : Chained('base') : PathPart('') : Args(0) {

}

=head2 end

Attempt to render a view, if needed.

=cut 

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

Catalyst developer

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
