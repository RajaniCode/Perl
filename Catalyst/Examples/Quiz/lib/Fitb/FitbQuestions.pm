package Fitb::FitbQuestions;

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("Core");
__PACKAGE__->table("fitb_questions");
__PACKAGE__->add_columns(
  "id",
  { data_type => "INTEGER", is_nullable => 0, size => undef },
);
__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.04004 @ 2007-12-23 22:38:59
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:B0C05oIfLoQSg43hEX5/Sw


# You can replace this text with custom content, and it will be preserved on regeneration
1;
