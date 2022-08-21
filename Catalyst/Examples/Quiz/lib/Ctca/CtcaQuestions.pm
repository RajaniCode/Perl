package Ctca::CtcaQuestions;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("ctca_questions");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "question",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "correct",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2007-12-21 23:25:20
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:u+CFwhJQ1zVkEbk8v6f87g


# You can replace this text with custom content, and it will be preserved on regeneration

Ctca::CtcaQuestions->has_many( 'options',
                                      'Ctca::CtcaChoices',
                                      { 'foreign.question' => 'self.id' } );


1;



