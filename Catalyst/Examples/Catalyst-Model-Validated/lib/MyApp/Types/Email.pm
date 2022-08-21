package MyApp::Types::Email;

use warnings;
use strict;

use Moose::Util::TypeConstraints;

use Email::Valid;

subtype 'Email'
  => as 'Str'
  => where { Email::Valid->address($_) };
