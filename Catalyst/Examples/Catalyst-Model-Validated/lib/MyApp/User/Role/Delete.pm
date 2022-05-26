package MyApp::User::Role::Delete;

use warnings;
use strict;

use Moose::Role;

sub delete {
  my($self, $user) = @_;
  $user->delete;
}

1;
