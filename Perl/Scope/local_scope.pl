use feature ':5.22';
use strict;
use warnings;

sub func {
    # local $num = 5; # without # use strict;
    my $num = 5;
    $num = $num + 1;
}

sub main {
    # local $num = 1; # without # use strict;
    my $num = 1;    
    &func; # func(); 
    say($num);
}

main();


=pod
1
=cut
