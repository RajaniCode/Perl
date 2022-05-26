package OpenID;

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

use Catalyst qw/-Debug ConfigLoader Static::Simple
    Authentication
    Authentication::Store::Minimal
    Authentication::Credential::Password
    Session
    Session::Store::FastMmap
    Session::State::Cookie
/;

our $VERSION = '0.01';

# Configure the application.
#
# Note that settings in OpenID.yml (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with a external configuration file acting as an override for
# local deployment.

__PACKAGE__->config(
    name           => 'OpenID',
    authentication => { users => { foo => { password => 'password' } } }
);

# Start the application
__PACKAGE__->setup;

=head1 NAME

OpenID - Catalyst based application

=head1 SYNOPSIS

    script/openid_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<OpenID::Controller::Root>, L<Catalyst>

=head1 AUTHOR

Eden Cardoso Cardim

=head1 LICENSE

This library is copyright (C) 2007, PictureTrail.com

=cut

1;
