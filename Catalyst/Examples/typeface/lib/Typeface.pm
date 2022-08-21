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

package Typeface;

use strict;
use warnings;
use Cwd;

use Catalyst::Runtime '5.70';

use Catalyst qw/
Static::Simple

ConfigLoader
Nifty
Captcha

Cache::FileCache
PageCache

Session 
Session::Store::File 
Session::State::Cookie 

Server
Server::XMLRPC
ProxyReplyAs

Authentication 
Authentication::Store::DBIC 
Authentication::Credential::Password

/;

use Switch;
use DateTime;

__PACKAGE__->config->{static}->{ignore_extensions} = [qw/tt2 tt/];

our $VERSION = '0.71';

# Start the application
__PACKAGE__->setup;

1;
