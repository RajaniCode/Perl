package QuizMaster::Quizzes;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("quizzes");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "name",
  { data_type => "TEXT", is_nullable => 0, size => undef },

);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2007-12-21 23:24:16
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:8nVRYoTaUKlh4YlkLlcLXA


# You can replace this text with custom content, and it will be preserved on regeneration


QuizMaster::Quizzes->has_many( 'quizmodules',
                                      'QuizMaster::QuizModules',
                                      { 'foreign.quiz' => 'self.id' } );

1;

