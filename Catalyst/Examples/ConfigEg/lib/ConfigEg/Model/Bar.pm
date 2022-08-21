package ConfigEg::Model::Bar;

use strict;
use warnings;
use base 'Catalyst::Model';

use Data::Dump qw(dump);

__PACKAGE__->config( 'hello' => 'world ' );

    
=head1 NAME

ConfigEg::Model::Bar - Catalyst Model

=head1 DESCRIPTION

Catalyst Model.

=head1 METHODS

=cut

sub COMPONENT {
    my $self = shift->next::method(@_);
    print "\n", dump($self), "\n";
    return $self;
}

=head1 AUTHOR

A clever guy

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
