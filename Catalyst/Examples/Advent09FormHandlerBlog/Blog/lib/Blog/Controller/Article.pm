package Blog::Controller::Article;

use strict;
use warnings;
use parent 'Catalyst::Controller';
use Blog::Form::Article;

sub articles : Chained('/') PathPart('article') CaptureArgs(0) {
    my ($self, $c) = @_;
    $c->stash->{articles} = $c->model('DB::Article')->search({}, { order_by => 'ts desc' });
}

sub list : Chained('articles') Args(0) {
    my ($self, $c) = @_;
    $c->stash->{template} = 'article/list.tt';
}

sub item : Chained('articles') PathPart('') CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    
    $c->error("ID isn't valid!") unless $id =~ /^\d+$/;
    $c->stash->{item} = $c->stash->{articles}->find($id)
	|| $c->detach('not_found');
}

sub show : Chained('item') Args(0) {}

sub add : Chained('articles') Args(0) {
    my ($self, $c) = @_;
    $c->stash->{item} = $c->model('DB::Article')->new_result({});
    $c->forward('save');
}

sub edit : Chained('item') {
    my ($self, $c) = @_;    
    $c->forward('save');
}

sub save : Private {
    my ($self, $c) = @_;

    my $form = Blog::Form::Article->new( item => $c->stash->{item}  );

    my $all_tags = $c->model('DB::Tag')->search({}, { order_by => 'name' });
    $c->stash( form => $form, template => 'article/save.tt', tags => $all_tags );

    # the "process" call has all the saving logic,
    #   if it returns False, then a validation error happened
    return unless $form->process( params => $c->req->params  );

    $c->stash->{template} = 'article/save.tt';
    $c->flash->{info_msg} = "Article saved!";
    $c->redirect_to_action('Article', 'list');
}

sub not_found : Local {
    my ($self, $c) = @_;
    $c->response->status(404);
    $c->stash->{error_msg} = "Article not found!";
    $c->detach('list');
}

1;
