package NewAuthApp::Controller::Auth;

use strict;
use warnings;
use base 'Catalyst::Controller';

sub get_login : Local {
    my ($self, $c) = @_;
    $c->stash->{destination} = $c->req->path;
    $c->stash->{template} = 'auth/login.tt';
}

sub logout : Local {
    my ( $self, $c ) = @_;
    $c->logout;
    $c->stash->{template} = 'auth/logout.tt';
}

sub login : Local {
    my ( $self, $c ) = @_;
    my $user = $c->req->params->{user};
    my $password = $c->req->params->{password};
    $c->flash->{destination} = $c->req->params->{destination} || $c->req->path;
    $c->stash->{remember} = $c->req->params->{remember};
    if ( $user && $password ) {
        if ( $c->authenticate( { username => $user,
                                 password => $password } ) ) {
            $c->{session}{expires} = 999999999999 if $c->req->params->{remember};
            $c->res->redirect($c->uri_for($c->flash->{destination}));
        }
        else {
            # login incorrect
            $c->stash->{message} = 'Invalid user and/or password';
            $c->stash->{template} =  'auth/login.tt';
        }
    }
    else {
        # invalid form input
        $c->stash->{message} = 'invalid form input';
        $c->stash->{template} =  'auth/login.tt';
    }
}

sub unauthorized : Private {
    my ($self, $c) = @_;
    $c->stash->{template}= 'auth/unauth.tt';
}

1;
