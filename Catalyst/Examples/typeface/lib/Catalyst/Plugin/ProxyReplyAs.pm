package Catalyst::Plugin::ProxyReplyAs;
use strict;
 
sub uri_for {
    my $class = shift;
    if( $class->config->{proxy_reply_as} ) {
        my $u = URI->new($class->config->{proxy_reply_as});
        $class->req->base($u);
    }
    my $result = $class->NEXT::uri_for( @_ );
    return $result;
}

1;