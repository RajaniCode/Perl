package CatTube;

use strict;
use warnings;

use Catalyst::Runtime '5.70';

# Set flags and add plugins for the application
#
#         -Debug: activates the debug mode for very useful log messages
#   ConfigLoader: will load the configuration from a YAML file in the
#                 application's home directory
# Static::Simple: will serve static files from the application's root 
#                 directory

use Catalyst qw/-Debug ConfigLoader Static::Simple Prototype/;

our $VERSION = '0.01';

# Configure the application. 
#
# Note that settings in CatTube.yml (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with a external configuration file acting as an override for
# local deployment.

__PACKAGE__->config( name => 'CatTube' );

# Start the application
__PACKAGE__->setup;


=head1 NAME

CatTube - Catalyst based application

=head1 SYNOPSIS

    script/cattube_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<CatTube::Controller::Root>, L<Catalyst>

=head1 AUTHOR

Catalyst developer

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
