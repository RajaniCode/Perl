use feature ':5.22';
use strict;
use warnings;

sub stringify_undef_for {
    for my $x ( @_ ) {
        if (! defined $$x) {
            $$x = "undef";            
        }
    }
}

my $x = undef;
my $y = 0;
# my $y = "";
my $z = "Hello, World!";
say("stringify undef");
stringify_undef_for(\$x, \$y, \$z);
say($x);
say($y);
say($z);
say("");

sub call_by_value {
    my $n = shift; # my $n = @_;
    $n++; # Note # $$n++; # Won't work when called by SCALAR 
}
my $number = 5; 
say("pass by value");
call_by_value($number);
say($number);
say("");

sub call_by_reference {
    my $n = shift; # my $n = @_; # Can't use string ("1") as a SCALAR ref while "strict refs" in use at call_by_reference.pl line 17.
    $$n++; # Note # $n++; # Will make it call by value
}
$number = 5;
say("pass by reference");
call_by_reference(\$number);
say($number);
say("");

sub func {
    my ($a, $b) = @_;
    $a = 'new-value'; # a and b are local names
    $b = $b + 1; # assigned to new objects
    return $a, $b; # return new values
}

my ($c, $d) = ('old-value', 99);
say($c, " " , $d);

($c, $d) = func($c, $d);
say($c, " " ,$d);
