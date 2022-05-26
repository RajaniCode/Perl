use strict;
use warnings;
use Test::More tests => 9;

BEGIN { use_ok 'Test::WWW::Mechanize::Catalyst', 'NewAuthApp' }
BEGIN { use_ok 'NewAuthApp::Controller::Auth' }

my $mech = Test::WWW::Mechanize::Catalyst->new;
$mech->get_ok('http://localhost/');
$mech->submit_form( form_number => 1,
                    fields => {
                        user => 'bob',
                        password => 'bob',
                    },
                );
$mech->content_contains('Login successful', 'logged in');
$mech->follow_link_ok( {text => 'logout'}, 'logging out');
$mech->content_contains('Logout successful', 'logged out');
$mech->follow_link_ok( {text => 'Return to home page'}, 'back home');
$mech->submit_form( form_number => 1,
                    fields => {
                        user => 'notbob',
                        password => 'notbob',
                    },
                );
$mech->content_contains('Invalid user and/or password', 'not logged in');
$mech->get('http://localhost/auth/login?dudusername=joeuser&dudpassword=hackme');
$mech->content_contains('invalid form input', 'dud form input barfs');
