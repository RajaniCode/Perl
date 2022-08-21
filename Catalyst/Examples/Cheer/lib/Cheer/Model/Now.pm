package Cheer::Model::Now;

use strict;
use warnings;
use base 'Catalyst::Model';
use Date::Calc qw(:all);


=head1 NAME

Cheer::Model::Now - Catalyst Model

=head1 DESCRIPTION

Catalyst Model.

=head2 days_till_xmas

Tells us how many days there are until xmas

=cut

sub days_till_xmas {
    my ($self) = @_;
    my ($year, $month, $day) = Today();
    my ($xmas_day, $xmas_month) = qw/25 12/;
    my $days_till_xmas =
        Delta_Days($year, $month, $day, $year, $xmas_month, $xmas_day);
    return $days_till_xmas;
}

=head1 AUTHOR

Kieren Diment

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
