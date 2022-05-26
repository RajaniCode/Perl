package MyApp::User::Role::Compare;

use warnings;
use strict;

use Moose::Role;

sub is_equal {
  my($self, $user_a, $user_b) = @_;
  return $user_a->id == $user_b->id;
}

1;
