package Blog;

use strict;
use warnings;

use Catalyst::Runtime 5.70;

# Set flags and add plugins for the application
#
#         -Debug: activates the debug mode for very useful log messages
#   ConfigLoader: will load the configuration from a Config::General file in the
#                 application's home directory
# Static::Simple: will serve static files from the application's root
#                 directory

use parent qw/Catalyst/;
use Catalyst qw/-Debug
                ConfigLoader
                Static::Simple
                Session
                Session::State::Cookie
                Session::Store::FastMmap/;
our $VERSION = '0.01';

# Configure the application.
#
# Note that settings in blog.conf (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with an external configuration file acting as an override for
# local deployment.

__PACKAGE__->config( name => 'Blog' );

# Start the application
__PACKAGE__->setup();

sub redirect_to_action {
    my ($c, $controller, $action, @params) =@_;
    $c->response->redirect($c->uri_for($c->controller($controller)->action_for($action), @params));
    $c->detach;
}

sub action_uri {
    my ($c, $controller, $action, @params) = @_;
    return eval {$c->uri_for($c->controller($controller)->action_for($action), @params)};
}

=head1 NAME

Blog - Catalyst based application

=head1 SYNOPSIS

    script/blog_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<Blog::Controller::Root>, L<Catalyst>

=head1 AUTHOR

Alexandru Nedelcu,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
