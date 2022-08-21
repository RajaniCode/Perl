package Fu::Controller::Person;

use strict;
use warnings;
use base 'Catalyst::Controller';

=head1 NAME

Fu::Controller::Person - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut

=head2 /person/list 

Shows a list of persons in your database.

It's also the index action of your app.

=cut 

sub list : Path(/) {
  my ($self, $c) = @_;
  $c->stash->{persons} = $c->model('DB::Person');
}

=head2 /person/edit/<id>

Edits a person, expects the person id as an arg

=cut 

sub edit : Local {
  my ($self, $c, $id) = @_;
  $id =~ /\d+/ or die 'invalid id';
  $c->stash->{person} = $c->model('DB::Person')->find($id) or die "person $id not found";
  
  #TODO add fairydust
}

=head2 /person/add

Adds a new person in your db

=cut 

sub add : Local {
  my ($self, $c) = @_;
  
  #TODO add fairydust

}

=head1 AUTHOR

Bogdan Lucaciu,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
