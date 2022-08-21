package MyApp::User::List::Role::All;

use warnings;
use strict;

use Moose::Role;

requires 'store';

sub list {
  my ($self) = @_;
  warn $self->store->search_rs( {}, { $self->params } );
  return $self->store->search_rs( {}, { $self->params } );
}

1;
