use feature ':5.22';
use strict;
use warnings;

my $scalar = 10;

my @array  = (1, 2);

my %hash   = ( "1" => "Foo Bar" );

# print the reference type of every parameter.

sub printRef {
    foreach (@_) {
        my $refType = ref($_);
        defined($refType) ? print("$refType ") : print("Non-reference ");
    }    
}

printRef( $scalar, @array, %hash );
print("\n");
printRef( \$scalar, \@array, \%hash );
print("\n");
printRef( \&printRef, \\$scalar );

# Output
=pod

SCALAR ARRAY HASH
CODE REF
=cut