use feature ':5.22';
use strict;
use warnings;
use Try::Tiny;

# ppm install Email::Stuffer # Note # ppm remove Email-Stuffer
use Email::Stuffer;
use Email::Sender::Transport::SMTP ();
 
my $host = "smtp.live.com";
my $port = 587;
my $username = "#####\@outlook.com";
my $password = "********";

my $from = "##### <#####\@outlook.com>";
my $to = "##### <#*#*#\@outlook.com>";
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
