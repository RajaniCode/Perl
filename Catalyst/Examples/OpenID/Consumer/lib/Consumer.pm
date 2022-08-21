package Consumer;

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
    Authentication::Credential::OpenID
    Session
    Session::Store::FastMmap
    Session::State::Cookie/;

our $VERSION = '0.01';

# Configure the application.
#
# Note that settings in Consumer.yml (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with a external configuration file acting as an override for
# local deployment.

__PACKAGE__->config(
    name           => 'Consumer',
    authentication => { openid => { use_session => 1 } }
);

# Start the application
__PACKAGE__->setup;

=head1 NAME

Consumer - Catalyst based application

=head1 SYNOPSIS

    script/consumer_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<Consumer::Controller::Root>, L<Catalyst>

=head1 AUTHOR

Eden Cardoso Cardim,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
