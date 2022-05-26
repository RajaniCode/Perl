package TestBed::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

__PACKAGE__->config->{namespace} = '';

sub default : Path {
    my ($self, $c) = @_;
    $c->res->status(404);
    $c->stash->{template} = '404.tt';
}

sub index : Private {
        my ($self, $c) = @_;
        $c->forward('page');
}

sub page : Local {
    my ($self, $c) = @_;
    if ( ! @{$c->req->args}) {
        $c->stash->{template} = 'index.tt';
    }
    else {
        my $tt = join ('',@{$c->req->args}). ".tt";
        $c->stash->{template} = $tt;
    }
}

sub end : ActionClass('RenderView') {}

1;
