package GeoCat::Model::Geocode;

use strict;
use warnings;
use base 'Catalyst::Model';

use Geo::Coder::Google;
use Class::C3;

=head1 NAME

GeoCat::Model::Geocode - Catalyst Model

=head1 DESCRIPTION

Catalyst Model.

=head1 AUTHOR

A clever guy

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

sub ACCEPT_CONTEXT {
    my ( $self, $c ) = @_;
    $self->{'geocoder'} ||= Geo::Coder::Google->new(
        apikey => $c->config->{google}->{apikey} );
    $c->log->debug("API key: " . $c->config->{google}->{apikey});
    return $self;
}

sub geocode {
    my ( $self, $location ) = @_;
    return $self->{'geocoder'}->geocode( location => $location );
}

1;
