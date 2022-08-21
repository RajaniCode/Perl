package MyApp::User::List;

use warnings;
use strict;

use Moose;

has per_page => ( isa => 'Int', is => 'rw', required => 1 );
has page     => ( isa => 'Int', is => 'rw', required => 1 );

1;
