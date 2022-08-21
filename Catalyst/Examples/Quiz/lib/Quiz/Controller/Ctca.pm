package Quiz::Controller::Ctca;

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

sub index : PathPart('Ctca') Chained('/quiz/process')  Args(1)  {
    my ( $self, $c , $questionid ) = @_;
    my $question = $c->model('Ctca::CtcaQuestions')->search({id=>$questionid})->first;
    $c->stash->{question} = $question;
    
    $c->stash->{options}= [$question->search_related('options',question=>$questionid)->all];
    $c->session->{quiz}->{answer} = {choice => $question->correct};
    $c->stash->{template} = 'Ctca/index.tt2';
    
}


=head1 AUTHOR

Antano Solar 

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
