use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'CatTube' }
BEGIN { use_ok 'CatTube::Controller::Search' }

ok( request('/search')->is_success, 'Request should succeed' );


