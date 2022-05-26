use inc::Module::Install 0.87;

name 'Cheer';
all_from 'lib/Cheer.pm';

requires 'Catalyst' => '5.7005';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Date::Calc';
requires 'YAML'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/Cheer/';

WriteAll;
