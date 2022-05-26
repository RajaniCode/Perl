package Fu::View::TT;

use strict;
use base 'Catalyst::View::TT';

__PACKAGE__->config({

            INCLUDE_PATH => [
              Fu->path_to( 'root', 'src' ), 
              Fu->path_to( 'root', 'lib' ), 
            ],
            WRAPPER            => 'wrapper.tt',
            TEMPLATE_EXTENSION => '.tt',

});

=head1 NAME

Fu::View::TT - TT View for Fu

=head1 DESCRIPTION

TT View for Fu. 

=head1 AUTHOR

=head1 SEE ALSO

L<Fu>

Bogdan Lucaciu,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
