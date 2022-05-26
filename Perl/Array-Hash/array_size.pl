use feature ':5.22';
use strict;
use warnings;

my @arr = (2);
say(scalar @arr); # First way to print array size

say($#arr); # Second way to print array size

my $arrSize = @arr;
say($arrSize); # Third way to print array size

=pod
The first and third ways are the same: they evaluate an array in scalar context. I would consider this to be the standard way to get an array's size.
The second way actually returns the last index of the array, which is not (usually) the same as the array size.
=cut
