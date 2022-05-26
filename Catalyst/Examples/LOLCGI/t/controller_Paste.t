use strict;
use warnings;
use Test::More tests => 3;

BEGIN { use_ok 'Catalyst::Test', 'LOLCGI' }
BEGIN { use_ok 'LOLCGI::Controller::Paste' }

ok( request('/paste')->is_success, 'Request should succeed' );


