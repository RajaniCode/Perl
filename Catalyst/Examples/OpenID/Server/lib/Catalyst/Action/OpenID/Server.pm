package Catalyst::Action::OpenID::Server;

use warnings;
use strict;

our $VERSION = '0.01';

use Net::OpenID::Server;

use base 'Catalyst::Action';

sub openid_register {
    my ( $self, $controller ) = @_;
    $controller->_server_action($self);
}

sub execute {
    my $self = shift;
    my ( $controller, $c ) = @_;

    my $nos = Net::OpenID::Server->new(
        get_args      => $c->req->query_parameters,
        post_args     => $c->req->body_parameters,
        get_user      => sub { $controller->get_user( $c, @_ ) },
        is_identity   => sub { $controller->is_identity( $c, @_ ) },
        is_trusted    => sub { $controller->is_trusted( $c, @_ ) },
        server_secret => 'secret',
        setup_url =>
            $c->uri_for( $self, $c->req->query_parameters )->as_string
    );

    # run action to populate stash for controller callbacks
    $self->NEXT::execute(@_);

    my ( $type, $data ) = $nos->handle_page();

    if ( $c->stash->{cancel} ) {
        $c->res->redirect(
            $nos->cancel_return_url( return_to => $data->{return_to} ) );
        return;
    }
    elsif ( $type eq 'redirect' ) {
        $c->res->redirect($data);
    }
    elsif ( $type eq 'setup' ) {

        # stash $data so the view can use it
        $c->stash->{openid} = $data;
    }
    else {
        $c->res->content_type($type);
        $c->res->body($data);
    }
}

1;    # Magic true value required at end of module
__END__

=head1 NAME

Catalyst::Action::OpenID::Server - OpenID server endpoint in a Catalyst action


=head1 VERSION

This document describes Catalyst::Action::OpenID::Server version 0.0.1


=head1 SYNOPSIS

    use Catalyst::Action::OpenID::Server;  

  
=head1 DESCRIPTION


=head1 AUTHOR

Eden C. Cardim  C<< <edencardim@gmail.com> >>


=head1 LICENSE

This library is copyright (C) 2007, PictureTrail.com

=cut
