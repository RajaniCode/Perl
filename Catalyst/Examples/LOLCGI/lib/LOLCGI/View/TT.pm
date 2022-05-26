package LOLCGI::View::TT;

use strict;
use base 'Catalyst::View::TT';

__PACKAGE__->config(
    WRAPPER            => 'site/wrapper',
    TEMPLATE_EXTENSION => '.tt2'
);

=head1 NAME

LOLCGI::View::TT - TT View for LOLCGI

=head1 DESCRIPTION

TT View for LOLCGI. 

=head1 AUTHOR

=head1 SEE ALSO

L<LOLCGI>

Devin,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
