package Catalyst::Model::Validated;

use warnings;
use strict;

=head1 NAME

Catalyst::Model::Validated - The great new Catalyst::Model::ValidatedAction!

=head1 VERSION

Version 0.01

=cut

our $VERSION = '0.01';

=head1 SYNOPSIS

  package MyApp::Types::Email;

  use Email::Valid;
  subtype 'Email'
    => as 'Str'
    => where { Email::Valid->address($_) }

  package MyApp::User;

  use Moose;

  has email    => (isa => 'Email', is => 'rw', required => 1);
  has password => (isa => 'Str', is => 'rw', required => 1);

  package MyApp::Model::User;

  use Moose;
  extends 'Catalyst::Model::ValidatedAction';

  __PACKAGE__->config( model_class => 'MyApp::User' );

  has store => ( isa => 'DBIx::Class::ResultSet', is => 'rw', required => 1 );

  after 'validate' => sub {
    my($self) = @_;
    $self->assert_unique($self->params->{email});
  }

  sub assert_unique {
    my($self, $value) = @_;
    $self->set_error(email => 'exists')
      if $self->store->find($value);
  }

  sub create {
    my($self) = @_;
    return $self->store->create($self->params);
  }

  sub update {
    my($self, $obj) = @_;
    return $obj->update($self->params);
  }

  sub load {
    my($self, $username) = @_;
    return $self->store->find($username);
  }

  package MyApp::Controller::User;

  use base qw/Catalyst::Controller/;

  sub base : Chained('/') CaptureArgs(0) PathPart('user') {
    my($self, $c) = @_;
    my $model = $c->stash->{model} = $c->model('User');
    $model->store($c->model('DB::User'));
  }

  sub create : Chained('base') Args(0) {
    my ( $self, $c ) = @_;
    my $model = $c->stash->{model};
    $model->params( $c->req->params );
    if ( !$model->has_errors ) {
      my $user = $model->create;
      $c->res->redirect( $c->uri_for( $c->controller->action_for('view') ),
        $user->id );
    }
  }

  sub load : Chained('base') CaptureArgs(1) PathPart('') {
    my($self, $c, $username) = @_;
    my $model = $c->stash->{model};
    $c->stash->{user} = $model->load($username);
  }

  sub update : Chained('load') Args(0) {
    my($self, $c) = @_;
    my $model = $c->stash->{model};
    my $user = $c->stash->{user};
    $model->update()
  }

...in a View nearby...

  <form action="[% c.uri_for(c.controller('User').action_for('create')) %]"
        method="post">
    <input type="text" name=""/>
    <input type="password" name=""/>
  </form>

=cut

use Moose;

extends qw/Moose::Object Catalyst::Component/;

has _params => (
  isa       => 'HashRef',
  is        => 'rw',
  lazy_fail => 1,
  trigger   => sub { shift->adopt_params(@_) },
  predicate => 'has_params'
);
has errors => ( isa => 'HashRef', is => 'rw', lazy_build => 1 );
has fields => ( isa => 'HashRef', is => 'rw', lazy_build => 1 );

sub params {
  shift->_params(@_);
}

sub _build_errors { {} }

sub set_error {
  my ( $self, $attr_name, $error ) = @_;
  push @{ $self->errors->{$attr_name} }, $error;
}

sub _build_fields {
  my ($self) = @_;
  my $meta = $self->model_class->meta;
  return {
    map {
          $_->name => $_->has_type_constraint
        ? $_->type_constraint->name
        : 'NoType'
      } $meta->compute_all_applicable_attributes
  };
}

sub _build_model_object {
  my($self) = @_;
  return $self->model_class->new($self->params);
}

override COMPONENT => sub {
  my ( $class, $app ) = @_;
  my $arguments = ( ref( $_[-1] ) eq 'HASH' ) ? $_[-1] : {};
  $arguments = $class->merge_config_hashes( $class->config, $arguments );
  $class->config(%$arguments);
  my $model_class = $class->config->{model_class};
  Class::MOP::load_class($model_class)
    or confess("Couldn't load ${model_class}: $@");
  return $class;
};

sub ACCEPT_CONTEXT {
  my ( $class, $c ) = @_;
  return $class->new( %{ $class->config } );
}

sub model_class {
  shift->config->{model_class};
}

sub adopt_params {
  my ( $self, $params ) = @_;
  $self->clear_errors;
  $self->validate($params);
}

sub validate {
  my ( $self, $params ) = @_;
  my $meta = $self->model_class->meta;

  my %errors;
  foreach my $attr ( $meta->compute_all_applicable_attributes ) {
    my $init_arg = $attr->init_arg;
    my $value    = $params->{$init_arg};

    $self->set_error( $init_arg, 'required' )
      if $attr->is_required && !defined($value) || !length($value);

    if ( $attr->has_type_constraint ) {
      my $tc = $attr->type_constraint;
      $value = $tc->coercion->coerce($value)
        if $tc->has_coercion && $attr->should_coerce;
      $self->set_error( $init_arg, $tc->name )
        unless defined( $tc->check($value) );
    }
  }
}

=head1 ACKNOWLEDGEMENTS


=head1 COPYRIGHT & LICENSE

Copyright 2008 Eden Cardim, all rights reserved.

This program is free software; you can redistribute it and/or modify it
under the same terms as Perl itself.


=cut

1;
__END__
