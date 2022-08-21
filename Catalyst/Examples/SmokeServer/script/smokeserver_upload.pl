#!/usr/bin/perl

use strict;
use warnings;

use FindBin qw($Bin);
use lib "$Bin/../lib";

use Test::TAP::Model;
use Test::TAP::Model::Smoke;

die("$0 http://smokeserver:3000 /home/me/project_checkout") unless scalar(@ARGV) == 2;

my $uri = shift;
my $project = shift;

# Eugh, horrible horrible hacky mess.
lib->import("$project/lib");
chdir($project);
system("cd $project ; perl Makefile.PL") && do { warn("Project $project Makefile.PL non zero exit status"); exit 1 };
system("cd $project; make installdeps");
my $model = Test::TAP::Model->new_with_tests( glob("$project/t/*.t") );
my $report = Test::TAP::Model::Smoke->new( $model, qw/milk elk tag1/);

my $result = $report->upload($uri . "/upload");
my $exp_body = "OK";

unless ($result->code == 200 && $result->content eq $exp_body) {
    warn("Error " . $result->content . "\n");
    exit 1;
}
exit 0;

