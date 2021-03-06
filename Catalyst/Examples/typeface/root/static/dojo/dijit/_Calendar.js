dojo.provide("dijit._Calendar");

dojo.require("dojo.cldr.supplemental");
dojo.require("dojo.date");
dojo.require("dojo.date.locale");

dojo.require("dijit.base.Widget");
dojo.require("dijit.base.TemplatedWidget");
dojo.require("dijit.base.FormElement");

dojo.declare(
	"dijit._Calendar",
	[dijit.base.Widget, dijit.base.TemplatedWidget],
	{
		/*
		summary: 
			A simple GUI for choosing a date in the context of a monthly calendar.

		description:
			This widget is used internally by other widgets and is not accessible
			as a standalone widget.
			This widget can't be used in a form because it doesn't serialize the date to an
			<input> field.  For a form element, use DateTextbox instead.

			Note that the parser takes all dates attributes passed in the `RFC 3339` format:
			http://www.faqs.org/rfcs/rfc3339.html (2005-06-30T08:05:00-07:00)
			so that they are serializable and locale-independent.
		
		usage: 
			var calendar = new dijit._Calendar({}, dojo.byId("calendarNode")); 
		 	-or-
			<div dojoType="dijit._Calendar"></div> 
		*/
		templateString:"<table cellspacing=\"0\" cellpadding=\"0\" class=\"calendarContainer\">\n\t<thead>\n\t\t<tr class=\"dijitReset calendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset'>\n\t\t\t\t<img dojoAttachPoint=\"monthDecrease\" dojoAttachEvent=\"onclick: _onDecrementMonth;\" class=\"dijitDownArrow calendarMonthDecrement calendarIncrementControl calendarDecrease\" alt=\"-\">\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoAttachPoint=\"monthLabelSpacer\" class=\"calendarMonthLabelSpacer\"></div>\n\t\t\t\t<div dojoAttachPoint=\"monthLabelNode\" class=\"calendarMonth\"></div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset'>\n\t\t\t\t<img dojoAttachPoint=\"monthIncrease\" dojoAttachEvent=\"onclick: _onIncrementMonth;\" class=\"dijitUpArrow calendarMonthIncrement calendarIncrementControl calendarIncrease\" alt=\"+\">\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th class=\"dijitReset calendarDayLabelTemplate\"><span class=\"calendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick;\" class=\"dijitReset calendarBodyContainer\">\n\t\t<tr class=\"dijitReset calendarWeekTemplate\">\n\t\t\t<td class=\"dijitReset calendarDateTemplate\"><span class=\"calendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset calendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"calendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\"\n\t\t\t\t\t\tdojoAttachEvent=\"onclick: _onDecrementYear;\" class=\"calendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"calendarSelectedYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" \n\t\t\t\t\t\tdojoAttachEvent=\"onclick: _onIncrementYear;\" class=\"calendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\t\n",

		// value: Date
		// the currently selected Date
		value: new Date(),

		// dayWidth: String
		// How to represent the days of the week in the calendar header. See dojo.date.locale
		dayWidth: "narrow",

		setValue: function(/*Date*/ value){
			//summary: set the current date and update the UI
			if(!this.value || dojo.date.compare(value, this.value)){
				value = new Date(value);
				if(this.isDisabledDate(value, this.lang)){return;}
				this.value = value;
				this.value.setHours(0,0,0,0);
				this.displayMonth = new Date(this.value);
				this._populateGrid();
				this.onValueChanged(this.value);
			}
		},

		_populateGrid: function(){
			var month = this.displayMonth;
			month.setDate(1);
			var firstDay = month.getDay();
			var daysInMonth = dojo.date.getDaysInMonth(month);
			var daysInPreviousMonth = dojo.date.getDaysInMonth(dojo.date.add(month, "month", -1));
			var today = new Date();
			var selected = this.value;

			var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
			if(dayOffset > firstDay){ dayOffset -= 7; }

			// Iterate through dates in the calendar and fill in date numbers and style info
			dojo.query(".calendarDateTemplate", this.domNode).forEach(function(template, i){
				i += dayOffset;
				var date = new Date(month);
				var number, clazz, adj = 0;

				if(i < firstDay){
					number = daysInPreviousMonth - firstDay + i + 1;
					adj = -1;
					clazz = "calendarPrevious";
				}else if(i >= (firstDay + daysInMonth)){
					number = i - firstDay - daysInMonth + 1;
					adj = 1;
					clazz = "calendarNext";
				}else{
					number = i - firstDay + 1;
					clazz = "calendarCurrent";
				}

				if(adj){
					date = dojo.date.add(date, "month", adj);
				}
				date.setDate(number);

				if(!dojo.date.compare(date, today, "date")){
					clazz = "calendarCurrentDate " + clazz;
				}

				if(!dojo.date.compare(date, selected, "date")){
					clazz = "calendarSelectedDate " + clazz;
				}

				if(this.isDisabledDate(date, this.lang)){
					clazz = "calendarDisabledDate " + clazz;
				}

				template.className =  clazz + "Month calendarDateTemplate";
				template.dijitDateValue = date.valueOf();
				var label = dojo.query(".calendarDateLabel", template)[0];
				label.innerHTML = date.getDate();
			}, this);

			// Fill in localized month name
			var monthNames = dojo.date.locale.getNames('months', 'wide', 'standAlone', this.lang);
			this.monthLabelNode.innerHTML = monthNames[month.getMonth()];

			// Fill in localized prev/current/next years
			var y = month.getFullYear() - 1;
			dojo.forEach(["previous", "current", "next"], function(name){
				this[name+"YearLabelNode"].innerHTML =
					dojo.date.locale.format(new Date(y++, 0), {selector:'year', locale:this.lang});
			}, this);
		},

		postCreate: function(){
			dijit._Calendar.superclass.postCreate.apply(this);

			var cloneClass = dojo.hitch(this, function(clazz, n){
				var template = dojo.query(clazz, this.domNode)[0];
	 			for(var i=0; i<n; i++){
					template.parentNode.appendChild(template.cloneNode(true));
				}
			});

			// clone the day label and calendar day templates 6 times to make 7 columns
			cloneClass(".calendarDayLabelTemplate", 6);
			cloneClass(".calendarDateTemplate", 6);

			// now make 6 week rows
			cloneClass(".calendarWeekTemplate", 5);

			// insert localized day names in the header
			var dayNames = dojo.date.locale.getNames('days', this.dayWidth, 'standAlone', this.lang);
			var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
			dojo.query(".calendarDayLabel", this.domNode).forEach(function(label, i){
				label.innerHTML = dayNames[(i + dayOffset) % 7];
			});

			// Fill in spacer element with all the month names (invisible) so that the maximum width will affect layout
			var monthNames = dojo.date.locale.getNames('months', 'wide', 'standAlone', this.lang);
			dojo.forEach(monthNames, function(name){
				var monthSpacer = dojo.doc.createElement("div");
				monthSpacer.innerHTML = name;
				this.monthLabelSpacer.appendChild(monthSpacer);
			}, this);

			this.value = null;
			this.setValue(new Date());

			this._convertImages();
		},

		_convertImages : function() {
			// convert the arrow images from using style.background-image to the .src property (a11y)
			dijit.util.wai.imageBgToSrc([this.monthDecrease, this.monthIncrease]);

			// Trick to get image path reference from CSS as background image, then copy it into the img src attribute
/*			dojo.forEach(["monthDecrease", "monthIncrease"], function(item){
				var bi = dojo.getComputedStyle(this[item]).backgroundImage;
				var href = bi.charAt(4)=='"' ? bi.slice(5,-2) : bi.slice(4,-1);	// url(foo) --> foo, url("foo") --> foo
				this[item].src=href;
			}, this);
*/		
		},

		_adjustDate: function(/*String*/part, /*int*/amount){
			this.displayMonth = dojo.date.add(this.displayMonth, part, amount);
			this._populateGrid();
		},

		_onIncrementMonth: function(/*Event*/evt){
			// summary: handler for increment month event
			evt.stopPropagation();
			this._adjustDate("month", 1);
		},
	
		_onDecrementMonth: function(/*Event*/evt){
			// summary: handler for increment month event
			evt.stopPropagation();
			this._adjustDate("month", -1);
		},

		_onIncrementYear: function(/*Event*/evt){
			// summary: handler for increment year event
			evt.stopPropagation();
			this._adjustDate("year", 1);
		},
	
		_onDecrementYear: function(/*Event*/evt){
			// summary: handler for increment year event
			evt.stopPropagation();
			this._adjustDate("year", -1);
		},

		_onDayClick: function(/*Event*/evt){
			var node = evt.target;
			dojo.stopEvent(evt);
			while(!node.dijitDateValue){
				node = node.parentNode;
			}
			if(!dojo.hasClass(node, "calendarDisabledDate")){
				this.setValue(node.dijitDateValue);
				this.onValueSelected(this.value);
			}
		},

		onValueSelected: function(/*Date*/date){
			//summary: a date cell was selected.  It may be the same as the previous value.
		},

		onValueChanged: function(/*Date*/date){
			//summary: called only when the selected date has changed
		},

		isDisabledDate: function(/*Date*/dateObject, /*String?*/locale){
			// summary:
			//	May be overridden to disable certain dates in the calendar e.g. isDisabledDate=dojo.date.locale.isWeekend
			return false; // Boolean
		}
	}
);
