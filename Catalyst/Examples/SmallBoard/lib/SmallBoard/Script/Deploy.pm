package SmallBoard::Script::Deploy;

use Moose;
use MooseX::Types::Moose qw/Str/;
use SmallBoard::Schema;
use namespace::autoclean;
with 'Catalyst::ScriptRole';

has dsn => (
    traits        => [qw(Getopt)],
    isa           => Str,
	is            => 'ro',
	required      => 1,
	documentation => "dsn for your database"
);

has user => (
    traits        => [qw(Getopt)],
	isa           => Str,
	is            => 'ro',
	required      => 1,
	documentation => "username for your database",
);

has password => (
    traits        => [qw(Getopt)],
    isa           => Str,
	is            => 'ro',
	documentation => "password for your database",

);

has schema => (
    traits        => [qw(NoGetopt)],
	isa           => 'SmallBoard::Schema',
	is            => "ro",
	default       => sub { my $self = shift;  SmallBoard::Schema->connect($self->dsn, $self->user, $self->password);  },
);

sub run {
    my ($self) = @_;
	$self->_getopt_full_usage if !$self->ARGV->[0];
    print "Deploying...\n";
	print $_ . ":" .$self->$_ ."\n" for qw/ dsn user password /;
	$self->schema->deploy or die "Can't deploy: $!";
	print "Deployed successfully!\n";
}

sub _application_args {
    my ($self) = shift;
    return (
	    {
	     map { $_ => $self->$_ } qw/ dsn user password /
        }
    );
}

__PACKAGE__->meta->make_immutable;

1;

