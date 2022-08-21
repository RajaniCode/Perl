package OpenID::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

=head1 NAME

OpenID::Controller::Root - Root Controller for OpenID

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=cut

=head2 identity

=cut

=head2 end

Attempt to render a view, if needed.

=cut

sub end : ActionClass('RenderView') {
}

=head1 AUTHOR

Eden Cardoso Cardim,,,

=head1 LICENSE

This library is copyright (C) 2007, PictureTrail.com

=cut

1;
