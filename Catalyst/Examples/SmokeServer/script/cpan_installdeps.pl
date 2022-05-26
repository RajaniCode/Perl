#!/usr/bin/perl 

use strict;
use warnings;
use FindBin '$Bin';
use CPAN;

BEGIN {
    $ENV{PERL_MM_USE_DEFAULT} = 1;
}

my $dir = "$Bin/../cpan/extracted";

opendir my($dists), $dir
    or die "run $Bin/cpan_download first\n";

my @dists = grep !/^\.\.?\z/, readdir $dists;
closedir $dists;

# set up CPAN
CPAN::HandleConfig->load;
$CPAN::Config->{auto_commit} = 0;
@{$CPAN::Config->{urllist}} or
    $CPAN::Config->{urllist} = [ q[http://www.perl.org/CPAN] ];
$CPAN::Config->{prerequisites_policy} = q[follow];

# make sure we have the latest CPAN to get 'notest'
CPAN::Shell->install('CPAN');

# install some deps if on Debian (add to this list if needed)
#if (-f '/etc/debian_version') {
#    system 'sudo apt-get -y install libmath-bigint-gmp-perl libtidy-dev \
#    perlmagick libxslt1-dev libgd2-xpm-dev libgdbm-dev libxapian-dev \
#    libmemcached-dev libcache-memcached-perl';
#}

# Math::Pari prompts unless you pass in an option
{
    local $CPAN::Config->{makepl_arg} = 'force_download';
    CPAN::Shell->notest(install => 'Math::Pari');
}

# turn off manification for ->make
#$CPAN::Config->{make_arg} = 'POD2MAN_EXE=/bin/true';
$CPAN::Config->{makepl_arg}  = 'INSTALLMAN1DIR=none INSTALLMAN3DIR=none';
$CPAN::Config->{buildpl_arg} = '--install_path libdoc="" --install_path bindoc=""';

for my $dist (@dists) {
    chdir "$dir/$dist" or die $!;

# stolen from confound at https://trac.opensourcery.com/public/elementalclinic/browser/trunk/build_scripts/deps/install
    my $d = CPAN::Shell->expandany("$dir/$dist/.");
    $d->make;
    for my $p ($d->unsat_prereq("later")) {
        my ($name) = @$p;
        CPAN::Shell->notest(install => $name);
    }

    if (-e 'Makefile') {
        system 'make realclean >/dev/null 2>&1';
    } else {
        system './Build realclean >/dev/null 2>&1';
    }
}

print "************ DONE ***************\n";
