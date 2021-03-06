package Blog::Model::DB;

use strict;
use base 'Catalyst::Model::DBIC::Schema';

__PACKAGE__->config(
    schema_class => 'Blog::Schema',
    connect_info => [
        'dbi:Pg:dbname=blog',
        'blog',
        'blog',
        { AutoCommit => 1 },
        
    ],
);

=head1 NAME

Blog::Model::DB - Catalyst DBIC Schema Model
=head1 SYNOPSIS

See L<Blog>

=head1 DESCRIPTION

L<Catalyst::Model::DBIC::Schema> Model using schema L<Blog::Schema>

=head1 AUTHOR

Alexandru Nedelcu,,,

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
