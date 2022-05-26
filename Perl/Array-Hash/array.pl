use feature ':5.22';
use strict;
use warnings;
use Data::Dumper qw(Dumper);
use Storable qw/ dclone /;

# Non Unique
my @array= ('alpha', 'beta', 'gamma' , 'delta', 'epsilon', 'beta', 'zeta', 'greek', 'gamma', 'eta', undef, 1, 'theta', 'latin');

say("ref(\@array)");
say(ref(\@array));
say("");
say(Dumper \@array);
say(scalar @array);
say("");

say("push(\@array,'iota')");
push(@array,'iota');
say(Dumper \@array);
say(scalar @array);
say("");

say("my \$value = 'greek'  # warning");
my $value = 'greek';
say("\@array = grep {\$_ ne \$value} \@array");
@array = grep {$_ ne $value} @array; # Use of uninitialized value $_ in string ne
say(Dumper \@array);
say(scalar @array);
say("");

say("\$value = 1 # warning");
$value = 1;
say("\@array = grep {\$_ ne \$value} \@array");
@array = grep {$_ ne $value} @array; # Use of uninitialized value $value in string ne at array
say(Dumper \@array);
say(scalar @array);
say("");

say("pop(\@array)");
pop(@array);
say(Dumper \@array);
say(scalar @array);
say("");

say("splice \@array, 5, 1;");
splice @array, 5, 1;
say(Dumper \@array);
say(scalar @array);
say("");

say("splice \@array, 6, 1;");
splice @array, 6, 1;
say(Dumper \@array);
say(scalar @array);
say("");

say("splice \@array, 9, 0, 'kappa'");
splice @array, 9, 0, 'kappa';
say(Dumper \@array);
say(scalar @array);
say("");

say("\$array[10] = 'lambda'"); 
$array[10] = 'lambda'; # NOT # @array[10] = 'lambda';
say(Dumper \@array);
say(scalar @array);
say("");

say("splice \@array, scalar \@array, 0, 'mu'");
splice @array, scalar @array, 0, 'mu';
say(Dumper \@array);
say(scalar @array);
say("");

say("\$value = undef # warning");
$value = undef;  
say("\@array = grep {\$_ ne \$value} \@array");
@array = grep {$_ ne $value} @array; # Use of uninitialized value $value in string ne at array
say(Dumper \@array);
say(scalar @array);
say("");

say("splice \@array, 8, 0, 'iota'");
splice @array, 8, 0, 'iota';
say(Dumper \@array);
say(scalar @array);
say("");

my @arr = ('nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega');

say("push(\@array, \@arr)");
push(@array, @arr);
say(Dumper \@array);
say(scalar @array);
say("");

say("\@a = \@array");
my @a = @array;
say("");

say("\@a == \@array");
say(@a == @array);
say("");

say("\@array == \@a");
say(@array == @a);
say("");

say("\@a eq \@array");
say(@a eq @array);
say("");

say("\@array eq \@a");
say(@array eq @a);
say("");


my $array_copy = dclone \@array;
say("my \$array_copy = dclone \@array");
say(Dumper \$array_copy);
say("");

say("ref(\$array_copy)");
say(ref($array_copy));
say("");

say("\$array_copy == \@array");
say($array_copy == @array);
say("");

say("\@array == \$array_copy ");
say(@array == $array_copy );
say("");

say("\$array_copy eq \@array");
say($array_copy eq @array);
say("");

say("\@array eq \$array_copy");
say(@array eq $array_copy);
say("");


my @array_deep = @{ dclone \@array };
say("my \@array_deep = \@{ dclone \@array }");
say(Dumper \@array_deep);
say("");

say("ref(\@array_deep)");
say(ref(\@array_deep));
say("");

say("\@array_deep == \@array");
say(@array_deep == @array);
say("");

say("\@array == \@array_deep ");
say(@array == @array_deep );
say("");

say("\@array_deep eq \@array");
say(@array_deep eq @array);
say("");

say("\@array eq \@array_deep");
say(@array eq @array_deep);
say("");
