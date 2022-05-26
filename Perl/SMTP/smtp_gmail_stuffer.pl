use feature ':5.22';
use strict;
use warnings;
use Try::Tiny;

# ppm install Email::Stuffer # Note # ppm remove Email-Stuffer
use Email::Stuffer;
use Email::Sender::Transport::SMTP ();
 
my $host = "smtp.gmail.com";
my $port = 587;
my $username   = "#####";
my $password = "A\$1#%Zeta";

my $from = "##### <#####\@gmail.com>";
my $to = "##### <#*#*#\@gmail.com>";
my $subject = "Email using Perl";
my $text = <<"END";
Email using Perl Hello World!
END

try {
Email::Stuffer
    ->text_body($text)
    ->subject($subject)
    ->from($from)
    ->transport(Email::Sender::Transport::SMTP->new({host => $host, port => $port, username => $username, password => $password}))
    ->to($to)
    ->send;
    say("Email sent.");
} catch {
    warn "Email failed: $_";
};

