use inc::Module::Install 0.91;

name 'SmokeServer';
all_from 'lib/SmokeServer.pm';

requires 'Moose';
requires 'MooseX::Types::Moose';
requires 'YAML::Syck';
requires Catalyst => '5.64';
requires 'DBIx::Class' => '0.08012';
requires 'Test::TAP::HTMLMatrix' => '0.05';
requires 'HTML::TagCloud' => '0';
requires 'Text::Tags' => '0';
requires 'DateTime' => '0';
requires 'DateTime::Format::ISO8601' => '0';
requires 'Data::Serializer' => '0';
requires 'Time::Duration::Object' => '0';
requires 'Test::use::ok' => '0';
requires 'Catalyst::Plugin::Cache' => '0';
requires 'Cache::Memcached::libmemcached';
requires 'Catalyst::Plugin::HTML::Widget' => '0';
requires 'Catalyst::Plugin::Session' => '0';
requires 'Catalyst::Plugin::Session::State::Cookie' => '0';
requires 'Catalyst::Plugin::Session::Store::Memcached' => '0';
requires 'Catalyst::Plugin::Session::Defaults' => '0';
requires 'Catalyst::Plugin::Static::Simple' => '0';
requires 'Catalyst::Model::DBIC::Schema' => '0';
requires 'Catalyst::View::TT::FunctionGenerator' => '0';
requires 'Catalyst::View::JSON' => '0';
requires 'File::Find::Rule';

test_requires 'Test::WWW::Mechanize::Catalyst';

build_requires 'DBICx::Deploy';

catalyst_ignore 'cpan';
no_index 'cpan';
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/SmokeServer/';

WriteAll;
