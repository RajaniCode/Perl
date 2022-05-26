package Quiz::Model::Ctca;

use strict;
use base 'Catalyst::Model::DBIC::Schema';

__PACKAGE__->config(
    schema_class => 'Ctca',
    connect_info => [
        'dbi:SQLite:ctca.db',
        
    ],
);

=head1 NAME

Quiz::Model::Quiz - Catalyst DBIC Schema Model
=head1 SYNOPSIS

See L<Quiz>

=head1 DESCRIPTION

L<Catalyst::Model::DBIC::Schema> Model using schema L<QuizMaster>

=head1 AUTHOR

Antano Solar 

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
