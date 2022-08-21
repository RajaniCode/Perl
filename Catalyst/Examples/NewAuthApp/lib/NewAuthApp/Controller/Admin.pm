package NewAuthApp::Controller::Admin;

use strict;
use warnings;
use base 'Catalyst::Controller';

sub auto : Private {
    my ($self, $c) = @_;
    if ($c->check_user_roles(qw/admin/)) {
        return 1;
    }
    else {
        $c->stash->{template} = 'auth/unauth.tt';
        return 0;
    }
}

sub index : Private {
    my ($self, $c) = @_;
    $c->stash->{template} = 'admin/index.tt';
}

1;
