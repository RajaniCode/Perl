package MyApp::Model::DB;

use warnings;
use strict;

use base qw/Catalyst::Model::DBIC::Schema/;

__PACKAGE__->config(
  schema_class => 'MyApp::Schema',
  connect_info => [ 'dbi:SQLite:db_file', '', '' ]
);

1;
