package Typeface::Controller::Ajax;

use strict;
use warnings;
use base 'Catalyst::Controller';

=head1 NAME

Typeface::Controller::Ajax - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut

=head2 index 

=cut

sub check_articles : Local {
    my ( $self, $c ) = @_;

    my @articles = $c->model('Typeface::Articles')->search(
        {
            -or => {
                subject => { 'ilike' => '%' . $c->req->params->{field} . '%' },
                body    => { 'ilike' => '%' . $c->req->params->{field} . '%' }
            }
        }
    )->all();

    my @out = ();
    push @out, '<div align="center">';
    foreach my $article (@articles) {
        push @out,
          '<a href="/view/'
          . $c->nifty_txt_to_url( $article->subject() ) . '">'
          . $article->subject()
          . '</a><br/>';
    }
    push @out, '</div>';

    $c->res->body( join( ' ', @out ) );
}

sub sort_by : Local {
    my ( $self, $c ) = @_;

	my @cats;
    my @out = ();
	if($c->req->params->{field} =~ /alpha/) {
    @cats =
      $c->model('Typeface::Categories')->search( undef, { order_by => 'name' } )
      ->all();
	}
	else {
	    @cats =
	      $c->model('Typeface::Categories')->search( undef, { order_by => 'id' } )
	      ->all();		
	}

    push @out, '<ul>';
    foreach my $cat (@cats) {
        push @out,
          "<li><a title='"
          . $cat->name()
          . "' href='/category/"
          . $c->nifty_txt_to_url( $cat->name() ) . "'>"
          . $cat->name()
          . "</a></li>";
    }
    push @out, '</ul>';

    $c->res->body( join( '', @out ) );
}

sub help_complete_combobox : Local {
    my ( $self, $c, $class_name, $field_name ) = @_;

    my @class_instances =
      $c->model( 'Typeface::' . $class_name )
      ->search(
        { $field_name => { 'ilike' => $c->req->params->{field} . '%' } } )
      ->all();

    my @out;
    foreach my $item (@class_instances) {
        push @out, [ '' . $item->$field_name . '' ];
    }
    $c->stash->{result} = [@out];
    $c->forward('JSON');
}

=head1 AUTHOR

Victor Igumnov

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
