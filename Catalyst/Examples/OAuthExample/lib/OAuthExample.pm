package OAuthExample;

use strict;
use warnings;

use Catalyst::Runtime '5.70';

# Set flags and add plugins for the application
#
#         -Debug: activates the debug mode for very useful log messages
#   ConfigLoader: will load the configuration from a Config::General file in the
#                 application's home directory
# Static::Simple: will serve static files from the application's root 
#                 directory

use parent qw/Catalyst/;
use Crypt::OpenSSL::RSA;
use File::Slurp;
use Data::Random qw(rand_chars);


our $VERSION = '0.01';

# Configure the application. 
#
# Note that settings in oauthexample.conf (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with a external configuration file acting as an override for
# local deployment.

__PACKAGE__->config( name => 'OAuthExample' );

# Start the application
__PACKAGE__->setup(qw/-Debug 
    ConfigLoader 
    Static::Simple 
    Session 
    Session::State::Cookie
    Session::Store::File/);


sub _get_key {
    my $c = shift;
    my $ketstring = read_file($c->config->{private_key});
    return Crypt::OpenSSL::RSA->new_private_key($ketstring);
}

sub _default_request_params {
        my $c = shift;
        return (
                consumer_key => $c->config->{consumer_key},
                consumer_secret => '',
                request_method => 'GET',
                signature_method => 'RSA-SHA1',
                timestamp => time,
                nonce => join('', rand_chars(size=>16, set=>'alphanumeric')),
        );
}


=head1 NAME

OAuthExample - Catalyst based application

=head1 SYNOPSIS

    script/oauthexample_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<OAuthExample::Controller::Root>, L<Catalyst>

=head1 AUTHOR

Marcus Ramberg

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
