use inc::Module::Install 0.87;

name 'MiniMojoDBIC';
all_from 'lib/MiniMojoDBIC.pm';

requires Catalyst => '5.64';

catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/MiniMojoDBIC/';

WriteAll;
