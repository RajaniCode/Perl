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

package DB::Typeface::Schema::Categories;

# Created by DBIx::Class::Schema::Loader v0.03007 @ 2006-10-18 15:02:47

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("PK::Auto","Core");
__PACKAGE__->table("categories");
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
);
__PACKAGE__->set_primary_key("id");

__PACKAGE__->has_many( 'categories_articles' => 'DB::Typeface::Schema::CategoriesArticles', 'category_id');
__PACKAGE__->many_to_many( 'articles' => 'categories_articles', 'article');

1;

