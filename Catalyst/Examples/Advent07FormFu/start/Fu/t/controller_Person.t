use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'Fu' }
BEGIN { use_ok 'Fu::Controller::Person' }

ok( request('/person')->is_success, 'Request should succeed' );


