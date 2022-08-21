use inc::Module::Install 0.87;

name 'Statistics-QMethod-SortGenerator';
all_from 'lib/Statistics/QMethod/SortGenerator.pm';

requires 'Catalyst' => '5.7012';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::View::TT';
requires 'Statistics::QMethod::QuasiNormalDist';
requires 'Config::General'; 
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/Statistics-QMethod-SortGenerator/';

WriteAll;
