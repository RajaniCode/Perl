package MyApp::User;

use Moose;

use MyApp::Types::Core;
use MyApp::Types::Email;

has email      => ( isa => 'Email',     is => 'rw', required => 1 );
has login_name => ( isa => 'LoginName', is => 'rw', required => 1 );
has password   => ( isa => 'Password',  is => 'rw', required => 1 );

1;
