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

package DB::Typeface::Schema::Pages;

# Created by DBIx::Class::Schema::Loader v0.03007 @ 2006-10-18 15:02:47

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("PK::Auto","Core");
__PACKAGE__->table("pages");
__PACKAGE__->add_columns(
  "id",
  {
    data_type => 'integer', 
	is_auto_increment => 1,
    default_value => undef,
	is_nullable => 0,
  },
  "name",
  {
    data_type => "character varying",
    default_value => undef,
    is_nullable => 1,
    size => 255,
  },
  "body",
  {
    data_type => "text",
    default_value => undef,
    is_nullable => 1,
  },
  "display_sidebar",
  {
	data_type => 'smallint',
	default_value => 1,
	is_nullable => 0,
   },
  "display_in_drawer",
  {
	data_type => 'smallint',
	default_value => 1,
	is_nullable => 0,
  }
);
__PACKAGE__->set_primary_key("id");

use Text::Textile qw(textile);
sub textilize {
    my $self = shift;
    my $what = shift;
    
    my $temp = $self->$what;
    $temp =~ s/\[code (.*?)\]/==<pre>\[code $1\]/g;
    $temp =~ s/\[\/code\]/\[\/code\]<\/pre>==/g;
    return textile($temp);
}

1;

