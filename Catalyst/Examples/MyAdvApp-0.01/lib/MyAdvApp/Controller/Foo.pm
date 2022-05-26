package MyAdvApp::Controller::Foo;
use warnings;
use strict;

use base 'MyAdvApp::ControllerBase::LoadModel';

__PACKAGE__->config({model => 'DBIC::Foo'});

sub base : Chained('/language') PathPart('foo') CaptureArgs(0) { }

sub resultset : Chained('base') PathPart('') CaptureArgs(0) {
    my ($self, $c) = @_;
    $c->stash(resultset => 'Providing a resultset for Foo');
}

sub edit_foo : Chained('load_model') PathPart('edit') Args(0) {
    my ($self, $c) = @_;
    $c->stash(message => 'Editing a Foo');
}

sub show_foo : Chained('load_model') PathPart('') Args(0) {
    my ($self, $c) = @_;
    $c->stash(message => 'Showing a Foo');
}

1;
