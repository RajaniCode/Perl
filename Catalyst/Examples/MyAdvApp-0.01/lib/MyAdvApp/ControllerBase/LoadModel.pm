package MyAdvApp::ControllerBase::LoadModel;
use warnings;
use strict;

use base 'Catalyst::Controller';

sub load_model : Chained('base') PathPart('') CaptureArgs(1) {
    my ($self, $c, $item_id) = @_;
    $c->stash(loaded_item_id => $item_id);
    $c->stash(loaded_model   => $self->config->{model});
}

sub list : Chained('resultset') PathPart('') Args(0) {
    my ($self, $c) = @_;
    $c->stash(list => 'Showing a list from the Resultset');
}

1;
