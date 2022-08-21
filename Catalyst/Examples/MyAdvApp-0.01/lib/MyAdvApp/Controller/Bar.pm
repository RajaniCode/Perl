package MyAdvApp::Controller::Bar;
use warnings;
use strict;

use base 'MyAdvApp::ControllerBase::LoadModel';

__PACKAGE__->config({model => 'DBIC::Bar'});

sub base : Chained('/language') PathPart('bar') CaptureArgs(0) { }

sub resultset : Chained('base') PathPart('') CaptureArgs(0) {
    my ($self, $c) = @_;
    $c->stash(resultset => 'Providing a resultset for Bar');
}

sub something : Chained('load_model') PathPart('something') Args(0) {
    my ($self, $c) = @_;
    $c->stash(message => 'Doing something with a Bar');
}

1;
