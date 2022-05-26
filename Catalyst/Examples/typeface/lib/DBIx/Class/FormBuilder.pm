package DBIx::Class::FormBuilder;

use strict;
use warnings;
use base 'DBIx::Class';
use CGI::FormBuilder;
use Data::Dumper;

sub new {
    my ($class, $attrs, @rest) = @_;
    my $ret = $class->next::method($attrs, @rest);
    
    #setup formbuilder + form
    $ret->{formbuilder} = CGI::FormBuilder->new();
    $ret->form();
    
    return $ret;
}

sub form {
    my ($self,@rest) = @_;
    return $self->{formbuilder};
}

sub insert {
    my ($self,@rest) = @_;
    
    foreach my $name ( $self->result_source->columns ) {
        $self->{formbuilder}->field(name=>$name , value => $self->get_column($name)) 
            if defined $self->get_column($name);
    }
    if($self->{formbuilder}->validate) {
        #$self->next::method(@_);
    } else {
        print $self->{formbuilder}->render;
    }
}

sub update {
    my ($self,@rest) = @_;
}

1;