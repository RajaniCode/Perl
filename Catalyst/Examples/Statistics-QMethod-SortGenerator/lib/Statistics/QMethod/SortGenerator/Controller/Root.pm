package Statistics::QMethod::SortGenerator::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';
use Statistics::QMethod::QuasiNormalDist;
use Catalyst::Controller::BindLex;

__PACKAGE__->config->{namespace} = '';

sub default : Private {
    my ($self, $c) = @_;
    $c->res->status(404);
    $c->stash->{template} = '404.tt';
}

sub main_page :Path {
    my ($self, $c) = @_;
    $c->stash->{template} = 'index.tt';
}

sub post_statements :Local {
    my ($self, $c) = @_;

    my $statements = $c->req->params->{statementlist};
    my @statements = split /(\r\n)+/, $statements;
    my $N  = scalar(@statements);
    $c->stash->{dist} = [ get_q_dist($N) ] ;
    $c->stash->{N} = $N;
    $c->stash->{statements} = [ @statements ];

    $c->stash->{template} = 'statements.tt';
}

sub end : ActionClass('RenderView') {}

1;
