package Fu::Schema::Result::Person;
use strict;
use warnings;
use base qw/DBIx::Class/;

__PACKAGE__->load_components(qw/ Core /);
__PACKAGE__->table('person');
__PACKAGE__->add_columns(
	person_id => {
		data_type 		=> 'integer',
		is_nullable 		=> 0,
		is_auto_increment	=> 1,
	},
	email => {
		data_type		=> 'varchar',
		size			=> 255,
	},
	name => {
		data_type		=> 'varchar',
		size			=> 255,
                is_nullable 		=> 1,
	},
	phone => {
               	data_type 		=> 'varchar',
		size			=> 32,
                is_nullable 		=> 1,
	},
	gender => {
                data_type		=> 'char' ,
		size			=> 1 ,
		is_nullable		=> 0 ,
	},

);

__PACKAGE__->set_primary_key('person_id');

1;
