package CatPaste::Schema::Category;

use DBIx::Class;

use base qw/DBIx::Class/;

=head1 NAME

CatPaste::Schema::Category - Categories of pastes

=head1 DESCRIPTION

A category can be any container a paste belongs into.  As an example, you could
setup categories for each IRC channel you wish to notify.

Categories support passwords, so you can protect pastes in a specific category

=head1 IMPORTANT

This schema class is not used in version 0.01.  It will be used in 0.02.

=cut

__PACKAGE__->load_components(qw/TimeStamp Core/);
__PACKAGE__->table('category');

__PACKAGE__->add_columns(
    pk1   => { data_type => 'integer', size => 16, is_auto_increment => 1 },
    label => { data_type => 'varchar', size => 255 },
    password  => { data_type => 'varchar', size => 25, is_nullable => 1 },
);

__PACKAGE__->set_primary_key('pk1');

__PACKAGE__->has_many( 'pastes', 'CatPaste::Schema::Paste', 'category_pk1' );

=head1 SEE ALSO

L<CatPaste>, L<CatPaste::Schema::Paste>, L<Catalyst>

=head1 AUTHOR

J. Shirley <jshirley@gmail.com>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
