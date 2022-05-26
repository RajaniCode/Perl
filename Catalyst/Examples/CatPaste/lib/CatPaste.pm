package CatPaste;

use strict;
use warnings;

use Catalyst::Runtime '5.70';

# Set flags and add plugins for the application
#
#   ConfigLoader: will load the configuration from a YAML file in the
#                 application's home directory
# Static::Simple: will serve static files from the application's root 
#                 directory

use Catalyst qw/ConfigLoader Static::Simple/;

our $VERSION = '0.01';

# Configure the application. 
#
# Note that settings in CatPaste.yml (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with a external configuration file acting as an override for
# local deployment.

__PACKAGE__->config(
    name => 'CatPaste',
    'View::TT' => {
        WRAPPER             => 'site/wrapper.tt',
        TEMPLATE_EXTENSION  => '.tt'
    }
);

# Start the application
__PACKAGE__->setup;


=head1 NAME

CatPaste - Catalyst based PasteBot

=head1 SYNOPSIS

    script/catpaste_server.pl

=head1 DESCRIPTION

CatPaste is a simple pastebot with L<Syntax::Highlight::Engine::Kate> support
with future plans to support L<POE::Component::IKC> to support instant
notification to listening programs (such as a plagger based ircbot)

=head1 SEE ALSO

L<CatPaste::Controller::Root>, L<Catalyst>

=head1 AUTHOR

J. Shirley <jshirley@gmail.com>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
