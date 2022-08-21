use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'GeoCat' }
BEGIN { use_ok 'GeoCat::Controller::Search' }

ok( request('/search')->is_success, 'Request should succeed' );


