use feature ':5.22';
use strict;
use warnings;
use Try::Tiny;
# ppm install Net::SMTP # Note # ppm remove Net-SMTP
use Net::SMTP;

my $host = "smtp.live.com";
my $port = 587;
my $username = "#####\@gmail.com";
my $password = "********";

my $from = '#####\@gmail.com';
my $to = '#*#*#\@gmail.com';
my $subject = "Email using Perl";
my $body = <<"END";
Email using Perl Hello World!
END

try {
    my $smtp = Net::SMTP->new($host, port=>$port);
    $smtp->auth($username, $password);
    $smtp->mail($from);
    $smtp->to($to);
    # $smtp->recipient($to);
    $smtp->data;
    $smtp->datasend("From: $from");
    $smtp->datasend("To: $to");  
    $smtp->datasend("Subject: $subject");
    $smtp->datasend("\n");
    $smtp->datasend ($body);
    $smtp->dataend;
    $smtp->quit;
    say("Email sent.");
} catch {
    warn "Email failed: $_";
};