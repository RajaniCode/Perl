use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'ExtJS' }
BEGIN { use_ok 'ExtJS::Controller::ExtJS::Controller::ExtJS' }

ok( request('/extjs/controller/extjs')->is_success, 'Request should succeed' );


