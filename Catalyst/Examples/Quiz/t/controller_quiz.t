use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'Quiz' }
BEGIN { use_ok 'Quiz::Controller::quiz' }

ok( request('/quiz')->is_success, 'Request should succeed' );


