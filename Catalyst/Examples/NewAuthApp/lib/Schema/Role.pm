package Schema::Role;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("role");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "role",
  { data_type => "TEXT", is_nullable => 0, size => undef },
);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2008-04-30 15:54:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:A55sLyGZSrhE0Tr98QTwxw


# You can replace this text with custom content, and it will be preserved on regeneration
1;
