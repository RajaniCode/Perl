package MyApp::Controller::Root;

use warnings;
use strict;

use base qw/Catalyst::Controller/;

__PACKAGE__->config( namespace => '' );

sub base : Chained('/') PathPart('') CaptureArgs(0) {}

sub root : Chained('base') PathPart('') Args(0) {
  my ( $self, $c ) = @_;
  $c->res->redirect( $c->controller('User')->action_for('list') );
}

sub user : Chained('base') CaptureArgs(0) {}

sub end : ActionClass('RenderView') {}

1;
