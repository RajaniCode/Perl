package CatPaste::Model::IKC;

use strict;
use warnings;
use base 'Catalyst::Model';

use Carp;
use POE::Component::IKC::ClientLite;

__PACKAGE__->mk_accessors( qw/remote/ );

=head1 NAME

CatPaste::Model::IKC - Catalyst Model for POE::Component::IKC communications

=head1 DESCRIPTION

Catalyst Model.

=cut

sub COMPONENT {
    my $self = shift->NEXT::COMPONENT(@_);

    die "Check configuration, requires port and channel to publish"
        unless $self->{port} and $self->{channel};
    my $name = $self->{name} || ref $self;

    $self->remote( create_ikc_client(
        port => $self->{port},
        name => $self->{name} . "_$$",
        timeout => 10
    ) );

    carp "Couldn't create IKC client, IKC notification disabled\n"
        unless $self->remote;

    return $self;
}

sub notify {
    my ( $self, $message ) = @_;
    return undef unless $self->remote;

    $self->remote->post( $self->{channel}, $message );
}

=head1 AUTHOR

J. Shirley <jshirley@gmail.com>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
