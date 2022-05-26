#!/usr/bin/perl

use warnings;
use strict;

use DateTime;
use Getopt::Long;
use Pod::Usage;
use Path::Class;
use Config::Any;
use FindBin;
use lib "$FindBin::Bin/../lib";
use CatPaste::Schema;
use YAML;
use Digest;
use Sys::Hostname;

my @databases      = [ qw/ MySQL SQLite PostgreSQL Oracle XML YAML / ];
my $help           = 0;
my $bin            = dir($FindBin::Bin);

my $hostname = hostname;
my $conf    = 'catpaste.yml';
if ( $ENV{CATALYST_DEBUG} and -f 'catpaste_local.yml' ) {
    $conf = 'catpaste_local.yml'
}

my $config         = YAML::LoadFile(file($bin->parent, $conf));
my $deploy         = 0;
my $create_ddl_dir = 0;
my $attrs          = { add_drop_table => 0, no_comments => 1 };
my $type           = '';

my ($user, $pass, $dsn);
GetOptions('help|?'         => \$help,
       'dsn=s'          => \$dsn,
       'user=s'         => \$user,
       'pass=s'         => \$pass,
       'deploy'         => \$deploy,
       'create_ddl_dir' => \$create_ddl_dir,
      );

pod2usage(1) if ($help);

my $config_dsn;
eval { 
    ($config_dsn, $user, $pass) = 
      @{$config->{'Model::Schema'}->{'connect_info'}};
};
if ($@ ){
    die "Your DSN line in catpaste.yml doesn't look like a valid DSN."
}
$dsn = $config_dsn if(!$dsn);
die "No valid Data Source Name (DSN).\n" if !$dsn;

($type) = ($dsn =~ m/:(.+?):/);
$type = 'MySQL' if $type eq 'mysql';

$dsn =~ s/__HOME__/$FindBin::Bin\/\.\./g;

my $db = CatPaste::Schema->connect($dsn, $user, $pass, $attrs);
if ($create_ddl_dir) {
    print $db->storage->create_ddl_dir($db, @databases, '0.1', 
                       "$FindBin::Bin/../db/", $attrs);
}
else {
    print "Connecting to $dsn\n";
    print " User: $user\n" if $user;
    print " Password: ********\n" if $pass;
    $db->storage->ensure_connected;
    $db->deploy( $attrs );

    my @people = $db->populate('Category', [
        [ qw/label password/ ],
        [ 'General', undef ],
        [ 'PT',  'ptftw!' ],
    ]);
}

1;

__END__

=head1 NAME

catpaste_spawn_db.pl - prodcues the sql statements needed to create a
MailRoller database

=head1 SYNOPSIS

catpaste_spawndb.pl [options]

 Options:
   -help              Display this help and exit
   -create_ddl_dir    Create SQL files for common databases in /db. 
                      Requires SQL::Translator installed.
 Example:
    catpaste_spawndb.pl

 See also:
    perldoc CatPAste

=head1 SEE ALSO

L<CatPaste>

=head1 Cargo Culter (MAINTAINER)

J. Shirley <jshirley@gmail.com>

=head2 ORIGINAL AUTHOR

K. J. Cheetham <jamie@shadowcatsystems.co.uk>

=head1 COPYRIGHT

This library is free software. You can redistribute it and/or modify it under
the same terms as perl itself.

=cut
