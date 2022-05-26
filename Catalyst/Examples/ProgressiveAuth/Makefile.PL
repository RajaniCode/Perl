# IMPORTANT: if you delete this file your app will not work as
# expected.  you have been warned
use inc::Module::Install 0.87;

name 'ProgressiveAuth';
all_from 'lib/ProgressiveAuth.pm';

requires 'Catalyst::Runtime' => '5.7014';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';

requires 'Catalyst::Plugin::Authentication' => '0.100091';

requires 'Catalyst::Authentication::Credential::OpenID';

requires 'parent';

# This should reflect the config file format you've chosen
# See Catalyst::Plugin::ConfigLoader for supported formats
requires 'Config::General'; 


catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/ProgressiveAuth/';

WriteAll;
