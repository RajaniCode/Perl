package MyApp::Controller::User;

use warnings;
use strict;

use base qw/Catalyst::Controller/;

sub base : Chained('.') PathPart('') CaptureArgs(0) {
  my ( $self, $c ) = @_;
  $c->stash->{current_model_instance} = $c->model('User');
  $c->model->store( $c->model('DB::User') );
}

sub create : Chained('base') Args(0) {
  my ( $self, $c ) = @_;
  $c->model->params( $c->req->params );
  $c->detach unless $c->req->method eq 'POST';
  $c->detach if $c->model->has_errors;
  my $user = $c->model->create or $c->error_500;
  $c->res->redirect(
    $c->uri_for( $c->controller->action_for('view'), [ $user->login_name ] ) );
}

sub fetch : Chained('base') PathPart('') CaptureArgs(1) {
  my ( $self, $c, $login_name ) = @_;
  $c->stash->{user} = $c->model->fetch($login_name);
}

sub update : Chained('fetch') Args(0) {
  my ( $self, $c ) = @_;
  my $user = $c->stash->{user};
  $c->model->params( { $user->get_columns, %{ $c->req->params } } );
  $c->detach unless $c->req->method eq 'POST';
  $c->detach if $c->model->has_errors;
  $user = $c->model->update( $user ) or $c->error_500;
  $c->res->redirect(
    $c->uri_for( $c->controller->action_for('view'), [ $user->login_name ] ) );
}

sub delete : Chained('fetch') Args(0) {
  my ( $self, $c ) = @_;
  $c->model->delete( $c->stash->{user} );
  $c->res->redirect( $c->uri_for( $c->controller->action_for('list') ) );
}

sub view : Chained('fetch') PathPart('') Args(0) {}

sub user_list : Chained('base') PathPart('') CaptureArgs(0) {
  my ( $self, $c ) = @_;
  my $user_model = $c->model;
  $c->stash->{current_model_instance} = $c->model('User::List');
  $c->model->user_model($user_model);
  $c->model->params( $c->req->params );
  $c->error_500 if $c->model->has_errors;
}

sub list : Chained('user_list') Args(0) {}

1;
