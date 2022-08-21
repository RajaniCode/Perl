package MyApp::Schema::Result::User;

use warnings;
use strict;

use base qw/DBIx::Class/;

__PACKAGE__->load_components(qw/Core/);

__PACKAGE__->table('user');

__PACKAGE__->add_columns(
  id => { data_type => 'INTEGER', is_auto_increment => 1, is_nullable => 0 },
  login_name => { data_type => 'VARCHAR', is_nullable => 0 },
  email      => { data_type => 'VARCHAR', is_nullable => 0 },
  password   => { data_type => 'VARCHAR', is_nullable => 0 }
);

__PACKAGE__->set_primary_key('id');

__PACKAGE__->add_unique_constraint( [qw/login_name/] );

1;
