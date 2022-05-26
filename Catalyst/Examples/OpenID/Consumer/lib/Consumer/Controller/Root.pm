package Consumer::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

=head1 NAME

Consumer::Controller::Root - Root Controller for Consumer

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=cut

=head2 default

=cut

sub login : Local Args(0) {
    my ( $self, $c ) = @_;
    if ( $c->authenticate_openid ) {
        $c->res->redirect( $c->uri_for('/') );
    }
}

sub index : Local {}

=head2 end

Attempt to render a view, if needed.

=cut 

sub end : ActionClass('RenderView') {
}

=head1 AUTHOR

Eden Cardoso Cardim,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
