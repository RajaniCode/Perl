use feature ':5.22';
use strict;
use warnings;

my $big_int = 18446744073709551615;

say($big_int);

my $big_int = 18446744073709551616; # 1.84467440737096e+19

say($big_int);