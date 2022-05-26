use strict;
use warnings;
use Test::More tests => 11;

BEGIN { use_ok 'Test::WWW::Mechanize::Catalyst', 'NewAuthApp' }
BEGIN { use_ok 'NewAuthApp::Controller::Admin' }

my $mech=Test::WWW::Mechanize::Catalyst->new();
$mech->get_ok('http://localhost/');
$mech->submit_form( form_number => 1,
                    fields => {
                        user => 'bob',
                        password => 'bob',
                    },
                );
$mech->content_contains('Login successful', 'logged in');
$mech->follow_link_ok( {text => 'this'}, 'got admin page');
$mech->content_contains("you're allowed to admin",'allowed to admin');
$mech->get_ok('http://localhost/auth/logout','logged out');
$mech->get_ok('http://localhost/');
$mech->submit_form( form_number => 1,
                    fields => {
                        user => 'bill',
                        password => 'bill',
                    },
                );
$mech->content_contains('Login successful', 'logged in');
$mech->follow_link_ok( {text => 'this'}, 'got admin page');
$mech->content_contains('You are not allowed to view this page','not allowed');



