use strict;
use warnings;
use FindBin qw/$Bin/;
use DBICx::Deploy;
use Test::More tests => 1;
use Test::Exception;

my $fn =  $Bin . '/../cat_test_smoke.db';
if (! -r $fn) {
    lives_ok {
        DBICx::Deploy->deploy(
            'SmokeDB' => 'DBI:SQLite:' . $fn
        );
    }
}
else {
    ok 1;
}

