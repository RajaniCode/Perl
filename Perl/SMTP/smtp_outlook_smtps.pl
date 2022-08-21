use feature ':5.22';
use strict;
use warnings;
use Try::Tiny;
use Email::Sender::Simple qw(sendmail);

# ppm install Email::Sender::Transport::SMTPS # Note # ppm remove Email-Sender-Transport-SMTPS
# https://www.google.com/settings/security/lesssecureapps
# Access for less secure apps
# Turn on
# https://accounts.google.com/DisplayUnlockCaptcha
# Allow
use Email::Sender::Transport::SMTPS ();
use Email::Simple ();
use Email::Simple::Creator ();

my $host = 'smtp.live.com';
my $port = 587;
my $username = '#####\@outlook.com';
my $password = '********';
my $ssl = "starttls";

my $from = "#####\@outlook.com";
my $to = "#*#*#\@outlook.com";
my $subject = "Email using Perl";
my $body = <<"END";
Email using Perl Hello World!
END

my $transport = Email::Sender::Transport::SMTPS->new({
    host => $host,
    port => $port,
    ssl => $ssl,
    username => $username,
    password => $password,
});

my $email = Email::Simple->create(
    header => [
        From => $from,
        To => $to,
        Subject => $subject,
        ],
        body => $body,
);

try {
    sendmail($email, { transport => $transport });
    say("Email sent.");
} catch {
    warn "Email failed: $_";
};