package MyApp::Model::User::List;

use warnings;
use strict;

use Moose;

extends 'Catalyst::Model::Validated';

__PACKAGE__->config(
  model_class => 'MyApp::User::List',
  per_page    => 10,
  page        => 1
);

has user_model => (
  is        => 'rw',
  lazy_fail => 1,
  handles   => [qw/store public_fields/]
);

before 'validate' => sub {
  my ($self) = @_;
  $self->params->{$_} ||= $self->config->{$_} for qw/per_page page/;
};

sub list {
  my ($self) = @_;
  return $self->store->search_rs( {},
    { map { $_ => $self->params->{$_} } qw/per_page page/ } );
}

1;
