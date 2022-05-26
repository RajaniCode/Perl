package SmallBoard::View::TT;

use strict;
use warnings;

use base 'Catalyst::View::TT';

__PACKAGE__->config(
    TEMPLATE_EXTENSION => '.tt2',   
	INCLUDE_PATH => [
	    SmallBoard->path_to( 'root', 'src' ),
	],
    WRAPPER            => 'wrapper',
);

=head1 NAME

SmallBoard::View::TT - TT View for SmallBoard

=head1 DESCRIPTION

TT View for SmallBoard.

=head1 SEE ALSO

L<SmallBoard>

=head1 AUTHOR

Devin Austin

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
