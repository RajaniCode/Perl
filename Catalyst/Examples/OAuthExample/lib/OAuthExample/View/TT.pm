package OAuthExample::View::TT;

use strict;
use base 'Catalyst::View::TT';

__PACKAGE__->config(TEMPLATE_EXTENSION => '.tt');
__PACKAGE__->config(WRAPPER => 'wrapper.tt');

=head1 NAME

OAuthExample::View::TT - TT View for OAuthExample

=head1 DESCRIPTION

TT View for OAuthExample. 

=head1 AUTHOR

=head1 SEE ALSO

L<OAuthExample>

Marcus Ramberg

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
