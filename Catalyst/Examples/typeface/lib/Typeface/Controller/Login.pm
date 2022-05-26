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

package Typeface::Controller::Login;

use strict;
use warnings;
use base 'Catalyst::Controller';
use Data::Dumper;


#since this will be forwarded to a method with a form
sub login_as : Local {
    my ( $self, $c ) = @_;

    my $login    = $c->req->params->{login};
    my $password = $c->req->params->{password};

	$c->log->info('logging in!');
    if ( $c->login( $login, $password ) ) {
        $c->res->redirect('/admin/index');
		return;
    }
    else {
        $c->flash->{notice} = "Wrong password or name.";
        $c->res->redirect('/login');
		return;
    }
}

sub index : Local {
    my ( $self, $c ) = @_;
	$c->stash->{template} = 'login_as.tt2';
}

sub logout : Local {
    my ( $self, $c ) = @_;

    $c->logout;
    $c->res->redirect('/');
    $c->res->body('stub');
}

sub info : Local {
    my ( $self, $c ) = @_;
	$c->stash->{template} = 'shared/info.tt2';
}

sub end : Private {
    my ( $self, $c ) = @_;
    
    return 1 if $c->req->method eq 'HEAD';
    return 1 if length( $c->response->body );
    return 1 if scalar @{ $c->error } && !$c->stash->{template};
    return 1 if $c->response->status =~ /^(?:204|3\d\d)$/;
    
    $c->forward('ADMIN');
}


1;
