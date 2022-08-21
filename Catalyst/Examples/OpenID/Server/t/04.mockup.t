use lib 't/lib';
use Test::More qw/no_plan/;
use Test::OpenID::Consumer;
use Test::WWW::Mechanize;

my $consumer = Test::OpenID::Consumer->new;
$consumer->ua( Test::WWW::Mechanize->new );
my $url_root = $consumer->started_ok('consumer server started ok');

# needs a running script/openid_server.pl in order to work 
$consumer->verify_ok('http://localhost:3000/identity/foo');
$consumer->verify_invalid('http://localhost:3000/identity/bar');
