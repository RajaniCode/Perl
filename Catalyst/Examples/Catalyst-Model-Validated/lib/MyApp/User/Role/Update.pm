package MyApp::User::Role::Update;

use warnings;
use strict;

use Moose::Role;

requires 'params';

sub update {
  my($self, $user) = @_;
  $user->update($self->params);
}

1;
