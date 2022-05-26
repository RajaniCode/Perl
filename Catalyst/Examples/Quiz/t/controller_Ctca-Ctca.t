use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'Quiz' }
BEGIN { use_ok 'Quiz::Controller::Ctca::Ctca' }

ok( request('/ctca/ctca')->is_success, 'Request should succeed' );


