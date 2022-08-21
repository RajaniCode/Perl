use feature ':5.22';
use strict;
use warnings;
use Try::Tiny;

sub func {
    try {       
        throw Exception->new("To Force Issue");
    }
    catch {
        return 1;
    }
}

sub nested {
    try {
        try {          
            throw Exception->new("To Force Issue");
        }
        catch {
            return 10;
        }
    }
    catch {
        say(20);
    }
}

say(func());

say(nested());
