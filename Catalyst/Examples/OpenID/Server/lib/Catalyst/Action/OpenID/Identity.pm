package Catalyst::Action::OpenID::Identity;

use warnings;
use strict;

our $VERSION = '0.01';

use base 'Catalyst::Action';

sub execute {
    my $self = shift;
    my ( $controller, $c, @args ) = @_;

    # check identity if we're a subrequest
    if ( $c->stash->{is_subreq} ) {

        # custom identity check
        $self->NEXT::execute(@_);

        # default identity check
        if ( !exists $c->stash->{is_identity} && $c->user_exists ) {
            $c->stash->{is_identity} = $c->user->id eq $args[0];
        }

        $c->res->body(
            $c->stash->{is_identity} ? 'is_identity' : 'not_identity' );
        return;
    }

    my $action     = $controller->_server_action;
    my $openid_var = $self->attributes->{OPENID_VAR} || 'openid_server';
    my $href       = $c->uri_for($action)->as_string;

    $c->stash->{$openid_var} = qq{<link rel="openid.server" href="$href" />};
}

1;    # Magic true value required at end of module
__END__

=head1 NAME

Catalyst::Action::OpenID::Identity - OpenID identity as a Catalyst action

=head1 VERSION

This document describes Catalyst::Action::OpenID::Identity version 0.0.1


=head1 SYNOPSIS

    use Catalyst::Action::OpenID::Identity;
  
=head1 DESCRIPTION

=head1 SEE ALSO

L<Catalyst::Controller::OpenID>, L<Catalyst::Action::OpenID::Server>

=head1 AUTHOR

Eden C. Cardim  C<< <edencardim@gmail.com> >>

=head1 LICENSE

This library is copyright (C) 2007, PictureTrail.com

=cut
