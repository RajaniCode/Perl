package Blog::Schema::Result::Article;

use strict;
use warnings;

use base qw/DBIx::Class/;

__PACKAGE__->load_components(qw/TimeStamp InflateColumn::DateTime Core/);
__PACKAGE__->table('articles');

__PACKAGE__->add_columns(
    article_id => {
        data_type	=> 'integer' ,
	is_nullable	=> 0 ,
	is_auto_increment => 1
    },
    ts => {
        data_type     => 'datetime' ,
	is_nullable   => 1,
	set_on_create => 1,	    
	set_on_update => 1,
    },    
    
    title => {
        data_type   => 'varchar',
        size        => 250,
        is_nullable => 0,
    },
    content => {
        data_type   => 'text',
        is_nullable => 1,
    },
    summary => {
	data_type   => 'text',
	is_nullable => 1,
    },
    rank => {
	data_type => 'decimal',
	size => [3,2],
	is_nullable => 1,
    },
);

__PACKAGE__->set_primary_key('article_id');

__PACKAGE__->has_many(article_tags => 'Blog::Schema::Result::ArticleTag', 'article_fk');
__PACKAGE__->many_to_many(tags => 'article_tags', 'tag');

1;
