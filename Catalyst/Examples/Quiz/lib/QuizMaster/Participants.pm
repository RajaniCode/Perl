package QuizMaster::Participants;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("participants");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "name",
  { data_type => "TEXT", is_nullable => 0, size => undef },
  "quiz",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "score",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
  "totalscore",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2007-12-21 23:24:16
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:tWuats9APAgXYQ+qLETQXw


# You can replace this text with custom content, and it will be preserved on regeneration


QuizMaster::Participants->belongs_to( 'quiz',
                                      'QuizMaster::Quizzes',
                                      { 'foreign.id' => 'self.quizzes' } );

1;
