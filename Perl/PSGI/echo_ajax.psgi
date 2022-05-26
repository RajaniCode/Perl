#!/usr/bin/perl
use strict;
use warnings;
 
use Plack::Request;
use JSON qw(to_json);
 
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
    my $data;
    if ($request->param('field')) {
        $data = { txt => 'You said: ' . $request->param('field') };
    } else {
        $data = { txt => 'You did not say anything.' };
    }
    return [
        '200',
        [ 'Content-Type' => 'application/json' ],
        [ to_json $data ],
    ];
}
 
 
sub get_html {
    return q{
      <input id="field">
      <button id="echo">Echo</button>
      <hr>
      <div id="response"></div>
 
      <script>
      function show_response(resp) {
          document.getElementById('response').innerHTML = resp['txt'];
      }
 
      function send_text() {
         ajax_get_json('/echo?field=' + document.getElementById('field').value, show_response);
      }
 
      function ajax_get_json(url, on_success) {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  console.log('responseText:' + xmlhttp.responseText);
                  on_success(JSON.parse(xmlhttp.responseText));
              }
          }
          xmlhttp.open("GET", url, true);
          xmlhttp.send();
      }
 
      document.getElementById('echo').addEventListener('click', send_text);
      </script>
 
    }
}