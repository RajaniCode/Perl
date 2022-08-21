package MyAdvApp::Controller::Root;

use strict;
use warnings;
use base 'Catalyst::Controller';

use Data::Dumper ();

__PACKAGE__->config->{namespace} = '';

sub default : Private {
    my ( $self, $c ) = @_;

    $c->response->status(404);
    $c->response->body( 'Not found' );
}

sub app_root : Chained PathPart('') Args(0) {
    my ($self, $c) = @_;
    $c->stash(message => 'Welcome to the root action!');
}

sub language : Chained PathPart('') CaptureArgs(1) {
    my ($self, $c, $language) = @_;
    $c->stash(language => $language);
}

sub end : Private {
    my ($self, $c) = @_;

    my $language = $c->stash->{language} || 'en';
    my $item_id  = $c->stash->{loaded_item_id} || 23;

    my $output;
    $output .= '<html><body>';
    $output .= '<pre>' . Data::Dumper::Dumper($c->stash) . '</pre>';
    $output .= '<br>' x 3;

    $output .= make_link( $c->uri_for(
      $c->controller('Foo')->action_for('list'), [$language] ));
    $output .= make_link( $c->uri_for(
      $c->controller('Foo')->action_for('edit_foo'), [$language, $item_id] ));
    $output .= make_link( $c->uri_for(
      $c->controller('Foo')->action_for('show_foo'), [$language, $item_id] ));

    $output .= make_link( $c->uri_for(
      $c->controller('Bar')->action_for('list'), [$language] ));
    $output .= make_link( $c->uri_for(
      $c->controller('Bar')->action_for('something'), [$language, $item_id] ));

    $output .= '</body></html>';

    $c->response->body($output);
}

sub make_link {
    my ($uri) = @_;
    return qq{<a href="$uri">$uri</a><br>};
}

1;
