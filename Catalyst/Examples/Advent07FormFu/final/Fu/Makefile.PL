use inc::Module::Install 0.87;

name 'Fu';
all_from 'lib/Fu.pm';

requires 'Catalyst::Runtime' => '5.7011';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::Controller::HTML::FormFu' => '0.02000';
requires 'HTML::FormFu' => '0.02002';
requires 'YAML'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/Advent07FormFu/final/Fu/';

WriteAll;
