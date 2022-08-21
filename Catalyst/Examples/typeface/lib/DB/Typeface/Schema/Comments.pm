# Copyright (C) 2006  name of Victor Igumnov
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

package DB::Typeface::Schema::Comments;

# Created by DBIx::Class::Schema::Loader v0.03007 @ 2006-10-18 15:02:47

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components("PK::Auto", "InflateColumn::DateTime","Core");
__PACKAGE__->table("comments");
__PACKAGE__->add_columns(
  "id",
  {
    data_type => 'integer', 
	is_auto_increment => 1,
    default_value => undef,
    is_nullable => 0,
  },
  "name",
  {
    data_type => "character varying",
    default_value => undef,
    is_nullable => 1,
    size => 255,
  },
  "email",
  {
    data_type => "character varying",
    default_value => undef,
    is_nullable => 1,
    size => 255,
  },
  "url",
  {
    data_type => "character varying",
    default_value => undef,
    is_nullable => 1,
    size => 255,
  },
  "comment",
  {
    data_type => "text",
    default_value => undef,
    is_nullable => 1,
    size => undef,
  },
  "created_at",
  {
    data_type => "datetime",
    default_value => "now()",
    is_nullable => 1,
    size => undef,
  },
  "article_id",
  { data_type => "integer", default_value => undef, is_nullable => 1, size => 4 },
);

use Text::Textile qw(textile);
sub textilize {
    my $self = shift;
    my $what = shift;
    
    my $temp = $self->$what;
    $temp =~ s/\[code (.*?)\]/==<pre>\[code $1\]/g;
    $temp =~ s/\[\/code\]/\[\/code\]<\/pre>==/g;
    return textile($temp);
}

sub insert {
	 my $self = shift; 
	 $self->created_at(DateTime->now());
	 $self->next::method( @_ ); 
}

sub form {
    my ($self,$from) = @_;
    
    $self->{formbuilder}->field(
        name     => 'name',
        required => 1,
        label    => 'Name',
        size     => 25
    );
    $self->{formbuilder}->field( name => 'email', label => 'Email',   size => 25, validate => 'EMAIL' );
    $self->{formbuilder}->field( name => 'url',   label => 'Website', size => 25 );
  
  	$self->{formbuilder}->field(
        name     => 'comment',
        type     => 'textarea',
        required => 1,
        label    => 'Body',
        cols     => 30,
        rows     => 10
    );

    $self->{formbuilder}->field(
        name     => 'verification',
        label    => 'Verification',
        size     => 25,
        required => 1
    );
    # make sure no trailing slashes happen.
    $from = '/' . $from;
    $self->{formbuilder}->action( '/submit/comment' . $from );
    $self->{formbuilder}->method('post');
    
    return $self->{formbuilder};
}

__PACKAGE__->set_primary_key("id");

__PACKAGE__->belongs_to('article',
		'DB::Typeface::Schema::Articles','article_id');

1;

