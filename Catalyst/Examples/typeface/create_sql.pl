use lib './lib';
use DB::Typeface::Schema;
use Data::Dumper;
use Config::Any::YAML;

my $cfg = Config::Any::YAML->load('typeface.yml');

my $db = DB::Typeface::Schema->connect($cfg->{Typeface}->{connect_info});

#$db->deploy();
$db->create_ddl_dir();

