package Fu::Model::DB;

use strict;
use base 'Catalyst::Model::DBIC::Schema';

__PACKAGE__->config(
    schema_class => 'Fu::Schema',
    connect_info => [
        'dbi:SQLite:dbname=t/var/fu.db',
        
    ],
);

=head1 NAME

Fu::Model::DB - Catalyst DBIC Schema Model
=head1 SYNOPSIS

See L<Fu>

=head1 DESCRIPTION

L<Catalyst::Model::DBIC::Schema> Model using schema L<Fu::Schema>

=head1 AUTHOR

Bogdan Lucaciu,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
