use feature ':5.22';
use strict;
use warnings;

sub func {
    # our $num;
    # $num = $num + 1;
    our $num = $num + 1;
}

sub main {
    # our $num;
    # $num = 1;
    our $num = 1;
    &func; #func();
    say($num);
}

our $num = 0;
main();


=pod
2
=cut
