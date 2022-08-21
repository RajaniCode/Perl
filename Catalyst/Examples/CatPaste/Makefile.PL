use inc::Module::Install 0.87;

name 'CatPaste';
all_from 'lib/CatPaste.pm';

requires 'Catalyst' => '5.7007';
requires 'DBIx::Class';
requires 'DBD::SQLite';
requires 'XML::Feed';
requires 'Syntax::Highlight::Engine::Kate';
requires 'POE::Component::IKC::ClientLite';

requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::View::TT';
requires 'Catalyst::Model::DBIC::Schema';

requires 'DBIx::Class::TimeStamp';

requires 'YAML'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/CatPaste/';

WriteAll;
