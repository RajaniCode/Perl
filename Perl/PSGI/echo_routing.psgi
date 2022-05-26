#!/usr/bin/perl
use strict;
use warnings;
 
use Plack::Request;
 
my %ROUTING = (
    '/'      => \&serve_root,
    '/echo'  => \&serve_echo,
);
 
 
my $app = sub {
    my $env = shift;
 
    my $request = Plack::Request->new($env);
    my $route = $ROUTING{$request->path_info};
    if ($route) {
        return $route->($env);
    }
    return [
        '404',
        [ 'Content-Type' => 'text/html' ],
        [ '404 Not Found' ],
    ];
};
 
sub serve_root {
    my $html = get_html();
    return [
        '200',
        [ 'Content-Type' => 'text/html' ],
        [ $html ],
    ];
} 
 
sub serve_echo {
    my $env = shift;
 
    my $request = Plack::Request->new($env);
    my $html;
    if ($request->param('field')) {
        $html = 'You said: ' . $request->param('field');
    } else {
        $html = 'You did not say anything.';
    }
    return [
        '200',
        [ 'Content-Type' => 'text/html' ],
        [ $html ],
    ];
}
 
sub get_html {
    return q{
      <form action="/echo">
 
      <input name="field">
      <input type="submit" value="Echo">
      </form>
      <hr>
    }
}