package NewAuthApp;

use strict;
use warnings;

use Catalyst::Runtime '5.70';
use Catalyst qw/
               ConfigLoader
               Static::Simple
               Authentication
               Authorization::Roles
               Session
               Session::State::Cookie
               Session::Store::FastMmap
               /;


our $VERSION = '0.01';


__PACKAGE__->setup;

1;
