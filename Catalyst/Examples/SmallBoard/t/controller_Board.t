use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'Board' }
BEGIN { use_ok 'SmallBoard::Controller::Board' }

ok( request('/board')->is_success, 'Request should succeed' );



done_testing();
