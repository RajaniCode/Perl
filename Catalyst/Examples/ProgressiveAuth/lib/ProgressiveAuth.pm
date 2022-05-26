package ProgressiveAuth;

use strict;
use warnings;

use Catalyst::Runtime '5.70';

use parent qw/Catalyst/;

use Catalyst qw/ 
    ConfigLoader Static::Simple 
    Authentication Session Session::Store::FastMmap Session::State::Cookie
/;

our $VERSION = '0.01';

# Our member hash, which is going to be passed into the simple store for
# password authentication
my $members = {
    bob  => { password => "s00p3r" },
    bill => { password => "s3kr1t" },
};


__PACKAGE__->config( 
    name => 'ProgressiveAuth',
    'Plugin::Authentication' => {
        default_realm => 'progressive',
        realms => {
            progressive => {
                class  => 'Progressive',
                realms => [ 'openid', 'local' ],
            },
            'openid' => {
                credential => {
                    class => 'OpenID'
                },
                store => {
                    class => 'Null',
                }
            },
            'local' => {
                credential => {
                    class => 'Password',
                    password_field => 'password',
                    password_type => 'clear'
                },
                store => {
                    class => 'Minimal',
                    users => $members
                }
            },
        }
    }
);

# Start the application
__PACKAGE__->setup();

=head1 NAME

ProgressiveAuth - Catalyst example application for progressive authentication

=head1 SYNOPSIS

This application was built for the 2008 Catalyst Advent Calendar, available
at L<http://www.catalystframework.org/calendar/2008/>

To start the server, simply run:

    script/progressiveauth_server.pl

Then, in your web-browser load:

    http://localhost:3000/login

You are then able to login via OpenID or local store

=head1 DESCRIPTION

This application is designed to demonstrate how to use the Progressive 
authentication system so that you can have multiple types of logins and
"fall through" by order of precedence.

=head1 SEE ALSO

=over

=item L<Catalyst::Plugin::Authentication>

The documentation for authentication

=item L<Catalyst::Plugin::Authentication::Realm::Progressive>

The documentation for the progressive realm

=item L<Catalyst>

Catalyst, where all the magic happens.

=back

=head1 AUTHOR

Jay Shirley C<< <jshirley@coldhardcode.com> >>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
