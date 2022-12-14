use inc::Module::Install 0.87;

name 'Typeface';
all_from 'lib/Typeface.pm';

requires 'Catalyst' => '5.7006';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::Plugin::Cache';
requires 'Catalyst::Plugin::Cache::FileCache';
requires 'Catalyst::Plugin::PageCache';
requires 'Catalyst::Controller::FormBuilder';
requires 'Catalyst::Plugin::Session';
requires 'Catalyst::Plugin::Session::Store::File';
requires 'Catalyst::Plugin::Session::State::Cookie';
requires 'Catalyst::Plugin::Authentication';
requires 'Catalyst::Plugin::Authentication::Store::DBIC';
requires 'Catalyst::Plugin::Authentication::Credential::Password';
requires 'Catalyst::Plugin::Captcha';
requires 'Catalyst::View::JSON';
requires 'Text::Highlight';
# requires 'Syntax::Highlight::Engine::Kate';
# requires 'Syntax::Highlight::Engine::Kate:All';
requires 'Text::Textile';
requires 'JSON::Syck';
requires 'Scalar::Util::Clone';
requires 'DateTime::Format::Pg';
requires 'DateTime::Format::MySQL';
requires 'SQL::Translator';
requires 'SCGI';
requires 'Catalyst::Plugin::Server';
requires 'Catalyst::Plugin::Server::XMLRPC';
requires 'Config::Any::YAML';
requires 'XML::Feed';
requires 'HTML::CalendarMonthSimple';
requires 'Switch';
requires 'DateTime';
requires 'YAML'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
catalyst;

install_script glob('script/*.pl');
auto_install;
resources repository => 'http://dev.catalyst.perl.org/repos/Catalyst/trunk/examples/typeface/';

WriteAll;
