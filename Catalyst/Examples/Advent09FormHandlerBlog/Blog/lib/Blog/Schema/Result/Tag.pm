package Blog::Schema::Result::Tag;

use strict;
use warnings;

use base qw/DBIx::Class/;

__PACKAGE__->load_components(qw/Core/);
__PACKAGE__->table('tags');

__PACKAGE__->add_columns(
    tag_id => {
        data_type	=> 'integer' ,
	is_nullable	=> 0 ,
	is_auto_increment => 1
    },
    name => {
        data_type   => 'varchar',
        size        => 100,
        is_nullable => 0,
    },
);

__PACKAGE__->set_primary_key('tag_id');

1;
