use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'ProgressiveAuth' }
BEGIN { use_ok 'ProgressiveAuth::Controller::Auth' }

ok( request('/auth')->is_success, 'Request should succeed' );


