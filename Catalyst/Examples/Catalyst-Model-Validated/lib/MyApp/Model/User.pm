package MyApp::Model::User;

use warnings;
use strict;

use Moose;

extends 'Catalyst::Model::Validated';
with 'MyApp::User::Role::Create';
with 'MyApp::User::Role::Update';
with 'MyApp::User::Role::Delete';

__PACKAGE__->config( model_class => 'MyApp::User', per_page => 10, page => 1 );

has _store => (
  isa       => 'DBIx::Class::ResultSet',
  is        => 'rw',
  init_arg  => 'store',
  lazy_fail => 1
);

sub store { shift->_store( @_ ? @_ : () ) }

after 'validate' => sub {
  my($self) = @_;
  my $login_name = $self->params->{login_name};
  if($self->fetch($login_name)) {
    $self->set_error('login_name' => 'LoginNameNotUnique');
  }
};

sub fetch {
  my ( $self, $login_name ) = @_;
  $self->store->find( $login_name, { key => 'user_login_name' } );
}

sub public_fields {
  my $fields = shift->fields;
  delete $fields->{password};
  return $fields;
}

1;
