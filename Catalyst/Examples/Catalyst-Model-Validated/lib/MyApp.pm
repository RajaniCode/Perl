package MyApp;

=pod

This is a sample app for testing and improving Catalyst::Model::Validate, please
fix things where applicable

=cut

use strict;
use warnings;

use Catalyst::Runtime '5.70';

use parent qw/Catalyst/;

our $VERSION = '0.01';

__PACKAGE__->config( name => 'MyApp' );

__PACKAGE__->setup(qw/ConfigLoader Static::Simple/);

1;
