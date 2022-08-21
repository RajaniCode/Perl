package SmallBoard::Controller::Board;

use strict;
use warnings;
use parent 'Catalyst::Controller';

=head1 NAME

SmallBoard::Controller::Board - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;

    $c->res->redirect( $c->uri_for_action('board/create'));
}

sub board_base : Chained('/') PathPart('board') CaptureArgs(0) {}

sub load_threads : Chained('board_base') PathPart('') CaptureArgs(1) {
    my ($self, $c, $thread_id) = @_;

	my $thread = $c->model('Board::Thread')->find($thread_id);
    
	if ($thread_id) {
	    $c->stash( 
		    thread  => $thread,
			replies =>  
		);
	} else {
	    $c->error("No such thread");
		$c->detach;
	}
}

sub view : Chained('load_threads') PathPart('view') Args(0) {
    my ($self, $c) = @_;

}

sub create : Chained('board_base') PathPart('new') Args(0) {
    my ($self, $c) = @_;

    ## fancy form stuff would go here, but I'm lazy
	if ( $c->req->param('submitted') ) {
		my $params = $c->req->params;
        delete $params->{$_} for qw/submitted submit/;
	    my $entry = $c->model('Board::Thread')->create($params) or $c->error("Error creating thread parent: $!");
		$c->msg("Created new thread!");
	}
	
}

sub reply : Chained('load_threads') PathPart('reply') Args(0) {
	my ($self, $c) = @_;
	my $parent = $c->stash->{thread};
	
	if ( $c->req->param('submitted') ) {
		my $params = $c->req->params;
		delete $params->{$_} for qw/submitted submit/;

	    my $reply = $c->model('Board::Thread')->create($params);
		$reply->update({  parent_id => $parent->thread_id }) or die "Error :$!";
        $c->msg("Reply added!");
	}
	$c->stash(
	    parent => $parent,
	);
}

sub list : Path Args(1) {
    my ($self, $c, $page) = @_;

	$page ||= 1;
	my $rs = $c->model("Board::Thread")->search(
	    { 
			parent_id => undef, 
		}, 
		{ 
			rows => 50, 
			order_by => "thread_id", 
			page => $page,
		}
);
	$c->stash(
	    threads => [ $rs->all ],
		pager   => $rs->pager,
	);
}

=head1 AUTHOR

Devin Austin

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
