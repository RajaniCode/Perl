dojo.provide("dijit.form.InlineEditBox");

dojo.require("dijit.base.FormElement");
dojo.require("dijit.base.Container");
dojo.require("dijit.base.TemplatedWidget");
dojo.require("dojo.i18n");
dojo.require("dijit.form.Button");

dojo.requireLocalization("dijit", "common");

dojo.declare(
	"dijit.form.InlineEditBox",
	[dijit.base.FormElement, dijit.base.Container, dijit.base.TemplatedWidget],
	// summary
	//		Wrapper widget to a text edit widget.
	//		The text is displayed on the page using normal user-styling.
	//		When clicked, the text is hidden, and the edit widget is
	//		visible, allowing the text to be updated.  Additionally,
	//		Save and Cancel button are displayed below the edit widget.
	//		When Save is clicked, the text is pulled from the edit
	//		widget and redisplayed and the edit widget is again hidden.
	//		Currently all textboxes that inherit from dijit.form.Textbox
	//		are supported edit widgets.
	//		An edit widget must support the following API to be used:
	//		String getTextValue() OR String getValue()
	//		void setTextValue(String) OR void setValue(String)
	//		void focus()
	//		It must also be able to initialize with style="display:none;" set.
{
	templateString:"<span>\n\t<span class='dijitInlineValue' tabIndex=\"0\" dojoAttachPoint=\"editable;focusNode\" style=\"\" \n\t\tdojoAttachEvent=\"onkeypress:_onKeyPress;onclick:_onClick;onmouseout:_onMouseOut;onmouseover:_onMouseOver;onfocus:_onMouseOver;onblur:_onMouseOut;\"></span>\n\t<fieldset style=\"display:none;\" dojoAttachPoint=\"editNode\" class=\"dijitInlineEditor\">\n\t\t<div dojoAttachPoint=\"containerNode\" dojoAttachEvent=\"onkeyup:checkForValueChange;\"></div>\n\t\t<button class='saveButton' dojoAttachPoint=\"saveButton\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:save\">${buttonSave}</button>\n\t\t<button class='cancelButton' dojoAttachPoint=\"cancelButton\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:cancel\">${buttonCancel}</button>\n\t</fieldset>\n</span>\n",

	// editing: Boolean
	//		Is the node currently in edit mode?
	editing: false,

	// buttonSave: String
	//              Save button label
	buttonSave: "",

	// buttonCancel: String
	//              Cancel button label
	buttonCancel: "",

	widgetsInTemplate: true,

	postCreate: function(){
		var _this = this;
		dojo.addOnLoad(function(){
			// look for the input widget as a child of the containerNode
			if(_this.editWidget){
				_this.containerNode.appendChild(_this.editWidget.domNode);
			}else{
				var node = _this.containerNode.firstChild;
				while(node != null){
					_this.editWidget = dijit.util.manager.byNode(node);
					if(_this.editWidget){
						break;
					}

					node = node.nextSibling;
				}
			}
			_this._setEditValue = dojo.hitch(_this.editWidget,_this.editWidget.setDisplayedValue||_this.editWidget.setValue);
			_this._getEditValue = dojo.hitch(_this.editWidget,_this.editWidget.getDisplayedValue||_this.editWidget.getValue);
			_this._setEditFocus = dojo.hitch(_this.editWidget,_this.editWidget.focus);
			_this.editWidget.onValueChanged = dojo.hitch(_this,"checkForValueChange");
			_this.checkForValueChange();
			_this._showText();
		});
	},

	postMixInProperties: function(){
		dijit.form.InlineEditBox.superclass.postMixInProperties.apply(this, arguments);
		this.messages = dojo.i18n.getLocalization("dijit", "common", this.lang);
		dojo.forEach(["buttonSave", "buttonCancel"], function(prop){
			if(!this[prop]){ this[prop] = this.messages[prop]; }
		}, this);
	},

	_onKeyPress: function(e){
		if(this.disabled || e.altKey || e.ctrlKey){ return; }
		if(e.charCode == dojo.keys.SPACE || e.keyCode == dojo.keys.ENTER){
			dojo.stopEvent(e);
			this._onClick(e);
		}
	},

	_onMouseOver: function(){
		if(!this.editing){
			var classname = this.disabled ? "dijitDisabledClickableRegion" : "dijitClickableRegion";
			dojo.addClass(this.editable, classname);
		}
	},

	_onMouseOut: function(){
		if(!this.editing){
			var classStr = this.disabled ? "dijitDisabledClickableRegion" : "dijitClickableRegion";
			dojo.removeClass(this.editable, classStr);
		}
	},

	onClick: function(/*Event*/ e){
		// summary: callback for when button is clicked; user can override this function
	},

	_onClick: function(e){
		// summary
		// 		When user clicks the text, then start editing.
		// 		Hide the text and display the form instead.

		if(this.editing || this.disabled){ return; }
		this._onMouseOut();
		this.editing = true;

		// show the edit form and hide the read only version of the text
		this._setEditValue(this._isEmpty ? '' : this.editable.innerHTML);
		this._initialText = this._getEditValue();
		this._visualize();

		this._setEditFocus();
		this.saveButton.disable();
		// moved to postCreate to always listen
		//this.editWidget.onValueChanged = dojo.hitch(this,"checkForValueChange");
		this.onClick();
	},

	_visualize: function(e){
		dojo.style(this.editNode, "display", this.editing ? "" : "none");
		dojo.style(this.editable, "display", this.editing ? "none" : "");
	},

	_showText: function(){
		var value = this._getEditValue();
		dijit.form.InlineEditBox.superclass.setValue.call(this, value);
		// whitespace is really hard to click so show a ?
		if(/^\s*$/.test(value)){ value = "?"; this._isEmpty = true; }
		else { this._isEmpty = false; }
		this.editable.innerHTML = value;
		this._visualize();
	},

	save: function(e){
		// summary: Callback when user presses "Save" button
		if(e){ dojo.stopEvent(e); }
		this.editing = false;
		this._showText();
	},

	cancel: function(e){
		// summary: Callback when user presses "Cancel" button
		if(e){ dojo.stopEvent(e); }
		this.editing = false;
		this._visualize();
	},

	setValue: function(/*String*/ value){
		// sets the text without informing the server
		this._setEditValue(value);
		this.editing = false;
		this._showText();
	},

	checkForValueChange: function(){
		// summary
		//		Callback when user changes input value.
		//		Enable save button if the text value is different than the original value.
		if(this.editing){
			(this._getEditValue() == this._initialText) ? this.saveButton.disable() : this.saveButton.enable();
		}else{
			this._showText();
		}

	},

	disable: function(){
		this.saveButton.disable();
		this.cancelButton.disable();
		this.editable.disabled = true;
		this.editWidget.disable();
		dijit.form.InlineEditBox.superclass.disable.apply(this, arguments);
	},

	enable: function(){
		this.checkForValueChange();
		this.cancelButton.enable();
		this.editable.disabled = false;
		this.editWidget.enable();
		dijit.form.InlineEditBox.superclass.enable.apply(this, arguments);
	}
});
