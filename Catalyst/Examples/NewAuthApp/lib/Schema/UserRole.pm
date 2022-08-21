package Schema::UserRole;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("user_role");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "user",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "roleid",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2008-04-30 15:54:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:E1wTbZtsp6Ge8mHwpbLnGw


# You can replace this text with custom content, and it will be preserved on regeneration
__PACKAGE__->belongs_to('role', 'Schema::Role', { 'foreign.id' => 'self.roleid'});

1;
