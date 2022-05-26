use inc::Module::Install 0.87;

name     'Catalyst-Model-ValidatedAction';
all_from 'lib/Catalyst/Model/ValidatedAction.pm';
author   'Eden Cardim <edencardim@gmail.com>';

build_requires 'Test::More';

auto_install;

resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/Catalyst-Model-Validated/';

WriteAll;

