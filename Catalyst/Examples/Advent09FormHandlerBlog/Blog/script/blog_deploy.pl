#!/usr/bin/env perl
use strict;
use warnings;

use Blog::Schema qw(load_schema);

my $schema = load_schema();
$schema->deploy;
