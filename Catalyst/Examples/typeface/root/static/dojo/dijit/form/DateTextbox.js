dojo.provide("dijit.form.DateTextbox");

dojo.require("dijit._Calendar");
dojo.require("dijit.form._DropDownTextBox");
dojo.require("dojo.date");
dojo.require("dojo.date.locale");
dojo.require("dojo.date.stamp");
dojo.require("dijit.form.ValidationTextbox");

dojo.declare(
	"dijit.form.DateTextbox",
	[dijit.form.RangeBoundTextbox, dijit.form._DropDownTextBox],
	{
		// summary:
		//		A validating, serializable, range-bound date text box.
		// constraints object: min, max
		templateString:"<fieldset class='dijit dijitInline dijitLeft dijitAutoCompleter' id=\"widget_${id}\" name=\"${name}\"\n\tdojoAttachEvent=\"onmouseover:setStateClass;onmouseout:setStateClass;\"\t\n>\n<table cellspacing=0 cellpadding=0>\n\t<tr>\n\t\t<td class='dijitReset dijitStretch dijitAutoCompleterInput'\n\t\t\t><input class='XdijitInputField' type=\"text\" autocomplete=\"off\" name=\"${name}\"\n\t\t\tdojoAttachEvent=\"onkeypress; onkeyup; onfocus; onblur; compositionend;\"\n\t\t\tdojoAttachPoint=\"textbox;focusNode\" id='${id}'\n\t\t\ttabIndex='${tabIndex}' size='${size}' maxlength='${maxlength}'\n\t></td><td class='dijitReset dijitRight dijitButtonNode dijitDownArrowButton'\n\t\t\tdojoAttachPoint=\"downArrowNode\"\n\t\t\tdojoAttachEvent=\"onclick:arrowClick;onmousedown:setStateClass;onmouseup:setStateClass;onmouseover:setStateClass;onmouseout:setStateClass;\"\n\t\t\ttabIndex=\"${tabIndex}\"\n\t\t\twaiRole=\"button\" waiState=\"haspopup-true\"\n\t\t><div class='dijitRightSpacer'><span class='dijitA11yDownArrow'>&#9660;</span></div>\n\t</td></tr>\n</table>\n</fieldset>\n",
		regExpGen: dojo.date.locale.regexp,
		compare: dojo.date.compare,
		format: dojo.date.locale.format,
		parse: dojo.date.locale.parse,
		value: new Date(),
		_popupClass:"dijit._Calendar",

		postMixInProperties: function(){
			this.constraints.selector = 'date';
			// manual import of RangeBoundTextbox properties
			dijit.form.DateTextbox.superclass.postMixInProperties.apply(this, arguments);
			// #2999
			if(typeof this.constraints.min == "string"){ this.constraints.min = dojo.date.stamp.fromRfc3339(this.constraints.min); }
 			if(typeof this.constraints.max == "string"){ this.constraints.max = dojo.date.stamp.fromRfc3339(this.constraints.max); }
		},

		serialize: function(/*Date*/date){
			return dojo.date.stamp.toRfc3339(date, 'date'); // String
		},

		setValue:function(/*Date*/date){
			// summary:
			//	Sets the date on this textbox

			if(!this._popupWidget||!this._popupWidget.onValueSelected){
				dijit.form.DateTextbox.superclass.setValue.apply(this, arguments);
			}else{
				this._popupWidget.setValue(date);
			}
		},

		postCreate:function(){
			dijit.form.DateTextbox.superclass.postCreate.apply(this, arguments);
			this._popupArgs={
				// #3000: set popupArgs here so Calendar gets the widget's lang, not the user's lang
				lang:this.lang,

				open:function(/*Widget*/ widget){
					// summary:
					//	opens the Calendar, and sets the onValueSelected for the Calendar

					this.constraints=widget.constraints;
					this.setValue(widget.getValue());
					this.onValueSelected=dojo.hitch(widget, widget._calendarOnValueSelected);
					return dijit.util.PopupManager.openAround(widget.domNode, this);
				},

				isDisabledDate:function(/*Date*/ date){
					// summary:
					// 	disables dates outside of the min/max of the DateTextbox
					return(this.constraints!=null&&(dojo.date.compare(this.constraints.min,date)>0||dojo.date.compare(this.constraints.max,date)<0));
				}
			};
			// convert the arrow image from using style.background-image to the .src property (a11y)
			dijit.util.wai.imageBgToSrc(this.arrowImage);
		},

		_calendarOnValueSelected:function(value){
			// summary: taps into the popup Calendar onValueSelected
			dijit.form.DateTextbox.superclass.setValue.apply(this, arguments);
			this._hideResultList();
		}
	}
);
