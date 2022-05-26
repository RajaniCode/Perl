package Schema::User;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("user");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "username",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "email",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "password",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "status",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "role_text",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "session_data",
  { data_type => "TEXT", is_nullable => 0, size => undef },
);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2008-04-30 15:54:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Ve4gGdBYHK4WkUKEPK9p9w


# You can replace this text with custom content, and it will be preserved on regeneration

__PACKAGE__->has_many( 'map_user_role' => 'Schema::UserRole' => 'user' );
__PACKAGE__->many_to_many( roles => 'map_user_role', 'role');


1;
