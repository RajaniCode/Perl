package Quiz::View::Quiz;

use strict;
use base 'Catalyst::View::TT';

__PACKAGE__->config({
    CATALYST_VAR => 'Catalyst',
    INCLUDE_PATH => [
        Quiz->path_to( 'root', 'src' ),
        Quiz->path_to( 'root', 'lib' )
    ],
    PRE_PROCESS  => 'config/main',
    WRAPPER      => 'site/wrapper',
    ERROR        => 'error.tt2',
    TIMER        => 0
});

=head1 NAME

Quiz::View::Quiz - Catalyst TTSite View

=head1 SYNOPSIS

See L<Quiz>

=head1 DESCRIPTION

Catalyst TTSite View.

=head1 AUTHOR

Antano Solar 

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;

