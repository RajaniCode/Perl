package CatPaste::Schema::Paste;

use DBIx::Class;

use Syntax::Highlight::Engine::Kate;
use Syntax::Highlight::Engine::Kate::All;

use base qw/DBIx::Class/;

=head1 NAME

CatPaste::Schema::Paste - Schema class for storing paste information

=head1 DESCRIPTION

The Paste schema class provides the links to the pastes as they sit on disk.

This needs to be moved to 
=cut

__PACKAGE__->load_components(qw/TimeStamp Core/);
__PACKAGE__->table('paste');

__PACKAGE__->add_columns(
    pk1   => { data_type => 'integer', size => 16, is_auto_increment => 1 },
    category_pk1 => { data_type => 'integer', size => 16 },
    author       => { data_type => 'varchar', size => 255 },
    ip_address   => { data_type => 'varchar', size => 255 },
    title        => { data_type => 'varchar', size => 255 },
    type         => { data_type => 'varchar', size => 25  },
    t_created    => { data_type => 'datetime', set_on_create => 1 }
);

__PACKAGE__->set_primary_key('pk1');

__PACKAGE__->belongs_to( 'category', 'CatPaste::Schema::Category',
    { 'foreign.pk1' => 'self.category_pk1' } );

sub contents {
    my ( $self, $c, $no_hl ) = @_;
    return undef unless $c;
    
    my $file = File::Spec
        ->catfile($c->config->{bucket}->{path}, $self->pk1 );
    open( my $fh, $file ) or die "Unable to open $file";
#return $data;
    my $hl;
    eval {
        $hl = new Syntax::Highlight::Engine::Kate(
                language => $self->type,
                substitutions => {
                    "<" => "&lt;",
                    ">" => "&gt;",
                    "&" => "&amp;",
                    " " => "&nbsp;",
                    "\t" => "&nbsp;&nbsp;&nbsp;&nbsp;",
                    "\n" => "\n",
                },
                format_table => {
                    Alert => ["<span class=\"alert\">", "</span>"],
                    BaseN => ["<font color=\"#007f00\">", "</font>"],
                    BString => ["<font color=\"#c9a7ff\">", "</font>"],
                    Char => ["<span class=\"char\">", "</span>"],
                    Comment => ["<span class=\"comment\">", "</span>"],
                    DataType => ["<span class=\"datatype\">", "</span>"],
                    DecVal => ["<span class=\"#decval\">", "</span>"],
                    Error => ["<span class=\"error\">", "</span>"],
                    Float => ["<font color=\"#00007f\">", "</font>"],
                    Function => ["<span class=\"function\">", "</span>"],
                    IString => ["<span class=\"istring\">", "</span>"],
                    Keyword => ["<span class=\"keyword\">", "</span>"],
                    Normal => ["", ""],
                    Operator => ["<span class=\"operator\">", "</span>"],
                    Others => ["<span class=\"others\">", "</span>"],
                    RegionMarker => ["<span class=\"region_marker\">", "</span>"],
                    Reserved => ["<span class=\"reservedf\">", "</span>"],
                    String => ["<span class=\"string\">", "</span>"],
                    Variable => ["<span class=\"variable\">", "</span>"],
                    Warning => ["<span class=\"warning\"", "</span>"],
                },
        );
    }; if ( $@ ) { $hl = undef; $no_hl = 1; }
    my $output = '';
    while ( my $in = <$fh> ) {
        $output .= ( $hl and not $no_hl ) ? $hl->highlightText( $in ) : $in;
    }
    close($fh);

    return $output;
}

=head1 TODO

=over

=item Add user information, such as IP address and "Who am I?" values

=item Get the categories and verification working

=back

=head1 SEE ALSO

L<CatPaste>, L<Catalyst>

=head1 AUTHOR

J. Shirley <jshirley@gmail.com>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
