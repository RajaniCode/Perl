use lib './lib';
use DB::Typeface::Schema;
use Data::Dumper;
use Config::Any::YAML;

my $cfg = Config::Any::YAML->load('typeface.yml');

my $db = DB::Typeface::Schema->connect($cfg->{'Model::Typeface'}->{connect_info}->[0]);

if(!defined $db) {
	print "Can't connect to database!\n";
	exit(0);
}

$login = question('login');
$password = question('password');

my $user = $db->resultset('Users')->new({});
$user->name($login);
$user->password($password);
$user->insert();

print "Your ready to rock and roll now.\n";

sub question {
	my ($what)=@_;
	while(1) {
		print "What $what do you want? ";
		$input = <STDIN>;
		chomp($input);
		if ($login =~ / /) {
			print "\n\nNo spaces in $what\n\n";
		}
		else {
			last;
		}
	}	
	
	return $input;
}


