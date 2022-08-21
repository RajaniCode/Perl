
package Quiz::Controller::quiz;

use strict;
use warnings;
use base 'Catalyst::Controller';


=head1 NAME

Quiz::Controller::quiz - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index 

=cut

sub index : Private 
  {
  my ( $self, $c ) = @_;
  $c->stash->{quizlist} = [$c->model('QuizMaster::Quizzes')->all];
    
    
  $c->stash->{template}='quiz/index.tt2'

}

sub create : Local
  { 
  my ( $self, $c ) = @_;

  my $modulelist =  [$c->model('QuizMaster::Modules')->all];
  $c->stash->{modules} = $modulelist;
    
  if ($c->request->param('submit')) {
    my $name = $c->request->param('name'); 
    my $quiz = $c->model('QuizMaster::Quizzes')->create({ 
							 name  => $name,
							});

    my $modules =[$c->request->param('modules')];
    my $noq =[$c->request->param('noq')]; 

   
    foreach my $module (@{$modules}) {
     

     
      my $modulename = $modulelist->[$module-1]->name;

     
      my @questions = $c->model($modulename.'::'.$modulename.'Questions')->all;
      my $tnoq = $#questions + 1;
     
      $noq->[$module-1] = $tnoq if $noq->[$module-1] > $tnoq;
      my $selectquest = " ";
     
      for (my $j=0 ; $j < $noq->[$module-1] ; $j++) {
	my $rand  ;
       
       
	$rand =  (int(rand($noq->[$module-1]))+1);

       
	# Avoid Duplication of questions
	while ( $selectquest && ($selectquest =~  /\s$rand\s/) ) {
	  $rand =  (int(rand($noq->[$module-1]))+1)  ;
	 
 
	}


       
	$selectquest.=$rand.' ';

       
      }
      $quiz->add_to_quizmodules({questions => $selectquest,module=>$module});
     
    }
   

  }


  


}


sub deploy : Local 
  {
  my ($self,$c,$quizid) = @_;
  #code to slice db



  #system("/home/John/Desktop/Quiz/deploy.sh");

  $c->response->body('This portion will be completed and updated this week');
    
 }



sub start : Local
  {

  # This function initializes the quiz by loading the details of the module and the questions of each module for the quiz into the session.

  my ($self,$c,$quizid) = @_;
   
  if ($c->request->param('name')) {
      
    my $quiz = $c->model('QuizMaster::Quizzes')->search({id=>$quizid})->first;
    my $modules = [$quiz->search_related('quizmodules',{quiz=>$quizid})->all];
    $c->session->{quiz}={participant=>$c->request->param('name'),name=>$quiz->name};
    my $moduledata;
     
    foreach my $module (@{$modules}) {

      
      push @{$moduledata} , { id => $module->id , name=>$module->module->name, questions => [split ' ',$module->questions] };
       
    }
    $c->log->debug('Module data'.$moduledata->[0]->{name});
    
    $c->session->{quiz}->{modquestions}=$moduledata;

    #set up counter for the questions and modules
    $c->session->{quiz}->{modindex}=0;
    $c->session->{quiz}->{qindex}=0;

    #set score and total score as 0
    $c->session->{quiz}->{score} = 0;
    $c->session->{quiz}->{tscore} = 0;

    $c->log->debug('Forwarding to process') ;
    $c->stash->{newurl} = "/quiz/process/$quizid/$moduledata->[0]->{name}/$moduledata->[0]->{questions}->[0]";
    $c->stash->{template} = 'quiz/begin.tt2';
    
  }
  

}





sub process : PathPart('quiz/process') Chained('/')  CaptureArgs(1) {
    
  my ($self,$c,$quizid) = @_;


  # This controller does two things .
  # 1.It does scoring for the previously answered question
  # 2.Set the action path for the next question to be used by the module displaying the current question in the form


  #Scoring 
  $c->log->debug($c->request->method);
  
  if ($c->request->method =~ /POST/) {
    $c->log->debug('Entered here');
    
    # To make sure we don't evaluate a non existing previous answer when displaying the first question
    if ($c->session->{quiz}->{answer}) {
      my $flag= 1;
	
      
      

      foreach (keys %{$c->session->{quiz}->{answer}}) {
	if ($c->session->{quiz}->{answer}->{$_} != $c->request->param($_) ) {
	  $flag = 0;
	    
	}
      }
	
      # The score per question is taken as 10 here . It can also be set to take a value from the sessions in which case the modules can assign different marks to each question
      my $spq = 10;
	
      $c->session->{quiz}->{score} += ($flag * $spq);
      $c->session->{quiz}->{tscore} += $spq;
      $c->log->debug($c->session->{quiz}->{score});
      

    }
      
  }


  #Determine the action path


  my $modindex = $c->session->{quiz}->{modindex};
  my $qindex = $c->session->{quiz}->{qindex};
    
  #check that the current question is not the last question of the module
  if ( $qindex != $#{$c->session->{quiz}->{modquestions}->[$modindex]->{questions}}) {
      
    
    $c->session->{quiz}->{qindex} += 1;
    $qindex ++;
      
    # generate /quiz/process/quizid/modulename/questionid
    my $modulename = $c->session->{quiz}->{modquestions}->[$modindex]->{name};
    my $questionid = int($c->session->{quiz}->{modquestions}->[$modindex]->{questions}->[$qindex]);

    $c->stash->{postaction}="/quiz/process/$quizid/$modulename/$questionid";

  } else {
    #if it is the last question , check that the current module is not the last module
    if ($modindex != $#{$c->session->{quiz}->{modquestions}}) {
      $qindex = $c->session->{quiz}->{qindex} = 0;
      $c->session->{quiz}->{modindex} += 1;
      $modindex ++;
      my $modulename = $c->session->{quiz}->{modquestions}->[$modindex]->{name};
      my $questionid = int($c->session->{quiz}->{modquestions}->[$modindex]->{questions}->[$qindex]);

      $c->stash->{postaction}="/quiz/process/$quizid/$modulename/$questionid";

	 

    }
      
    #if the current question is the last question of the last module set action path to the quiz finish controller
    else {
      $c->stash->{postaction}="/quiz/finish/$quizid";
	
    }
  }
    
    
}

sub finish : Local {

  my ($self,$c,$quizid) = @_;
  my  $name = $c->session->{quiz}->{participant};
  
  my $flag= 1;
	
      foreach (keys %{$c->session->{quiz}->{answer}}) {
	if ($c->session->{quiz}->{answer}->{$_} != $c->request->param($_) ) {
	  $flag = 0;
	    
	}
      }
	
  my $spq = 10;
	
      $c->session->{quiz}->{score} += ($flag * $spq);
      $c->session->{quiz}->{tscore} += $spq;


  my $score = $c->session->{quiz}->{score};
  my $tscore = $c->session->{quiz}->{tscore};
  
 my $participant = $c->model('QuizMaster::Participants')->create({
                 name => $name,
		 quiz => $quizid,
		 score => $score,
                 totalscore => $tscore
								  
									 							 });
  $c->stash->{score} = "$score / $tscore";
  
          
}

=head1 AUTHOR

Antano Solar 

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
