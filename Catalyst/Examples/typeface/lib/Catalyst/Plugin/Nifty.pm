# Copyright (C) 2006  name of Victor Igumnov
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


package Catalyst::Plugin::Nifty;
use DateTime;
use strict;
use Text::Highlight;
# use Syntax::Highlight::Engine::Kate;


sub render_nifty_date {
    my $self = shift;
    my $date = shift;
    
    return "<span class=\"nifty_date\" title=\""
      . $self->datetime_to_nifty_time($date)
      . "\"></span>";
}

sub set_nifty_params {
    my $self = shift;
    if (@_) { $self->{nifty_args} = shift; }
    else {
        return $self->{nifty_args};
    }
}

sub render_nifty_headers {
    my $self = shift;
	return $self->render_nifty_edges_and_dates;
}

sub nifty_txt_to_url {
    my $self = shift;

    my ( $txt, $id ) = @_;

    $txt =~ s/(\'|\!|\`|\?)//g;
    $txt =~ s/ /\_/g;

    return $txt;
}

sub nifty_url_to_query {
    my $self = shift;

    my ($txt) = shift;

    $txt =~ s/\_/ /g;
    $txt =~ s/s /\%/g;
    return ( "%" . $txt . "%" );
}

sub datetime_to_nifty_time {
    my $self = shift;

    my ($d) = shift;
    # $d =~ /(.*)-(.*)-(.*) (.*):(.*):(.*)/;
    # my $dt = DateTime->new(
    #     year   => $1,
    #     month  => $2,
    #     day    => $3,
    #     hour   => $4,
    #     minute => $5,
    #     second => $6
    # );
    my $ext =
        $d->day_abbr() . ", "
      . $d->day() . " "
      . $d->month_abbr() . " "
      . $d->year() . " "
      . $d->hour . ":"
      . $d->minute . ":"
      . $d->second();
    return $ext;
}

#use Scalar::Util qw( weaken );
sub nifty_highlight_code {
	my $self = shift;
	my $html = shift;

	$html =~ s/\[code syntax\=[\'|\"](.*?)[\'|\"]\](.*?)\[\/code\]/$self->process_code($1,$2)/egs;
	return $html;
}


sub process_code {
	my ($self,$lang,$code)=@_;
	
    # $lang =~ s/CPP/C/g;
	
            #     my $hl = new Syntax::Highlight::Engine::Kate(
            #        language => $lang,
            #        substitutions => {
            #           "<" => "&lt;",
            #           ">" => "&gt;",
            #           "&" => "&amp;",
            #           " " => "&nbsp;",
            #           "\t" => "&nbsp;&nbsp;&nbsp;",
            #           "\n" => "<br/>",
            #        },
            #        format_table => { Alert => ['<span class="Alert">', '</span>'],
            #  BaseN => ['<span class="BaseN">', '</span>'],
            #  BString => ['<span class="BString">', '</span>'],
            #  Char => ['<span class="Char">', '</span>'],
            #  Comment => ['<span class="Comment">', '</span>'],
            #  DataType => ['<span class="DataType">', '</span>'],
            #  DecVal => ['<span class="DecVal">', '</span>'],
            #  Error => ['<span class="Error">', '</span>'],
            #  Float => ['<span class="Float">', '</span>'],
            #  Function => ['<span class="Function">', '</span>'],
            #  IString => ['<span class="IString">', '</span>'],
            #  Keyword => ['<span class="Keyword">', '</span>'],
            #  Normal => ['<span class="Normal">', '</span>'],
            #  Operator => ['<span class="Operator">', '</span>'],
            #  Others => ['<span class="Others">', '</span>'],
            #  RegionMarker => ['<span class="RegionMarker">', '</span>'],
            #  Reserved => ['<span class="Reserved">', '</span>'],
            #  String => ['<span class="String">', '</span>'],
            #  Variable => ['<span class="Variable">', '</span>'],
            #  Warning => ['<span class="Warning">', '</span>'],
            #  
            # },
            #     );
	
    my $high = new Text::Highlight(wrapper=>"<div class='code'>%s</div>\n");
    my $final=$high->highlight($lang,$code);
    $final =~ s/  /&nbsp;&nbsp;/g;
    $final =~ s/\n/<br\/>/g;
    # my $final = '<div class="code">' . $hl->highlightText($code) . '</div>';
    
    return $final;
}

sub render_nifty_edges_and_dates {
    my $self = shift;

    my ($tags) = $self->{nifty_args};
    my $nifty_tags = "<script type=\"text/javascript\">\n";
    $nifty_tags = $nifty_tags . "window.onload=function(){ \n";
    $nifty_tags = $nifty_tags . "show_dates_as_local_time(); \n";
    for my $tag ( @{$tags} ) {
        $nifty_tags = $nifty_tags . "Nifty(";
        for my $element ( @{$tag} ) {
            $nifty_tags = $nifty_tags . "'$element',";
        }
        chop($nifty_tags);
        $nifty_tags = $nifty_tags . ");\n";
    }

    $nifty_tags = $nifty_tags . "} \n </script> \n";

    return $nifty_tags;
}

sub push_into_nifty_params {
    my $self = shift;
    my ( $current_list, $tags_to_add ) = @_;
    push @$current_list, $tags_to_add;
    return $current_list;
}

1;
