package OpenID::Controller::Server;

use strict;
use warnings;

use base 'Catalyst::Controller::OpenID';

sub identity : Local ActionClass('OpenID::Identity') {
}

sub server : Local ActionClass('OpenID::Server') {
    my ( $self, $c ) = @_;

    my $params = $c->req->params;

    # set up trust for consumer url
    if ( exists $params->{trust_consumer} ) {
        $c->stash->{trust_consumer} = ( $params->{trust_consumer} eq 'yes' );
    }

    # check for cancel
    return
        if $c->stash->{cancel} = $params->{cancel}
        || $params->{trust_consumer} eq 'no';

    # login
    if (    !$c->user_exists
        and my $user     = $params->{user}
        and my $password = $params->{password} )
    {
        $c->login( $user, $password );
    }
}

1;
