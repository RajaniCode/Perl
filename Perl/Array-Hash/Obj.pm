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
