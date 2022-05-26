#!/usr/bin/env perl -w

BEGIN { $ENV{CATALYST_ENGINE} ||= 'SCGI' }

use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use FindBin;
use lib "$FindBin::Bin/../lib";
use Typeface;

my $help = 0;
my ( $port, $detach );
 
GetOptions(
    'help|?'      => \$help,
    'port|p=s'  => \$port,
    'daemon|d'    => \$detach,
);

pod2usage(1) if $help;

Typeface->run( 
    $port, 
    $detach,
);

1;

