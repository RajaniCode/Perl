#!/usr/bin/env perl
use strict;
use Placky;

Placky->setup_engine('PSGI');
my $app = sub { Placky->run(@_) };
