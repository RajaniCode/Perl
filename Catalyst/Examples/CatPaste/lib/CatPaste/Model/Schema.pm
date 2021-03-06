package CatPaste::Model::Schema;

use strict;
use base 'Catalyst::Model::DBIC::Schema';

__PACKAGE__->config(
    schema_class => 'CatPaste::Schema',
    
);

=head1 NAME

CatPaste::Model::Schema - Catalyst DBIC Schema Model
=head1 SYNOPSIS

See L<CatPaste>

=head1 DESCRIPTION

L<Catalyst::Model::DBIC::Schema> Model using schema L<CatPaste::Schema>

=head1 AUTHOR

A clever guy

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
