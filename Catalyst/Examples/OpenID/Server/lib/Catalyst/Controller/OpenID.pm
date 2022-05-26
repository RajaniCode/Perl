package Catalyst::Controller::OpenID;

use warnings;
use strict;

use Catalyst::Plugin::SubRequest;

use base 'Catalyst::Controller';

our $VERSION = '0.01';

__PACKAGE__->mk_accessors(qw/_server_action/);

sub create_action {
    my $self   = shift;
    my $action = $self->NEXT::create_action(@_);
    if ( my $register = $action->can('openid_register') ) {
        $register->( $action, $self );
    }
    return $action;
}

sub get_user {
    my ( $self, $c ) = @_;
    return $c->user if $c->user_exists;
    return;
}

sub is_identity {
    my ( $self, $c, $user, $identity ) = @_;
    return 0 unless $user;

    my $base = $c->req->base;
    ( my $identity_action = $identity ) =~ s/^$base//;

    my $body = $c->Catalyst::Plugin::SubRequest::subreq( "/$identity_action",
        { is_subreq => 1 } );
    return $c->stash->{is_identity} = 1 if $body eq 'is_identity';
    return;
}

sub is_trusted {
    my ( $self, $c, $user, $trust_root, $is_identity ) = @_;

    return unless $user;
    return unless $is_identity;

    # Server action should have this set up by the time we get here
    return $c->stash->{trust_consumer};
}

1;    # Magic true value required at end of module
__END__

=head1 NAME

Catalyst::Controller::OpenID - Controller for OpenID authentication


=head1 VERSION

This document describes Catalyst::Controller::OpenID version 0.0.1


=head1 SYNOPSIS

    use Catalyst::Controller::OpenID;

=for author to fill in:
    Brief code example(s) here showing commonest usage(s).
    This section will be as far as many users bother reading
    so make it as educational and exeplary as possible.
  
  
=head1 DESCRIPTION

=for author to fill in:
    Write a full description of the module and its features here.
    Use subsections (=head2, =head3) as appropriate.


=head1 INTERFACE 

=for author to fill in:
    Write a separate section listing the public components of the modules
    interface. These normally consist of either subroutines that may be
    exported, or methods that may be called on objects belonging to the
    classes provided by the module.


=head1 DIAGNOSTICS

=for author to fill in:
    List every single error and warning message that the module can
    generate (even the ones that will "never happen"), with a full
    explanation of each problem, one or more likely causes, and any
    suggested remedies.

=over

=item C<< Error message here, perhaps with %s placeholders >>

[Description of error here]

=item C<< Another error message here >>

[Description of error here]

[Et cetera, et cetera]

=back


=head1 CONFIGURATION AND ENVIRONMENT

=for author to fill in:
    A full explanation of any configuration system(s) used by the
    module, including the names and locations of any configuration
    files, and the meaning of any environment variables or properties
    that can be set. These descriptions must also include details of any
    configuration language used.
  
Catalyst::Controller::OpenID requires no configuration files or environment variables.


=head1 DEPENDENCIES

=for author to fill in:
    A list of all the other modules that this module relies upon,
    including any restrictions on versions, and an indication whether
    the module is part of the standard Perl distribution, part of the
    module's distribution, or must be installed separately. ]

None.


=head1 INCOMPATIBILITIES

=for author to fill in:
    A list of any modules that this module cannot be used in conjunction
    with. This may be due to name conflicts in the interface, or
    competition for system or program resources, or due to internal
    limitations of Perl (for example, many modules that use source code
    filters are mutually incompatible).

None reported.


=head1 BUGS AND LIMITATIONS

=for author to fill in:
    A list of known problems with the module, together with some
    indication Whether they are likely to be fixed in an upcoming
    release. Also a list of restrictions on the features the module
    does provide: data types that cannot be handled, performance issues
    and the circumstances in which they may arise, practical
    limitations on the size of data sets, special cases that are not
    (yet) handled, etc.

No bugs have been reported.

Please report any bugs or feature requests to
C<bug-<RT NAME>@rt.cpan.org>, or through the web interface at
L<http://rt.cpan.org>.


=head1 AUTHOR

Eden Cardoso Cardim  C<< <edencardim@gmail.com> >>


=head1 LICENSE

This library is copyright (C) 2007, PictureTrail.com

=cut
