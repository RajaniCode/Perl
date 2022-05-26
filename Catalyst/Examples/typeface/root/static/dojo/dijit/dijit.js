/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

dojo.provide("dijit.util.manager");
dijit.util.manager=new function(){
var _1={};
var _2={};
this.getUniqueId=function(_3){
var _4;
do{
_4=_3+"_"+(_2[_3]!==undefined?++_2[_3]:_2[_3]=0);
}while(_1[_4]);
return _4;
};
this.add=function(_5){
if(!_5.id){
_5.id=this.getUniqueId(_5.declaredClass.replace(".","_"));
}
_1[_5.id]=_5;
};
this.remove=function(id){
delete _1.id;
};
this.destroyAll=function(){
for(var id in _1){
_1[id].destroy();
}
};
this.getWidgets=function(){
return _1;
};
this.byNode=function(_8){
return _1[_8.widgetId];
};
};
dojo.addOnUnload(function(){
dijit.util.manager.destroyAll();
});
dijit.byId=function(id){
return dijit.util.manager.getWidgets()[id];
};
dojo.provide("dijit.base.Widget");
dojo.declare("dijit.base.Widget",null,function(_a,_b){
this.srcNodeRef=dojo.byId(_b);
this._connects=[];
if(this.srcNodeRef&&(typeof this.srcNodeRef.id=="string")){
this.id=this.srcNodeRef.id;
}
if(_a){
dojo.mixin(this,_a);
}
this.postMixInProperties();
dijit.util.manager.add(this);
this.buildRendering();
if(this.domNode){
this.domNode.widgetId=this.id;
if(this.srcNodeRef&&this.srcNodeRef.dir){
this.domNode.dir=this.srcNodeRef.dir;
}
}
this.postCreate();
if(this.srcNodeRef&&!this.srcNodeRef.parentNode){
delete this.srcNodeRef;
}
},{id:"",lang:"",dir:"",srcNodeRef:null,domNode:null,postMixInProperties:function(){
},buildRendering:function(){
this.domNode=this.srcNodeRef;
},postCreate:function(){
},startup:function(){
},destroyRecursive:function(_c){
this.destroyDescendants();
this.destroy();
},destroy:function(_d){
this.uninitialize();
dojo.forEach(this._connects,dojo.disconnect);
this.destroyRendering(_d);
dijit.util.manager.remove(this.id);
},destroyRendering:function(_e){
if(this.bgIframe){
this.bgIframe.remove();
delete this.bgIframe;
}
if(this.domNode){
if(this.domNode.parentNode){
this.domNode.parentNode.removeChild(this.domNode);
}
delete this.domNode;
}
if(this.srcNodeRef&&this.srcNodeRef.parentNode){
this.srcNodeRef.parentNode.removeChild(this.srcNodeRef);
delete this.srcNodeRef;
}
},destroyDescendants:function(){
dojo.forEach(this.getDescendants(),function(_f){
_f.destroy();
});
},uninitialize:function(){
return false;
},toString:function(){
return "[Widget "+this.declaredClass+", "+(this.id||"NO ID")+"]";
},getDescendants:function(){
var _10=this.domNode.all||this.domNode.getElementsByTagName("*");
var i=0,_12;
var _13=[];
while((_12=_10[i++])){
var id=_12.widgetId;
if(id){
_13.push(dijit.byId(id));
}
}
return _13;
},connect:function(obj,_16,_17){
this._connects.push(dojo.connect(obj,_16,this,_17));
},isLeftToRight:function(){
if(typeof this._ltr=="undefined"){
this._ltr=(this.dir||dojo.getComputedStyle(this.domNode).direction)!="rtl";
}
return this._ltr;
}});
dijit._disableSelection=function(_18){
if(dojo.isMozilla){
_18.style.MozUserSelect="none";
}else{
if(dojo.isKhtml){
_18.style.KhtmlUserSelect="none";
}else{
if(dojo.isIE){
_18.unselectable="on";
}
}
}
};
dojo.provide("dijit.base.Container");
dojo.declare("dijit.base.Contained",null,{getParent:function(){
for(var p=this.domNode.parentNode;p;p=p.parentNode){
var _1a=p.widgetId;
if(_1a){
return dijit.byId(_1a);
}
}
return null;
},_getSibling:function(_1b){
var _1c=this.domNode;
do{
_1c=_1c[_1b+"Sibling"];
}while(_1c&&_1c.nodeType!=1);
if(!_1c){
return null;
}
var id=_1c.widgetId;
return dijit.byId(id);
},getPreviousSibling:function(){
return this._getSibling("previous");
},getNextSibling:function(){
return this._getSibling("next");
}});
dojo.declare("dijit.base.Container",null,{isContainer:true,addChild:function(_1e,_1f){
var _20=this.containerNode||this.domNode;
if(typeof _1f=="undefined"){
dojo.place(_1e.domNode,_20,"last");
}else{
dojo.place(_1e.domNode,_20,_1f);
}
},removeChild:function(_21){
var _22=_21.domNode;
_22.parentNode.removeChild(_22);
},_nextElement:function(_23){
do{
_23=_23.nextSibling;
}while(_23&&_23.nodeType!=1);
return _23;
},_firstElement:function(_24){
_24=_24.firstChild;
if(_24&&_24.nodeType!=1){
_24=this._nextElement(_24);
}
return _24;
},getChildren:function(){
var res=[];
var cn=this.containerNode||this.domNode;
var _27=this._firstElement(cn);
while(_27){
var tmp=dijit.byId(_27.widgetId);
if(tmp){
res.push(tmp);
}
_27=this._nextElement(_27);
}
return res;
},hasChildren:function(){
var cn=this.containerNode||this.domNode;
return !!this._firstElement(cn);
}});
dojo.provide("dijit.base.Layout");
dojo.declare("dijit.base.Sizable",null,{resize:function(mb){
var _2b=this.domNode;
if(mb){
dojo.marginBox(_2b,mb);
if(mb.t){
_2b.style.top=mb.t+"px";
}
if(mb.l){
_2b.style.left=mb.l+"px";
}
}
mb=dojo.marginBox(_2b);
this._contentBox=dijit.base.Layout.marginBox2contentBox(_2b,mb);
this.layout();
},layout:function(){
}});
dojo.declare("dijit.base.Layout",[dijit.base.Sizable,dijit.base.Container,dijit.base.Contained,dijit.base.Showable],{isLayoutContainer:true,startup:function(){
if(this._started){
return;
}
this._started=true;
if(this.getChildren){
dojo.forEach(this.getChildren(),function(_2c){
_2c.startup();
});
}
if(!this.getParent||!this.getParent()){
this.resize();
this.connect(window,"onresize","resize");
}
}});
dijit.base.Layout.marginBox2contentBox=function(_2d,mb){
var cs=dojo.getComputedStyle(_2d);
var me=dojo._getMarginExtents(_2d,cs);
var pb=dojo._getPadBorderExtents(_2d,cs);
return {l:dojo._toPixelValue(this.containerNode,cs.paddingLeft),t:dojo._toPixelValue(this.containerNode,cs.paddingTop),w:mb.w-(me.w+pb.w),h:mb.h-(me.h+pb.h)};
};
dijit.base.Layout.layoutChildren=function(_32,dim,_34,_35){
dojo.addClass(_32,"dijitLayoutContainer");
_34=dojo.filter(_34,function(_36,idx){
_36.idx=idx;
return dojo.indexOf(["top","bottom","left","right","client","flood"],_36.layoutAlign)>-1;
});
if(_35&&_35!="none"){
var _38=function(_39){
switch(_39.layoutAlign){
case "flood":
return 1;
case "left":
case "right":
return (_35=="left-right")?2:3;
case "top":
case "bottom":
return (_35=="left-right")?3:2;
default:
return 4;
}
};
_34.sort(function(a,b){
return (_38(a)-_38(b))||(a.idx-b.idx);
});
}
var ret=true;
dojo.forEach(_34,function(_3d){
var elm=_3d.domNode;
var pos=_3d.layoutAlign;
var _40=elm.style;
_40.left=dim.l+"px";
_40.top=dim.t+"px";
_40.bottom=_40.right="auto";
var _41=function(_42){
return _42.substring(0,1).toUpperCase()+_42.substring(1);
};
dojo.addClass(elm,"dijitAlign"+_41(pos));
if(pos=="top"||pos=="bottom"){
if(_3d.resize){
_3d.resize({w:dim.w});
}else{
dojo.marginBox(elm,{w:dim.w});
}
var h=dojo.marginBox(elm).h;
dim.h-=h;
dojo.mixin(_3d,{w:dim.w,h:h});
if(pos=="top"){
dim.t+=h;
}else{
_40.top=dim.t+dim.h+"px";
}
}else{
if(pos=="left"||pos=="right"){
var w=dojo.marginBox(elm).w;
var _45=dijit.base.Layout._sizeChild(_3d,elm,w,dim.h);
if(_45){
ret=false;
}
dim.w-=w;
if(pos=="left"){
dim.l+=w;
}else{
_40.left=dim.l+dim.w+"px";
}
}else{
if(pos=="flood"||pos=="client"){
var _45=dijit.base.Layout._sizeChild(_3d,elm,dim.w,dim.h);
if(_45){
ret=false;
}
}
}
}
});
return ret;
};
dijit.base.Layout._sizeChild=function(_46,elm,w,h){
var box={};
var _4b=(w==0||h==0);
if(!_4b){
if(w!=0){
box.w=w;
}
if(h!=0){
box.h=h;
}
if(_46.resize){
_46.resize(box);
}else{
dojo.marginBox(elm,box);
}
}
dojo.mixin(_46,box);
return _4b;
};
dojo.provide("dijit.base.Showable");
dojo.declare("dijit.base.Showable",null,{isShowing:function(){
return dojo.style(this.domNode,"display")!="none";
},toggleShowing:function(){
if(this.isShowing()){
this.hide();
}else{
this.show();
}
},show:function(){
if(this.isShowing()){
return;
}
this.domNode.style.display="";
this.onShow();
},onShow:function(){
},hide:function(){
if(!this.isShowing()){
return;
}
this.domNode.style.display="none";
this.onHide();
},onHide:function(){
}});
dojo.provide("dijit.util.sniff");
(function(){
var d=dojo;
var ie=d.isIE;
var _4e=d.isOpera;
var maj=Math.floor;
var _50={dj_ie:ie,dj_ie6:maj(ie)==6,dj_ie7:maj(ie)==7,dj_iequirks:ie&&d.isQuirks,dj_opera:_4e,dj_opera8:maj(_4e)==8,dj_opera9:maj(_4e)==9,dj_khtml:d.isKhtml,dj_safari:d.isSafari,dj_gecko:d.isMozilla};
for(var p in _50){
if(_50[p]){
var _52=dojo.doc.documentElement;
if(_52.className){
_52.className+=" "+p;
}else{
_52.className=p;
}
}
}
})();
dojo.provide("dijit.util.wai");
dijit.util.waiNames=["waiRole","waiState"];
dijit.util.wai={waiRole:{name:"waiRole","namespace":"http://www.w3.org/TR/xhtml2",alias:"x2",prefix:"wairole:"},waiState:{name:"waiState","namespace":"http://www.w3.org/2005/07/aaa",alias:"aaa",prefix:""},setAttr:function(_53,ns,_55,_56){
if(dojo.isIE){
_53.setAttribute(this[ns].alias+":"+_55,this[ns].prefix+_56);
}else{
_53.setAttributeNS(this[ns]["namespace"],_55,this[ns].prefix+_56);
}
},getAttr:function(_57,ns,_59){
if(dojo.isIE){
return _57.getAttribute(this[ns].alias+":"+_59);
}else{
return _57.getAttributeNS(this[ns]["namespace"],_59);
}
},removeAttr:function(_5a,ns,_5c){
var _5d=true;
if(dojo.isIE){
_5d=_5a.removeAttribute(this[ns].alias+":"+_5c);
}else{
_5a.removeAttributeNS(this[ns]["namespace"],_5c);
}
return _5d;
},imageBgToSrc:function(_5e){
if(!dojo.isArrayLike(_5e)){
_5e=[_5e];
}
dojo.forEach(_5e,function(_5f){
var _60=_5f&&dojo.getComputedStyle(_5f);
if(!_60){
return;
}
var _61=_60.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
if(!_61){
return;
}
_5f.src=_61[1];
_5f.style.backgroundImage="none";
});
}};
dojo._loaders.unshift(function(){
var div=document.createElement("div");
div.id="a11yTestNode";
dojo.body().appendChild(div);
function check(){
var cs=dojo.getComputedStyle(div);
var _64=cs.backgroundImage;
var _65=(cs.borderTopColor==cs.borderRightColor)||(_64!=null&&(_64=="none"||_64=="url(invalid-url:)"));
dojo[_65?"addClass":"removeClass"](dojo.body(),"dijit_a11y");
};
if(dojo.isIE||dojo.isMoz){
check();
if(dojo.isIE){
setInterval(check,4000);
}
}
});
dojo.provide("dijit.base.FormElement");
dojo.declare("dijit.base.FormElement",dijit.base.Widget,{baseClass:"",value:"",name:"",id:"",alt:"",type:"text",tabIndex:"0",disabled:false,enable:function(){
this._setDisabled(false);
},disable:function(){
this._setDisabled(true);
},_setDisabled:function(_66){
this.domNode.disabled=this.disabled=_66;
if(this.focusNode){
this.focusNode.disabled=_66;
}
dijit.util.wai.setAttr(this.focusNode||this.domNode,"waiState","disabled",_66);
this.setStateClass(null,this.domNode);
},setStateClass:function(_67,_68,_69){
if(_68==null){
_68=this.domNode;
}
if(_67){
dojo.stopEvent(_67);
}
var _6a=_68.getAttribute("baseClass")||this.baseClass||(this.baseClass="dijit"+this.declaredClass.replace(/.*\./g,""));
if(this.disabled){
dojo.removeClass(this.domNode,_6a+"Enabled");
dojo.removeClass(this.domNode,_6a+"Hover");
dojo.removeClass(this.domNode,_6a+"Active");
dojo.addClass(this.domNode,_6a+"Disabled");
}else{
if(_67){
switch(_67.type){
case "mouseover":
_68._hovering=true;
break;
case "mouseout":
_68._hovering=false;
break;
case "mousedown":
_68._active=true;
var _6b=this;
var _6c=function(_6d){
_6b.setStateClass(_6d,_68);
};
_68._mouseUpConnector=dojo.connect(dojo.global,"onmouseup",this,_6c);
break;
case "mouseup":
_68._active=false;
if(this._mouseUpConnector){
dojo.disconnect(_68._mouseUpConnector);
_68._mouseUpConnector=false;
}
break;
case "click":
this.onClick(_67);
break;
}
}
dojo.removeClass(this.domNode,_6a+"Disabled");
dojo.toggleClass(this.domNode,_6a+"Active",_68._active==true);
dojo.toggleClass(this.domNode,_6a+"Hover",_68._hovering==true&&_68._active!=true);
dojo.addClass(this.domNode,_6a+"Enabled");
}
},onValueChanged:function(_6e){
},postCreate:function(){
this._setDisabled(this.disabled==true);
},_lastValueReported:null,setValue:function(_6f){
if(_6f!=this._lastValueReported){
this._lastValueReported=_6f;
dijit.util.wai.setAttr(this.focusNode||this.domNode,"waiState","valuenow",_6f);
this.onValueChanged(_6f);
}
},getValue:function(){
return this._lastValueReported;
}});
dojo.provide("dojo.string");
dojo.string.pad=function(_70,_71,ch,end){
var out=String(_70);
if(!ch){
ch="0";
}
while(out.length<_71){
if(end){
out+=ch;
}else{
out=ch+out;
}
}
return out;
};
dojo.string.substitute=function(_75,map,_77,_78){
return _75.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(_79,key,_7b){
var _7c=dojo.getObject(key,false,map);
if(_7b){
_7c=dojo.getObject(_7b,false,_78)(_7c);
}
if(_77){
_7c=_77(_7c);
}
return _7c.toString();
});
};
dojo.provide("dojo.date.stamp");
dojo.date.stamp.setIso8601=function(_7d,_7e){
var _7f=(_7e.indexOf("T")==-1)?_7e.split(" "):_7e.split("T");
_7d=dojo.date.stamp.setIso8601Date(_7d,_7f[0]);
if(_7f.length==2){
_7d=dojo.date.stamp.setIso8601Time(_7d,_7f[1]);
}
return _7d;
};
dojo.date.stamp.fromIso8601=function(_80){
return dojo.date.stamp.setIso8601(new Date(0,0),_80);
};
dojo.date.stamp.setIso8601Date=function(_81,_82){
var _83="^([0-9]{4})((-?([0-9]{2})(-?([0-9]{2}))?)|"+"(-?([0-9]{3}))|(-?W([0-9]{2})(-?([1-7]))?))?$";
var d=_82.match(new RegExp(_83));
if(!d){
console.debug("invalid date string: "+_82);
return null;
}
var _85=d[1];
var _86=d[4];
var _87=d[6];
var _88=d[8];
var _89=d[10];
var _8a=d[12]||1;
_81.setFullYear(_85);
if(_88){
_81.setMonth(0);
_81.setDate(Number(_88));
}else{
if(_89){
_81.setMonth(0);
_81.setDate(1);
var day=_81.getDay()||7;
var _8c=Number(_8a)+(7*Number(_89));
if(day<=4){
_81.setDate(_8c+1-day);
}else{
_81.setDate(_8c+8-day);
}
}else{
if(_86){
_81.setDate(1);
_81.setMonth(_86-1);
}
if(_87){
_81.setDate(_87);
}
}
}
return _81;
};
dojo.date.stamp.fromIso8601Date=function(_8d){
return dojo.date.stamp.setIso8601Date(new Date(0,0),_8d);
};
dojo.date.stamp.setIso8601Time=function(_8e,_8f){
var _90="Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$";
var d=_8f.match(new RegExp(_90));
var _92=0;
if(d){
if(d[0]!="Z"){
_92=(Number(d[3])*60)+Number(d[5]||0);
if(d[2]!="-"){
_92*=-1;
}
}
_92-=_8e.getTimezoneOffset();
_8f=_8f.substr(0,_8f.length-d[0].length);
}
var _93="^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$";
d=_8f.match(new RegExp(_93));
if(!d){
console.debug("invalid time string: "+_8f);
return null;
}
var _94=d[1];
var _95=Number(d[3]||0);
var _96=d[5]||0;
var ms=d[7]?(Number("0."+d[7])*1000):0;
_8e.setHours(_94);
_8e.setMinutes(_95);
_8e.setSeconds(_96);
_8e.setMilliseconds(ms);
if(_92!==0){
_8e.setTime(_8e.getTime()+_92*60000);
}
return _8e;
};
dojo.date.stamp.fromIso8601Time=function(_98){
return dojo.date.stamp.setIso8601Time(new Date(0,0),_98);
};
dojo.date.stamp.toRfc3339=function(_99,_9a){
_99=_99||new Date();
var _=dojo.string.pad;
var _9c=[];
if(_9a!="time"){
var _9d=[_(_99.getFullYear(),4),_(_99.getMonth()+1,2),_(_99.getDate(),2)].join("-");
_9c.push(_9d);
}
if(_9a!="date"){
var _9e=[_(_99.getHours(),2),_(_99.getMinutes(),2),_(_99.getSeconds(),2)].join(":");
var _9f=_99.getTimezoneOffset();
_9e+=(_9f>0?"-":"+")+_(Math.floor(Math.abs(_9f)/60),2)+":"+_(Math.abs(_9f)%60,2);
_9c.push(_9e);
}
return _9c.join("T");
};
dojo.date.stamp.fromRfc3339=function(_a0){
_a0=_a0.replace("Tany","");
return dojo.date.stamp.setIso8601(new Date(),_a0);
};
dojo.provide("dijit.util.parser");
dijit.util.parser=new function(){
function val2type(_a1){
if(dojo.isString(_a1)){
return "string";
}
if(typeof _a1=="number"){
return "number";
}
if(typeof _a1=="boolean"){
return "boolean";
}
if(dojo.isFunction(_a1)){
return "function";
}
if(dojo.isArray(_a1)){
return "array";
}
if(_a1 instanceof Date){
return "date";
}
if(_a1 instanceof dojo._Url){
return "url";
}
return "object";
};
function str2obj(_a2,_a3){
switch(_a3){
case "string":
return _a2;
case "number":
return _a2.length?Number(_a2):null;
case "boolean":
return typeof _a2=="boolean"?_a2:!(_a2.toLowerCase()=="false");
case "function":
if(dojo.isFunction(_a2)){
return _a2;
}
try{
if(_a2.search(/[^\w\.]+/i)!=-1){
_a2=dijit.util.parser._nameAnonFunc(new Function(_a2),this);
}
return dojo.getObject(_a2,false);
}
catch(e){
return new Function();
}
case "array":
return _a2.split(";");
case "date":
return dojo.date.stamp.fromRfc3339(_a2);
case "url":
return dojo.baseUrl+_a2;
default:
try{
eval("var tmp = "+_a2);
return tmp;
}
catch(e){
return _a2;
}
}
};
var _a4={};
function getWidgetClassInfo(_a5){
if(!_a4[_a5]){
var cls=dojo.getObject(_a5);
if(!dojo.isFunction(cls)){
throw new Error("Could not load widget '"+_a5+"'. Did you spell the name correctly and use a full path, like 'dijit.form.Button'?");
}
var _a7=cls.prototype;
var _a8={};
for(var _a9 in _a7){
if(_a9.charAt(0)=="_"){
continue;
}
var _aa=_a7[_a9];
_a8[_a9]=val2type(_aa);
}
_a4[_a5]={cls:cls,params:_a8};
}
return _a4[_a5];
};
this.instantiate=function(_ab){
var _ac=[];
dojo.forEach(_ab,function(_ad){
if(!_ad){
return;
}
var _ae=_ad.getAttribute("dojoType");
if((!_ae)||(!_ae.length)){
return;
}
var _af=getWidgetClassInfo(_ae);
var _b0={};
for(var _b1 in _af.params){
var _b2=_ad.getAttribute(_b1);
if(_b2!=null){
var _b3=_af.params[_b1];
_b0[_b1]=str2obj(_b2,_b3);
}
}
_ac.push(new _af.cls(_b0,_ad));
var _b4=_ad.getAttribute("jsId");
if(_b4){
dojo.setObject(_b4,_ac[_ac.length-1]);
}
});
dojo.forEach(_ac,function(_b5){
if(_b5&&_b5.startup&&(!_b5.getParent||_b5.getParent()==null)){
_b5.startup();
}
});
return _ac;
};
this.parse=function(_b6){
var _b7=dojo.query("[dojoType]",_b6);
return this.instantiate(_b7);
};
}();
dojo.addOnLoad(function(){
dijit.util.parser.parse();
});
dijit.util.parser._anonCtr=0;
dijit.util.parser._anon={};
dijit.util.parser._nameAnonFunc=function(_b8,_b9,_ba){
var jpn="$joinpoint";
var nso=(_b9||dijit.util.parser._anon);
if(dojo.isIE){
var cn=_b8["__dojoNameCache"];
if(cn&&nso[cn]===_b8){
return _b8["__dojoNameCache"];
}else{
if(cn){
var _be=cn.indexOf(jpn);
if(_be!=-1){
return cn.substring(0,_be);
}
}
}
}
var ret="__"+dijit.util.parser._anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dijit.util.parser._anonCtr++;
}
nso[ret]=_b8;
return ret;
};
dojo.provide("dijit.base.TemplatedWidget");
dojo.declare("dijit.base.TemplatedWidget",null,{templateNode:null,templateString:null,templatePath:null,widgetsInTemplate:false,containerNode:null,buildRendering:function(){
var _c0=dijit.base.getCachedTemplate(this.templatePath,this.templateString);
var _c1;
if(dojo.isString(_c0)){
var _c2=dojo.string.substitute(_c0,this,function(_c3){
return _c3.toString().replace(/"/g,"&quot;");
},this);
_c1=dijit.base._createNodesFromText(_c2)[0];
}else{
_c1=_c0.cloneNode(true);
}
this._attachTemplateNodes(_c1);
if(this.srcNodeRef){
dojo.style(_c1,"cssText",this.srcNodeRef.style.cssText);
if(this.srcNodeRef.className){
_c1.className+=" "+this.srcNodeRef.className;
}
}
this.domNode=_c1;
if(this.srcNodeRef&&this.srcNodeRef.parentNode){
this.srcNodeRef.parentNode.replaceChild(this.domNode,this.srcNodeRef);
}
if(this.widgetsInTemplate){
var _c4=dijit.util.parser.parse(this.domNode);
this._attachTemplateNodes(_c4,function(n,p){
return n[p];
});
}
if(this.srcNodeRef&&this.srcNodeRef.hasChildNodes()){
var _c7=this.containerNode||this.domNode;
while(this.srcNodeRef.hasChildNodes()){
_c7.appendChild(this.srcNodeRef.firstChild);
}
}
},_attachTemplateNodes:function(_c8,_c9){
var _ca=function(str){
return str.replace(/^\s+|\s+$/g,"");
};
_c9=_c9||function(n,p){
return n.getAttribute(p);
};
var _ce=dojo.isArray(_c8)?_c8:(_c8.all||_c8.getElementsByTagName("*"));
var x=dojo.isArray(_c8)?0:-1;
for(;x<_ce.length;x++){
var _d0=(x==-1)?_c8:_ce[x];
if(this.widgetsInTemplate&&_c9(_d0,"dojoType")){
return;
}
var _d1=_c9(_d0,"dojoAttachPoint");
if(_d1){
var _d2=_d1.split(";");
var z=0,ap;
while((ap=_d2[z++])){
if(dojo.isArray(this[ap])){
this[ap].push(_d0);
}else{
this[ap]=_d0;
}
}
}
var _d5=_c9(_d0,"dojoAttachEvent");
if(_d5){
var _d6=_d5.split(";");
var y=0,evt;
while((evt=_d6[y++])){
if(!evt||!evt.length){
continue;
}
var _d9=null;
var _da=_ca(evt);
if(evt.indexOf(":")!=-1){
var _db=_da.split(":");
_da=_ca(_db[0]);
_d9=_ca(_db[1]);
}
if(!_d9){
_d9=_da;
}
this.connect(_d0,_da,_d9);
}
}
dojo.forEach(["waiRole","waiState"],function(_dc){
var wai=dijit.util.wai[_dc];
var val=_c9(_d0,wai.name);
if(val){
var _df="role";
if(val.indexOf("-")!=-1){
var _e0=val.split("-");
_df=_e0[0];
val=_e0[1];
}
dijit.util.wai.setAttr(_d0,wai.name,_df,val);
}
},this);
}
}});
dijit.base._templateCache={};
dijit.base.getCachedTemplate=function(_e1,_e2){
var _e3=dijit.base._templateCache;
var key=_e2||_e1;
var _e5=_e3[key];
if(_e5){
return _e5;
}
if(!_e2){
_e2=dijit.base._sanitizeTemplateString(dojo._getText(_e1));
}
_e2=_e2.replace(/^\s+|\s+$/g,"");
if(_e2.match(/\$\{([^\}]+)\}/g)){
return (_e3[key]=_e2);
}else{
return (_e3[key]=dijit.base._createNodesFromText(_e2)[0]);
}
};
dijit.base._sanitizeTemplateString=function(_e6){
if(_e6){
_e6=_e6.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,"");
var _e7=_e6.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_e7){
_e6=_e7[1];
}
}else{
_e6="";
}
return _e6;
};
if(dojo.isIE){
dojo.addOnUnload(function(){
var _e8=dijit.base._templateCache;
for(var key in _e8){
var _ea=_e8[key];
if(!isNaN(_ea.nodeType)){
}
_e8[key]=null;
}
});
}
(function(){
var _eb={cell:{re:/^<t[dh][\s\r\n>]/i,pre:"<table><tbody><tr>",post:"</tr></tbody></table>"},row:{re:/^<tr[\s\r\n>]/i,pre:"<table><tbody>",post:"</tbody></table>"},section:{re:/^<(thead|tbody|tfoot)[\s\r\n>]/i,pre:"<table>",post:"</table>"}};
var tn;
var _ed;
dijit.base._createNodesFromText=function(_ee){
if(!tn){
_ed=tn=dojo.doc.createElement("div");
tn.style.visibility="hidden";
}
var _ef="none";
var _f0=_ee.replace(/^\s+/);
for(var _f1 in _eb){
var map=_eb[_f1];
if(map.re.test(_f0)){
_ef=_f1;
_ee=map.pre+_ee+map.post;
break;
}
}
tn.innerHTML=_ee;
dojo.body().appendChild(tn);
if(tn.normalize){
tn.normalize();
}
var tag={cell:"tr",row:"tbody",section:"table"}[_ef];
if(typeof tag!="undefined"){
_ed=tn.getElementsByTagName(tag)[0];
}
var _f4=[];
while(_ed.firstChild){
_f4.push(_ed.removeChild(_ed.firstChild));
}
_ed=dojo.body().removeChild(tn);
return _f4;
};
})();
dojo.extend(dijit.base.Widget,{dojoAttachEvent:"",dojoAttachPoint:"",waiRole:"",waiState:""});
dojo.provide("dijit.util.FocusManager");
dijit.util.FocusManager=new function(){
var _f5,_f6;
function onFocus(_f7){
if(_f7&&_f7.tagName=="body"){
_f7=null;
}
if(_f7!==_f5){
_f6=_f5;
_f5=_f7;
console.debug("focused on ",_f7?(_f7.id?_f7.id:_f7.tagName):"nothing");
}
};
dojo.addOnLoad(function(){
if(dojo.isIE){
window.setInterval(function(){
onFocus(document.activeElement);
},100);
}else{
dojo.body().addEventListener("focus",function(evt){
onFocus(evt.target);
},true);
}
});
var _f9=null;
var _fa=false;
var _fb;
var _fc;
var _fd;
var _fe=function(){
var _ff=dojo.global;
var _100=dojo.doc;
if(_100.selection){
return _100.selection.createRange().text=="";
}else{
if(_ff.getSelection){
var _101=_ff.getSelection();
if(dojo.isString(_101)){
return _101=="";
}else{
return _101.isCollapsed||_101.toString()=="";
}
}
}
};
var _102=function(){
var _103;
var _104=dojo.doc;
if(_104.selection){
var _105=_104.selection.createRange();
if(_104.selection.type.toUpperCase()=="CONTROL"){
if(_105.length){
_103=[];
var i=0;
while(i<_105.length){
_103.push(_105.item(i++));
}
}else{
_103=null;
}
}else{
_103=_105.getBookmark();
}
}else{
var _107;
try{
_107=dojo.global.getSelection();
}
catch(e){
}
if(_107){
var _105=_107.getRangeAt(0);
_103=_105.cloneRange();
}else{
console.debug("No idea how to store the current selection for this browser!");
}
}
return _103;
};
var _108=function(_109){
var _10a=dojo.doc;
if(_10a.selection){
if(dojo.isArray(_109)){
var _10b=_10a.body.createControlRange();
var i=0;
while(i<_109.length){
_10b.addElement(_109[i++]);
}
_10b.select();
}else{
var _10b=_10a.selection.createRange();
_10b.moveToBookmark(_109);
_10b.select();
}
}else{
var _10d;
try{
_10d=dojo.global.getSelection();
}
catch(e){
}
if(_10d&&_10d.removeAllRanges){
_10d.removeAllRanges();
_10d.addRange(_109);
}else{
console.debug("No idea how to restore selection for this browser!");
}
}
};
this.save=function(menu,_10f){
if(menu==_f9){
return;
}
if(_f9){
_f9.close();
}
_f9=menu;
_fb=_10f;
var _110=function(node,_112){
while(node){
if(node===_112){
return true;
}
node=node.parentNode;
}
return false;
};
_fc=_110(_f5,menu.domNode)?_f6:_f5;
console.debug("will restore focus to "+(_fc?(_fc.id||_fc.tagName):"nothing"));
console.debug("prev focus is "+_f6);
if(!dojo.withGlobal(_fb||dojo.global,_fe)){
_fd=dojo.withGlobal(_fb||dojo.global,_102);
}else{
_fd=null;
}
};
this.restore=function(menu){
if(_f9==menu){
if(_fc){
_fc.focus();
}
if(_fd&&dojo.withGlobal(_fb||dojo.global,_fe)){
if(_fb){
_fb.focus();
}
try{
dojo.withGlobal(_fb||dojo.global,_108,null,[_fd]);
}
catch(e){
}
}
_fd=null;
_fa=false;
_f9=null;
}
};
}();
dojo.provide("dijit.util.BackgroundIframe");
dijit.util.BackgroundIframe=function(node){
if(dojo.isIE&&dojo.isIE<7){
var html="<iframe src='javascript:false'"+" style='position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"+"z-index: -1; filter:Alpha(Opacity=\"0\");'>";
this.iframe=dojo.doc.createElement(html);
this.iframe.tabIndex=-1;
if(node){
node.appendChild(this.iframe);
this.domNode=node;
}else{
dojo.body().appendChild(this.iframe);
this.iframe.style.display="none";
}
}
};
dojo.extend(dijit.util.BackgroundIframe,{iframe:null,onResized:function(){
if(this.iframe&&this.domNode&&this.domNode.parentNode){
var _116=dojo.marginBox(this.domNode);
if(!_116.w||!_116.h){
setTimeout(this,this.onResized,100);
return;
}
this.iframe.style.width=_116.w+"px";
this.iframe.style.height=_116.h+"px";
}
},size:function(node){
if(!this.iframe){
return;
}
var _118=dojo.coords(node,true);
var s=this.iframe.style;
s.width=_118.w+"px";
s.height=_118.h+"px";
s.left=_118.x+"px";
s.top=_118.y+"px";
},setZIndex:function(node){
if(!this.iframe){
return;
}
this.iframe.style.zIndex=!isNaN(node)?node:(node.style.zIndex-1);
},show:function(){
if(this.iframe){
this.iframe.style.display="block";
}
},hide:function(){
if(this.iframe){
this.iframe.style.display="none";
}
},remove:function(){
if(this.iframe){
this.iframe.parentNode.removeChild(this.iframe);
delete this.iframe;
this.iframe=null;
}
}});
dojo.provide("dijit.util.place");
dijit.util.getViewport=function(){
var _11b=dojo.global;
var _11c=dojo.doc;
var w=0;
var h=0;
if(dojo.isMozilla){
w=_11c.documentElement.clientWidth;
h=_11b.innerHeight;
}else{
if(!dojo.isOpera&&_11b.innerWidth){
w=_11b.innerWidth;
h=_11b.innerHeight;
}else{
if(dojo.isIE&&_11c.documentElement&&_11c.documentElement.clientHeight){
w=_11c.documentElement.clientWidth;
h=_11c.documentElement.clientHeight;
}else{
if(dojo.body().clientWidth){
w=dojo.body().clientWidth;
h=dojo.body().clientHeight;
}
}
}
}
return {w:w,h:h};
};
dijit.util.getScroll=function(){
var _11f=dojo.global;
var _120=dojo.doc;
var top=_11f.pageYOffset||_120.documentElement.scrollTop||dojo.body().scrollTop||0;
var left=_11f.pageXOffset||_120.documentElement.scrollLeft||dojo.body().scrollLeft||0;
return {top:top,left:left,offset:{x:left,y:top}};
};
dijit.util.placeOnScreen=function(node,_124,_125,_126,_127,_128,_129){
if(dojo.isArray(_124)){
_129=_128;
_128=_127;
_127=_126;
_126=_125;
_125=_124[1];
_124=_124[0];
}
if(dojo.isString(_128)){
_128=_128.split(",");
}
if(!isNaN(_126)){
_126=[Number(_126),Number(_126)];
}else{
if(!dojo.isArray(_126)){
_126=[0,0];
}
}
var _12a=dijit.util.getScroll().offset;
var view=dijit.util.getViewport();
node=dojo.byId(node);
var _12c=node.style.display;
var _12d=node.style.visibility;
node.style.visibility="hidden";
node.style.display="";
var bb=dojo.marginBox(node);
var w=bb.w;
var h=bb.h;
node.style.display=_12c;
node.style.visibility=_12d;
var _131,_132,_133,_134="";
if(!dojo.isArray(_128)){
_128=["TL"];
}
var _135,_136,_137=Infinity,_138;
for(var _139=0;_139<_128.length;++_139){
var _131,_132="";
var _13a=_128[_139];
var _13b=true;
var tryX=_124-(_13a.charAt(1)=="L"?0:w)+_126[0]*(_13a.charAt(1)=="L"?1:-1);
var tryY=_125-(_13a.charAt(0)=="T"?0:h)+_126[1]*(_13a.charAt(0)=="T"?1:-1);
if(_127){
tryX-=_12a.x;
tryY-=_12a.y;
}
var x=tryX+w;
if(x>view.w){
_13b=false;
}
x=Math.max(_126[0],tryX)+_12a.x;
if(_13a.charAt(1)=="L"){
if(w>view.w-tryX){
_131=view.w-tryX;
_13b=false;
}else{
_131=w;
}
}else{
if(tryX<0){
_131=w+tryX;
_13b=false;
}else{
_131=w;
}
}
var y=tryY+h;
if(y>view.h){
_13b=false;
}
y=Math.max(_126[1],tryY)+_12a.y;
if(_13a.charAt(0)=="T"){
if(h>view.h-tryY){
_132=view.h-tryY;
_13b=false;
}else{
_132=h;
}
}else{
if(tryY<0){
_132=h+tryY;
_13b=false;
}else{
_132=h;
}
}
if(_13b){
_135=x;
_136=y;
_137=0;
_133=_131;
_134=_132;
_138=_13a;
break;
}else{
var dist=Math.pow(x-tryX-_12a.x,2)+Math.pow(y-tryY-_12a.y,2);
if(dist==0){
dist=Math.pow(h-_132,2);
}
if(_137>dist){
_137=dist;
_135=x;
_136=y;
_133=_131;
_134=_132;
_138=_13a;
}
}
}
if(!_129){
node.style.left=_135+"px";
node.style.top=_136+"px";
}
return {left:_135,top:_136,x:_135,y:_136,dist:_137,corner:_138,h:_134,w:_133};
};
dijit.util.placeOnScreenAroundElement=function(node,_142,_143,_144,_145){
if(!node.parentNode||String(node.parentNode.tagName).toLowerCase()!="body"){
dojo.body().appendChild(node);
}
var best,_147=Infinity;
_142=dojo.byId(_142);
var _148=_142.style.display;
_142.style.display="";
var _149=_142.offsetWidth;
var _14a=_142.offsetHeight;
var _14b=dojo.coords(_142,true);
_142.style.display=_148;
for(var _14c in _144){
var pos,_14e,_14f;
var _150=_144[_14c];
_14e=_14b.x+(_14c.charAt(1)=="L"?0:_149);
_14f=_14b.y+(_14c.charAt(0)=="T"?0:_14a);
pos=dijit.util.placeOnScreen(node,_14e,_14f,_143,true,_150,true);
if(pos.dist==0){
best=pos;
break;
}else{
if(_147>pos.dist){
_147=pos.dist;
best=pos;
}
}
}
if(!_145){
node.style.left=best.left+"px";
node.style.top=best.top+"px";
}
return best;
};
console.warn("dijit.dijit may dissapear in the 0.9 timeframe in lieu of a different rollup file!");
dojo.provide("dijit.dijit");
