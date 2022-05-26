package LOLCGI::Controller::Paste;

use Moose;
use parent 'Catalyst::Controller::WrapCGI';

use CGI qw/:html3/;

has 'cgi' => (is =>'rw', isa =>'CGI', default => sub { CGI->new });
=head1 NAME

LOLCGI::Controller::Paste - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index 

=cut

sub index :Path('/cgi-bin/paste.cgi')  {
    my ( $self, $c ) = @_;
    my $q = $self->cgi;
    $self->cgi_to_response( $c, sub {  
        
        print $q->header, $q->start_html('Clean your code!'),
              $q->h1('Paste your code here'),
              $q->start_form(
                 -name   => 'paste',
                 -action => $c->uri_for('/cgi-bin/bleachit.cgi'),              
              ),
              $q->textarea (
                -name => 'code',
                -rows => '10',
                -cols => '80'
              ),
              $q->br,
              $q->submit(
                -name    => 'translate',
                -value   => 'Paste it!',
              ),
              $q->end_form,
              $q->end_html;
    });

}

sub paste : Path("/cgi-bin/bleachit.cgi") {
    my ($self, $c) = @_;
    my $q = $self->cgi;

    $self->cgi_to_response( $c, sub {  
        
        my $code = $q->param('code');
        my $cleaned_string = eval "use Acme::Bleach; $code" . "";
        $c->log->debug("Code: $code");
        $c->log->debug("Clean code: $cleaned_string");
 
        print $q->header, $q->start_html('Cleaned code'),
        $q->h1("Your code, cleaned:"),
        $q->pre($cleaned_string),
        $q->end_html;
    });

}

=head1 AUTHOR

Devin,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
