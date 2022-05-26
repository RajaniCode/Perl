use feature ':5.22';
use strict;
use warnings;
use Error qw(:try);

sub func {
    try {       
        throw Exception->new("To Force Issue");
    }
    catch Error with {
        return 1; # 2
    }
    except {
        say(2);
        return 2;
    }
    otherwise {
        say(3);
        return 3;
    }
    finally {
        say(4);  # 1
        return 4;
    };
}

sub nested {
    try {
        try {          
            throw Exception->new("To Force Issue");
        }
        catch Error with  {
            return 10; # 5
        }
        except {
            say(20);
            return 20;
        }
        otherwise {
            say(30);
            return 30;
        }
        finally {
            say(40);
            return 40; # 3
        };
    }
    catch Error with  {
        say(50);
    }
    except {
        say(60);
    }
    otherwise {
        say(70);
    }
    finally {
        say(80); # 4
    };
}

say(func());

say(nested());
