use inc::Module::Install 0.87;

name 'IM';
all_from 'lib/IM.pm';

requires Catalyst => '5.62';
requires Catalyst::Plugin::DefaultEnd;
requires Catalyst::Plugin::Session;
requires Catalyst::Plugin::Session::Store::DBI;
requires Catalyst::Plugin::Session::State::Cookie;
requires Catalyst::Plugin::Scheduler;
requires Catalyst::Controller::BindLex;

catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/InstantMessenger/';

WriteAll;
