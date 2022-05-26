# IMPORTANT: if you delete this file your app will not work as
# expected.  you have been warned
use inc::Module::Install 0.87;

name 'OAuthExample';
all_from 'lib/OAuthExample.pm';

requires 'Catalyst::Runtime' => '5.7014';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::Plugin::Session::State::Cookie';
requires 'Catalyst::Plugin::Session::Store::File';
requires 'Catalyst::View::TT';
requires 'Crypt::OpenSSL::RSA';
requires 'Net::OAuth';
requires 'XML::LibXML';
requires 'Data::Random';
requires 'parent';
requires 'Config::General'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/OAuthExample/';

WriteAll;
