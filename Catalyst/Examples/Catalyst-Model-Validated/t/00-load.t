#!perl -T

use Test::More tests => 1;

BEGIN {
  use_ok('Catalyst::Model::Validated');
}

diag( "Testing Catalyst::Model::Validated $Catalyst::Model::Validated::VERSION,"
    . " Perl $], $^X" );
