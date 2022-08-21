package MyApp::User::Role::Create;

use warnings;
use strict;

use Moose::Role;

requires 'store';
requires 'params';

sub create {
  my($self) = @_;
  $self->store->create($self->params);
}

1;
