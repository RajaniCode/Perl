# Copyright (C) 2006  name of Victor Igumnov
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

package Typeface::View::TT;

use strict;
use base 'Catalyst::View::TT';
use Template::Stash::XS;
use Path::Class qw(dir);

__PACKAGE__->config({
	COMPILE_DIR => dir( Typeface->config->{home}, 'tmp') ,
    STASH => Template::Stash::XS->new,
    CATALYST_VAR => 'c',
    INCLUDE_PATH => [
        Typeface->path_to( 'root', 'src' ),
        Typeface->path_to( 'root', 'lib' ),
		Typeface->path_to( 'root', 'templates' , Typeface->config->{site}->{template}),
		Typeface->path_to( 'root', 'shared'),
    ],
    PRE_PROCESS  => 'config/main',
    WRAPPER      => 'site/wrapper',
    TIMER        => 0
});

=head1 NAME

Typeface::View::TT - Catalyst TTSite View

=head1 SYNOPSIS

See L<Typeface>

=head1 DESCRIPTION

Catalyst TTSite View.

=head1 AUTHOR

Victor Igumnov

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;

