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

if(typeof dojo=="undefined"){
(function(){
if(typeof this["djConfig"]=="undefined"){
this.djConfig={};
}
if((!this["console"])||(!console["firebug"])){
this.console={};
}
var cn=["assert","count","debug","dir","dirxml","error","group","groupEnd","info","log","profile","profileEnd","time","timeEnd","trace","warn"];
var i=0,tn;
while(tn=cn[i++]){
if(!console[tn]){
console[tn]=function(){
};
}
}
if(typeof this["dojo"]=="undefined"){
this.dojo={};
}
dojo.global=this;
var _4={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",preventBackButtonFix:true,delayMozLoadingFix:false};
for(var _5 in _4){
if(typeof djConfig[_5]=="undefined"){
djConfig[_5]=_4[_5];
}
}
var _6=["Browser","Rhino","Spidermonkey","Mobile"];
var t;
while(t=_6.shift()){
dojo["is"+t]=false;
}
})();
dojo.locale=djConfig.locale;
dojo.version={major:0,minor:0,patch:0,flag:"dev",revision:Number("$Rev: 8123 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo._getProp=function(_8,_9,_a){
var _b=_a||dojo.global;
for(var i=0,p;_b&&(p=_8[i]);i++){
_b=(p in _b?_b[p]:(_9?_b[p]={}:undefined));
}
return _b;
};
dojo.setObject=function(_e,_f,_10){
var _11=_e.split("."),p=_11.pop(),obj=dojo._getProp(_11,true,_10);
return (obj&&p?(obj[p]=_f):undefined);
};
dojo.getObject=function(_14,_15,_16){
return dojo._getProp(_14.split("."),_15,_16);
};
dojo.exists=function(_17,obj){
return Boolean(dojo.getObject(_17,false,obj));
};
dojo["eval"]=function(_19){
return dojo.global.eval?dojo.global.eval(_19):eval(_19);
};
dojo.deprecated=function(_1a,_1b,_1c){
var _1d="DEPRECATED: "+_1a;
if(_1b){
_1d+=" "+_1b;
}
if(_1c){
_1d+=" -- will be removed in version: "+_1c;
}
console.debug(_1d);
};
dojo.experimental=function(_1e,_1f){
var _20="EXPERIMENTAL: "+_1e;
_20+=" -- Not yet ready for use.  APIs subject to change without notice.";
if(_1f){
_20+=" "+_1f;
}
console.debug(_20);
};
dojo._getText=function(uri){
};
(function(){
var _22={_pkgFileName:"__package__",_loadedModules:{},_inFlightCount:0,_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_23){
var mp=this._modulePrefixes;
return Boolean(mp[_23]&&mp[_23].value);
},_getModulePrefix:function(_25){
var mp=this._modulePrefixes;
if(this._moduleHasPrefix(_25)){
return mp[_25].value;
}
return _25;
},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false};
for(var _27 in _22){
dojo[_27]=_22[_27];
}
})();
dojo._loadPath=function(_28,_29,cb){
var uri=(((_28.charAt(0)=="/"||_28.match(/^\w+:/)))?"":this.baseUrl)+_28;
if(djConfig.cacheBust&&dojo.isBrowser){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return !_29?this._loadUri(uri,cb):this._loadUriAndCheck(uri,_29,cb);
}
catch(e){
console.debug(e);
return false;
}
};
dojo._loadUri=function(uri,cb){
if(this._loadedUrls[uri]){
return true;
}
var _2e=this._getText(uri,true);
if(!_2e){
return false;
}
this._loadedUrls[uri]=true;
if(cb){
_2e="("+_2e+")";
}
var _2f=dojo["eval"]("//@ sourceURL="+uri+"\r\n"+_2e);
if(cb){
cb(_2f);
}
return true;
};
dojo._loadUriAndCheck=function(uri,_31,cb){
var ok=false;
try{
ok=this._loadUri(uri,cb);
}
catch(e){
console.debug("failed loading ",uri," with error: ",e);
}
return Boolean(ok&&this._loadedModules[_31]);
};
dojo.loaded=function(){
this._loadNotifying=true;
this._postLoad=true;
var mll=this._loaders;
for(var x=0;x<mll.length;x++){
mll[x]();
}
this._loaders=[];
this._loadNotifying=false;
};
dojo.unloaded=function(){
var mll=this._unloaders;
while(mll.length){
(mll.pop())();
}
};
dojo.addOnLoad=function(obj,_38){
var d=dojo;
if(arguments.length==1){
d._loaders.push(obj);
}else{
if(arguments.length>1){
d._loaders.push(function(){
obj[_38]();
});
}
}
if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){
d._callLoaded();
}
};
dojo.addOnUnload=function(obj,_3b){
var d=dojo;
if(arguments.length==1){
d._unloaders.push(obj);
}else{
if(arguments.length>1){
d._unloaders.push(function(){
obj[_3b]();
});
}
}
};
dojo._modulesLoaded=function(){
if(this._postLoad){
return;
}
if(this._inFlightCount>0){
console.debug("files still in flight!");
return;
}
dojo._callLoaded();
};
dojo._callLoaded=function(){
if(typeof setTimeout=="object"||(djConfig["useXDomain"]&&dojo.isOpera)){
setTimeout("dojo.loaded();",0);
}else{
dojo.loaded();
}
};
dojo._getModuleSymbols=function(_3d){
var _3e=_3d.split(".");
for(var i=_3e.length;i>0;i--){
var _40=_3e.slice(0,i).join(".");
if((i==1)&&!this._moduleHasPrefix(_40)){
_3e[0]="../"+_3e[0];
}else{
var _41=this._getModulePrefix(_40);
if(_41!=_40){
_3e.splice(0,i,_41);
break;
}
}
}
return _3e;
};
dojo._global_omit_module_check=false;
dojo._loadModule=function(_42,_43,_44){
_44=this._global_omit_module_check||_44;
var _45=this._loadedModules[_42];
if(_45){
return _45;
}
var _46=_42.split(".");
var _47=this._getModuleSymbols(_42);
var _48=((_47[0].charAt(0)!="/")&&!_47[0].match(/^\w+:/));
var _49=_47[_47.length-1];
var _4a;
if(_49=="*"){
_42=_46.slice(0,-1).join(".");
_47.pop();
_4a=_47.join("/")+"/"+this._pkgFileName+".js";
if(_48&&_4a.charAt(0)=="/"){
_4a=_4a.slice(1);
}
}else{
_4a=_47.join("/")+".js";
_42=_46.join(".");
}
var _4b=(!_44)?_42:null;
var ok=this._loadPath(_4a,_4b);
if((!ok)&&(!_44)){
throw new Error("Could not load '"+_42+"'; last tried '"+_4a+"'");
}
if((!_44)&&(!this["isXDomain"])){
_45=this._loadedModules[_42];
if(!_45){
throw new Error("symbol '"+_42+"' is not defined after loading '"+_4a+"'");
}
}
return _45;
};
dojo.require=dojo._loadModule;
dojo.provide=function(_4d){
var _4e=String(_4d);
var _4f=_4e;
var _50=_4d.split(/\./);
if(_50[_50.length-1]=="*"){
_50.pop();
_4f=_50.join(".");
}
var _51=dojo.getObject(_4f,true);
this._loadedModules[_4e]=_51;
this._loadedModules[_4f]=_51;
return _51;
};
dojo.platformRequire=function(_52){
var _53=_52["common"]||[];
var _54=_53.concat(_52[dojo._name]||_52["default"]||[]);
for(var x=0;x<_54.length;x++){
var _56=_54[x];
if(_56.constructor==Array){
dojo._loadModule.apply(dojo,_56);
}else{
dojo._loadModule(_56);
}
}
};
dojo.requireIf=function(_57,_58){
if(_57===true){
var _59=[];
for(var i=1;i<arguments.length;i++){
_59.push(arguments[i]);
}
dojo.require.apply(dojo,_59);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.registerModulePath=function(_5b,_5c){
this._modulePrefixes[_5b]={name:_5b,value:_5c};
};
if(djConfig["modulePaths"]){
for(var param in djConfig["modulePaths"]){
dojo.registerModulePath(param,djConfig["modulePaths"][param]);
}
}
dojo.requireLocalization=function(_5d,_5e,_5f,_60){
dojo.require("dojo.i18n");
dojo.i18n._requireLocalization.apply(dojo.hostenv,arguments);
};
(function(){
var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$");
var ire=new RegExp("^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$");
dojo._Url=function(){
var n=null;
var _a=arguments;
var uri=_a[0];
for(var i=1;i<_a.length;i++){
if(!_a[i]){
continue;
}
var _67=new dojo._Url(_a[i]+"");
var _68=new dojo._Url(uri+"");
if((_67.path=="")&&(!_67.scheme)&&(!_67.authority)&&(!_67.query)){
if(_67.fragment!=null){
_68.fragment=_67.fragment;
}
_67=_68;
}else{
if(_67.scheme==null){
_67.scheme=_68.scheme;
if(_67.authority==null){
_67.authority=_68.authority;
if(_67.path.charAt(0)!="/"){
var _69=_68.path.substring(0,_68.path.lastIndexOf("/")+1)+_67.path;
var _6a=_69.split("/");
for(var j=0;j<_6a.length;j++){
if(_6a[j]=="."){
if(j==_6a.length-1){
_6a[j]="";
}else{
_6a.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&_6a[0]=="")&&_6a[j]==".."&&_6a[j-1]!=".."){
if(j==(_6a.length-1)){
_6a.splice(j,1);
_6a[j-1]="";
}else{
_6a.splice(j-1,2);
j-=2;
}
}
}
}
_67.path=_6a.join("/");
}
}
}
}
uri="";
if(_67.scheme!=null){
uri+=_67.scheme+":";
}
if(_67.authority!=null){
uri+="//"+_67.authority;
}
uri+=_67.path;
if(_67.query!=null){
uri+="?"+_67.query;
}
if(_67.fragment!=null){
uri+="#"+_67.fragment;
}
}
this.uri=uri.toString();
var r=this.uri.match(ore);
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
r=this.authority.match(ire);
this.user=r[3]||null;
this.password=r[4]||null;
this.host=r[5];
this.port=r[7]||null;
}
};
dojo._Url.prototype.toString=function(){
return this.uri;
};
})();
dojo.moduleUrl=function(_6d,url){
var loc=dojo._getModuleSymbols(_6d).join("/");
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
var _70=loc.indexOf(":");
if(loc.charAt(0)!="/"&&(_70==-1||_70>loc.indexOf("/"))){
loc=dojo.baseUrl+loc;
}
return new dojo._Url(loc,url);
};
}
if(typeof window!="undefined"){
dojo.isBrowser=true;
dojo._name="browser";
(function(){
var d=dojo;
if(document&&document.getElementsByTagName){
var _72=document.getElementsByTagName("script");
var _73=/dojo\.js([\?\.]|$)/i;
for(var i=0;i<_72.length;i++){
var src=_72[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_73);
if(m){
if(!djConfig["baseUrl"]){
djConfig["baseUrl"]=src.substring(0,m.index);
}
var cfg=_72[i].getAttribute("djConfig");
if(cfg){
var _78=eval("({ "+cfg+" })");
for(var x in _78){
djConfig[x]=_78[x];
}
}
break;
}
}
}
d.baseUrl=djConfig["baseUrl"];
var n=navigator;
var dua=n.userAgent;
var dav=n.appVersion;
var tv=parseFloat(dav);
d.isOpera=(dua.indexOf("Opera")>=0)?tv:0;
d.isKhtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0)?tv:0;
d.isSafari=(dav.indexOf("Safari")>=0)?tv:0;
var _7e=dua.indexOf("Gecko");
d.isMozilla=d.isMoz=((_7e>=0)&&(!d.isKhtml))?tv:0;
d.isFF=0;
d.isIE=0;
try{
if(d.isMoz){
d.isFF=parseFloat(dua.split("Firefox/")[1].split(" ")[0]);
}
if((document.all)&&(!d.isOpera)){
d.isIE=parseFloat(dav.split("MSIE ")[1].split(";")[0]);
}
}
catch(e){
}
var cm=document["compatMode"];
d.isQuirks=(cm=="BackCompat")||(cm=="QuirksMode")||(d.isIE<6);
d.locale=djConfig.locale||(d.isIE?n.userLanguage:n.language).toLowerCase();
d._println=console.debug;
d._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
d._xhrObj=function(){
var _80=null;
var _81=null;
try{
_80=new XMLHttpRequest();
}
catch(e){
}
if(!_80){
for(var i=0;i<3;++i){
var _83=dojo._XMLHTTP_PROGIDS[i];
try{
_80=new ActiveXObject(_83);
}
catch(e){
_81=e;
}
if(_80){
dojo._XMLHTTP_PROGIDS=[_83];
break;
}
}
}
if(!_80){
throw new Error("XMLHTTP not available: "+_81);
}
return _80;
};
d._isDocumentOk=function(_84){
var _85=_84.status||0;
return ((_85>=200)&&(_85<300))||(_85==304)||(_85==1223)||(!_85&&(location.protocol=="file:"||location.protocol=="chrome:"));
};
d._getText=function(uri,_87){
var _88=this._xhrObj();
if(dojo._Url){
uri=(new dojo._Url(window.location,uri)).toString();
}
_88.open("GET",uri,false);
try{
_88.send(null);
if(!d._isDocumentOk(_88)){
var err=Error("Unable to load "+uri+" status:"+_88.status);
err.status=_88.status;
err.responseText=_88.responseText;
throw err;
}
}
catch(e){
if(_87){
return null;
}
throw e;
}
return _88.responseText;
};
})();
dojo._handleNodeEvent=function(_8a,_8b,fp){
var _8d=_8a["on"+_8b]||function(){
};
_8a["on"+_8b]=function(){
fp.apply(_8a,arguments);
_8d.apply(_8a,arguments);
};
return true;
};
dojo._initFired=false;
dojo._loadInit=function(e){
dojo._initFired=true;
var _8f=(e&&e.type)?e.type.toLowerCase():"load";
if(arguments.callee.initialized||(_8f!="domcontentloaded"&&_8f!="load")){
return;
}
arguments.callee.initialized=true;
if(typeof dojo["_khtmlTimer"]!="undefined"){
clearInterval(dojo._khtmlTimer);
delete dojo._khtmlTimer;
}
if(dojo._inFlightCount==0){
dojo._modulesLoaded();
}
};
if(document.addEventListener){
if(dojo.isOpera||(dojo.isMoz&&(djConfig["enableMozDomContentLoaded"]===true))){
document.addEventListener("DOMContentLoaded",dojo._loadInit,null);
}
window.addEventListener("load",dojo._loadInit,null);
}
if(dojo.isIE){
document.write("<scr"+"ipt defer src=\"//:\" "+"onreadystatechange=\"if(this.readyState=='complete'){dojo._loadInit();}\">"+"</scr"+"ipt>");
}
if(/(WebKit|khtml)/i.test(navigator.userAgent)){
dojo._khtmlTimer=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
dojo._loadInit();
}
},10);
}
if(dojo.isIE){
dojo._handleNodeEvent(window,"beforeunload",function(){
dojo._unloading=true;
window.setTimeout(function(){
dojo._unloading=false;
},0);
});
}
dojo._handleNodeEvent(window,"unload",function(){
if((!dojo.isIE)||(dojo.isIE&&dojo._unloading)){
dojo.unloaded();
}
});
try{
if(dojo.isIE){
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
document.createStyleSheet().addRule("v\\:*","behavior:url(#default#VML)");
}
}
catch(e){
}
dojo._writeIncludes=function(){
};
dojo.doc=window["document"]||null;
dojo.body=function(){
return dojo.doc.body||dojo.doc.getElementsByTagName("body")[0];
};
dojo.setContext=function(_90,_91){
dojo.global=_90;
dojo.doc=_91;
};
dojo._fireCallback=function(_92,_93,_94){
if((_93)&&((typeof _92=="string")||(_92 instanceof String))){
_92=_93[_92];
}
return (_93?_92.apply(_93,_94||[]):_92());
};
dojo.withGlobal=function(_95,_96,_97,_98){
var _99;
var _9a=dojo.global;
var _9b=dojo.doc;
try{
dojo.setContext(_95,_95.document);
_99=dojo._fireCallback(_96,_97,_98);
}
finally{
dojo.setContext(_9a,_9b);
}
return _99;
};
dojo.withDoc=function(_9c,_9d,_9e,_9f){
var _a0;
var _a1=dojo.doc;
try{
dojo.doc=_9c;
_a0=dojo._fireCallback(_9d,_9e,_9f);
}
finally{
dojo.doc=_a1;
}
return _a0;
};
}
if(djConfig.isDebug){
if(!console.firebug){
dojo.require("dojo._firebug.firebug");
}
}
dojo.provide("dojo._base.lang");
dojo.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.isArray=function(it){
return (it&&it instanceof Array||typeof it=="array"||((typeof dojo["NodeList"]!="undefined")&&(it instanceof dojo.NodeList)));
};
if(dojo.isBrowser&&dojo.isSafari){
dojo.isFunction=function(it){
if((typeof (it)=="function")&&(it=="[object NodeList]")){
return false;
}
return (typeof it=="function"||it instanceof Function);
};
}else{
dojo.isFunction=function(it){
return (typeof it=="function"||it instanceof Function);
};
}
dojo.isObject=function(it){
if(typeof it=="undefined"){
return false;
}
return (it===null||typeof it=="object"||dojo.isArray(it)||dojo.isFunction(it));
};
dojo.isArrayLike=function(it){
var d=dojo;
if((!it)||(typeof it=="undefined")){
return false;
}
if(d.isString(it)){
return false;
}
if(d.isFunction(it)){
return false;
}
if(d.isArray(it)){
return true;
}
if((it.tagName)&&(it.tagName.toLowerCase()=="form")){
return false;
}
if(isFinite(it.length)){
return true;
}
return false;
};
dojo.isAlien=function(it){
if(!it){
return false;
}
return !dojo.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo._mixin=function(obj,_ab){
var _ac={};
for(var x in _ab){
if((typeof _ac[x]=="undefined")||(_ac[x]!=_ab[x])){
obj[x]=_ab[x];
}
}
if(dojo.isIE&&(typeof (_ab["toString"])=="function")&&(_ab["toString"]!=obj["toString"])&&(_ab["toString"]!=_ac["toString"])){
obj.toString=_ab.toString;
}
return obj;
};
dojo.mixin=function(obj,_af){
for(var i=1,l=arguments.length;i<l;i++){
dojo._mixin(obj,arguments[i]);
}
return obj;
};
dojo.extend=function(_b2,_b3){
for(var i=1,l=arguments.length;i<l;i++){
dojo._mixin(_b2.prototype,arguments[i]);
}
return _b2;
};
dojo._hitchArgs=function(_b6,_b7){
var pre=dojo._toArray(arguments,2);
var _b9=dojo.isString(_b7);
return function(){
var _ba=dojo._toArray(arguments);
var f=(_b9?(_b6||dojo.global)[_b7]:_b7);
return (f)&&(f.apply(_b6||this,pre.concat(_ba)));
};
};
dojo.hitch=function(_bc,_bd){
if(arguments.length>2){
return dojo._hitchArgs.apply(dojo,arguments);
}
if(!_bd){
_bd=_bc;
_bc=null;
}
if(dojo.isString(_bd)){
_bc=_bc||dojo.global;
if(!_bc[_bd]){
throw (["dojo.hitch: scope[\"",_bd,"\"] is null (scope=\"",_bc,"\")"].join(""));
}
return function(){
return _bc[_bd].apply(_bc,arguments||[]);
};
}else{
return (!_bc?_bd:function(){
return _bd.apply(_bc,arguments||[]);
});
}
};
dojo._delegate=function(obj,_bf){
function TMP(){
};
TMP.prototype=obj;
var tmp=new TMP();
if(_bf){
dojo.mixin(tmp,_bf);
}
return tmp;
};
dojo.partial=function(_c1){
var arr=[null];
return dojo.hitch.apply(dojo,arr.concat(dojo._toArray(arguments)));
};
dojo._toArray=function(obj,_c4){
var arr=[];
for(var x=_c4||0;x<obj.length;x++){
arr.push(obj[x]);
}
return arr;
};
dojo.provide("dojo._base.declare");
dojo.declare=function(_c7,_c8,_c9,_ca){
if(dojo.isFunction(_ca)||(!_ca&&!dojo.isFunction(_c9))){
var t=_ca;
_ca=_c9;
_c9=t;
}
var _cc=function(){
this._construct(arguments);
};
var dd=dojo.declare,p=_ca||{},_cf=[],pc;
if(dojo.isArray(_c8)){
_cf=_c8;
_c8=_cf.shift();
}
var scp=_c8?_c8.prototype:null;
if(scp){
_cc.prototype=dojo._delegate(scp);
}
dojo.mixin(_cc,{superclass:scp,mixins:_cf,extend:dd._extend});
for(var i=0,m;(m=_cf[i]);i++){
dojo.extend(_cc,m.prototype);
}
_c9=_c9||(pc=p.constructor)&&(pc!=Object)&&pc||null;
dojo.extend(_cc,{declaredClass:_c7,_initializer:_c9,preamble:null},p,dd._core);
_cc.prototype.constructor=_cc;
return dojo.setObject(_c7,_cc);
};
dojo.mixin(dojo.declare,{_extend:function(_d4,_d5){
dojo.extend(this,_d4);
this.mixins.push(!_d5?_d4:function(){
_d4.apply(this,_d5.apply(this,arguments)||arguments);
});
},_core:{_construct:function(_d6){
var c=_d6.callee,s=c.superclass,ct=s&&s.constructor,a=_d6,ii;
if(fn=c.prototype.preamble){
a=fn.apply(this,a)||a;
}
if(ct&&ct.apply){
ct.apply(this,a);
}
for(var i=0,m;(m=c.mixins[i]);i++){
if(m.apply){
m.apply(this,a);
}
}
var ii=c.prototype._initializer;
if(ii){
ii.apply(this,_d6);
}
},inherited:function(_de,_df,_e0){
var c=_df.callee,p=this.constructor.prototype,a=_e0||_df,fn;
if(this[_de]!=c||p[_de]==c){
while(p&&(p[_de]!==c)){
p=p.constructor.superclass;
}
if(!p){
throw (this.toString()+": name argument (\""+_de+"\") to inherited must match callee (declare.js)");
}
while(p&&(p[_de]==c)){
p=p.constructor.superclass;
}
}
return (fn=p&&p[_de])&&(fn.apply(this,a));
}}});
dojo.provide("dojo._base.connect");
dojo._listener={getDispatcher:function(){
return function(){
var ls=arguments.callee.listeners;
for(var i in ls){
if(!(i in Array.prototype)){
ls[i].apply(this,arguments);
}
}
};
},add:function(_e7,_e8,_e9){
_e7=_e7||dojo.global;
var f=_e7[_e8];
if(!f||!f.listeners){
var d=dojo._listener.getDispatcher();
d.listeners=(f?[f]:[]);
f=_e7[_e8]=d;
}
return f.listeners.push(_e9);
},remove:function(_ec,_ed,_ee){
var f=(_ec||dojo.global)[_ed];
if(f&&f.listeners&&_ee--){
delete f.listeners[_ee];
}
}};
dojo.connect=function(obj,_f1,_f2,_f3,_f4){
var a=arguments,_f6=[],i=0;
_f6.push(dojo.isString(a[0])?null:a[i++],a[i++]);
var a1=a[i+1];
_f6.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);
for(var l=a.length;i<l;i++){
_f6.push(a[i]);
}
return dojo._connect.apply(this,_f6);
};
dojo._connect=function(obj,_fb,_fc,_fd){
var h=dojo._listener.add(obj,_fb,dojo.hitch(_fc,_fd));
return [obj,_fb,h];
};
dojo.disconnect=function(_ff){
dojo._disconnect.apply(this,_ff);
if(_ff&&_ff[0]!=undefined){
dojo._disconnect.apply(this,_ff);
delete _ff[0];
}
};
dojo._disconnect=function(obj,_101,_102){
dojo._listener.remove(obj,_101,_102);
};
dojo._topics={};
dojo.subscribe=function(_103,_104,_105){
return dojo._listener.add(dojo._topics,_103,dojo.hitch(_104,_105));
};
dojo.unsubscribe=function(_106,_107){
dojo._listener.remove(dojo._topics,_106,_107);
};
dojo.publish=function(_108,args){
var f=dojo._topics[_108];
(f)&&(f.apply(this,args||[]));
};
dojo.provide("dojo._base.Deferred");
dojo.Deferred=function(_10b){
this.chain=[];
this.id=this._nextId();
this.fired=-1;
this.paused=0;
this.results=[null,null];
this.canceller=_10b;
this.silentlyCancelled=false;
};
dojo.extend(dojo.Deferred,{_getFunctionFromArgs:function(){
var a=arguments;
if((a[0])&&(!a[1])){
if(dojo.isFunction(a[0])){
return a[0];
}else{
if(dojo.isString(a[0])){
return dojo.global[a[0]];
}
}
}else{
if((a[0])&&(a[1])){
return dojo.hitch(a[0],a[1]);
}
}
return null;
},makeCalled:function(){
var _10d=new dojo.Deferred();
_10d.callback();
return _10d;
},toString:function(){
var _10e;
if(this.fired==-1){
_10e="unfired";
}else{
if(this.fired==0){
_10e="success";
}else{
_10e="error";
}
}
return "Deferred("+this.id+", "+_10e+")";
},_nextId:(function(){
var n=1;
return function(){
return n++;
};
})(),cancel:function(){
if(this.fired==-1){
if(this.canceller){
this.canceller(this);
}else{
this.silentlyCancelled=true;
}
if(this.fired==-1){
this.errback(new Error(this.toString()));
}
}else{
if((this.fired==0)&&(this.results[0] instanceof dojo.Deferred)){
this.results[0].cancel();
}
}
},_pause:function(){
this.paused++;
},_unpause:function(){
this.paused--;
if((this.paused==0)&&(this.fired>=0)){
this._fire();
}
},_continue:function(res){
this._resback(res);
this._unpause();
},_resback:function(res){
this.fired=((res instanceof Error)?1:0);
this.results[this.fired]=res;
this._fire();
},_check:function(){
if(this.fired!=-1){
if(!this.silentlyCancelled){
throw new Error("already called!");
}
this.silentlyCancelled=false;
return;
}
},callback:function(res){
this._check();
this._resback(res);
},errback:function(res){
this._check();
if(!(res instanceof Error)){
res=new Error(res);
}
this._resback(res);
},addBoth:function(cb,cbfn){
var _116=this._getFunctionFromArgs(cb,cbfn);
if(arguments.length>2){
_116=dojo.partial(_116,arguments,2);
}
return this.addCallbacks(_116,_116);
},addCallback:function(cb,cbfn){
var _119=this._getFunctionFromArgs(cb,cbfn);
if(arguments.length>2){
_119=dojo.partial(_119,arguments,2);
}
return this.addCallbacks(_119,null);
},addErrback:function(cb,cbfn){
var _11c=this._getFunctionFromArgs(cb,cbfn);
if(arguments.length>2){
_11c=dojo.partial(_11c,arguments,2);
}
return this.addCallbacks(null,_11c);
return this.addCallbacks(null,cbfn);
},addCallbacks:function(cb,eb){
this.chain.push([cb,eb]);
if(this.fired>=0){
this._fire();
}
return this;
},_fire:function(){
var _11f=this.chain;
var _120=this.fired;
var res=this.results[_120];
var self=this;
var cb=null;
while((_11f.length>0)&&(this.paused==0)){
var pair=_11f.shift();
var f=pair[_120];
if(f==null){
continue;
}
try{
res=f(res);
_120=((res instanceof Error)?1:0);
if(res instanceof dojo.Deferred){
cb=function(res){
self._continue(res);
};
this._pause();
}
}
catch(err){
_120=1;
res=err;
}
}
this.fired=_120;
this.results[_120]=res;
if((cb)&&(this.paused)){
res.addBoth(cb);
}
}});
dojo.provide("dojo._base.json");
dojo.fromJson=function(json){
try{
return eval("("+json+")");
}
catch(e){
console.debug(e);
return json;
}
};
dojo._escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.toJsonIndentStr="\t";
dojo.toJson=function(it,_12a,_12b){
_12b=_12b||"";
var _12c=(_12a?_12b+dojo.toJsonIndentStr:"");
var _12d=(_12a?"\n":"");
var _12e=typeof (it);
if(_12e=="undefined"){
return "undefined";
}else{
if((_12e=="number")||(_12e=="boolean")){
return it+"";
}else{
if(it===null){
return "null";
}
}
}
if(_12e=="string"){
return dojo._escapeString(it);
}
var _12f=arguments.callee;
var _130;
if(typeof it.__json__=="function"){
_130=it.__json__();
if(it!==_130){
return _12f(_130,_12a,_12c);
}
}
if(typeof it.json=="function"){
_130=it.json();
if(it!==_130){
return _12f(_130,_12a,_12c);
}
}
if(dojo.isArray(it)){
var res=[];
for(var i=0;i<it.length;i++){
var val=_12f(it[i],_12a,_12c);
if(typeof (val)!="string"){
val="undefined";
}
res.push(_12d+_12c+val);
}
return "["+res.join(",")+_12d+_12b+"]";
}
if(_12e=="function"){
return null;
}
var _134=[];
for(var key in it){
var _136;
if(typeof (key)=="number"){
_136="\""+key+"\"";
}else{
if(typeof (key)=="string"){
_136=dojo._escapeString(key);
}else{
continue;
}
}
val=_12f(it[key],_12a,_12c);
if(typeof (val)!="string"){
continue;
}
_134.push(_12d+_12c+_136+":"+val);
}
return "{"+_134.join(",")+_12d+_12b+"}";
};
dojo.provide("dojo._base.array");
(function(){
var d=dojo;
if(Array.forEach){
var tn=["indexOf","lastIndexOf","every","some","forEach","filter","map"];
for(var x=0;x<tn.length;x++){
d[tn[x]]=Array[tn[x]];
}
}else{
var _13a=function(arr,obj){
return [(d.isString(arr)?arr.split(""):arr),(obj||d.global)];
};
d.mixin(d,{indexOf:function(_13d,_13e,_13f,_140){
if(_140){
var step=-1,i=(_13f||_13d.length-1),end=-1;
}else{
var step=1,i=(_13f||0),end=_13d.length;
}
for(;i!=end;i+=step){
if(_13d[i]==_13e){
return i;
}
}
return -1;
},lastIndexOf:function(_144,_145,_146){
return d.indexOf(_144,_145,_146,true);
},map:function(arr,func,obj){
var _p=_13a(arr,obj);
arr=_p[0];
obj=_p[1];
var _14b=[];
for(var i=0;i<arr.length;++i){
_14b.push(func.call(obj,arr[i]));
}
return _14b;
},forEach:function(arr,_14e,obj){
if((!arr)||(!arr.length)){
return;
}
var _p=_13a(arr,obj);
arr=_p[0];
obj=_p[1];
for(var i=0,l=arr.length;i<l;i++){
_14e.call(obj,arr[i],i,arr);
}
},_everyOrSome:function(_153,arr,_155,obj){
var _p=_13a(arr,obj);
arr=_p[0];
obj=_p[1];
for(var i=0,l=arr.length;i<l;i++){
var _15a=_155.call(obj,arr[i],i,arr);
if(_153&&!_15a){
return false;
}else{
if((!_153)&&(_15a)){
return true;
}
}
}
return (!!_153);
},every:function(arr,_15c,_15d){
return this._everyOrSome(true,arr,_15c,_15d);
},some:function(arr,_15f,_160){
return this._everyOrSome(false,arr,_15f,_160);
},filter:function(arr,_162,obj){
var _p=_13a(arr,obj);
arr=_p[0];
obj=_p[1];
var _165=[];
for(var i=0;i<arr.length;i++){
if(_162.call(obj,arr[i],i,arr)){
_165.push(arr[i]);
}
}
return _165;
}});
}
})();
dojo.provide("dojo._base");
dojo.provide("dojo._base.event");
(function(){
var de={addListener:function(node,_169,fp){
if(!node){
return;
}
_169=de._normalizeEventName(_169);
fp=de._fixCallback(_169,fp);
node.addEventListener(_169,fp,false);
return fp;
},removeListener:function(node,_16c,_16d){
(node)&&(node.removeEventListener(de._normalizeEventName(_16c),_16d,false));
},_normalizeEventName:function(name){
return (name.slice(0,2)=="on"?name.slice(2):name);
},_fixCallback:function(name,fp){
return (name!="keypress"?fp:function(e){
return fp.call(this,de._fixEvent(e,this));
});
},_fixEvent:function(evt,_173){
switch(evt.type){
case "keypress":
de._setKeyChar(evt);
break;
}
return evt;
},_setKeyChar:function(evt){
evt.keyChar=(evt.charCode?String.fromCharCode(evt.charCode):"");
}};
dojo.addListener=function(node,_176,_177,_178){
return de.addListener(node,_176,dojo.hitch(_177,_178));
};
dojo.removeListener=function(node,_17a,_17b){
de.removeListener(node,_17a,_17b);
};
dojo.fixEvent=function(evt,_17d){
return de._fixEvent(evt,_17d);
};
dojo.stopEvent=function(evt){
evt.preventDefault();
evt.stopPropagation();
};
var dc=dojo._connect;
var dd=dojo._disconnect;
dojo._connect=function(obj,_182,_183,_184,_185){
_185=Boolean(!obj||!(obj.nodeType||obj.attachEvent||obj.addEventListener)||_185);
var h=(_185?dc.apply(this,arguments):[obj,_182,dojo.addListener.apply(this,arguments)]);
h.push(_185);
return h;
};
dojo._disconnect=function(obj,_188,_189,_18a){
(_18a?dd:dojo.removeListener).apply(this,arguments);
};
dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145};
if(dojo.isIE){
_trySetKeyCode=function(e,code){
try{
return e.keyCode=code;
}
catch(e){
return 0;
}
};
var ap=Array.prototype;
var iel=dojo._listener;
if((dojo.isIE<7)&&(!djConfig._allow_leaks)){
iel=dojo._ie_listener={handlers:[],add:function(_18f,_190,_191){
_18f=_18f||dojo.global;
var f=d=_18f[_190];
if(!d||!d.listeners){
d=_18f[_190]=dojo._getIeDispatcher();
d.listeners=(f?[ieh.push(f)-1]:[]);
}
return d.listeners.push(ieh.push(_191)-1);
},remove:function(_194,_195,_196){
var f=(_194||dojo.global)[_195],l=f&&f.listeners;
if(f&&l&&_196--){
delete ieh[l[_196]];
delete l[_196];
}
}};
var ieh=iel.handlers;
}
dojo.mixin(de,{addListener:function(node,_19a,fp){
if(!node){
return;
}
_19a=de._normalizeEventName(_19a);
if(_19a=="onkeypress"){
var kd=node.onkeydown;
if(!kd||!kd.listeners||!kd._stealthKeydown){
de.addListener(node,"onkeydown",de._stealthKeyDown);
node.onkeydown._stealthKeydown=true;
}
}
return iel.add(node,_19a,de._fixCallback(fp,node));
},removeListener:function(node,_19e,_19f){
iel.remove(node,de._normalizeEventName(_19e),_19f);
},_normalizeEventName:function(_1a0){
return (_1a0.slice(0,2)!="on"?"on"+_1a0:_1a0);
},_nop:function(){
},_fixCallback:function(fp,_1a2){
return function(e){
return fp.call(this,de._fixEvent(e,_1a2));
};
},_fixEvent:function(evt,_1a5){
if(!evt){
var w=(_1a5)&&((_1a5.ownerDocument||_1a5.document||_1a5).parentWindow)||window;
evt=w.event;
}
evt.target=evt.srcElement;
evt.currentTarget=(_1a5||evt.srcElement);
evt.layerX=evt.offsetX;
evt.layerY=evt.offsetY;
var se=evt.srcElement,doc=(se&&se.ownerDocument)||document;
var _1a9=((dojo.isIE<6)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;
evt.pageX=evt.clientX+(_1a9.scrollLeft||0);
evt.pageY=evt.clientY+(_1a9.scrollTop||0);
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
evt.relatedTarget=evt.toElement;
}
evt.stopPropagation=this._stopPropagation;
evt.preventDefault=this._preventDefault;
return this._fixKeys(evt);
},_fixKeys:function(evt){
switch(evt.type){
case "keypress":
var c=("charCode" in evt?evt.charCode:evt.keyCode);
if(c==10){
c=0;
evt.keyCode=13;
}else{
if(c==13||c==27){
c=0;
}else{
if(c==3){
c=99;
}
}
}
evt.charCode=c;
de._setKeyChar(evt);
break;
}
return evt;
},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},_stealthKeyDown:function(evt){
var kp=evt.currentTarget.onkeypress;
if(!kp||!kp.listeners){
return;
}
var k=evt.keyCode;
var _1af=(k!=13)&&(k!=32)&&(k!=27)&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);
if(_1af||evt.ctrlKey){
var c=(_1af?0:k);
if(evt.ctrlKey){
if(k==3||k==13){
return;
}else{
if(c>95&&c<106){
c-=48;
}else{
if((!evt.shiftKey)&&(c>=65&&c<=90)){
c+=32;
}else{
c=de._punctMap[c]||c;
}
}
}
}
var faux=de._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});
kp.call(evt.currentTarget,faux);
evt.cancelBubble=faux.cancelBubble;
evt.returnValue=faux.returnValue;
_trySetKeyCode(evt,faux.keyCode);
}
},_stopPropagation:function(){
this.cancelBubble=true;
},_preventDefault:function(){
_trySetKeyCode(this,0);
this.returnValue=false;
}});
dojo.stopEvent=function(evt){
evt=evt||window.event;
de._stopPropagation.call(evt);
de._preventDefault.call(evt);
};
}
de._synthesizeEvent=function(evt,_1b4){
var faux=dojo.mixin({},evt,_1b4);
de._setKeyChar(faux);
faux.preventDefault=function(){
evt.preventDefault();
};
faux.stopPropagation=function(){
evt.stopPropagation();
};
return faux;
};
if(dojo.isOpera){
dojo.mixin(de,{_fixEvent:function(evt,_1b7){
switch(evt.type){
case "keypress":
var c=evt.which;
if(c==3){
c=99;
}
c=((c<41)&&(!evt.shiftKey)?0:c);
if((evt.ctrlKey)&&(!evt.shiftKey)&&(c>=65)&&(c<=90)){
c+=32;
}
return de._synthesizeEvent(evt,{charCode:c});
}
return evt;
}});
}
if(dojo.isSafari){
dojo.mixin(de,{_fixEvent:function(evt,_1ba){
switch(evt.type){
case "keypress":
var c=evt.charCode,s=evt.shiftKey;
if(evt.keyIdentifier=="Enter"){
c=0;
}else{
if((evt.ctrlKey)&&(c>0)&&(c<27)){
c+=96;
}else{
if(c==dojo.keys.SHIFT_TAB){
c=dojo.keys.TAB;
s=true;
}else{
c=(c>=32&&c<63232?c:0);
}
}
}
return de._synthesizeEvent(evt,{charCode:c,shiftKey:s});
}
return evt;
}});
dojo.mixin(dojo.keys,{SHIFT_TAB:25,UP_ARROW:63232,DOWN_ARROW:63233,LEFT_ARROW:63234,RIGHT_ARROW:63235,F1:63236,F2:63237,F3:63238,F4:63239,F5:63240,F6:63241,F7:63242,F8:63243,F9:63244,F10:63245,F11:63246,F12:63247,PAUSE:63250,DELETE:63272,HOME:63273,END:63275,PAGE_UP:63276,PAGE_DOWN:63277,INSERT:63302,PRINT_SCREEN:63248,SCROLL_LOCK:63249,NUM_LOCK:63289});
}
})();
if(dojo.isIE<7){
dojo._getIeDispatcher=function(){
return function(){
var ap=Array.prototype,ls=arguments.callee.listeners,h=dojo._ie_listener.handlers;
for(var i in ls){
if(!(i in ap)){
h[ls[i]].apply(this,arguments);
}
}
};
};
}
dojo.provide("dojo._base.html");
try{
document.execCommand("BackgroundImageCache",false,true);
}
catch(e){
}
dojo.createElement=function(obj,_1c2,_1c3){
};
if(dojo.isIE&&(dojo.isIE<7)){
dojo.byId=function(id,doc){
if(dojo.isString(id)){
var _d=(doc||dojo.doc);
var te=_d.getElementById(id);
if((te)&&(te.id==id)){
return te;
}else{
var eles=_d.all[id];
if(!eles){
return;
}
if(!eles.length){
return eles;
}
var i=0;
while(te=eles[i++]){
if(te.id==id){
return te;
}
}
}
}else{
return id;
}
};
}else{
dojo.byId=function(id,doc){
if(dojo.isString(id)){
return (doc||dojo.doc).getElementById(id);
}else{
return id;
}
};
}
(function(){
var _1cc=function(node,ref){
ref.parentNode.insertBefore(node,ref);
return true;
};
var _1cf=function(node,ref){
var pn=ref.parentNode;
if(ref==pn.lastChild){
pn.appendChild(node);
}else{
return _1cc(node,ref.nextSibling);
}
return true;
};
dojo.place=function(node,_1d4,_1d5){
if((!node)||(!_1d4)||(typeof _1d5=="undefined")){
return false;
}
if(typeof _1d5=="number"){
var cn=_1d4.childNodes;
if(((_1d5==0)&&(cn.length==0))||(cn.length==_1d5)){
_1d4.appendChild(node);
return true;
}
if(_1d5==0){
return _1cc(node,_1d4.firstChild);
}
return _1cf(node,cn[_1d5-1]);
}
switch(_1d5.toLowerCase()){
case "before":
return _1cc(node,_1d4);
case "after":
return _1cf(node,_1d4);
case "first":
if(_1d4.firstChild){
return _1cc(node,_1d4.firstChild);
}else{
_1d4.appendChild(node);
return true;
}
break;
default:
_1d4.appendChild(node);
return true;
}
};
dojo.boxModel="content-box";
if(dojo.isIE){
var _dcm=document.compatMode;
dojo.boxModel=(_dcm=="BackCompat")||(_dcm=="QuirksMode")||(dojo.isIE<6)?"border-box":"content-box";
}
if(!dojo.isIE){
var dv=document.defaultView;
dojo.getComputedStyle=((dojo.isSafari)?function(node){
var s=dv.getComputedStyle(node,null);
if(!s){
node.style.display="";
s=dv.getComputedStyle(node,null);
}
return s;
}:function(node){
return dv.getComputedStyle(node,null);
});
dojo._toPixelValue=function(_1dc,_1dd){
return (parseFloat(_1dd)||0);
};
}else{
dojo.getComputedStyle=function(node){
return node.currentStyle;
};
dojo._toPixelValue=function(_1df,_1e0){
if(!_1e0){
return 0;
}
if(_1e0.slice&&(_1e0.slice(-2)=="px")){
return parseFloat(_1e0);
}
with(_1df){
var _1e1=style.left;
var _1e2=runtimeStyle.left;
runtimeStyle.left=currentStyle.left;
try{
style.left=_1e0;
_1e0=style.pixelLeft;
}
catch(e){
_1e0=0;
}
style.left=_1e1;
runtimeStyle.left=_1e2;
}
return _1e0;
};
}
dojo._getOpacity=((dojo.isIE)?function(node){
try{
return (node.filters.alpha.opacity/100);
}
catch(e){
return 1;
}
}:function(node){
return node.style.opacity;
});
dojo._setOpacity=((dojo.isIE)?function(node,_1e6){
var o="Alpha(Opacity="+(_1e6*100)+")";
node.style.filter=o;
if(node.nodeName.toLowerCase=="tr"){
dojo.query("> td",node).forEach(function(i){
i.style.filter=o;
});
}
return _1e6;
}:function(node,_1ea){
node.style.opacity=_1ea;
});
var _1eb={width:true,height:true,left:true,top:true};
var _1ec=function(node,type,_1ef){
if(_1eb[type]===true){
return dojo._toPixelValue(node,_1ef);
}else{
if(_1eb[type]===false){
return _1ef;
}else{
type=type.toLowerCase();
if((type.indexOf("margin")>=0)||(type.indexOf("padding")>=0)||(type.indexOf("width")>=0)||(type.indexOf("height")>=0)||(type.indexOf("max")>=0)||(type.indexOf("min")>=0)||(type.indexOf("offset")>=0)){
_1eb[type]=true;
return dojo._toPixelValue(node,_1ef);
}else{
_1eb[type]=false;
return _1ef;
}
}
}
};
dojo.style=function(){
var _a=arguments;
var _a_l=_a.length;
if(!_a_l){
return;
}
var node=dojo.byId(_a[0]);
var io=((dojo.isIE)&&(_a[1]=="opacity"));
if(_a_l==3){
return (io)?dojo._setOpacity(node,_a[2]):node.style[_a[1]]=_a[2];
}
var s=dojo.getComputedStyle(node);
if(_a_l==1){
return s;
}
if(_a_l==2){
return (io)?dojo._getOpacity(node):_1ec(node,_a[1],s[_a[1]]);
}
};
dojo._getPadBounds=function(n,_1f6){
var s=_1f6||dojo.getComputedStyle(n),px=dojo._toPixelValue,l=px(n,s.paddingLeft),t=px(n,s.paddingTop);
return {l:l,t:t,w:l+px(n,s.paddingRight),h:t+px(n,s.paddingBottom)};
};
dojo._getPadBorderExtents=function(n,_1fc){
var s=_1fc||dojo.getComputedStyle(n),px=dojo._toPixelValue,p=dojo._getPadBounds(n,s),bw=(s.borderLeftStyle!="none"?px(n,s.borderLeftWidth):0)+(s.borderRightStyle!="none"?px(n,s.borderRightWidth):0),bh=(s.borderTopStyle!="none"?px(n,s.borderTopWidth):0)+(s.borderBottomStyle!="none"?px(n,s.borderBottomWidth):0);
return {w:p.w+bw,h:p.h+bh};
};
dojo._getMarginExtents=function(n,_203){
var s=_203||dojo.getComputedStyle(n),px=dojo._toPixelValue;
return {w:px(n,s.marginLeft)+px(n,s.marginRight),h:px(n,s.marginTop)+px(n,s.marginBottom)};
};
if(dojo.isMoz){
dojo._getMarginBox=function(node,_207){
var s=_207||dojo.getComputedStyle(node);
var mb=dojo._getMarginExtents(node,s);
return {l:parseFloat(s.left)||0,t:parseFloat(s.top)||0,w:node.offsetWidth+mb.w,h:node.offsetHeight+mb.h};
};
}else{
dojo._getMarginBox=function(node,_20b){
var mb=dojo._getMarginExtents(node,_20b);
return {l:node.offsetLeft,t:node.offsetTop,w:node.offsetWidth+mb.w,h:node.offsetHeight+mb.h};
};
}
dojo._getContentBox=function(node,_20e){
var pb=dojo._getPadBounds(node,_20e);
return {l:pb.l,t:pb.t,w:node.clientWidth-pb.w,h:node.clientHeight-pb.h};
};
dojo._setBox=function(node,l,t,w,h,u){
u=u||"px";
with(node.style){
if(!isNaN(l)){
left=l+u;
}
if(!isNaN(t)){
top=t+u;
}
if(w>=0){
width=w+u;
}
if(h>=0){
height=h+u;
}
}
};
dojo._setContentBox=function(node,_217,_218,_219,_21a,_21b){
if(dojo.boxModel=="border-box"){
var pb=dojo._getPadBorderExtents(node,_21b);
if(_219>=0){
_219+=pb.w;
}
if(_21a>=0){
_21a+=pb.h;
}
}
dojo._setBox(node,_217,_218,_219,_21a);
};
dojo._nilExtents={w:0,h:0};
dojo._setMarginBox=function(node,_21e,_21f,_220,_221,_222){
var s=_222||dojo.getComputedStyle(node);
var pb=((dojo.boxModel=="border-box")?dojo._nilExtents:dojo._getPadBorderExtents(node,s));
var mb=dojo._getMarginExtents(node,s);
if(_220>=0){
_220=Math.max(_220-pb.w-mb.w,0);
}
if(_221>=0){
_221=Math.max(_221-pb.h-mb.h,0);
}
dojo._setBox(node,_21e,_21f,_220,_221);
};
dojo.marginBox=function(node,_227){
node=dojo.byId(node);
var s=dojo.getComputedStyle(node),b=_227;
return !b?dojo._getMarginBox(node,s):dojo._setMarginBox(node,b.l,b.t,b.w,b.h,s);
};
dojo.contentBox=function(node,_22b){
node=dojo.byId(node);
var s=dojo.getComputedStyle(node),b=_22b;
return !b?dojo._getContentBox(node,s):dojo._setContentBox(node,b.l,b.t,b.w,b.h,s);
};
var _22e=function(node,prop){
if(!node){
return 0;
}
var _b=dojo.body();
var _232=0;
while(node){
try{
if(dojo.getComputedStyle(node).position=="fixed"){
return 0;
}
}
catch(e){
}
var val=node[prop];
if(val){
_232+=val-0;
if(node==_b){
break;
}
}
node=node.parentNode;
}
return _232;
};
dojo._docScroll=function(){
var _b=dojo.body();
var _w=dojo.global;
var de=dojo.doc.documentElement;
return {y:(_w.pageYOffset||de.scrollTop||_b.scrollTop||0),x:(_w.pageXOffset||de.scrollLeft||_b.scrollLeft||0)};
};
var _237=((dojo.isIE>=7)&&(dojo.boxModel!="border-box"))?2:0;
dojo._abs=function(node,_239){
var _23a=dojo.doc;
var ret={x:0,y:0};
var db=dojo.body();
if(dojo.isIE){
with(node.getBoundingClientRect()){
ret.x=left-_237;
ret.y=top-_237;
}
}else{
if(_23a["getBoxObjectFor"]){
var bo=_23a.getBoxObjectFor(node);
ret.x=bo.x-_22e(node,"scrollLeft");
ret.y=bo.y-_22e(node,"scrollTop");
}else{
if(node["offsetParent"]){
var _23e;
if((dojo.isSafari)&&(node.style.getPropertyValue("position")=="absolute")&&(node.parentNode==db)){
_23e=db;
}else{
_23e=db.parentNode;
}
if(node.parentNode!=db){
var nd=node;
if(dojo.isOpera){
nd=db;
}
ret.x-=_22e(nd,"scrollLeft");
ret.y-=_22e(nd,"scrollTop");
}
var _240=node;
do{
var n=_240["offsetLeft"];
if(!dojo.isOpera||n>0){
ret.x+=isNaN(n)?0:n;
}
var m=_240["offsetTop"];
ret.y+=isNaN(m)?0:m;
_240=_240.offsetParent;
}while((_240!=_23e)&&(_240!=null));
}else{
if(node["x"]&&node["y"]){
ret.x+=isNaN(node.x)?0:node.x;
ret.y+=isNaN(node.y)?0:node.y;
}
}
}
}
if(_239){
var _243=dojo._docScroll();
ret.y+=_243.y;
ret.x+=_243.x;
}
return ret;
};
dojo.coords=function(node,_245){
node=dojo.byId(node);
var s=dojo.getComputedStyle(node);
var mb=dojo._getMarginBox(node,s);
var abs=dojo._abs(node,_245);
mb.x=abs.x;
mb.y=abs.y;
return mb;
};
})();
dojo.hasClass=function(node,_24a){
return ((" "+node.className+" ").indexOf(" "+_24a+" ")>=0);
};
dojo.addClass=function(node,_24c){
var cls=node.className;
if((" "+cls+" ").indexOf(" "+_24c+" ")<0){
node.className=cls+(cls?" ":"")+_24c;
}
};
dojo.removeClass=function(node,_24f){
var cls=node.className;
if(cls&&cls.indexOf(_24f)>=0){
node.className=cls.replace(new RegExp("(^|\\s+)"+_24f+"(\\s+|$)"),"$1$2");
}
};
dojo.toggleClass=function(node,_252,_253){
if(typeof _253=="undefined"){
_253=!dojo.hasClass(node,_252);
}
dojo[_253?"addClass":"removeClass"](node,_252);
};
dojo.provide("dojo._base.NodeList");
(function(){
var d=dojo;
dojo.NodeList=function(){
if((arguments.length==1)&&(typeof arguments[0]=="number")){
this.length=parseInt(arguments[0]);
}else{
if((arguments.length==1)&&(arguments[0].constructor==dojo.NodeList)){
}else{
for(var x=0;x<arguments.length;x++){
this.push(arguments[x]);
}
}
}
};
dojo.NodeList.prototype=new Array;
dojo.extend(dojo.NodeList,{box:function(){
return dojo.coords(this[0]);
},boxes:function(){
var ret=[];
this.forEach(function(item){
ret.push(dojo.coords(item));
});
return ret;
},style:function(prop){
var aa=dojo._toArray(arguments);
aa.unshift(this[0]);
return dojo.style.apply(dojo,aa);
},styles:function(prop){
var aa=dojo._toArray(arguments);
aa.unshift(null);
return this.map(function(i){
aa[0]=i;
return dojo.style.apply(dojo,aa);
});
},place:function(_25d,_25e){
var item=d.query(_25d)[0];
_25e=_25e||"last";
for(var x=0;x<this.length;x++){
d.place(this[x],item,_25e);
}
return this;
},orphan:function(_261){
var _262=d._filterQueryResult(this,_261);
_262.forEach(function(item){
if(item["parentNode"]){
item.parentNode.removeChild(item);
}
});
return _262;
},adopt:function(_264,_265){
var item=this[0];
_265=_265||"last";
var _267=d.query(_264);
for(var x=0;x<_267.length;x++){
d.place(_267[x],item,_265);
}
return _267;
},query:function(_269){
_269=_269||"";
var ret=new d.NodeList();
this.forEach(function(item){
d.query(_269,item).forEach(function(_26c){
if(typeof _26c!="undefined"){
ret.push(_26c);
}
});
});
return ret;
},filter:function(_26d){
var _26e=this;
var _a=arguments;
var r=new d.NodeList();
var rp=function(t){
if(typeof t!="undefined"){
r.push(t);
}
};
if(dojo.isString(_26d)){
_26e=d._filterQueryResult(this,_a[0]);
if(_a.length==1){
return _26e;
}
d.forEach(d.filter(_26e,_a[1],_a[2]),rp);
return r;
}
d.forEach(d.filter(_26e,_a[0],_a[1]),rp);
return r;
},addContent:function(_273,_274){
var ta=dojo.doc.createElement("span");
if(dojo.isString(_273)){
ta.innerHTML=_273;
}else{
ta.appendChild(_273);
}
var ct=((_274=="first")||(_274=="after"))?"lastChild":"firstChild";
this.forEach(function(item){
var tn=ta.cloneNode(true);
while(tn[ct]){
d.place(tn[ct],item,_274);
}
});
return this;
}});
if(!Array.forEach){
dojo.extend(dojo.NodeList,{indexOf:function(_279,_27a){
return d.indexOf(this,_279,_27a);
},lastIndexOf:function(_27b,_27c){
return d.lastIndexOf(this,_27b,_27c);
},forEach:function(_27d,_27e){
return d.forEach(this,_27d,_27e);
},every:function(_27f,_280){
return d.every(this,_27f,_280);
},some:function(_281,_282){
return d.some(this,_281,_282);
},map:function(_283,obj){
return d.map(this,_283,obj);
}});
}
if(d.isIE){
var _285=function(_286){
return ("var a2 = parent."+_286+"; "+"var ap = Array.prototype; "+"var a2p = a2.prototype; "+"for(var x in a2p){ ap[x] = a2p[x]; } "+"parent."+_286+" = Array; ");
};
var scs=_285("dojo.NodeList");
var _288=window.createPopup();
_288.document.write("<script>"+scs+"</script>");
_288.show(1,1,1,1);
}
})();
dojo.provide("dojo._base.query");
(function(){
var d=dojo;
var _28a=function(q){
return [q.indexOf("#"),q.indexOf("."),q.indexOf("["),q.indexOf(":")];
};
var _28c=function(_28d,_28e){
var ql=_28d.length;
var i=_28a(_28d);
var end=ql;
for(var x=_28e;x<i.length;x++){
if(i[x]>=0){
if(i[x]<end){
end=i[x];
}
}
}
return (end<0)?ql:end;
};
var _293=function(_294){
return _28c(_294,1);
};
var _295=function(_296){
var i=_28a(_296);
if(i[0]!=-1){
return _296.substring(i[0]+1,_293(_296));
}else{
return "";
}
};
var _298=function(_299){
var i=_28a(_299);
if((i[0]==0)||(i[1]==0)){
return 0;
}else{
return _28c(_299,0);
}
};
var _29b=function(_29c){
var _29d=_298(_29c);
return ((_29d>0)?_29c.substr(0,_29d).toLowerCase():"*");
};
var _29e=function(arr){
var ret=-1;
for(var x=0;x<arr.length;x++){
var ta=arr[x];
if(ta>=0){
if((ta>ret)||(ret==-1)){
ret=ta;
}
}
}
return ret;
};
var _2a3=function(_2a4){
var i=_28a(_2a4);
if(-1==i[1]){
return "";
}
var di=i[1]+1;
var _2a7=_29e(i.slice(2));
if(di<_2a7){
return _2a4.substring(di,_2a7);
}else{
if(-1==_2a7){
return _2a4.substr(di);
}else{
return "";
}
}
};
var _2a8=[{key:"|=",match:function(attr,_2aa){
return "[contains(concat(' ',@"+attr+",' '), ' "+_2aa+"-')]";
}},{key:"~=",match:function(attr,_2ac){
return "[contains(concat(' ',@"+attr+",' '), ' "+_2ac+" ')]";
}},{key:"^=",match:function(attr,_2ae){
return "[starts-with(@"+attr+", '"+_2ae+"')]";
}},{key:"*=",match:function(attr,_2b0){
return "[contains(@"+attr+", '"+_2b0+"')]";
}},{key:"$=",match:function(attr,_2b2){
return "[substring(@"+attr+", string-length(@"+attr+")-"+(_2b2.length-1)+")='"+_2b2+"']";
}},{key:"!=",match:function(attr,_2b4){
return "[not(@"+attr+"='"+_2b4+"')]";
}},{key:"=",match:function(attr,_2b6){
return "[@"+attr+"='"+_2b6+"']";
}}];
var _2b7=function(val){
var re=/^\s+|\s+$/g;
return val.replace(re,"");
};
var _2ba=function(_2bb,_2bc,_2bd,_2be){
var _2bf;
var i=_28a(_2bc);
if(i[2]>=0){
var _2c1=_2bc.indexOf("]",i[2]);
var _2c2=_2bc.substring(i[2]+1,_2c1);
while(_2c2&&_2c2.length){
if(_2c2.charAt(0)=="@"){
_2c2=_2c2.slice(1);
}
_2bf=null;
for(var x=0;x<_2bb.length;x++){
var ta=_2bb[x];
var tci=_2c2.indexOf(ta.key);
if(tci>=0){
var attr=_2c2.substring(0,tci);
var _2c7=_2c2.substring(tci+ta.key.length);
if((_2c7.charAt(0)=="\"")||(_2c7.charAt(0)=="'")){
_2c7=_2c7.substring(1,_2c7.length-1);
}
_2bf=ta.match(_2b7(attr),_2b7(_2c7));
break;
}
}
if((!_2bf)&&(_2c2.length)){
_2bf=_2bd(_2c2);
}
if(_2bf){
_2be(_2bf);
}
_2c2=null;
var _2c8=_2bc.indexOf("[",_2c1);
if(0<=_2c8){
_2c1=_2bc.indexOf("]",_2c8);
if(0<=_2c1){
_2c2=_2bc.substring(_2c8+1,_2c1);
}
}
}
}
};
var _2c9=function(_2ca){
var _2cb=".";
var _2cc=_2ca.split(" ");
while(_2cc.length){
var tqp=_2cc.shift();
var _2ce;
if(tqp==">"){
_2ce="/";
tqp=_2cc.shift();
}else{
_2ce="//";
}
var _2cf=_29b(tqp);
_2cb+=_2ce+_2cf;
var id=_295(tqp);
if(id.length){
_2cb+="[@id='"+id+"'][1]";
}
var cn=_2a3(tqp);
if(cn.length){
var _2d2=" ";
if(cn.charAt(cn.length-1)=="*"){
_2d2="";
cn=cn.substr(0,cn.length-1);
}
_2cb+="[contains(concat(' ',@class,' '), ' "+cn+_2d2+"')]";
}
_2ba(_2a8,tqp,function(_2d3){
return "[@"+_2d3+"]";
},function(_2d4){
_2cb+=_2d4;
});
}
return _2cb;
};
var _2d5={};
var _2d6=function(path){
if(_2d5[path]){
return _2d5[path];
}
var doc=d.doc;
var _2d9=_2c9(path);
var tf=function(_2db){
var ret=[];
var _2dd;
try{
_2dd=doc.evaluate(_2d9,_2db,null,XPathResult.ANY_TYPE,null);
}
catch(e){
console.debug("failure in exprssion:",_2d9,"under:",_2db);
console.debug(e);
}
var _2de=_2dd.iterateNext();
while(_2de){
ret.push(_2de);
_2de=_2dd.iterateNext();
}
return ret;
};
return _2d5[path]=tf;
};
var _2df={};
var _2e0={};
var _2e1=function(_2e2,_2e3){
if(!_2e2){
return _2e3;
}
if(!_2e3){
return _2e2;
}
return function(){
return _2e2.apply(window,arguments)&&_2e3.apply(window,arguments);
};
};
var _2e4=function(_2e5,_2e6,_2e7,idx){
var nidx=idx+1;
var _2ea=(_2e6.length==nidx);
var tqp=_2e6[idx];
if(tqp==">"){
var ecn=_2e5.childNodes;
if(!ecn.length){
return;
}
nidx++;
var _2ea=(_2e6.length==nidx);
var tf=_2ee(_2e6[idx+1]);
for(var x=ecn.length-1,te;x>=0,te=ecn[x];x--){
if(tf(te)){
if(_2ea){
_2e7.push(te);
}else{
_2e4(te,_2e6,_2e7,nidx);
}
}
if(x==0){
break;
}
}
}
var _2f1=_2f2(tqp)(_2e5);
if(_2ea){
while(_2f1.length){
_2e7.push(_2f1.shift());
}
}else{
while(_2f1.length){
_2e4(_2f1.shift(),_2e6,_2e7,nidx);
}
}
};
var _2f3=function(_2f4,_2f5){
ret=[];
var x=_2f4.length-1,te;
while(te=_2f4[x--]){
_2e4(te,_2f5,ret,0);
}
return ret;
};
var _2ee=function(_2f8){
if(_2df[_2f8]){
return _2df[_2f8];
}
var ff=null;
var _2fa=_29b(_2f8);
if(_2fa!="*"){
ff=_2e1(ff,function(elem){
var isTn=((elem.nodeType==1)&&(_2fa==elem.tagName.toLowerCase()));
return isTn;
});
}
var _2fd=_295(_2f8);
if(_2fd.length){
ff=_2e1(ff,function(elem){
return ((elem.nodeType==1)&&(elem.id==_2fd));
});
}
if(Math.max.apply(this,_28a(_2f8).slice(1))>=0){
ff=_2e1(ff,_2ff(_2f8));
}
return _2df[_2f8]=ff;
};
var _300=function(node){
var pn=node.parentNode;
var pnc=pn.childNodes;
var nidx=-1;
var _305=pn.firstChild;
if(!_305){
return nidx;
}
var ci=node["__cachedIndex"];
var cl=pn["__cachedLength"];
if(((typeof cl=="number")&&(cl!=pnc.length))||(typeof ci!="number")){
pn["__cachedLength"]=pnc.length;
var idx=1;
do{
if(_305===node){
nidx=idx;
}
if(_305.nodeType==1){
_305["__cachedIndex"]=idx;
idx++;
}
_305=_305.nextSibling;
}while(_305);
}else{
nidx=ci;
}
return nidx;
};
var _309=0;
var _30a=function(elem,attr){
var _30d="";
if(attr=="class"){
return elem.className||_30d;
}
if(attr=="for"){
return elem.htmlFor||_30d;
}
return elem.getAttribute(attr,2)||_30d;
};
var _30e=[{key:"|=",match:function(attr,_310){
var _311=" "+_310+"-";
return function(elem){
var ea=" "+(elem.getAttribute(attr,2)||"");
return ((ea==_310)||(ea.indexOf(_311)==0));
};
}},{key:"^=",match:function(attr,_315){
return function(elem){
return (_30a(elem,attr).indexOf(_315)==0);
};
}},{key:"*=",match:function(attr,_318){
return function(elem){
return (_30a(elem,attr).indexOf(_318)>=0);
};
}},{key:"~=",match:function(attr,_31b){
var tval=" "+_31b+" ";
return function(elem){
var ea=" "+_30a(elem,attr)+" ";
return (ea.indexOf(tval)>=0);
};
}},{key:"$=",match:function(attr,_320){
var tval=" "+_320;
return function(elem){
var ea=" "+_30a(elem,attr);
return (ea.lastIndexOf(_320)==(ea.length-_320.length));
};
}},{key:"!=",match:function(attr,_325){
return function(elem){
return (_30a(elem,attr)!=_325);
};
}},{key:"=",match:function(attr,_328){
return function(elem){
return (_30a(elem,attr)==_328);
};
}}];
var _32a=[{key:"first-child",match:function(name,_32c){
return function(elem){
if(elem.nodeType!=1){
return false;
}
var fc=elem.previousSibling;
while(fc&&(fc.nodeType!=1)){
fc=fc.previousSibling;
}
return (!fc);
};
}},{key:"last-child",match:function(name,_330){
return function(elem){
if(elem.nodeType!=1){
return false;
}
var nc=elem.nextSibling;
while(nc&&(nc.nodeType!=1)){
nc=nc.nextSibling;
}
return (!nc);
};
}},{key:"empty",match:function(name,_334){
return function(elem){
var cn=elem.childNodes;
var cnl=elem.childNodes.length;
for(var x=cnl-1;x>=0;x--){
var nt=cn[x].nodeType;
if((nt==1)||(nt==3)){
return false;
}
}
return true;
};
}},{key:"contains",match:function(name,_33b){
return function(elem){
return (elem.innerHTML.indexOf(_33b)>=0);
};
}},{key:"not",match:function(name,_33e){
var ntf=_2ee(_33e);
return function(elem){
return (!ntf(elem));
};
}},{key:"nth-child",match:function(name,_342){
var pi=parseInt;
if(_342=="odd"){
return function(elem){
return (((_300(elem))%2)==1);
};
}else{
if((_342=="2n")||(_342=="even")){
return function(elem){
return ((_300(elem)%2)==0);
};
}else{
if(_342.indexOf("0n+")==0){
var _346=pi(_342.substr(3));
return function(elem){
return (elem.parentNode.childNodes[_346-1]===elem);
};
}else{
if((_342.indexOf("n+")>0)&&(_342.length>3)){
var _348=_342.split("n+",2);
var pred=pi(_348[0]);
var idx=pi(_348[1]);
return function(elem){
return ((_300(elem)%pred)==idx);
};
}else{
if(_342.indexOf("n")==-1){
var _346=pi(_342);
return function(elem){
return (_300(elem)==_346);
};
}
}
}
}
}
}}];
var _2ff=function(_34d){
var _34e=(_2e0[_34d]||_2df[_34d]);
if(_34e){
return _34e;
}
var ff=null;
var i=_28a(_34d);
if(i[0]>=0){
var tn=_29b(_34d);
if(tn!="*"){
ff=_2e1(ff,function(elem){
return (elem.tagName.toLowerCase()==tn);
});
}
}
var _353;
var _354=_2a3(_34d);
if(_354.length){
var _355=_354.charAt(_354.length-1)=="*";
if(_355){
_354=_354.substr(0,_354.length-1);
}
var re=new RegExp("(?:^|\\s)"+_354+(_355?".*":"")+"(?:\\s|$)");
ff=_2e1(ff,function(elem){
return re.test(elem.className);
});
}
if(i[3]>=0){
var _358=_34d.substr(i[3]+1);
var _359="";
var obi=_358.indexOf("(");
var cbi=_358.lastIndexOf(")");
if((0<=obi)&&(0<=cbi)&&(cbi>obi)){
_359=_358.substring(obi+1,cbi);
_358=_358.substr(0,obi);
}
_353=null;
for(var x=0;x<_32a.length;x++){
var ta=_32a[x];
if(ta.key==_358){
_353=ta.match(_358,_359);
break;
}
}
if(_353){
ff=_2e1(ff,_353);
}
}
var _35e=(d.isIE)?function(cond){
return function(elem){
return elem[cond];
};
}:function(cond){
return function(elem){
return elem.hasAttribute(cond);
};
};
_2ba(_30e,_34d,_35e,function(_363){
ff=_2e1(ff,_363);
});
if(!ff){
ff=function(){
return true;
};
}
return _2e0[_34d]=ff;
};
var _364=function(_365){
return (Math.max.apply(this,_28a(_365))==-1);
};
var _366={};
var _2f2=function(_367,root){
var fHit=_366[_367];
if(fHit){
return fHit;
}
var i=_28a(_367);
var id=_295(_367);
if(i[0]==0){
return _366[_367]=function(root){
return [d.byId(id)];
};
}
var _36d=_2ff(_367);
var _36e;
if(i[0]>=0){
_36e=function(root){
var te=d.byId(id);
if(_36d(te)){
return [te];
}
};
}else{
var tret;
var tn=_29b(_367);
if(_364(_367)){
_36e=function(root){
var ret=[];
var te,x=0,tret=root.getElementsByTagName(tn);
while(te=tret[x++]){
ret.push(te);
}
return ret;
};
}else{
_36e=function(root){
var ret=[];
var te,x=0,tret=root.getElementsByTagName(tn);
while(te=tret[x++]){
if(_36d(te)){
ret.push(te);
}
}
return ret;
};
}
}
return _366[_367]=_36e;
};
var _37b={};
var _37c={};
var _37d=function(_37e){
if(0>_37e.indexOf(" ")){
return _2f2(_37e);
}
var sqf=function(root){
var _381=_37e.split(" ");
var _382;
if(_381[0]==">"){
_382=[root];
root=document;
}else{
_382=_2f2(_381.shift())(root);
}
return _2f3(_382,_381);
};
return sqf;
};
var _383=((document["evaluate"]&&!d.isSafari)?function(_384){
var _385=_384.split(" ");
if((document["evaluate"])&&(_384.indexOf(":")==-1)&&((true))){
if(((_385.length>2)&&(_384.indexOf(">")==-1))||(_385.length>3)||(_384.indexOf("[")>=0)||((1==_385.length)&&(0<=_384.indexOf(".")))){
return _2d6(_384);
}
}
return _37d(_384);
}:_37d);
var _386=function(_387){
if(_37c[_387]){
return _37c[_387];
}
if(0>_387.indexOf(",")){
return _37c[_387]=_383(_387);
}else{
var _388=_387.split(", ");
var tf=function(root){
var _38b=0;
var ret=[];
var tp;
while(tp=_388[_38b++]){
ret=ret.concat(_383(tp,tp.indexOf(" "))(root));
}
return ret;
};
return _37c[_387]=tf;
}
};
var _38e=0;
var _zip=function(arr){
var ret=new d.NodeList();
if(!arr){
return ret;
}
if(arr[0]){
ret.push(arr[0]);
}
if(arr.length<2){
return ret;
}
_38e++;
arr[0]["_zipIdx"]=_38e;
for(var x=1,te;te=arr[x];x++){
if(arr[x]["_zipIdx"]!=_38e){
ret.push(te);
}
te["_zipIdx"]=_38e;
}
return ret;
};
d.query=function(_394,root){
if(typeof _394!="string"){
return new d.NodeList(_394);
}
if(typeof root=="string"){
root=dojo.byId(root);
}
return _zip(_386(_394)(root||dojo.doc));
};
d._filterQueryResult=function(_396,_397){
var tnl=new d.NodeList();
var ff=(_397)?_2ee(_397):function(){
return true;
};
for(var x=0,te;te=_396[x];x++){
if(ff(te)){
tnl.push(te);
}
}
return tnl;
};
})();
dojo.provide("dojo._base.xhr");
dojo.formToObject=function(_39c){
var ret={};
var iq="input[type!=file][type!=submit][type!=image][type!=reset][type!=button], select, textarea";
dojo.query(iq,_39c).filter(function(node){
return (!node.disabled);
}).forEach(function(item){
var _in=item.name;
var type=(item.type||"").toLowerCase();
if((type=="radio")||(type=="checkbox")){
if(item.checked){
ret[_in]=item.value;
}
}else{
if(item.multiple){
var ria=ret[_in]=[];
dojo.query("option[selected]",item).forEach(function(opt){
ria.push(opt.value);
});
}else{
ret[_in]=item.value;
if(type=="image"){
ret[_in+".x"]=ret[_in+".y"]=ret[_in].x=ret[_in].y=0;
}
}
}
});
return ret;
};
dojo.objectToQuery=function(map){
var ec=encodeURIComponent;
var ret="";
var _3a8={};
for(var x in map){
if(map[x]!=_3a8[x]){
if(dojo.isArray(map[x])){
for(var y=0;y<map[x].length;y++){
ret+=ec(x)+"="+ec(map[x][y])+"&";
}
}else{
ret+=ec(x)+"="+ec(map[x])+"&";
}
}
}
if((ret.length)&&(ret.charAt(ret.length-1)=="&")){
ret=ret.substr(0,ret.length-1);
}
return ret;
};
dojo.formToQuery=function(_3ab){
return dojo.objectToQuery(dojo.formToObject(_3ab));
};
dojo.formToJson=function(_3ac){
return dojo.toJson(dojo.formToObject(_3ac));
};
dojo.queryToObject=function(str){
var ret={};
var qp=str.split("&");
var dc=decodeURIComponent;
dojo.forEach(qp,function(item){
if(item.length){
var _3b2=item.split("=");
var name=_3b2.shift();
var val=dc(_3b2.join("="));
if(dojo.isString(ret[name])){
ret[name]=[ret[name]];
}
if(dojo.isArray(ret[name])){
ret[name].push(val);
}else{
ret[name]=val;
}
}
});
return ret;
};
dojo._blockAsync=false;
dojo._contentHandlers={"text":function(xhr){
return xhr.responseText;
},"json":function(xhr){
console.debug("please consider using a mimetype of text/json-comment-filtered to avoid potential security issues with JSON endpoints");
return dojo.fromJson(xhr.responseText);
},"json-comment-optional":function(xhr){
var _3b8=xhr.responseText;
var _3b9=_3b8.indexOf("/*");
var _3ba=_3b8.lastIndexOf("*/");
if((_3b9==-1)||(_3ba==-1)){
return dojo.fromJson(xhr.responseText);
}
return dojo.fromJson(_3b8.substring(_3b9+2,_3ba));
},"json-comment-filtered":function(xhr){
var _3bc=xhr.responseText;
var _3bd=_3bc.indexOf("/*");
var _3be=_3bc.lastIndexOf("*/");
if((_3bd==-1)||(_3be==-1)){
console.debug("your JSON wasn't comment filtered!");
return "";
}
return dojo.fromJson(_3bc.substring(_3bd+2,_3be));
},"javascript":function(xhr){
return dojo.eval(xhr.responseText);
},"xml":function(xhr){
return xhr.responseXML;
}};
(function(){
dojo._ioSetArgs=function(args,_3c2,_3c3,_3c4){
var _3c5={};
_3c5.args=args;
var _3c6=null;
if(args.form){
var form=dojo.byId(args.form);
_3c5.url=args.url||form.getAttribute("action");
_3c6=dojo.formToQuery(form);
}else{
_3c5.url=args.url;
}
var qi=_3c5.url.indexOf("?");
var _3c9=[{}];
if(qi!=-1){
_3c9.push(dojo.queryToObject(_3c5.url.substr(qi+1)));
_3c5.url=_3c5.url.substr(0,qi);
}
if(_3c6){
_3c9.push(dojo.queryToObject(_3c6));
}
if(args.content){
_3c9.push(args.content);
}
if(args.preventCache){
_3c9.push({"dojo.preventCache":new Date().valueOf()});
}
_3c5.query=dojo.objectToQuery(dojo.mixin.apply(null,_3c9));
_3c5.ha=args.handleAs||"text";
var d=new dojo.Deferred(_3c2);
d.addCallbacks(_3c3,function(_3cb){
return _3c4(_3cb,d);
});
d.ioArgs=_3c5;
return d;
};
var _3cc=function(dfd){
dfd.canceled=true;
dfd.ioArgs.xhr.abort();
};
var _3ce=function(dfd){
return dojo._contentHandlers[dfd.ioArgs.ha](dfd.ioArgs.xhr);
};
var _3d0=function(_3d1,dfd){
console.debug("xhr error in:",dfd.ioArgs.xhr);
console.debug(_3d1);
return _3d1;
};
var _3d3=function(args){
var dfd=dojo._ioSetArgs(args,_3cc,_3ce,_3d0);
dfd.ioArgs.xhr=dojo._xhrObj();
return dfd;
};
var _3d6=null;
var _3d7=[];
var _3d8=function(){
var now=(new Date()).getTime();
if(!dojo._blockAsync){
dojo.forEach(_3d7,function(tif,_3db){
if(!tif){
return;
}
var dfd=tif.dfd;
try{
if(!dfd||dfd.canceled||!tif.validCheck(dfd)){
_3d7.splice(_3db,1);
return;
}
if(tif.ioCheck(dfd)){
_3d7.splice(_3db,1);
tif.resHandle(dfd);
}else{
if(dfd.startTime){
if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){
dfd.cancel();
_3d7.splice(_3db,1);
var err=new Error("timeout exceeded");
err.dojoType="timeout";
dfd.errback(err);
}
}
}
}
catch(e){
console.debug(e);
dfd.errback(new Error("_watchInFlightError!"));
}
});
}
if(!_3d7.length){
clearInterval(_3d6);
_3d6=null;
return;
}
};
dojo._ioWatch=function(dfd,_3df,_3e0,_3e1){
if(dfd.ioArgs.args.timeout){
dfd.startTime=(new Date()).getTime();
}
_3d7.push({dfd:dfd,validCheck:_3df,ioCheck:_3e0,resHandle:_3e1});
if(!_3d6){
_3d6=setInterval(_3d8,50);
}
_3d8();
};
var _3e2="application/x-www-form-urlencoded";
var _3e3=function(dfd){
return dfd.ioArgs.xhr.readyState;
};
var _3e5=function(dfd){
return 4==dfd.ioArgs.xhr.readyState;
};
var _3e7=function(dfd){
if(dojo._isDocumentOk(dfd.ioArgs.xhr)){
dfd.callback(dfd);
}else{
dfd.errback(new Error("bad http response code:"+dfd.ioArgs.xhr.status));
}
};
var _3e9=function(type,dfd){
var _3ec=dfd.ioArgs;
var args=_3ec.args;
_3ec.xhr.open(type,_3ec.url,(args.sync!==true),(args.user?args.user:undefined),(args.password?args.password:undefined));
_3ec.xhr.setRequestHeader("Content-Type",(args.contentType||_3e2));
try{
_3ec.xhr.send(_3ec.query);
}
catch(e){
_3ec.cancel();
}
dojo._ioWatch(dfd,_3e3,_3e5,_3e7);
return dfd;
};
dojo.xhrGet=function(args){
var dfd=_3d3(args);
var _3f0=dfd.ioArgs;
if(_3f0.query.length){
_3f0.url+="?"+_3f0.query;
_3f0.query=null;
}
return _3e9("GET",dfd);
};
dojo.xhrPost=function(args){
return _3e9("POST",_3d3(args));
};
dojo.rawXhrPost=function(args){
var dfd=_3d3(args);
dfd.ioArgs.query=args.postData;
return _3e9("POST",dfd);
};
dojo.wrapForm=function(_3f4){
throw new Error("dojo.wrapForm not yet implemented");
};
})();
dojo.provide("dojo._base.fx");
dojo._Line=function(_3f5,end){
this.start=_3f5;
this.end=end;
this.getValue=function(n){
return ((this.end-this.start)*n)+this.start;
};
};
dojo.Color=function(){
this.setColor.apply(this,arguments);
};
dojo.Color.named={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255]};
dojo.extend(dojo.Color,{_cache:null,setColor:function(){
this._cache=[];
var d=dojo;
var a=arguments;
var a0=a[0];
var pmap=(d.isArray(a0)?a0:(d.isString(a0)?d.extractRgb(a0):d._toArray(a)));
d.forEach(["r","g","b","a"],function(p,i){
this._cache[i]=this[p]=parseFloat(pmap[i]);
},this);
this._cache[3]=this.a=this.a||1;
},toRgb:function(_3fe){
return this._cache.slice(0,((_3fe)?4:3));
},toRgba:function(){
return this._cache.slice(0,4);
},toHex:function(){
return dojo.rgb2hex(this.toRgb());
},toCss:function(){
return "rgb("+this.toRgb().join(", ")+")";
},toString:function(){
return this.toHex();
}});
dojo.blendColors=function(a,b,_401){
if(typeof a=="string"){
a=dojo.extractRgb(a);
}
if(typeof b=="string"){
b=dojo.extractRgb(b);
}
if(a["_cache"]){
a=a._cache;
}
if(b["_cache"]){
b=b._cache;
}
_401=Math.min(Math.max(-1,(_401||0)),1);
_401=((_401+1)/2);
var c=[];
for(var x=0;x<3;x++){
c[x]=parseInt(b[x]+((a[x]-b[x])*_401));
}
return c;
};
dojo.extractRgb=function(_404){
_404=_404.toLowerCase();
if(_404.indexOf("rgb")==0){
var _405=_404.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=dojo.map(_405.splice(1,3),parseFloat);
return ret;
}else{
return dojo.hex2rgb(_404)||dojo.Color.named[_404]||[255,255,255];
}
};
dojo.hex2rgb=function(hex){
var _408="0123456789abcdef";
var rgb=new Array(3);
if(hex.charAt(0)=="#"){
hex=hex.substr(1);
}
hex=hex.toLowerCase();
if(hex.replace(new RegExp("["+_408+"]","g"),"")!=""){
return null;
}
if(hex.length==3){
rgb[0]=hex.charAt(0)+hex.charAt(0);
rgb[1]=hex.charAt(1)+hex.charAt(1);
rgb[2]=hex.charAt(2)+hex.charAt(2);
}else{
rgb[0]=hex.substr(0,2);
rgb[1]=hex.substr(2,2);
rgb[2]=hex.substr(4);
}
for(var i=0;i<rgb.length;i++){
rgb[i]=_408.indexOf(rgb[i].charAt(0))*16+_408.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.rgb2hex=function(r,g,b){
var ret=dojo.map(((r._cache)||((!g)?r:[r,g,b])),function(x,i){
var s=(new Number(x)).toString(16);
while(s.length<2){
s="0"+s;
}
return s;
});
ret.unshift("#");
return ret.join("");
};
dojo.declare("dojo._Animation",null,function(args){
dojo.mixin(this,args);
if(dojo.isArray(this.curve)){
this.curve=new dojo._Line(this.curve[0],this.curve[1]);
}
},{curve:null,duration:1000,easing:null,repeat:0,rate:10,delay:null,beforeBegin:null,onBegin:null,onAnimate:null,onEnd:null,onPlay:null,onPause:null,onStop:null,_active:false,_paused:false,_startTime:null,_endTime:null,_timer:null,_percent:0,_startRepeatCount:0,fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,args||[]);
}
return this;
},chain:function(_415){
dojo.forEach(_415,function(anim,i){
var prev=(i==0)?this:_415[i-1];
dojo.connect(prev,"onEnd",anim,"play");
},this);
return this;
},combine:function(_419){
dojo.forEach(_419,function(anim){
dojo.connect(this,"play",anim,"play");
},this);
return this;
},play:function(_41b,_41c){
if(_41c){
clearTimeout(this._timer);
this._active=this._paused=false;
this._percent=0;
}else{
if(this._active&&!this._paused){
return this;
}
}
this.fire("beforeBegin");
var d=_41b||this.delay;
if(d>0){
setTimeout(dojo.hitch(this,function(){
this.play(null,_41c);
}),d);
return this;
}
this._startTime=new Date().valueOf();
if(this._paused){
this._startTime-=this.duration*this._percent;
}
this._endTime=this._startTime+this.duration;
this._active=true;
this._paused=false;
var _41e=this.curve.getValue(this._percent);
if(this._percent==0){
if(!this._startRepeatCount){
this._startRepeatCount=this.repeat;
}
this.fire("onBegin",[_41e]);
}
this.fire("onPlay",[_41e]);
this._cycle();
return this;
},pause:function(){
clearTimeout(this._timer);
if(!this._active){
return this;
}
this._paused=true;
this.fire("onPause",[this.curve.getValue(this._percent)]);
return this;
},gotoPercent:function(pct,_420){
clearTimeout(this._timer);
this._active=this._paused=true;
this._percent=pct*100;
if(_420){
this.play();
}
return this;
},stop:function(_421){
clearTimeout(this._timer);
if(_421){
this._percent=1;
}
this.fire("onStop",[this.curve.getValue(this._percent)]);
this._active=this._paused=false;
return this;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}
return "stopped";
},_cycle:function(){
clearTimeout(this._timer);
if(this._active){
var curr=new Date().valueOf();
var step=(curr-this._startTime)/(this._endTime-this._startTime);
if(step>=1){
step=1;
}
this._percent=step;
if(this.easing){
step=this.easing(step);
}
this.fire("onAnimate",[this.curve.getValue(step)]);
if(step<1){
this._timer=setTimeout(dojo.hitch(this,"_cycle"),this.rate);
}else{
this._active=false;
if(this.repeat>0){
this.repeat--;
this.play(null,true);
}else{
if(this.repeat==-1){
this.play(null,true);
}else{
if(this._startRepeatCount){
this.repeat=this._startRepeatCount;
this._startRepeatCount=0;
}
}
}
this.fire("onEnd");
}
}
return this;
}});
(function(){
var _424=function(node){
if(dojo.isIE){
if(node.style.zoom.length==0&&dojo.style(node,"zoom")=="normal"){
node.style.zoom="1";
}
if(node.style.width.length==0&&dojo.style(node,"width")=="auto"){
node.style.width="auto";
}
}
};
dojo._fade=function(args){
if(typeof args.end=="undefined"){
throw new Error("dojo._fade needs an end value");
}
args.node=dojo.byId(args.node);
var _427=dojo.mixin({properties:{}},args);
var _428=_427.properties.opacity={};
_428.start=(typeof _427.start=="undefined")?function(){
return Number(dojo.style(_427.node,"opacity"));
}:_427.start;
_428.end=_427.end;
var anim=dojo.animateProperty(_427);
dojo.connect(anim,"beforeBegin",null,function(){
_424(_427.node);
});
return anim;
};
dojo.fadeIn=function(args){
return dojo._fade(dojo.mixin({end:1},args));
};
dojo.fadeOut=function(args){
return dojo._fade(dojo.mixin({end:0},args));
};
if(dojo.isKhtml&&!dojo.isSafari){
dojo._defaultEasing=function(n){
return parseFloat("0.5")+((Math.sin((n+parseFloat("1.5"))*Math.PI))/2);
};
}else{
dojo._defaultEasing=function(n){
return 0.5+((Math.sin((n+1.5)*Math.PI))/2);
};
}
dojo.animateProperty=function(args){
args.node=dojo.byId(args.node);
if(!args.easing){
args.easing=dojo._defaultEasing;
}
var _42f=function(_430){
this._properties=_430;
for(var p in _430){
var prop=_430[p];
if(dojo.isFunction(prop.start)){
prop.start=prop.start(prop);
}
if(dojo.isFunction(prop.end)){
prop.end=prop.end(prop);
}
}
this.getValue=function(n){
var ret={};
for(var p in this._properties){
var prop=this._properties[p];
var _437=null;
if(prop.start instanceof dojo.Color){
_437=dojo.rgb2hex(dojo.blendColors(prop.end,prop.start,n));
}else{
if(!dojo.isArray(prop.start)){
_437=((prop.end-prop.start)*n)+prop.start+(p!="opacity"?prop.units||"px":"");
}
}
ret[p]=_437;
}
return ret;
};
};
var anim=new dojo._Animation(args);
dojo.connect(anim,"beforeBegin",anim,function(){
var pm=this.properties;
for(var p in pm){
var prop=pm[p];
if(dojo.isFunction(prop.start)){
prop.start=prop.start();
}
if(dojo.isFunction(prop.end)){
prop.end=prop.end();
}
var _43c=(p.toLowerCase().indexOf("color")>=0);
if(typeof prop.end=="undefined"){
prop.end=dojo.style(this.node,p);
}else{
if(typeof prop.start=="undefined"){
prop.start=dojo.style(this.node,p);
}
}
if(_43c){
prop.start=new dojo.Color(prop.start);
prop.end=new dojo.Color(prop.end);
}else{
prop.start=(p=="opacity")?Number(prop.start):parseInt(prop.start);
}
}
this.curve=new _42f(pm);
});
dojo.connect(anim,"onAnimate",anim,function(_43d){
for(var s in _43d){
dojo.style(this.node,s,_43d[s]);
}
});
return anim;
};
})();
