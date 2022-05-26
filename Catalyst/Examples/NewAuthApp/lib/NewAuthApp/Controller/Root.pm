package NewAuthApp::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

__PACKAGE__->config->{namespace} = '';

sub auto : Private {
     my ( $self, $c) = @_;
     if ( !$c->user && $c->req->path !~ /^auth.*?login/) {
         $c->forward('NewAuthApp::Controller::Auth', 'get_login');
         return 0;
     }
     return 1;
}

sub default : Private {
    my ( $self, $c ) = @_;
    $c->stash->{template} = 'success.tt'
}

sub end : ActionClass('RenderView') {}

1;
