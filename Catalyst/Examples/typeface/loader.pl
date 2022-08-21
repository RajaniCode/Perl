use lib './lib';
use DB::Typeface::Schema;

my $db = DB::Typeface::Schema->connect('dbi:SQLite:./mydb.db');

if(!defined $db) {
  print "Can't connect to database!\n";
  exit(0);
}

use lib './lib';
use DBIC::Dumper::YAML;
use Data::Dumper;

my $dumper = DBIC::Dumper::YAML->new();
$dumper->load($db,'fixtures');
