use feature ':5.22';
use strict;
use warnings;

use Data::Dumper;

# Note # Only 1 key from duplicated keys
my %hash = ( 1 => 'alpha', 2 => 'beta', 3 => 'gamma', 4 => 'delta', 5 => 'epsilon', 6 => 'zeta', 7 => 'gamma',
	9 => undef, 10 => 'iota',  undef => 'kappa', 11 => 'lambda', undef => undef, 12 => 'mu', 13 => 'nu' );

say("ref(\%hash)");
say(ref(\%hash));
say(Dumper(\%hash));
say(scalar keys %hash); # say(scalar values %hash);
say("");

say("add if key does not exist else update # 8  => 'theta'");
$hash{8} = 'theta';
say(Dumper(\%hash));
say(scalar keys %hash);
say("\$hash{8}");
say ($hash{8});
say("");

say("update if key exists else add # 7  => 'eta'");
$hash{7} = 'eta';
say(Dumper(\%hash));
say(scalar keys %hash);
say("\$hash{7}");
say ($hash{7});
say("");

say("delete item based on key only # 9  => undef");
delete $hash{9};
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("delete item based on key only # No effect despite key 20 not in hash");
delete $hash{20};
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("delete item item based on key only # 11  => 'lambda'");
delete $hash{11};
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("add if key undef does not exist else update # warning in say without Dumper");
$hash{undef} = undef;
say(Dumper(\%hash));
say(scalar keys %hash);
say("Dumper(\$hash{undef})");
say(Dumper($hash{undef})); # Use of uninitialized value $hash{"undef"} in say # without Dumper
say("");

say("undef %hash");
undef %hash;
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("hash from arrays - arbitrary");
my @array1 = ('A', 'B', 'C', 'D', 'E');
my @array2 = (1, 2, 3, 4, 5);
my @array3 = ('alpha', 'beta', 'gamma', 'delta', 'epsilon');
%hash = (1 => @array1, 2 => @array2, 3 => @array3);
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

=pod
cpanm List::Tuples # # cpanm List::Tuples --force
use List::Tuples qw(:all) ;
my @tuples = tuples[2] => (1 .. 6); # is equivalent to: my @tuples = tuples[2] => (1 .. 6);
=cut

say("hash from array of tuples");
my @tuples = ([1, 'Mango'], [2, 'Banana']); 
say("ref(\@tuples)");
say(ref(\@tuples));
say(Dumper(\@tuples));
%hash = @tuples;
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("hash from array of hash");
my @array = ((1 => 'English', 2 => 'French'));
say("ref(\@array)");
say(ref(\@array));
%hash = @array;
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("hash");
%hash = (1  => 'Red', 2  => 'Green', 3  => 'Blue');
say(Dumper(\%hash));
say(scalar keys %hash);
say("");

say("hash for using variable");
my @numbers = keys %hash;
for my $number (@numbers) {
    print "The number '$number' is the key of $hash{$number}\n";
}
say("");

say("hash for");
for my $number (keys %hash) {
    print "The number '$number' is the key of $hash{$number}\n";
}
say("");

say("hash while print key, value");
while (my ($key, $value) = each %hash) {
    print "$key, $value\n";
}
say("");

say("hash while print key=value");
while (my ($key,$value) = each %hash) {
    print "$key=$value\n";
}
say("");

say("while each");
while (each %hash) {
	print "$_=$hash{$_}\n";
    }
say("");


say("key 'number'");
%hash = ('name'  => 'Foo', 'number'  => 1);
my $key = 'number';
say "Exists" if exists $hash{$key};
say "Defined" if defined $hash{$key};
say "True" if $hash{$key};
say("");

say("key 'name'");
%hash = ('name'  => 'Foo', 'number'  => 1);
$key = 'name';
say "Exists" if exists $hash{$key};
say "Defined" if defined $hash{$key};
say "True" if $hash{$key};
say("");

say("value 'Foo'");
my @matching_keys = grep { $hash{$_} eq 'Foo' } keys %hash;
say("$_ ") foreach @matching_keys;
my ($any_match) = grep { $hash{$_} eq 'Foo' } keys %hash;
say("$_ ") foreach $any_match;
say("");

say("value 1");
@matching_keys = grep { $hash{$_} eq 1 } keys %hash;
say("$_ ") foreach @matching_keys;
($any_match) = grep { $hash{$_} eq 1 } keys %hash;
say("$_ ") foreach $any_match;
say("");

say("default \@_");
sub hash {
    # my %default = ('name'  => 'Foo', 'number'  => 1);
    # my %params = (%default, @_);
    my %params = ('name'  => 'Foo', 'number'  => 1, @_);
    \%params
}
say(ref(&hash));
say(Dumper(hash('technology' => 'Perl')));
say("");


say("comprehension equivalent grep");
%hash = ( A => 'undef', B => 'yes', C => undef );
my @keys = grep { defined $hash{$_} } keys %hash;
say "Key: $_" for @keys;
say("");

=pod
# Obj.pm
package Obj;
use feature ':5.22';
use strict;
use warnings;

my $id = 0;

sub new {
    my $invocant = shift;
    my $class = ref($invocant) || $invocant;
    my $self = { @_ };          # Remaining args become attributes
    bless($self, $class);       # Bestow objecthood
    return $self;
}

sub get_id {
    my $self = shift;
    return $self->{id};
}

sub set_id {
    my $self      = shift;
    $self->{id} = shift;
}

1;
=cut

say("comprehension equivalents grep");
use Obj;
my $obj0 = Obj->new;
$obj0->set_id(100);
my $obj1 = Obj->new;
$obj1->set_id(101);
my $obj2 = Obj->new;
$obj2->set_id(102);
my @objs = ($obj0, $obj1, $obj2);
%hash = map { $_->get_id > 100 ? $_->get_id : () } @objs;
say(Dumper(\%hash));
say("OR");
%hash = map { $_->{id} > 100 ? $_->{id} : () } @objs;
say(Dumper(\%hash));
say("OR");
%hash = map { $_->get_id } grep { $_->get_id > 100 } @objs;
say(Dumper(\%hash));
say("OR");
%hash = grep { $_ > 100 } map { $_->get_id } @objs;
say(Dumper(\%hash));
say("OR");
%hash = map + ($_->get_id) x ($_->get_id>100), @objs;
say(Dumper(\%hash));
say("");


say("alphanumeric");
# Bareword "True" not allowed while "strict subs" in use
# Bareword "False" not allowed while "strict subs" in use
# Use of uninitialized value $hash{""} in printf #  '' => undef
%hash = ('Alpha' => 'foo', 'Gamma' => 'bar', 'Beta' => 'baz', 'r' => 'Red', 'g' => 'Green', 'b' => 'Blue', 1 => 20, .2 => 2.5, 10 => [20, 30, 40], 50 => 60, 70 => 80, 0.9 => 90, 02 => 03, undef => '');
say(Dumper(\%hash));
say(scalar keys %hash);
say("string sort by keys default ASCII except in use of locale");
foreach my $x (sort keys %hash) {
    printf "%-8s %s\n", $x, $hash{$x};
}
say("alphabetical sort by keys");
foreach my $x (sort {lc $a cmp lc $b} keys %hash) {
    printf "%-8s %s\n", $x, $hash{$x};
}
say("string sort by values default ASCII except in use of locale");
foreach my $x (sort values %hash) {
    say $x;
}
say("alphabetical sort by values");
foreach my $x (sort {lc $a cmp lc $b} values %hash) {
    say $x;
}
say("");

say("alpha");
%hash = ('a' => 'Austria', 'c' => 'Canada', 'b' => 'Belgium', 'A'  => 'Australia', 'C' => 'Cuba', 'B' => 'Brazil', 'A' => 'Antartica', 'ascii' => 'ascii');
say("hash retains only unique keys and undefined order despite duplicate keys and given order");
say(Dumper(\%hash));
say(scalar keys %hash);
say("string sort by keys default ASCII except in use of locale");
foreach my $x (sort keys %hash) {
    printf "%-8s %s\n", $x, $hash{$x};
}
say("alphabetical sort by keys");
foreach my $x (sort {lc $a cmp lc $b} keys %hash) {
    printf "%-8s %s\n", $x, $hash{$x};
}
say("string sort by values default ASCII except in use of locale");
foreach my $x (sort values %hash) {
    say $x;
}
say("alphabetical sort by values");
foreach my $x (sort {lc $a cmp lc $b} values %hash) {
    say $x;
}
say("");

say("numeric");
%hash = (1  => 1, 3  => 9, -5  => 25, 7  => 49, -0.0  => .1, 9  => 81, -.8  => -.7, 0  => 0, 0  => -0, 9  => 9, 2.2 => 2.2, 20 => 20);
say("hash retains only unique keys and undefined order despite duplicate keys and given order");
say(Dumper(\%hash));
say(scalar keys %hash);
say("string sort by keys default ASCII except in use of locale");
foreach my $x (sort keys %hash) {
    printf "%-8s %s\n", $x, $hash{$x};
}
say("numeric sort by keys");
foreach my $x (sort {$a <=> $b} keys %hash) {
    printf "%-8s %s\n", $x, $hash{$x};
}
say("string sort by values default ASCII except in use of locale");
foreach my $x (sort values %hash) {
    say $x;
}
say("numeric sort by values");
foreach my $x (sort {$a <=> $b} values %hash) {
    say $x;
}
say("");

say("keys array and values array from hash");
%hash = (A => 1, C => 3, d => 10, B => 1.2);
say(Dumper(\%hash));
say(scalar keys %hash);

say("keys array");
my @keys = sort { $hash{$a} <=> $hash{$b} } keys(%hash);
say("ref(\@keys)");
say(ref(\@keys));
say(Dumper \@keys);
say(scalar @keys);

say("values array");
my @values = @hash{@keys};
say("ref(\@values)");
say(ref(\@values));
say(Dumper \@values);
say(scalar @values);
say("");

say("hash reference");
my $hash = \%hash;
say("ref(\$hash)");
say(ref(\$hash));
say(Dumper(\$hash));

say("keys array");
@keys = sort { $hash->{$a} <=> $hash->{$b} } keys(%$hash);
say("ref(\@keys)");
say(ref(\@keys));
say(Dumper \@keys);
say(scalar @keys);

say("values array");
@values = @{$hash}{@keys};
say("ref(\@values)");
say(ref(\@values));
say(Dumper \@values);
say(scalar @values);