package MyApp::Types::Core;

use warnings;
use strict;

use Moose::Util::TypeConstraints;

subtype 'Password'
  => as 'Str'
  => where { length >= 6 };

subtype 'LoginName'
  => as 'Str'
  => where { length > 0 && !/\s/ };

1;
