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

package Typeface::Model::Typeface;

use strict;
use base 'Catalyst::Model::DBIC::Schema';


# ./script/typeface_create.pl model DB::Typeface DBIC::Schema DB::Typeface::Schema create=static "dbi:Pg:dbname=typeface;host=xxxx;user=xxxx;password=xxxxx"

=head1 NAME

DB::Typeface - Catalyst DBIC Schema Model
=head1 SYNOPSIS

See L<Typeface>

=head1 DESCRIPTION

L<Catalyst::Model::DBIC::Schema> Model using schema L<DB::Typeface::Schema>

=head1 AUTHOR

Victor Igumnov

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
