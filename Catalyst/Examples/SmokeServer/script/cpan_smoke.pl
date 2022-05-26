#!/usr/bin/perl

use strict;
use warnings;
use FindBin qw($Bin);
use lib "$Bin/../lib";
use lib 'blib/lib'; # in dist dirs
use Test::TAP::Model;
use Test::TAP::Model::Smoke;
use File::Find::Rule;
use IO::Handle;
use File::Spec::Functions 'splitdir';

# these hang, or do other nasty things
my @SKIP = (qw/
    Catalyst-View-Reproxy
/);
my %SKIP;
@SKIP{@SKIP} = (1) x @SKIP;

warn("$0 http://smokeserver:3000 [extra tags]\n") unless scalar(@ARGV);
my $uri = shift || 'http://localhost:3001';
my @extra_tags = @ARGV;

my $dir = "$Bin/../cpan/extracted";

opendir my($dists), $dir
    or die "run $Bin/cpan_download && $Bin/cpan_installdeps.pl first\n";

my @dists = grep !/^\.\.?\z/, readdir $dists;
closedir $dists;

# install latest runtime trunk
system q{
    cd ~/repos/Catalyst-Runtime/5.80/trunk;
    svn up;
    perl Makefile.PL INSTALLMAN1DIR=none INSTALLMAN3DIR=none;
    make
    make install
};
my $runtime_revision =
qx[cd ~/repos/Catalyst-Runtime/5.80/trunk; svn info | grep '^Revision' | awk '{ print \$2 }'];
chomp $runtime_revision;

open my $log, '>', "$Bin/../cpan_smoke.log" or die $!;
$log->autoflush(1);

for my $dist_dir (@dists) {
    chdir "$dir/$dist_dir" or die $!;

    my ($dist, $dist_version) = $dist_dir =~ /^(.+)-(\d[^-]+)/;
    $dist ||= $dist_dir;
    next if exists $SKIP{$dist};

    my $tarball;

    if (not $dist_version) {
        (my $re = $dist_dir) =~ s/[^A-Za-z0-9]/./g;
        ($tarball) = File::Find::Rule->file->name(qr/^$re/i)->in("$Bin/../cpan/authors");
        ($dist_version) = $tarball =~ /-([^-]+)(?:\.tar\.gz|\.zip)\z/i;
    } else {
        ($tarball) = File::Find::Rule->file->name("${dist_dir}.*")->in("$Bin/../cpan/authors");
    }

    my $uploader = (splitdir $tarball)[-2];

    my @test_files = File::Find::Rule->file->name('*.t')->in('t/');

    print "*** Now testing $dist version $dist_version\n";

    if (-e 'Makefile.PL') {
        system
            "($^X Makefile.PL INSTALLMAN1DIR=none INSTALLMAN3DIR=none;
              make) >/dev/null 2>&1";
    } else {
        system qq{
            ($^X Build.PL --install_path libdoc="" --install_path bindoc="";
             ./Build) >/dev/null 2>&1};
    }

    my $model  = Test::TAP::Model->new_with_tests(@test_files);

    if (-e 'Makefile') {
        system "make realclean >/dev/null 2>&1";
    } else {
        system "./Build realclean >/dev/null 2>&1";
    }

    print $log (($model->ok ? 'PASS' : 'FAIL') . " $dist $dist_version "
        . $model->ratio . "\n");

    my $report = Test::TAP::Model::Smoke->new($model,
        "module.$dist",
        "version.cpan.$dist_version",
        "uploader.$uploader",
        "catalyst-runtime.svn.r${runtime_revision}",
        @extra_tags
    );

    my $result = $report->upload($uri . "/upload");

    unless ($result->code == 200 && $result->content eq 'OK') {
        warn("Error " . $result->content . "\n");
        exit 1;
    }
}

print "************** DONE ****************\n";

# vim:sts=4 sw=4 et cindent:
