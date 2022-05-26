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

package DB::Typeface::Schema::Articles;

# Created by DBIx::Class::Schema::Loader v0.03007 @ 2006-10-18 15:02:47

use strict;
use warnings;

use base 'DBIx::Class';

__PACKAGE__->load_components( "PK::Auto", "InflateColumn::DateTime" , "Core" );
__PACKAGE__->table("articles");
__PACKAGE__->add_columns(
    "id",
    {
        data_type         => 'integer',
        is_auto_increment => 1,
        default_value     => undef,
        is_nullable       => 0,
    },
    "subject",
    {
        data_type     => "character varying",
        default_value => undef,
        is_nullable   => 1,
        size          => 255,
    },
    "body",
    {
        data_type     => "text",
        default_value => undef,
        is_nullable   => 1,
        size          => undef,
    },
    "created_at",
    {
        data_type     => "datetime",
        default_value => "now()",
        is_nullable   => 1,
        size          => undef,
    },
    "user_id",
    {
        data_type     => "integer",
        default_value => undef,
        is_nullable   => 1,
        size          => 4,
    },
);

__PACKAGE__->set_primary_key("id");
__PACKAGE__->has_many(
    'comments' => 'DB::Typeface::Schema::Comments',
    'article_id'
);

__PACKAGE__->belongs_to(
    'user' => 'DB::Typeface::Schema::Users',
    'user_id'
);

__PACKAGE__->has_many(
    'categories_articles' =>
      'DB::Typeface::Schema::CategoriesArticles',
    'article_id'
);
__PACKAGE__->many_to_many( 'categories' => 'categories_articles', 'category' );

# Yes this is a hack since we need to textilize first then process code highlight
use Text::Textile qw(textile);
sub textilize {
    my $self = shift;
    my $what = shift;
    
    my $temp = $self->$what;
    $temp =~ s/<textarea/==<textarea/g;
    $temp =~ s/<\/textarea>/<\/textarea>==/g;
    # $temp =~ s/\[code (.*?)\]/==\[code $1\]/g;
    # $temp =~ s/\[\/code\]/\[\/code\]==/g;
    return textile($temp);
}

sub insert {
	 my $self = shift; 
	 $self->created_at(DateTime->now());
	 $self->next::method( @_ ); 
}

__PACKAGE__->resultset_class('DB::Typeface::Schema::ResultSet::Articles');
package DB::Typeface::Schema::ResultSet::Articles;
use base 'DBIx::Class::ResultSet';

sub get_latest_articles {
    my ($self,$number_of_posts) = @_;
    my $rows = 10;
    $rows = $number_of_posts if defined $number_of_posts;
    return $self->search( undef, { rows => $rows, order_by => 'id desc' } )->all;
}

sub archived  {
    my ( $self, $year, $month, $day ) = @_;

    my $dt   = DateTime->now();
    my $hour = $dt->hour();

	if (defined $day && $day != $dt->day )
	{
		$hour = '24';
	}

    if ( defined $day ) {
        return $self->search(
            {
                created_at => {
                    -between => [
                        "$year-$month-$day 00:00:00",
                        "$year-$month-$day $hour:00:00"
                    ]
                }
            },
            { order_by => 'id desc' }
        )->all();
    }
    else {
        my $lastday =
          DateTime->last_day_of_month( year => $year, month => $month )
          ->day;

        return $self->search(
            {
                    created_at => {
                        -between => [
                            "$year-$month-1",
                            "$year-$month-$lastday"
                        ]
                    }
            },
            { order_by => 'id desc' }
        )->all();
    }
}

sub from_month  {
    my ( $self, $month, $year ) = @_;
    
    $year = DateTime->now()->year() unless defined $year;

    my $dt = DateTime->now();
    my $lastday =
      DateTime->last_day_of_month( year => $year, month => $month )
      ->day;
    my $hour = $dt->hour();

    return $self->search(
        {
            created_at => {
                -between => [
                    "$year-$month-1",
                    "$year-$month-$lastday"
                ]
            }
        },
        { order_by => 'id desc' }
    )->all();
}

1;

