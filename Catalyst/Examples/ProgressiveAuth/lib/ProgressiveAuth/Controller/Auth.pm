package ProgressiveAuth::Controller::Auth;

use strict;
use warnings;
use parent 'Catalyst::Controller';

=head1 NAME

ProgressiveAuth::Controller::Auth - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index 

=cut

sub index : Path :Args(0) { }
sub logout : Local Args(0) { 
    my ( $self, $c ) = @_;
    $c->logout;
}

sub do_login : Local Args(0) {
    my ( $self, $c ) =  @_;
    my $data = $c->req->params;

    $c->res->status( 304 );
    my $uri = $c->req->uri;

    if ( $c->authenticate( $data ) ) {
        $c->res->status( 304 );
        $uri = $c->uri_for($c->controller('Auth')->action_for('success'));
    } else {
        $uri = $c->uri_for($c->controller('Auth')->action_for('failed'));
    }
    $c->res->redirect( $uri );
}

sub success : Local Args(0) { 
    my ( $self, $c ) = @_;
    unless ( $c->user_exists ) {
        $c->res->redirect( 
            $c->uri_for( $c->controller('Auth')->action_for('failed') )
        );
        $c->detach;
    }
}

sub failed : Local Args(0) { }

=head1 AUTHOR

Jay Shirley C<< <jshirley@gmail.com> >>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
