use warnings;
use strict;

use Test::More qw/no_plan/;
use Data::Dump;

package Test::Foo;

use Moose;
use Moose::Util::TypeConstraints;

coerce 'HashRef' => from 'Str' => via { eval };

has bar       => ( isa => 'Str',     is => 'rw', required => 1 );
has baz       => ( isa => 'HashRef', is => 'rw', coerce   => 1 );
has read_only => ( isa => 'Str',     is => 'ro', required => 1 );

package Test::Model::Foo;

use Moose;

extends 'Catalyst::Model::Validated';

__PACKAGE__->config( model_class => 'Test::Foo' );

package main;

ok( ( my $model = Test::Model::Foo->COMPONENT )
        ->isa('Catalyst::Model::Validated') );
isa_ok($model = $model->ACCEPT_CONTEXT, 'Catalyst::Model::Validated');
ok( !$model->has_errors );

$model->params(
  {
    bar       => 'test string',
    baz       => Data::Dump::dump( { foo => 'bar' } ),
    read_only => 'read only string'
  }
);
ok( !$model->has_errors );

$model->params(
  {
    bar       => {},
    baz       => Data::Dump::dump( { foo => 'bar' } ),
    read_only => 'read only string'
  }
);
ok( $model->has_errors );
is_deeply( $model->errors, { bar => ['Str'] } );

$model->params(
  {
    baz => Data::Dump::dump( [ foo => 'bar' ] ),
    read_only => 'read only string'
  }
);
ok( $model->has_errors );
is_deeply( $model->errors,
  { bar => [ 'required', 'Str' ], baz => ['HashRef'] } );

$model->params(
  {
    bar       => 'test string',
    baz       => Data::Dump::dump( [ foo => 'bar' ] ),
    read_only => {},
    bogus     => 'value'
  }
);
ok( $model->has_errors );
is_deeply( $model->errors, { baz => ['HashRef'], read_only => ['Str'] } );

$model->params( {} );
ok( $model->has_errors );
is_deeply(
  $model->errors,
  {
    bar       => [qw/required Str/],
    baz       => [qw/HashRef/],
    read_only => [qw/required Str/]
  }
);
