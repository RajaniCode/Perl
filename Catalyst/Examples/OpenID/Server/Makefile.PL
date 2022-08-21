use inc::Module::Install 0.87;

name 'OpenID';
all_from 'lib/OpenID.pm';

build_requires 'Test::OpenID::Consumer';
requires 'Catalyst' => '5.7007';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Net::OpenID::Server';
requires 'YAML'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/OpenID/Server/';

WriteAll;
