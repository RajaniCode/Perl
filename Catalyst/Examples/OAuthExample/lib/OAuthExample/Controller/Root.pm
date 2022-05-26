package OAuthExample::Controller::Root;

use strict;
use warnings;
use parent 'Catalyst::Controller';

use Net::OAuth;
use LWP::UserAgent;
use HTTP::Request::Common;
use XML::LibXML;
use XML::LibXML::XPathContext;
use File::Spec;
use List::Util 'shuffle';

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config->{namespace} = '';

=head1 NAME

OAuthExample::Controller::Root - Root Controller for OAuthExample

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=cut

=head2 index

=cut



sub default : Path {
    my ( $self, $c ) = @_;
            if (defined $c->session->{token}) {
                    my $request = Net::OAuth->request("protected resource")->new(
                        $c->_default_request_params,
                        request_url => $c->config->{contacts_feed_url},
                        token => $c->session->{token},
                        token_secret => '',
                    );

                    $request->sign($c->_get_key);

                    my $ua = LWP::UserAgent->new;

                    my $res = $ua->request(GET($request->request_url, 
                        Authorization => $request->to_authorization_header));

                    if (!$res->is_success) {
                        die 'Could not get feed: ' . $res->status_line . ' ' . 
                        $res->content;
                    }

                    my $parser = new XML::LibXML;
                    my $doc = $parser->parse_string($res->content);
                    my $xpc = XML::LibXML::XPathContext->new;
                    $xpc->registerNs('atom', 'http://www.w3.org/2005/Atom');
                    $c->stash->{contacts} = [ shuffle($xpc->findnodes('//atom:entry/atom:title', $doc))];

            }    
}

sub login : Global {
        my ( $self, $c ) = @_;

        my $request = Net::OAuth->request("request token")->new(
            $c->_default_request_params,
            request_url => $c->config->{request_token_endpoint},
            extra_params => {
                scope=> $c->config->{request_scope},
            }
        );


        $request->sign($c->_get_key);

        my  $ua = LWP::UserAgent->new;

        my $res = $ua->request(GET $request->to_url); 
        # Post message to the Service Provider

        if (!$res->is_success) {
            die 'Could not get a Request Token: ' . $res->status_line . ' ' . $res->content;
        }

        my $response = Net::OAuth->response('request token')->from_post_body($res->content);
    

        $request = Net::OAuth->request('user auth')->new(
            token => $response->token,
            callback => $c->uri_for('/callback'),
        );

        return $c->res->redirect($request->to_url($c->config->{user_auth_endpoint}));
}



sub callback : Global {
        my ( $self, $c ) = @_;
        my $response = Net::OAuth->response('user auth')->from_hash($c->req->params);

        my $request = Net::OAuth->request("access token")->new(
            $c->_default_request_params,
            request_url => $c->config->{access_token_endpoint},
            token => $response->token,
            token_secret => '',
        );

        $request->sign($c->_get_key);

        my $ua = LWP::UserAgent->new;

        my $res = $ua->request(GET $request->to_url); 
        # Post message to the Service Provider

        if (!$res->is_success) {
            die 'Could not get an Access Token: ' . $res->status_line . ' ' . $res->content;
        }

        $response = Net::OAuth->response('access token')->from_post_body($res->content);
        $c->session->{token}= $response->token;
        $c->res->redirect($c->uri_for('/'));
}

sub logout : Global {
    my ( $self, $c ) = @_;
    undef $c->session->{token};
    $c->res->redirect($c->uri_for('/'));
}

=head2 end

Attempt to render a view, if needed.

=cut 

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

Marcus Ramberg

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
