package Catalyst::Controller::FormBuilder::DBIC;

use strict;
use base qw/Catalyst::Controller::FormBuilder/;

sub create_form {
    my ( $self, $args ) = @_;
	
	$self->{_db_rset}=$args->{object};
	$self->{_db}=$self->{_db_rset}->result_source;
	$self->{_table}=$self->{_db_rset}->result_source->from;
	$self->{_table_info}=$self->{_db}->storage->columns_info_for($self->{_table});
	$self->{_columns}=$args->{columns};
	$self->{_action}=$args->{action};
	$self->{_size}=20;
	
	$self->_process_table_columns() if !defined $self->{_columns};
	$self->_process_field_lengths();
	$self->_process_form();
}


sub _process_field_lengths {
	my ($self)=@_;
	
	while (my ($key,$col) = each(%{$self->{_table_info}}) ) {
		if ($col->{data_type} eq "character varying") {
			if(length($self->{_db_rset}->$key)>$self->{_size}) {
				$self->{_size} = length($self->{_db_rset}->$key)+5;
			}
		}
	}
}

sub accept_form {
	my ($self,$args)=@_;

	if (defined $args->{id}) {
		# edit existing record
	}
	else {
		# must be a new record if no ID
		$self->{_db_rset}=$self->model("$args->{class}")->new({});
		$self->{_db}=$self->{_target}->result_source;
		$self->{_table}=$self->{_db_rset}->result_source->from;
		$self->{_table_info}=$self->{_db}->storage->columns_info_for($self->{_table});
	}

	$self->_process_table_columns();
	
	
	for my $col ( @{$self->{_columns}} ) {
		$self->{_db_rset}->$col($self->req->params->{$col});
	}
	
	return $self->{_db_rset};
} 

sub _process_form {
	my ($self)=@_;
	
	for my $col ( @{$self->{_columns}} ) {
		# default settings
        my $type     = "text";
		my $disabled = undef;
        my @options  = undef;
        my $required = 0;
		my $value	 = "";
		
		next if $col eq "created_at";
        next if $col eq "id";

        $type = "password" if ( $col =~ /^password$|^passwd$|^pass$/i );

        $required = 1 unless $self->{_table_info}->{$col}->{is_nullable};

		eval { $value=$self->{_db_rset}->$col; };
		
		if($@) {
		    # table not found
		    next;
		}

        if ( $self->{_table_info}->{$col}->{data_type} eq "smallint" ) {
            $type    = "radio";
            @options = [qw/Yes No/];
        }

        $type = "textarea" if ( $self->{_table_info}->{$col}->{data_type} eq "text" );

		# handle types fix up DateTime inflated objects
		$value = $value->mdy('/') if ref($value) eq 'DateTime';
				
        $self->formbuilder->field(
            name     => $col,
            label    => $self->_process_name($col),
            type     => $type,
            rows     => 10,
            cols     => 50,
			disabled => $disabled,
            required => $required,
            options  => @options,
			value	 => $value,
			size	 => $self->{_size},
        );

    }

	$self->formbuilder->method('POST');
	$self->formbuilder->action($self->{_action}) if defined $self->{_action};
	$self->formbuilder->submit('Commit ' . $self->_process_name($self->{_table}));
}

sub _process_name {
    my ( $self, $name ) = @_;
    my $label = ucfirst( lc($name) );
    $label =~ s/_/ /g;

	$label =~ s/^fname$/First Name/ig;
	$label =~ s/^lname$/Last Name/ig;
	$label =~ s/^mname$/Middle Name/ig;
	$label =~ s/dlicense/Drivers License/ig;
	$label =~ s/^dob$/Date of Birth/ig;

    return $label;
}

sub _process_table_columns {
    my ( $self ) = @_;

    my $dbh = $self->{_db}->schema->storage->dbh;

    my $table;
    if ( $self->{_db}->{db_schema} ) {
        $table = $self->{_db}->{db_schema} . $self->{_db}->{_namesep} . $table;
    }

    my $sth = $dbh->prepare("SELECT * FROM $self->{_table} WHERE 1=0");
    $sth->execute;
    $self->{_columns} = \@{ $sth->{NAME_lc} };
}

1;
