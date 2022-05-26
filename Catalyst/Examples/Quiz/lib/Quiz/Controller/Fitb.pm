package Quiz::Controller::Fitb;

use strict;
use warnings;
use base 'Catalyst::Controller';

=head1 NAME

Quiz::Controller::Ctca - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 show 

=cut

sub index : PathPart('Fitb') Chained('/quiz/process')  Args(1)  {
    my ( $self, $c , $questionid ) = @_;
    $c->response->body('This is Just a sample module . If you have reached here after answering 1 or more question from the previous module.It demonstrates how the quiz controller handles the flow of question between modules');
    
}


=head1 AUTHOR

Antano Solar 

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
