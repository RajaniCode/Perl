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

if(typeof dojo == "undefined"){

// TODOC: HOW TO DOC THE BELOW?
// @global: djConfig
// summary:
//		Application code can set the global 'djConfig' prior to loading
//		the library to override certain global settings for how dojo works.
// description:  The variables that can be set are as follows:
//			- isDebug: false
//			- baseScriptUri: ""
//			- baseRelativePath: ""
//			- libraryScriptUri: ""
//			- locale: undefined
//			- extraLocale: undefined
//			- preventBackButtonFix: true
// note:
//		'djConfig' does not exist under 'dojo.*' so that it can be set before the
//		'dojo' variable exists.
// note:
//		Setting any of these variables *after* the library has loaded does
//		nothing at all.


(function(){
	// make sure djConfig is defined
	if(typeof this["djConfig"] == "undefined"){
		this.djConfig = {};
	}

	// firebug stubs
	if((!this["console"])||(!console["firebug"])){
		this.console = {};
	}
	var cn = [
		"assert", "count", "debug", "dir", "dirxml", "error", "group",
		"groupEnd", "info", "log", "profile", "profileEnd", "time",
		"timeEnd", "trace", "warn"
	];
	var i=0, tn;
	while(tn=cn[i++]){
		if(!console[tn]){
			console[tn] = function(){};
		}
	}

	//TODOC:  HOW TO DOC THIS?
	// dojo is the root variable of (almost all) our public symbols -- make sure it is defined.
	if(typeof this["dojo"] == "undefined"){
		this.dojo = {};
	}

	// summary:
	//		return the current global context object
	//		(e.g., the window object in a browser).
	// description:
	//		Refer to 'dojo.global' rather than referring to window to ensure your
	//		code runs correctly in contexts other than web browsers (eg: Rhino on a server).
	dojo.global = this;

	var _config = {
		isDebug: false,
		allowQueryConfig: false,
		baseScriptUri: "",
		baseRelativePath: "",
		libraryScriptUri: "",
		preventBackButtonFix: true,
		delayMozLoadingFix: false
	};

	for(var option in _config){
		if(typeof djConfig[option] == "undefined"){
			djConfig[option] = _config[option];
		}
	}

	var _platforms = ["Browser", "Rhino", "Spidermonkey", "Mobile"];
	var t;
	while(t=_platforms.shift()){
		dojo["is"+t] = false;
	}
})();


// Override locale setting, if specified
dojo.locale = djConfig.locale;

//TODOC:  HOW TO DOC THIS?
dojo.version = {
	// summary: version number of this instance of dojo.
	major: 0, minor: 0, patch: 0, flag: "dev",
	revision: Number("$Rev: 8123 $".match(/[0-9]+/)[0]),
	toString: function(){
		with(dojo.version){
			return major + "." + minor + "." + patch + flag + " (" + revision + ")";	// String
		}
	}
}

dojo._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
	var obj=context||dojo.global;
	for(var i=0, p; obj&&(p=parts[i]); i++){
		obj = (p in obj ? obj[p] : (create ? obj[p]={} : undefined));
	}
	return obj; // Any
}

dojo.setObject = function(/*String*/name, /*Any*/value, /*Object*/context){
	// summary: 
	//		Set a property from a dot-separated string, such as "A.B.C"
	//	description: 
	//		Useful for longer api chains where you have to test each object in
	//		the chain, or when you have an object reference in string format.
	//		Objects are created as needed along 'path'.
	//	name: 	
	//		Path to a property, in the form "A.B.C".
	//	context:
	//		Optional. Object to use as root of path. Defaults to
	//		'dojo.global'. Null may be passed.
	var parts=name.split("."), p=parts.pop(), obj=dojo._getProp(parts, true, context);
	return (obj && p ? (obj[p]=value) : undefined); // Any
}

dojo.getObject = function(/*String*/name, /*Boolean*/create, /*Object*/context){
	// summary: 
	//		Get a property from a dot-separated string, such as "A.B.C"
	//	description: 
	//		Useful for longer api chains where you have to test each object in
	//		the chain, or when you have an object reference in string format.
	//	name: 	
	//		Path to an property, in the form "A.B.C".
	//	context:
	//		Optional. Object to use as root of path. Defaults to
	//		'dojo.global'. Null may be passed.
	//	create: 
	//		Optional. If true, Objects will be created at any point along the
	//		'path' that is undefined.
	return dojo._getProp(name.split("."), create, context); // Any
}

dojo.exists = function(/*String*/name, /*Object*/obj){
	// summary: 
	//		determine if an object supports a given method
	// description: 
	//		useful for longer api chains where you have to test each object in
	//		the chain
	// name: 	
	//		Path to an object, in the form "A.B.C".
	// obj:
	//		Optional. Object to use as root of path. Defaults to
	//		'dojo.global'. Null may be passed.
	return Boolean(dojo.getObject(name, false, obj)); // Boolean
}

dojo["eval"] = function(/*String*/ scriptFragment){
	// summary: 
	//		Perform an evaluation in the global scope.  Use this rather than
	//		calling 'eval()' directly.
	// description: 
	//		Placed in a separate function to minimize size of trapped
	//		evaluation context.
	// note:
	//	 - JSC eval() takes an optional second argument which can be 'unsafe'.
	//	 - Mozilla/SpiderMonkey eval() takes an optional second argument which is the
	//  	 scope object for new symbols.

	// FIXME: investigate Joseph Smarr's technique for IE:
	//		http://josephsmarr.com/2007/01/31/fixing-eval-to-use-global-scope-in-ie/
	//	see also:
	// 		http://trac.dojotoolkit.org/ticket/744
	return dojo.global.eval ? dojo.global.eval(scriptFragment) : eval(scriptFragment); 	// mixed
}

dojo.deprecated = function(/*String*/ behaviour, /*String?*/ extra, /*String?*/ removal){
	// summary: 
	//		Log a debug message to indicate that a behavior has been
	//		deprecated.
	// extra: Text to append to the message.
	// removal: 
	//		Text to indicate when in the future the behavior will be removed.
	var message = "DEPRECATED: " + behaviour;
	if(extra){ message += " " + extra; }
	if(removal){ message += " -- will be removed in version: " + removal; }
	console.debug(message);
}

dojo.experimental = function(/* String */ moduleName, /* String? */ extra){
	// summary: Marks code as experimental.
	// description: 
	//		This can be used to mark a function, file, or module as
	//		experimental.  Experimental code is not ready to be used, and the
	//		APIs are subject to change without notice.  Experimental code may be
	//		completed deleted without going through the normal deprecation
	//		process.
	// moduleName: 
	//		The name of a module, or the name of a module file or a specific
	//		function
	// extra: 
	//		some additional message for the user
	// examples:
	//		dojo.experimental("dojo.data.Result");
	//		dojo.experimental("dojo.weather.toKelvin()", "PENDING approval from NOAA");
	var message = "EXPERIMENTAL: " + moduleName;
	message += " -- Not yet ready for use.  APIs subject to change without notice.";
	if(extra){ message += " " + extra; }
	console.debug(message);
}

dojo._getText = function(/*String*/ uri){
	//	summary:	
	//		Read the plain/text contents at the specified 'uri'.
	//	description:
	//		If 'getText()' is not implemented, then it is necessary to
	//		override 'loadUri()' with an implementation that doesn't
	//		rely on it.

	// NOTE: platform specializations need to implement this
}

// vim:ai:ts=4:noet:textwidth=80

/*
 * loader.js - A bootstrap module.  Runs before the hostenv_*.js file. Contains
 * all of the package loading methods.
 */

//A semi-colon is at the start of the line because after doing a build, this
//function definition get compressed onto the same line as the last line in
//bootstrap1.js. That list line is just a curly bracket, and the browser
//complains about that syntax. The semicolon fixes it. Putting it here instead
//of at the end of bootstrap1.js, since it is more of an issue for this file,
//(using the closure), and bootstrap1.js could change in the future.
;(function(){
	//Additional properties for dojo
	var _add = {
		_pkgFileName: "__package__",
	
		// for recursion protection
		_loadedModules: {},
		_inFlightCount: 0,
	
		// FIXME: it should be possible to pull module prefixes in from djConfig
		_modulePrefixes: {
			dojo: {name: "dojo", value: "."},
			doh: {name: "doh", value: "../util/doh"},
			tests: {name: "tests", value: "tests"}
		},

		_moduleHasPrefix: function(/*String*/module){
			// summary: checks to see if module has been established
			var mp = this._modulePrefixes;
			return Boolean(mp[module] && mp[module].value); // Boolean
		},

		_getModulePrefix: function(/*String*/module){
			// summary: gets the prefix associated with module
			var mp = this._modulePrefixes;
			if(this._moduleHasPrefix(module)){
				return mp[module].value; // String
			}
			return module; // String
		},

		_loadedUrls: [],
	
		//WARNING: 
		//		This variable is referenced by packages outside of bootstrap:
		//		FloatingPane.js and undo/browser.js
		_postLoad: false,
		
		//Egad! Lots of test files push on this directly instead of using dojo.addOnLoad.
		_loaders: [],
		_unloaders: [],
		_loadNotifying: false
	};
	
	//Add all of these properties to dojo
	for(var param in _add){
		dojo[param] = _add[param];
	}
})();

dojo._loadPath = function(/*String*/relpath, /*String?*/module, /*Function?*/cb){
	// 	summary:
	//		Load a Javascript module given a relative path
	//
	//	description:
	//		Loads and interprets the script located at relpath, which is
	//		relative to the script root directory.  If the script is found but
	//		its interpretation causes a runtime exception, that exception is
	//		not caught by us, so the caller will see it.  We return a true
	//		value if and only if the script is found.
	//
	// relpath: 
	//		A relative path to a script (no leading '/', and typically ending
	//		in '.js').
	// module: 
	//		A module whose existance to check for after loading a path.  Can be
	//		used to determine success or failure of the load.
	// cb: 
	//		a callback function to pass the result of evaluating the script

	var uri = (((relpath.charAt(0) == '/' || relpath.match(/^\w+:/))) ? "" : this.baseUrl) + relpath;
	if(djConfig.cacheBust && dojo.isBrowser){
		uri += "?" + String(djConfig.cacheBust).replace(/\W+/g,"");
	}
	try{
		return !module ? this._loadUri(uri, cb) : this._loadUriAndCheck(uri, module, cb); // Boolean
	}catch(e){
		console.debug(e);
		return false; // Boolean
	}
}

dojo._loadUri = function(/*String (URL)*/uri, /*Function?*/cb){
	//	summary:
	//		Loads JavaScript from a URI
	//	description:
	//		Reads the contents of the URI, and evaluates the contents.  This is
	//		used to load modules as well as resource bundles. Returns true if
	//		it succeeded. Returns false if the URI reading failed.  Throws if
	//		the evaluation throws.
	//	uri: a uri which points at the script to be loaded
	//	cb: 
	//		a callback function to process the result of evaluating the script
	//		as an expression, typically used by the resource bundle loader to
	//		load JSON-style resources

	if(this._loadedUrls[uri]){
		return true; // Boolean
	}
	var contents = this._getText(uri, true);
	if(!contents){ return false; } // Boolean
	this._loadedUrls[uri] = true;
	if(cb){ contents = '('+contents+')'; }
	// var value = dojo["eval"](contents);
	var value = dojo["eval"]("//@ sourceURL="+uri+"\r\n"+contents);
	if(cb){ cb(value); }
	return true; // Boolean
}

// FIXME: probably need to add logging to this method
dojo._loadUriAndCheck = function(/*String (URL)*/uri, /*String*/moduleName, /*Function?*/cb){
	// summary: calls loadUri then findModule and returns true if both succeed
	var ok = false;
	try{
		ok = this._loadUri(uri, cb);
	}catch(e){
		console.debug("failed loading ", uri, " with error: ", e);
	}
	return Boolean(ok && this._loadedModules[moduleName]); // Boolean
}

dojo.loaded = function(){
	this._loadNotifying = true;
	this._postLoad = true;
	var mll = this._loaders;
	for(var x=0; x<mll.length; x++){
		mll[x]();
	}

	//Clear listeners so new ones can be added
	//For other xdomain package loads after the initial load.
	this._loaders = [];
	this._loadNotifying = false;
}

dojo.unloaded = function(){
	var mll = this._unloaders;
	while(mll.length){
		(mll.pop())();
	}
}

dojo.addOnLoad = function(/*Object?*/obj, /*String|Function*/functionName){
	// summary:
	//		Registers a function to be triggered after the DOM has finished
	//		loading and widgets declared in markup have been instantiated.
	//		Images and CSS files may or may not have finished downloading when
	//		the specified function is called.  (Note that widgets' CSS and HTML
	//		code is guaranteed to be downloaded before said widgets are
	//		instantiated.)
	//
	// usage:
	//		dojo.addOnLoad(functionPointer);
	//		dojo.addOnLoad(object, "functionName");
	var d = dojo;
	if(arguments.length == 1){
		d._loaders.push(obj);
	}else if(arguments.length > 1){
		d._loaders.push(function(){
			obj[functionName]();
		});
	}

	//Added for xdomain loading. dojo.addOnLoad is used to
	//indicate callbacks after doing some dojo.require() statements.
	//In the xdomain case, if all the requires are loaded (after initial
	//page load), then immediately call any listeners.
	if(d._postLoad && d._inFlightCount == 0 && !d._loadNotifying){
		d._callLoaded();
	}
}

dojo.addOnUnload = function(/*Object?*/obj, /*String|Function?*/functionName){
	// summary: registers a function to be triggered when the page unloads
	// usage:
	//		dojo.addOnUnload(functionPointer)
	//		dojo.addOnUnload(object, "functionName")
	var d = dojo;
	if(arguments.length == 1){
		d._unloaders.push(obj);
	}else if(arguments.length > 1){
		d._unloaders.push(function(){
			obj[functionName]();
		});
	}
}

dojo._modulesLoaded = function(){
	if(this._postLoad){ return; }
	if(this._inFlightCount > 0){ 
		console.debug("files still in flight!");
		return;
	}
	dojo._callLoaded();
}

dojo._callLoaded = function(){
	//The "object" check is for IE, and the other opera check fixes an issue
	//in Opera where it could not find the body element in some widget test cases.
	//For 0.9, maybe route all browsers through the setTimeout (need protection
	//still for non-browser environments though). This might also help the issue with
	//FF 2.0 and freezing issues where we try to do sync xhr while background css images
	//are being loaded (trac #2572)? Consider for 0.9.
	if(typeof setTimeout == "object" || (djConfig["useXDomain"] && dojo.isOpera)){
		setTimeout("dojo.loaded();", 0);
	}else{
		dojo.loaded();
	}
}

dojo._getModuleSymbols = function(/*String*/modulename){
	// summary:
	//		Converts a module name in dotted JS notation to an array
	//		representing the path in the source tree
	var syms = modulename.split(".");
	for(var i = syms.length; i>0; i--){
		var parentModule = syms.slice(0, i).join(".");
		if((i==1) && !this._moduleHasPrefix(parentModule)){		
			// Support default module directory (sibling of dojo) for top-level modules 
			syms[0] = "../" + syms[0];
		}else{
			var parentModulePath = this._getModulePrefix(parentModule);
			if(parentModulePath != parentModule){
				syms.splice(0, i, parentModulePath);
				break;
			}
		}
	}
	// console.debug(syms);
	return syms; // Array
}

dojo._global_omit_module_check = false;

dojo._loadModule = function(	/*String*/moduleName, 
								/*Boolean?*/exactOnly, 
								/*Boolean?*/omitModuleCheck){
	//	summary:
	//		loads a Javascript module from the appropriate URI
	//	description:
	//		_loadModule("A.B") first checks to see if symbol A.B is defined. If
	//		it is, it is simply returned (nothing to do).
	//	
	//		If it is not defined, it will look for "A/B.js" in the script root
	//		directory, followed by "A.js".
	//	
	//		It throws if it cannot find a file to load, or if the symbol A.B is
	//		not defined after loading.
	//	
	//		It returns the object A.B.
	//	
	//		This does nothing about importing symbols into the current package.
	//		It is presumed that the caller will take care of that. For example,
	//		to import all symbols:
	//	
	//			with (dojo._loadModule("A.B")) {
	//				...
	//			}
	//	
	//		And to import just the leaf symbol:
	//	
	//			var B = dojo._loadModule("A.B");
	//	   		...
	//	
	//		dj_load is an alias for dojo._loadModule

	omitModuleCheck = this._global_omit_module_check || omitModuleCheck;
	var module = this._loadedModules[moduleName];
	if(module){
		return module;
	}

	// convert periods to slashes
	var nsyms = moduleName.split(".");
	var syms = this._getModuleSymbols(moduleName);
	var startedRelative = ((syms[0].charAt(0) != '/') && !syms[0].match(/^\w+:/));
	var last = syms[syms.length - 1];
	var relpath;
	// figure out if we're looking for a full package, if so, we want to do
	// things slightly diffrently
	if(last=="*"){
		moduleName = nsyms.slice(0, -1).join('.');
		syms.pop();
		relpath = syms.join("/") + "/" + this._pkgFileName + '.js';
		if(startedRelative && relpath.charAt(0)=="/"){
			relpath = relpath.slice(1);
		}
	}else{
		relpath = syms.join("/") + '.js';
		moduleName = nsyms.join('.');
	}
	var modArg = (!omitModuleCheck) ? moduleName : null;
	var ok = this._loadPath(relpath, modArg);

	if((!ok)&&(!omitModuleCheck)){
		throw new Error("Could not load '" + moduleName + "'; last tried '" + relpath + "'");
	}

	// check that the symbol was defined
	// Don't bother if we're doing xdomain (asynchronous) loading.
	if((!omitModuleCheck)&&(!this["isXDomain"])){
		// pass in false so we can give better error
		module = this._loadedModules[moduleName];
		if(!module){
			throw new Error("symbol '" + moduleName + "' is not defined after loading '" + relpath + "'"); 
		}
	}

	return module;
}

dojo.require = dojo._loadModule;

dojo.provide = function(/*String*/ packageName){
	//	summary:
	//		Each javascript source file must have (exactly) one dojo.provide()
	//		call at the top of the file, corresponding to the file name.  For
	//		example, dojo/src/foo.js must have dojo.provide("dojo.foo"); at the
	//		top of the file.
	//	description:
	//		Each javascript source file is called a resource.  When a resource
	//		is loaded by the browser, dojo.provide() registers that it has been
	//		loaded.
	//	
	//		For backwards compatibility reasons, in addition to registering the
	//		resource, dojo.provide() also ensures that the javascript object
	//		for the module exists.  For example,
	//		dojo.provide("dojo.io.cometd"), in addition to registering that
	//		cometd.js is a resource for the dojo.iomodule, will ensure that
	//		the dojo.io javascript object exists, so that calls like
	//		dojo.io.foo = function(){ ... } don't fail.
	//
	//		In the case of a build (or in the future, a rollup), where multiple
	//		javascript source files are combined into one bigger file (similar
	//		to a .lib or .jar file), that file will contain multiple
	//		dojo.provide() calls, to note that it includes multiple resources.

	//Make sure we have a string.
	var fullPkgName = String(packageName);
	var strippedPkgName = fullPkgName;

	var syms = packageName.split(/\./);
	if(syms[syms.length-1]=="*"){
		syms.pop();
		strippedPkgName = syms.join(".");
	}
	var evaledPkg = dojo.getObject(strippedPkgName, true);
	this._loadedModules[fullPkgName] = evaledPkg;
	this._loadedModules[strippedPkgName] = evaledPkg;
	
	return evaledPkg; // Object
}

//Start of old bootstrap2:

dojo.platformRequire = function(/*Object containing Arrays*/modMap){
	//	description:
	//		This method taks a "map" of arrays which one can use to optionally
	//		load dojo modules. The map is indexed by the possible
	//		dojo.name_ values, with two additional values: "default"
	//		and "common". The items in the "default" array will be loaded if
	//		none of the other items have been choosen based on the
	//		hostenv.name_ item. The items in the "common" array will _always_
	//		be loaded, regardless of which list is chosen.  Here's how it's
	//		normally called:
	//	
	//			dojo.platformRequire({
	//				// an example that passes multiple args to _loadModule()
	//				browser: [
	//					["foo.bar.baz", true, true], 
	//					"foo.sample.*",
	//					"foo.test,
	//				],
	//				default: [ "foo.sample.*" ],
	//				common: [ "really.important.module.*" ]
	//			});

	// FIXME: dojo.name_ no longer works!!

	var common = modMap["common"]||[];
	var result = common.concat(modMap[dojo._name]||modMap["default"]||[]);

	for(var x=0; x<result.length; x++){
		var curr = result[x];
		if(curr.constructor == Array){
			dojo._loadModule.apply(dojo, curr);
		}else{
			dojo._loadModule(curr);
		}
	}
}


dojo.requireIf = function(/*Boolean*/ condition, /*String*/ resourceName){
	// summary:
	//		If the condition is true then call dojo.require() for the specified
	//		resource
	if(condition === true){
		// FIXME: why do we support chained require()'s here? does the build system?
		var args = [];
		for(var i = 1; i < arguments.length; i++){ 
			args.push(arguments[i]);
		}
		dojo.require.apply(dojo, args);
	}
}

dojo.requireAfterIf = dojo.requireIf;

dojo.registerModulePath = function(/*String*/module, /*String*/prefix){
	//	summary: 
	//		maps a module name to a path
	//	description: 
	//		An unregistered module is given the default path of ../<module>,
	//		relative to Dojo root. For example, module acme is mapped to
	//		../acme.  If you want to use a different module name, use
	//		dojo.registerModulePath. 
	this._modulePrefixes[module] = { name: module, value: prefix };
}

if(djConfig["modulePaths"]){
	for(var param in djConfig["modulePaths"]){
		dojo.registerModulePath(param, djConfig["modulePaths"][param]);
	}
}

dojo.requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
	// summary:
	//		Declares translated resources and loads them if necessary, in the
	//		same style as dojo.require.  Contents of the resource bundle are
	//		typically strings, but may be any name/value pair, represented in
	//		JSON format.  See also dojo.i18n.getLocalization.
	// moduleName: 
	//		name of the package containing the "nls" directory in which the
	//		bundle is found
	// bundleName: 
	//		bundle name, i.e. the filename without the '.js' suffix
	// locale: 
	//		the locale to load (optional)  By default, the browser's user
	//		locale as defined by dojo.locale
	// availableFlatLocales: 
	//		A comma-separated list of the available, flattened locales for this
	//		bundle. This argument should only be set by the build process.
	// description:
	//		Load translated resource bundles provided underneath the "nls"
	//		directory within a package.  Translated resources may be located in
	//		different packages throughout the source tree.  For example, a
	//		particular widget may define one or more resource bundles,
	//		structured in a program as follows, where moduleName is
	//		mycode.mywidget and bundleNames available include bundleone and
	//		bundletwo:
	//
	//			...
	//			mycode/
	//			 mywidget/
	//			  nls/
	//			   bundleone.js (the fallback translation, English in this example)
	//			   bundletwo.js (also a fallback translation)
	//			   de/
	//			    bundleone.js
	//			    bundletwo.js
	//			   de-at/
	//			    bundleone.js
	//			   en/
	//			    (empty; use the fallback translation)
	//			   en-us/
	//			    bundleone.js
	//			   en-gb/
	//			    bundleone.js
	//			   es/
	//			    bundleone.js
	//			    bundletwo.js
	//			  ...etc
	//			...
	//
	//		Each directory is named for a locale as specified by RFC 3066,
	//		(http://www.ietf.org/rfc/rfc3066.txt), normalized in lowercase.
	//		Note that the two bundles in the example do not define all the same
	//		variants.  For a given locale, bundles will be loaded for that
	//		locale and all more general locales above it, including a fallback
	//		at the root directory.  For example, a declaration for the "de-at"
	//		locale will first load nls/de-at/bundleone.js, then
	//		nls/de/bundleone.js and finally nls/bundleone.js.  The data will be
	//		flattened into a single Object so that lookups will follow this
	//		cascading pattern.  An optional build step can preload the bundles
	//		to avoid data redundancy and the multiple network hits normally
	//		required to load these resources.

	dojo.require("dojo.i18n");
	dojo.i18n._requireLocalization.apply(dojo.hostenv, arguments);
};

(function(){

	var ore = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$");
	var ire = new RegExp("^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$");

	dojo._Url = function(/*dojo._Url||String...*/){
		// summary: 
		//		Constructor to create an object representing a URL.
		//		It is marked as private, since we might consider removing
		//		or simplifying it.
		// description: 
		//		Each argument is evaluated in order relative to the next until
		//		a canonical uri is produced. To get an absolute Uri relative to
		//		the current document use:
		//      	new dojo._Url(document.baseURI, url)

		// TODO: support for IPv6, see RFC 2732

		// resolve uri components relative to each other
		var n = null;
		var _a = arguments;
		var uri = _a[0];
		for(var i = 1; i<_a.length; i++){
			if(!_a[i]){ continue; }

			// Safari doesn't support this.constructor so we have to be explicit
			var relobj = new dojo._Url(_a[i]+"");
			var uriobj = new dojo._Url(uri+"");

			if(
				(relobj.path=="")	&&
				(!relobj.scheme)	&&
				(!relobj.authority)	&&
				(!relobj.query)
			){
				if(relobj.fragment != null){
					uriobj.fragment = relobj.fragment;
				}
				relobj = uriobj;
			}else if(relobj.scheme == null){
				relobj.scheme = uriobj.scheme;

				if(relobj.authority == null){
					relobj.authority = uriobj.authority;

					if(relobj.path.charAt(0) != "/"){
						var path = uriobj.path.substring(0,
							uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						var segs = path.split("/");
						for(var j = 0; j < segs.length; j++){
							if(segs[j] == "."){
								if (j == segs.length - 1) { segs[j] = ""; }
								else { segs.splice(j, 1); j--; }
							}else if(j > 0 && !(j == 1 && segs[0] == "") &&
								segs[j] == ".." && segs[j-1] != ".."){

								if(j == (segs.length - 1)){
									segs.splice(j, 1); segs[j - 1] = "";
								}else{
									segs.splice(j - 1, 2); j -= 2;
								}
							}
						}
						relobj.path = segs.join("/");
					}
				}
			}

			uri = "";
			if(relobj.scheme != null){ 
				uri += relobj.scheme + ":";
			}
			if(relobj.authority != null){
				uri += "//" + relobj.authority;
			}
			uri += relobj.path;
			if(relobj.query != null){
				uri += "?" + relobj.query;
			}
			if(relobj.fragment != null){
				uri += "#" + relobj.fragment;
			}
		}

		this.uri = uri.toString();

		// break the uri into its main components
		var r = this.uri.match(ore);

		this.scheme = r[2] || (r[1] ? "" : null);
		this.authority = r[4] || (r[3] ? "" : null);
		this.path = r[5]; // can never be undefined
		this.query = r[7] || (r[6] ? "" : null);
		this.fragment  = r[9] || (r[8] ? "" : null);

		if(this.authority != null){
			// server based naming authority
			r = this.authority.match(ire);

			this.user = r[3] || null;
			this.password = r[4] || null;
			this.host = r[5];
			this.port = r[7] || null;
		}
	}

	dojo._Url.prototype.toString = function(){ return this.uri; };
})();

dojo.moduleUrl = function(/*String*/module, /*dojo._Url||String*/url){
	// summary: 
	//		returns a Url object relative to a module
	// description: 
	//		Examples: 
	//			dojo.moduleUrl("dojo.widget","templates/template.html");
	//			dojo.moduleUrl("acme","images/small.png")

	var loc = dojo._getModuleSymbols(module).join('/');
	if(!loc){ return null; }
	if(loc.lastIndexOf("/") != loc.length-1){
		loc += "/";
	}
	
	//If the path is an absolute path (starts with a / or is on another
	//domain/xdomain) then don't add the baseUrl.
	var colonIndex = loc.indexOf(":");
	if(loc.charAt(0) != "/" && (colonIndex == -1 || colonIndex > loc.indexOf("/"))){
		loc = dojo.baseUrl + loc;
	}

	return new dojo._Url(loc, url);
}

};

if(typeof window != 'undefined'){
	dojo.isBrowser = true;
	dojo._name = "browser";


	// attempt to figure out the path to dojo if it isn't set in the config
	(function(){
		var d = dojo;
		// this is a scope protection closure. We set browser versions and grab
		// the URL we were loaded from here.

		// grab the node we were loaded from
		if(document && document.getElementsByTagName){
			var scripts = document.getElementsByTagName("script");
			var rePkg = /dojo\.js([\?\.]|$)/i;
			for(var i = 0; i < scripts.length; i++){
				var src = scripts[i].getAttribute("src");
				if(!src){ continue; }
				var m = src.match(rePkg);
				if(m){
					// find out where we came from
					if(!djConfig["baseUrl"]){
						djConfig["baseUrl"] = src.substring(0, m.index);
					}
					// and find out if we need to modify our behavior
					var cfg = scripts[i].getAttribute("djConfig");
					if(cfg){
						var cfgo = eval("({ "+cfg+" })");
						for(var x in cfgo){
							djConfig[x] = cfgo[x];
						}
					}
					break; // "first Dojo wins"
				}
			}
		}
		d.baseUrl = djConfig["baseUrl"];

		// fill in the rendering support information in dojo.render.*
		var n = navigator;
		var dua = n.userAgent;
		var dav = n.appVersion;
		var tv = parseFloat(dav);

		d.isOpera = (dua.indexOf("Opera") >= 0) ? tv : 0;
		d.isKhtml = (dav.indexOf("Konqueror") >= 0)||(dav.indexOf("Safari") >= 0) ? tv : 0;
		d.isSafari = (dav.indexOf("Safari") >= 0) ? tv : 0;
		var geckoPos = dua.indexOf("Gecko");
		d.isMozilla = d.isMoz = ((geckoPos >= 0)&&(!d.isKhtml)) ? tv : 0;
		d.isFF = 0;
		d.isIE = 0;
		try{
			if(d.isMoz){
				d.isFF = parseFloat(dua.split("Firefox/")[1].split(" ")[0]);
			}
			if((document.all)&&(!d.isOpera)){
				d.isIE = parseFloat(dav.split("MSIE ")[1].split(";")[0]);
			}
		}catch(e){}

		var cm = document["compatMode"];
		d.isQuirks = (cm == "BackCompat")||(cm == "QuirksMode")||(d.isIE < 6);

		// TODO: is the HTML LANG attribute relevant?
		d.locale = djConfig.locale || (d.isIE ? n.userLanguage : n.language).toLowerCase();

		d._println = console.debug;

		// These are in order of decreasing likelihood; this will change in time.
		d._XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

		d._xhrObj= function(){
			// summary: 
			//		does the work of portably generating a new XMLHTTPRequest
			//		object.
			var http = null;
			var last_e = null;
			try{ http = new XMLHttpRequest(); }catch(e){}
			if(!http){
				for(var i=0; i<3; ++i){
					var progid = dojo._XMLHTTP_PROGIDS[i];
					try{
						http = new ActiveXObject(progid);
					}catch(e){
						last_e = e;
					}

					if(http){
						dojo._XMLHTTP_PROGIDS = [progid];  // so faster next time
						break;
					}
				}
			}

			if(!http){
				throw new Error("XMLHTTP not available: "+last_e);
			}

			return http; // XMLHTTPRequest instance
		}

		d._isDocumentOk = function(http){
			var stat = http.status || 0;
			return ( (stat>=200)&&(stat<300))|| 	// allow any 2XX response code
				(stat==304)|| 						// get it out of the cache
				(stat==1223)|| 						// Internet Explorer mangled the status code
				(!stat && (location.protocol=="file:" || location.protocol=="chrome:") ); // Boolean
		}

		d._getText = function(uri, fail_ok){
			// summary: Read the contents of the specified uri and return those contents.
			// uri:
			//		A relative or absolute uri. If absolute, it still must be in
			//		the same "domain" as we are.
			// fail_ok:
			//		Default false. If fail_ok and loading fails, return null
			//		instead of throwing.

			// alert("_getText: " + uri);

			// NOTE: must be declared before scope switches ie. this._xhrObj()
			var http = this._xhrObj();

			if(dojo._Url){
				uri = (new dojo._Url(window.location, uri)).toString();
			}
			/*
			console.debug("_getText:", uri);
			console.debug(window.location+"");
			alert(uri);
			*/

			http.open('GET', uri, false);
			try{
				http.send(null);
				if(!d._isDocumentOk(http)){
					var err = Error("Unable to load "+uri+" status:"+ http.status);
					err.status = http.status;
					err.responseText = http.responseText;
					throw err;
				}
			}catch(e){
				// console.debug(e);
				if(fail_ok){ return null; }
				throw e;
			}
			return http.responseText; // String
		}
	})();

	dojo._handleNodeEvent = function(/*DomNode*/node, /*String*/evtName, /*Function*/fp){
		// summary:
		//		non-destructively adds the specified function to the node's
		//		evtName handler.
		// node: the DomNode to add the handler to
		// evtName: should be in the form "click" for "onclick" handlers
		var oldHandler = node["on"+evtName] || function(){};
		node["on"+evtName] = function(){
			fp.apply(node, arguments);
			oldHandler.apply(node, arguments);
		}
		return true;
	}

	dojo._initFired = false;
	//	BEGIN DOMContentLoaded, from Dean Edwards (http://dean.edwards.name/weblog/2006/06/again/)
	dojo._loadInit = function(e){
		dojo._initFired = true;
		// allow multiple calls, only first one will take effect
		// A bug in khtml calls events callbacks for document for event which isnt supported
		// for example a created contextmenu event calls DOMContentLoaded, workaround
		var type = (e && e.type) ? e.type.toLowerCase() : "load";
		if(arguments.callee.initialized || (type!="domcontentloaded" && type!="load")){ return; }
		arguments.callee.initialized = true;
		if(typeof dojo["_khtmlTimer"] != 'undefined'){
			clearInterval(dojo._khtmlTimer);
			delete dojo._khtmlTimer;
		}

		if(dojo._inFlightCount == 0){
			dojo._modulesLoaded();
		}
	}

	//	START DOMContentLoaded
	// Mozilla and Opera 9 expose the event we could use
	if(document.addEventListener){
		// NOTE: 
		//		due to a threading issue in Firefox 2.0, we can't enable
		//		DOMContentLoaded on that platform. For more information, see:
		//		http://trac.dojotoolkit.org/ticket/1704
		if(dojo.isOpera|| (dojo.isMoz && (djConfig["enableMozDomContentLoaded"] === true))){
			document.addEventListener("DOMContentLoaded", dojo._loadInit, null);
		}

		//	mainly for Opera 8.5, won't be fired if DOMContentLoaded fired already.
		//  also used for Mozilla because of trac #1640
		window.addEventListener("load", dojo._loadInit, null);
	}

	// 	for Internet Explorer. readyState will not be achieved on init call,
	// 	but dojo doesn't need it however, we'll include it because we don't
	// 	know if there are other functions added that might.  Note that this has
	// 	changed because the build process strips all comments -- including
	// 	conditional ones.
	if(dojo.isIE){
		document.write('<scr'+'ipt defer src="//:" '
			+ 'onreadystatechange="if(this.readyState==\'complete\'){dojo._loadInit();}">'
			+ '</scr'+'ipt>'
		);
	}

	if(/(WebKit|khtml)/i.test(navigator.userAgent)){ // sniff
		dojo._khtmlTimer = setInterval(function(){
			if(/loaded|complete/.test(document.readyState)){
				dojo._loadInit(); // call the onload handler
			}
		}, 10);
	}
	//	END DOMContentLoaded

	// IE WebControl hosted in an application can fire "beforeunload" and "unload"
	// events when control visibility changes, causing Dojo to unload too soon. The
	// following code fixes the problem
	// Reference: http://support.microsoft.com/default.aspx?scid=kb;en-us;199155
	if(dojo.isIE){
		dojo._handleNodeEvent(window, "beforeunload", function(){
			dojo._unloading = true;
			window.setTimeout(function() {
				dojo._unloading = false;
			}, 0);
		});
	}

	dojo._handleNodeEvent(window, "unload", function(){
		if((!dojo.isIE)||(dojo.isIE && dojo._unloading)){
			dojo.unloaded();
		}
	});

	/*
	OpenAjax.subscribe("OpenAjax", "onload", function(){
		if(dojo._inFlightCount == 0){
			dojo._modulesLoaded();
		}
	});

	OpenAjax.subscribe("OpenAjax", "onunload", function(){
		dojo.unloaded();
	});
	*/

	try{
		if(dojo.isIE){
			document.namespaces.add("v","urn:schemas-microsoft-com:vml");
			document.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML)");
		}
	}catch(e){ }

	// stub, over-ridden by debugging code. This will at least keep us from
	// breaking when it's not included
	dojo._writeIncludes = function(){}

	// @global: dojo.doc
	// summary:
	//		Current document object. 'dojo.doc' can be modified
	//		for temporary context shifting. Also see dojo.withDoc().
	// description:
	//    Refer to dojo.doc rather
	//    than referring to 'window.document' to ensure your code runs
	//    correctly in managed contexts.
	dojo.doc = window["document"] || null;

	dojo.body = function(){
		// summary:
		//		return the body object associated with dojo.doc

		// Note: document.body is not defined for a strict xhtml document
		// Would like to memoize this, but dojo.doc can change vi dojo.withDoc().
		return dojo.doc.body || dojo.doc.getElementsByTagName("body")[0];
	}

	dojo.setContext = function(/*Object*/globalObject, /*DocumentElement*/globalDocument){
		// summary:
		//		changes the behavior of many core Dojo functions that deal with
		//		namespace and DOM lookup, changing them to work in a new global
		//		context. The varibles dojo.global and dojo.doc
		//		are modified as a result of calling this function.
		dojo.global = globalObject;
		dojo.doc = globalDocument;
	};

	dojo._fireCallback = function(callback, context, cbArguments){
		if((context)&&((typeof callback == "string")||(callback instanceof String))){
			callback = context[callback];
		}
		return (context ? callback.apply(context, cbArguments || [ ]) : callback());
	}

	dojo.withGlobal = function(	/*Object*/globalObject, 
								/*Function*/callback, 
								/*Object?*/thisObject, 
								/*Array?*/cbArguments){
		// summary:
		//		Call callback with globalObject as dojo.global and
		//		globalObject.document as dojo.doc. If provided, globalObject
		//		will be executed in the context of object thisObject
		// description:
		//		When callback() returns or throws an error, the dojo.global
		//		and dojo.doc will be restored to its previous state.
		var rval;
		var oldGlob = dojo.global;
		var oldDoc = dojo.doc;
		try{
			dojo.setContext(globalObject, globalObject.document);
			rval = dojo._fireCallback(callback, thisObject, cbArguments);
		}finally{
			dojo.setContext(oldGlob, oldDoc);
		}
		return rval;
	}

	dojo.withDoc = function(	/*Object*/documentObject, 
								/*Function*/callback, 
								/*Object?*/thisObject, 
								/*Array?*/cbArguments){
		// summary:
		//		Call callback with documentObject as dojo.doc. If provided,
		//		callback will be executed in the context of object thisObject
		// description:
		//		When callback() returns or throws an error, the dojo.doc will
		//		be restored to its previous state.
		var rval;
		var oldDoc = dojo.doc;
		try{
			dojo.doc = documentObject;
			rval = dojo._fireCallback(callback, thisObject, cbArguments);
		}finally{
			dojo.doc = oldDoc;
		}
		return rval;
	}

} //if (typeof window != 'undefined')

//Load debug code if necessary.
// dojo.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "dojo.debug");

//window.widget is for Dashboard detection
//The full conditionals are spelled out to avoid issues during builds.
//Builds may be looking for require/requireIf statements and processing them.
// dojo.requireIf(djConfig["debugAtAllCosts"] && !window.widget && !djConfig["useXDomain"], "dojo.browser_debug");
// dojo.requireIf(djConfig["debugAtAllCosts"] && !window.widget && djConfig["useXDomain"], "dojo.browser_debug_xd");

if(djConfig.isDebug){
	if(!console.firebug){
		dojo.require("dojo._firebug.firebug");
	}
}

dojo.provide("dojo._base.lang");

// Crockford functions (ish)

dojo.isString = function(/*anything*/ it){
	// summary:	Return true if it is a String.
	return (typeof it == "string" || it instanceof String); // Boolean
}

dojo.isArray = function(/*anything*/ it){
	// summary: Return true of it is an Array
	return (it && it instanceof Array || typeof it == "array" || ((typeof dojo["NodeList"] != "undefined") && (it instanceof dojo.NodeList))); // Boolean
}

if(dojo.isBrowser && dojo.isSafari){
	// only slow this down w/ gratuitious casting in Safari since it's what's b0rken
	dojo.isFunction = function(/*anything*/ it){
		if((typeof(it) == "function") && (it == "[object NodeList]")){ return false; }
		return (typeof it == "function" || it instanceof Function); // Boolean
	}
}else{
	dojo.isFunction = function(/*anything*/ it){
		return (typeof it == "function" || it instanceof Function); // Boolean
	}
}

dojo.isObject = function(/*anything*/ it){
	if(typeof it == "undefined"){ return false; }
	// FIXME: why true for null?
	return (it === null || typeof it == "object" || dojo.isArray(it) || dojo.isFunction(it)); // Boolean
}

dojo.isArrayLike = function(/*anything*/ it){
	// return:
	//		If it walks like a duck and quicks like a duck, return true
	var d = dojo;
	if((!it)||(typeof it == "undefined")){ return false; }
	if(d.isString(it)){ return false; }
	// keep out built-in constructors (Number, String, ...) which have length
	// properties
	if(d.isFunction(it)){ return false; } 
	if(d.isArray(it)){ return true; }
	if((it.tagName)&&(it.tagName.toLowerCase()=='form')){ return false; }
	if(isFinite(it.length)){ return true; }
	return false; // Boolean
}

dojo.isAlien = function(/*anything*/ it){
	// summary: 
	//		Returns true if it is a built-in function or some other kind of
	//		oddball that *should* report as a function but doesn't
	if(!it){ return false; }
	return !dojo.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
}

dojo._mixin = function(/*Object*/ obj, /*Object*/ props){
	// summary:
	//		Adds all properties and methods of props to obj. This addition is
	//		"prototype extension safe", so that instances of objects will not
	//		pass along prototype defaults.
	var tobj = {};
	for(var x in props){
		// the "tobj" condition avoid copying properties in "props"
		// inherited from Object.prototype.  For example, if obj has a custom
		// toString() method, don't overwrite it with the toString() method
		// that props inherited from Object.protoype
		if((typeof tobj[x] == "undefined") || (tobj[x] != props[x])){
			obj[x] = props[x];
		}
	}
	// IE doesn't recognize custom toStrings in for..in
	if(dojo.isIE && 
		(typeof(props["toString"]) == "function") && 
		(props["toString"] != obj["toString"]) && 
		(props["toString"] != tobj["toString"])
	){
		obj.toString = props.toString;
	}
	return obj; // Object
}

dojo.mixin = function(/*Object*/obj, /*Object...*/props){
	// summary:	Adds all properties and methods of props to obj. 
	for(var i=1, l=arguments.length; i<l; i++){
		dojo._mixin(obj, arguments[i]);
	}
	return obj; // Object
}

dojo.extend = function(/*Object*/ constructor, /*Object...*/ props){
	// summary:
	//		Adds all properties and methods of props to constructor's
	//		prototype, making them available to all instances created with
	//		constructor.
	for(var i=1, l=arguments.length; i<l; i++){
		dojo._mixin(constructor.prototype, arguments[i]);
	}
	return constructor; // Object
}

dojo._hitchArgs = function(scope, method /*,...*/){
	var pre = dojo._toArray(arguments, 2);
	var named = dojo.isString(method);
	return function(){
		// arrayify arguments
		var args = dojo._toArray(arguments);
		// locate our method
		var f = (named ? (scope||dojo.global)[method] : method);
		// invoke with collected args
		return (f)&&(f.apply(scope||this, pre.concat(args))); // Any
 	} // Function
}

dojo.hitch = function(/*Object*/scope, /*Function|String*/method /*,...*/){
	// summary: 
	//		Returns a function that will only ever execute in the a given scope. 
	//		This allows for easy use of object member functions
	//		in callbacks and other places in which the "this" keyword may
	//		otherwise not reference the expected scope. 
	//		Any number of default positional arguments may be passed as parameters 
	//		beyond "method".
	//		Each of these values will be used to "placehold" (similar to curry)
	//		for the hitched function. 
	// scope: 
	//		The scope to use when method executes. If method is a string, 
	//		scope is also the object containing method.
	// method:
	//		A function to be hitched to scope, or the name of the method in
	//		scope to be hitched.
	// usage:
	//		dojo.hitch(foo, "bar")(); // runs foo.bar() in the scope of foo
	//		dojo.hitch(foo, myFunction); // returns a function that runs myFunction in the scope of foo
	if(arguments.length > 2){
		return dojo._hitchArgs.apply(dojo, arguments);
	}
	if(!method){
		method = scope;
		scope = null;
	}
	if(dojo.isString(method)){
		scope = scope || dojo.global;
		if (!scope[method]) throw(['dojo.hitch: scope["', method, '"] is null (scope="', scope, '")'].join(''))
		return function(){ return scope[method].apply(scope, arguments||[]); }
	}else{
		return (!scope ? method : function(){ return method.apply(scope, arguments||[]); });
	}
}

dojo._delegate = function(obj, props){
	// boodman/crockford delegation
	function TMP(){};
	TMP.prototype = obj;
	var tmp = new TMP();
	if(props){
		dojo.mixin(tmp, props);
	}
	return tmp;
}

dojo.partial = function(/*Function|String*/method /*, ...*/){
	// summary:
	//		similar to hitch() except that the scope object is left to be
	//		whatever the execution context eventually becomes. This is the
	//		functional equivalent of calling:
	//		dojo.hitch(null, funcName, ...);
	var arr = [ null ];
	return dojo.hitch.apply(dojo, arr.concat(dojo._toArray(arguments)));
}

dojo._toArray = function(/*Object*/obj, /*Number?*/offset){
	// summary:
	//		Converts an array-like object (i.e. arguments, DOMCollection)
	//		to an array. Returns a new Array object.
	var arr = [];
	for(var x= offset||0; x<obj.length; x++){
		arr.push(obj[x]);
	}
	return arr;
}


dojo.provide("dojo._base.declare");


// this file courtesy of the TurboAjax group, licensed under a Dojo CLA

dojo.declare = function(/*String*/ className, 
						/*Function||Array*/ superclass, 
						/*Function*/ init, 
						/*Object*/ props){
	//	summary: 
	//		Create a feature-rich constructor from compact notation
	//	className: String
	//		the name of the constructor (loosely, a "class")
	//		stored in the "declaredClass" property in the created prototype
	// 	superclass: Function||Array
	//		may be a Function, or an Array of Functions. If "superclass" is an
	//		array, the first element is used as the prototypical ancestor and
	//		any following Functions become mixin ancestors.
	//	init: Function?
	//    an initializer function called when an object is instantiated
	//		from this constructor.
	//	props: Object?||Array?
	//		an object (or array of objects) whose properties are copied to the
	//		created prototype
	//	description:
	//		Create a constructor using a compact notation for inheritance and
	//		prototype extension. 
	//
	//		All superclasses (including mixins) must be Functions (not simple Objects).
	//
	//		Mixin ancestors provide a type of multiple inheritance.
	//	
	//		Prototypes of mixin ancestors are copied to the new class.
	//
	//		"className" is cached in "declaredClass" property of the new class.
	//
	// usage:
	//		dojo.declare("my.classes.bar", my.classes.foo,
	//			function(){
	//				// initialization function
	//				this.myComplicatedObject = new ReallyComplicatedObject(); 
	//			},{ 
	//				// properties to be added to the class prototype
	//				someValue: 2,
	//				someMethod: function(){ 
	//					doStuff(); 
	//				}
	//			}
	//		);
	
	// argument juggling
	if(dojo.isFunction(props)||(!props&&!dojo.isFunction(init))){ 
		var t=props; props=init; init=t;
	}	
	// our constructor boilerplate (this is cloned, so keep it short)
	var ctor = function(){this._construct(arguments);}
	// alias declare, ensure props, make mixin array
	var dd=dojo.declare, p=props || {}, mixins=[], pc;
	// extract mixins
	if(dojo.isArray(superclass)){
		mixins = superclass;
		superclass = mixins.shift();
	}
	// chain prototypes
	var scp = superclass ? superclass.prototype : null;
	if(scp){ctor.prototype = dojo._delegate(scp);}
	// cache ancestry, attach fancy extension mechanism
	dojo.mixin(ctor, {superclass: scp, mixins: mixins, extend: dd._extend});
	// extend with mixin classes
	for(var i=0,m;(m=mixins[i]);i++){dojo.extend(ctor, m.prototype);}
	// locate initializer
	init = init || (pc=p.constructor)&&(pc!=Object)&&pc || null;
	// decorate the prototype
	dojo.extend(ctor, {declaredClass: className, _initializer: init, preamble: null}, p, dd._core); 
	// do this last (doesn't work via extend anyway)
	ctor.prototype.constructor = ctor;
	// create named reference
	return dojo.setObject(className, ctor); // Function
}

dojo.mixin(dojo.declare, {
	_extend: function(mixin, preamble) {
		dojo.extend(this, mixin);
		this.mixins.push(!preamble ? mixin : function() { mixin.apply(this, preamble.apply(this, arguments) || arguments); });
	},
	_core: {
		_construct: function(args) {
			var c=args.callee, s=c.superclass, ct=s&&s.constructor, a=args, ii;
			// call any preamble
			if(fn=c.prototype.preamble){a = fn.apply(this, a) || a;}
			// initialize superclass
			if(ct&&ct.apply){ct.apply(this, a)};
			// initialize mixins
			for(var i=0, m; (m=c.mixins[i]); i++){if(m.apply){m.apply(this, a);}}
			// call our own initializer
			var ii = c.prototype._initializer;
			if(ii){ii.apply(this, args);}
		},
		inherited: function(name, args, newArgs){
			var c=args.callee, p=this.constructor.prototype, a=newArgs||args, fn;
			// if not an instance override 
			if (this[name]!=c || p[name]==c) {
				// seek the prototype which contains callee
				while(p && (p[name]!==c)){p=p.constructor.superclass;}
				// not found means user error
				if(!p){ throw(this.toString() + ': name argument ("' + name + '") to inherited must match callee (declare.js)');	}
				// find the eldest prototype which does not contain callee
				while(p && (p[name]==c)){p=p.constructor.superclass;}
			}
			// if the function exists, invoke it in our scope
			return (fn=p&&p[name])&&(fn.apply(this, a));
		}
	}
});	

dojo.provide("dojo._base.connect");


// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

// FIXME: needs in-code docs in the worst way!!

// low-level delegation machinery
dojo._listener = {
	// create a dispatcher function
	getDispatcher: function(){
		// following comments pulled out-of-line to prevent cloning them 
		// in the returned function.
		// - indices (i) that are really in the array of listeners (ls) will 
		//   not be in Array.prototype. This is the 'sparse array' trick
		//   that keeps us safe from libs that take liberties with built-in 
		//   objects
		// - listener is invoked with current scope (this)
		return function(){
			var ls = arguments.callee.listeners;
			for(var i in ls){
				if(!(i in Array.prototype)){
					ls[i].apply(this, arguments);
				}
			}
		}
	},
	// add a listener to an object
	add: function(/*Object*/ source, /*String*/ method, /*Function*/ listener){
		// Whenever 'method' is invoked, 'listener' will have the same scope.
		// Trying to supporting a context object for the listener led to 
		// complexity. 
		// Non trivial to provide 'once' functionality here
		// because listener could be the result of a dojo.hitch call,
		// in which case two references to the same hitch target would not
		// be equivalent. 
		source = source || dojo.global;
		// The source method is either null, a dispatcher, or some other function
		var f = source[method];
		// Ensure a dispatcher
		if(!f||!f.listeners){
			var d = dojo._listener.getDispatcher();
			// dispatcher holds a list of handlers
			d.listeners = (f ? [f] : []);
			// put back in source			
			f = source[method] = d;
		}
		// The contract is that a handle is returned that can 
		// identify this listener for disconnect. 
		//
		// The type of the handle is private. Here is it implemented as Integer. 
		// DOM event code has this same contract but handle is Function 
		// in non-IE browsers.
		//
		// Could implement 'before' with a flag and unshift.
		return f.listeners.push(listener) ; /*Handle*/
	},
	// remove a listener from an object
	remove: function(/*Object*/ source, /*String*/ method, /*Handle*/ handle){
		var f = (source||dojo.global)[method];
		// remember that handle is the index+1 (0 is not a valid handle)
		if(f && f.listeners && handle--){	
			delete f.listeners[handle]; 
		}
	}
};

// Multiple delegation for arbitrary methods.

// This unit knows nothing about DOM, 
// but we include DOM aware 
// documentation and dontFix
// argument here to help the autodocs.
// Actual DOM aware code is in event.js.

dojo.connect = function(/*Object|null*/ obj, 
						/*String*/ event, 
						/*Object|null*/ context, 
						/*String|Function*/ method,
						/*Boolean*/ dontFix){
	// summary:
	//		Create a link that calls one function when another executes. 
	// description:
	//		Connects method to event, so that after event fires, method
	//		does too. Connect as many methods to event as needed.
	//
	//		event must be a string. If obj is null, dojo.global is used.
	//
	//		null arguments may simply be omitted.
	//
	//		obj[event] can resolve to a function or undefined (null). 
	//		If obj[event] is null, it is assigned a function.
	//
	//		The return value is a handle that is needed to 
	//		remove this connection with dojo.disconnect.
	// obj: 
	//		The source object for the event function. 
	//		Defaults to dojo.global if null.
	//		If obj is a DOM node, the connection is delegated 
	//		to the DOM event manager (unless dontFix is true).
	// event:
	//		String name of the event function in obj. 
	//		I.e. identifies a property obj[event].
	// context: 
	//		The object that method will receive as "this".
	//
	//		If context is null and method is a function, then method
	//		inherits the context of event.
	//	
	//		If method is a string then context must be the source 
	//		object object for method (context[method]). If context is null,
	//		dojo.global is used.
	// method:
	//		A function reference, or name of a function in context. 
	//		The function identified by method fires after event does. 
	//		method receives the same arguments as the event.
	//		See context argument comments for information on method's scope.
	// dontFix:
	//		If obj is a DOM node, set dontFix to true to  prevent delegation 
	//		of this connection to the DOM event manager. 
	// usage:
	//		// when obj.onchange(), do ui.update()
	//		dojo.connect(obj, "onchange", ui, "update");
	//		dojo.connect(obj, "onchange", ui, ui.update); // same
	//
	//		// using return value for disconnect
	//		var link = dojo.connect(obj, "onchange", ui, "update");
	//		...
	//		dojo.disconnect(link);
	//
	//		// when onglobalevent executes, watcher.handler is invoked
	//		dojo.connect(null, "onglobalevent", watcher, "handler");
	//
	//		// when ob.onCustomEvent executes, customEventHandler is invoked
	//		dojo.connect(ob, "onCustomEvent", null, "customEventHandler");
	//		dojo.connect(ob, "onCustomEvent", "customEventHandler"); // same
	//
	//		// when ob.onCustomEvent executes, customEventHandler is invoked
	//		// with the same scope (this)
	//		dojo.connect(ob, "onCustomEvent", null, customEventHandler);
	//		dojo.connect(ob, "onCustomEvent", customEventHandler); // same
	//
	//		// when globalEvent executes, globalHandler is invoked
	//		// with the same scope (this)
	//		dojo.connect(null, "globalEvent", null, globalHandler);
	//		dojo.connect("globalEvent", globalHandler); // same

	// normalize arguments
	var a=arguments, args=[], i=0;
	// if a[0] is a String, obj was ommited
	args.push(dojo.isString(a[0]) ? null : a[i++], a[i++]);
	// if the arg-after-next is a String or Function, context was NOT omitted
	var a1 = a[i+1];
	args.push(dojo.isString(a1)||dojo.isFunction(a1) ? a[i++] : null, a[i++]);
	// absorb any additional arguments
	for (var l=a.length; i<l; i++){	args.push(a[i]); }
	// do the actual work
	return dojo._connect.apply(this, args); /*Handle*/
}

dojo._connect = function(obj, event, context, method){
	var h = dojo._listener.add(obj, event, dojo.hitch(context, method)); 
	return [obj, event, h]; /*Handle*/
}

dojo.disconnect = function(/*Handle*/ handle){
	// summary:
	//		Remove a link created by dojo.connect.
	// description:
	//		Removes the connection between event and the method referenced by handle.
	// handle:
	//		the return value of the dojo.connect call that created the connection.
	dojo._disconnect.apply(this, handle);
	if (handle && handle[0]!=undefined){
		dojo._disconnect.apply(this, handle);
		// let's not keep this reference
		delete handle[0];
	}
}

dojo._disconnect = function(obj, event, handle){
	dojo._listener.remove(obj, event, handle);
}

// topic publish/subscribe

dojo._topics = {};

dojo.subscribe = function(/*String*/ topic, /*Object|null*/ context, /*String|Function*/ method){
	// support for 3 argument invocation depends on hitch
	return dojo._listener.add(dojo._topics, topic, dojo.hitch(context, method)); /*Handle*/
}

dojo.unsubscribe = function(/*String*/ topic, /*Handle*/ handle){
	dojo._listener.remove(dojo._topics, topic, handle);
}

dojo.publish = function(/*String*/ topic, /*Array*/ args){
	// Note that args is an array. This is more efficient vs variable length argument list.
	// Ideally, by convention, var args are implemented via Array throughout the APIs.
	var f = dojo._topics[topic];
	(f)&&(f.apply(this, args||[]));
}

dojo.provide("dojo._base.Deferred");


// FIXME: need to port tests in!!

dojo.Deferred = function(/*Function?*/ canceller){
	// summary:
	//		Encapsulates a sequence of callbacks in response to a value that
	//		may not yet be available.  This is modeled after the Deferred class
	//		from Twisted <http://twistedmatrix.com>.
	// description:
	//		JavaScript has no threads, and even if it did, threads are hard.
	//		Deferreds are a way of abstracting non-blocking events, such as the
	//		final response to an XMLHttpRequest. Deferreds create a promise to
	//		return a response a some point in the future and an easy way to
	//		register your interest in receiving that response.
	//
	//		The most important methods for Deffered users are:
	//
	//			addCallback(handler)
	//			addErrback(handler)
	//			callback(result)
	//			errback(result)
	//
	//		In general, when a function returns a Deferred, users then "fill
	//		in" the second half of the contract by registering callbacks and
	//		error handlers. You may register as many callback and errback
	//		handlers as you like and they will be executed in the order
	//		registered when a result is provided. Usually this result is
	//		provided as the result of an asynchronous operation. The code
	//		"managing" the Deferred (the code that made the promise to provide
	//		an answer later) will use the callback() and errback() methods to
	//		communicate with registered listeners about the result of the
	//		operation. At this time, all registered result handlers are called
	//		*with the most recent result value*.
	//
	//		Deferred callback handlers are treated as a chain, and each item in
	//		the chain is required to return a value that will be fed into
	//		successive handlers. The most minimal callback may be registered
	//		like this:
	//
	//			var d = new dojo.Deferred();
	//			d.addCallback(function(result){ return result; });
	//
	//		Perhaps the most common mistake when first using Deferreds is to
	//		forget to return a value (in most cases, the value you were
	//		passed).
	//
	//		The sequence of callbacks is internally represented as a list of
	//		2-tuples containing the callback/errback pair.  For example, the
	//		following call sequence:
	//		
	//			var d = new dojo.Deferred();
	//			d.addCallback(myCallback);
	//			d.addErrback(myErrback);
	//			d.addBoth(myBoth);
	//			d.addCallbacks(myCallback, myErrback);
	//
	//		is translated into a Deferred with the following internal
	//		representation:
	//
	//		[
	//			[myCallback, null],
	//			[null, myErrback],
	//			[myBoth, myBoth],
	//			[myCallback, myErrback]
	//		]
	//
	//		The Deferred also keeps track of its current status (fired).  Its
	//		status may be one of three things:
	//
	//			-1: no value yet (initial condition)
	//			0: success
	//			1: error
	//	
	//		A Deferred will be in the error state if one of the following three
	//		conditions are met:
	//
	//			1. The result given to callback or errback is "instanceof" Error
	//			2. The previous callback or errback raised an exception while
	//			   executing
	//			3. The previous callback or errback returned a value
	//			   "instanceof" Error
	//
	//		Otherwise, the Deferred will be in the success state. The state of
	//		the Deferred determines the next element in the callback sequence
	//		to run.
	//
	//		When a callback or errback occurs with the example deferred chain,
	//		something equivalent to the following will happen (imagine that
	//		exceptions are caught and returned):
	//
	//			// d.callback(result) or d.errback(result)
	//			if(!(result instanceof Error)){
	//				result = myCallback(result);
	//			}
	//			if(result instanceof Error){
	//				result = myErrback(result);
	//			}
	//			result = myBoth(result);
	//			if(result instanceof Error){
	//				result = myErrback(result);
	//			}else{
	//				result = myCallback(result);
	//			}
	//
	//		The result is then stored away in case another step is added to the
	//		callback sequence.	Since the Deferred already has a value
	//		available, any new callbacks added will be called immediately.
	//
	//		There are two other "advanced" details about this implementation
	//		that are useful:
	//
	//		Callbacks are allowed to return Deferred instances themselves, so
	//		you can build complicated sequences of events with ease.
	//
	//		The creator of the Deferred may specify a canceller.  The canceller
	//		is a function that will be called if Deferred.cancel is called
	//		before the Deferred fires. You can use this to implement clean
	//		aborting of an XMLHttpRequest, etc. Note that cancel will fire the
	//		deferred with a CancelledError (unless your canceller returns
	//		another kind of error), so the errbacks should be prepared to
	//		handle that error for cancellable Deferreds.
	// usage:
	//		Deferred objects are often used when making code asynchronous. It
	//		may be easiest to write functions in a synchronous manner and then
	//		split code using a deferred to trigger a response to a long-lived
	//		operation. For example, instead of register a callback function to
	//		denote when a rendering operation completes, the function can
	//		simply return a deferred:
	//
	//			// callback style:
	//			function renderLotsOfData(data, callback){
	//				var success = false
	//				try{
	//					for(var x in data){
	//						renderDataitem(data[x]);
	//					}
	//					success = true;
	//				}catch(e){ }
	//				if(callback){
	//					callback(success);
	//				}
	//			}
	//
	//			// using callback style
	//			renderLotsOfData(someDataObj, function(success){
	//				// handles success or failure
	//				if(!success){
	//					promptUserToRecover();
	//				}
	//			});
	//			// NOTE: no way to add another callback here!!
	//
	//		Using a Deferred doesn't simplify the sending code any, but it
	//		provides a standard interface for callers and senders alike,
	//		providing both with a simple way to service multiple callbacks for
	//		an operation and freeing both sides from worrying about details
	//		such as "did this get called already?". With Deferreds, new
	//		callbacks can be added at any time.
	//
	//			// Deferred style:
	//			function renderLotsOfData(data, callback){
	//				var d = new dojo.Deferred();
	//				try{
	//					for(var x in data){
	//						renderDataitem(data[x]);
	//					}
	//					d.callback(true);
	//				}catch(e){ 
	//					d.errback(new Error("rendering failed"));
	//				}
	//				return d;
	//			}
	//
	//			// using Deferred style
	//			renderLotsOfData(someDataObj).addErrback(function(){
	//				promptUserToRecover();
	//			});
	//			// NOTE: addErrback and addCallback both return the Deferred
	//			// again, so we could chain adding callbacks or save the
	//			// deferred for later should we need to be notified again.
	//
	//		In this example, renderLotsOfData is syncrhonous and so both
	//		versions are pretty artificial. Putting the data display on a
	//		timeout helps show why Deferreds rock:
	//
	//			// Deferred style and async func
	//			function renderLotsOfData(data, callback){
	//				var d = new dojo.Deferred();
	//				setTimeout(function(){
	//					try{
	//						for(var x in data){
	//							renderDataitem(data[x]);
	//						}
	//						d.callback(true);
	//					}catch(e){ 
	//						d.errback(new Error("rendering failed"));
	//					}
	//				}, 100);
	//				return d;
	//			}
	//
	//			// using Deferred style
	//			renderLotsOfData(someDataObj).addErrback(function(){
	//				promptUserToRecover();
	//			});
	//
	//		Note that the caller doesn't have to change his code at all to
	//		handle the asynchronous case.

	this.chain = [];
	this.id = this._nextId();
	this.fired = -1;
	this.paused = 0;
	this.results = [null, null];
	this.canceller = canceller;
	this.silentlyCancelled = false;
};

dojo.extend(dojo.Deferred, {
	_getFunctionFromArgs: function(){
		// summary:
		//		takes one or two arguments and does type detection to determine
		//		if they contain enough information to return a function from
		//		them. If a scope and function name are provided a version o
		//		that function hitched to the passed scope will be returned.
		// usage: FIXME
		var a = arguments;
		if((a[0])&&(!a[1])){
			if(dojo.isFunction(a[0])){
				return a[0];
			}else if(dojo.isString(a[0])){
				return dojo.global[a[0]];
			}
		}else if((a[0])&&(a[1])){
			return dojo.hitch(a[0], a[1]);
		}
		return null;
	},

	makeCalled: function(){
		// summary:
		//		returns a new, empty deferred, which is already in the called
		//		state. Calling callback() or errback() on this deferred will
		//		yeild an error and adding new handlers to it will result in
		//		them being called immediately.
		var deferred = new dojo.Deferred();
		deferred.callback();
		return deferred;
	},

	toString: function(){
		var state;
		if(this.fired == -1){
			state = 'unfired';
		}else if(this.fired == 0){
			state = 'success';
		}else{
			state = 'error';
		}
		return 'Deferred(' + this.id + ', ' + state + ')';
	},

	_nextId: (function(){
		var n = 1;
		return function(){ return n++; };
	})(),

	cancel: function(){
		// summary:	
		//		Cancels a Deferred that has not yet received a value, or is
		//		waiting on another Deferred as its value.
		// description:
		//		If a canceller is defined, the canceller is called. If the
		//		canceller did not return an error, or there was no canceller,
		//		then the errback chain is started.
		if(this.fired == -1){
			if (this.canceller){
				this.canceller(this);
			}else{
				this.silentlyCancelled = true;
			}
			if(this.fired == -1){
				this.errback(new Error(this.toString()));
			}
		}else if(	(this.fired == 0) &&
					(this.results[0] instanceof dojo.Deferred)
		){
			this.results[0].cancel();
		}
	},
			

	_pause: function(){
		// summary: 
		//		Used internally to signal that it's waiting on another Deferred
		this.paused++;
	},

	_unpause: function(){
		// summary: 
		//		Used internally to signal that it's no longer waiting on
		//		another Deferred.
		this.paused--;
		if(
			(this.paused == 0) && 
			(this.fired >= 0)
		){
			this._fire();
		}
	},

	_continue: function(res){
		// summary: 
		//		Used internally when a dependent deferred fires.
		this._resback(res);
		this._unpause();
	},

	_resback: function(res){
		// summary:
		//		The private primitive that means either callback or errback
		this.fired = ((res instanceof Error) ? 1 : 0);
		this.results[this.fired] = res;
		this._fire();
	},

	_check: function(){
		if(this.fired != -1){
			if(!this.silentlyCancelled){
				throw new Error("already called!");
			}
			this.silentlyCancelled = false;
			return;
		}
	},

	callback: function(res){
		// summary:	Begin the callback sequence with a non-error value.
		
		/*
		callback or errback should only be called once on a given
		Deferred.
		*/
		this._check();
		this._resback(res);
	},

	errback: function(/*Error*/res){
		// summary: 
		//		Begin the callback sequence with an error result.
		this._check();
		if(!(res instanceof Error)){
			res = new Error(res);
		}
		this._resback(res);
	},

	addBoth: function(/*Function||Object*/cb, /*Optional, String*/cbfn){
		// summary:
		//		Add the same function as both a callback and an errback as the
		//		next element on the callback sequence.	This is useful for code
		//		that you want to guarantee to run, e.g. a finalizer.
		var enclosed = this._getFunctionFromArgs(cb, cbfn);
		if(arguments.length > 2){
			enclosed = dojo.partial(enclosed, arguments, 2);
		}
		return this.addCallbacks(enclosed, enclosed);
	},

	addCallback: function(cb, cbfn){
		// summary: 
		//		Add a single callback to the end of the callback sequence.
		var enclosed = this._getFunctionFromArgs(cb, cbfn);
		if(arguments.length > 2){
			enclosed = dojo.partial(enclosed, arguments, 2);
		}
		return this.addCallbacks(enclosed, null);
	},

	addErrback: function(cb, cbfn){
		// summary: 
		//		Add a single callback to the end of the callback sequence.
		var enclosed = this._getFunctionFromArgs(cb, cbfn);
		if(arguments.length > 2){
			enclosed = dojo.partial(enclosed, arguments, 2);
		}
		return this.addCallbacks(null, enclosed);
		return this.addCallbacks(null, cbfn);
	},

	addCallbacks: function(cb, eb){
		// summary: 
		//		Add separate callback and errback to the end of the callback
		//		sequence.
		this.chain.push([cb, eb])
		if(this.fired >= 0){
			this._fire();
		}
		return this;
	},

	_fire: function(){
		// summary: 
		//		Used internally to exhaust the callback sequence when a result
		//		is available.
		var chain = this.chain;
		var fired = this.fired;
		var res = this.results[fired];
		var self = this;
		var cb = null;
		while(
			(chain.length > 0) &&
			(this.paused == 0)
		){
			// Array
			var pair = chain.shift();
			var f = pair[fired];
			if(f == null){
				continue;
			}
			try{
				res = f(res);
				fired = ((res instanceof Error) ? 1 : 0);
				if(res instanceof dojo.Deferred){
					cb = function(res){
						self._continue(res);
					}
					this._pause();
				}
			}catch(err){
				fired = 1;
				res = err;
			}
		}
		this.fired = fired;
		this.results[fired] = res;
		if((cb)&&(this.paused)){
			// this is for "tail recursion" in case the dependent
			// deferred is already fired
			res.addBoth(cb);
		}
	}
});

dojo.provide("dojo._base.json");

dojo.fromJson = function(/*String*/ json){
	// summary:
	// 		evaluates the passed string-form of a JSON object
	// json: 
	//		a string literal of a JSON item, for instance:
	//			'{ "foo": [ "bar", 1, { "baz": "thud" } ] }'
	// return:
	//		the result of the evaluation

	// FIXME: should this accept mozilla's optional second arg?
	try {
		return eval("(" + json + ")");
	}catch(e){
		console.debug(e);
		return json;
	}
}

dojo._escapeString = function(/*String*/str){
	//summary:
	//		Adds escape sequences for non-visual characters, double quote and
	//		backslash and surrounds with double quotes to form a valid string
	//		literal.
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"'
		).replace(/[\f]/g, "\\f"
		).replace(/[\b]/g, "\\b"
		).replace(/[\n]/g, "\\n"
		).replace(/[\t]/g, "\\t"
		).replace(/[\r]/g, "\\r"); // string
}

dojo.toJsonIndentStr = "\t";
dojo.toJson = function(/*Object*/ it, /*Boolean?*/ prettyPrint, /*String?*/ _indentStr){
	// summary:
	//		Create a JSON serialization of an object. 
	//		Note that this doesn't check for infinite recursion, so don't do that!
	//
	// it:
	//		an object to be serialized. Objects may define their own
	//		serialization via a special "__json__" or "json" function
	//		property. If a specialized serializer has been defined, it will
	//		be used as a fallback.
	//
	// prettyPrint:
	//		if true, we indent objects and arrays to make the output prettier.
	//		The variable dojo.toJsonIndentStr is used as the indent string 
	//		-- to use something other than the default (tab), 
	//		change that variable before calling dojo.toJson().
	//
	// _indentStr:
	//		private variable for recursive calls when pretty printing, do not use.
	//		
	// return:
	//		a String representing the serialized version of the passed object.

	_indentStr = _indentStr || "";
	var nextIndent = (prettyPrint ? _indentStr + dojo.toJsonIndentStr : "");
	var newLine = (prettyPrint ? "\n" : "");
	var objtype = typeof(it);
	if(objtype == "undefined"){
		return "undefined";
	}else if((objtype == "number")||(objtype == "boolean")){
		return it + "";
	}else if(it === null){
		return "null";
	}
	if(objtype == "string"){ return dojo._escapeString(it); }
	// recurse
	var recurse = arguments.callee;
	// short-circuit for objects that support "json" serialization
	// if they return "self" then just pass-through...
	var newObj;
	if(typeof it.__json__ == "function"){
		newObj = it.__json__();
		if(it !== newObj){
			return recurse(newObj, prettyPrint, nextIndent);
		}
	}
	if(typeof it.json == "function"){
		newObj = it.json();
		if(it !== newObj){
			return recurse(newObj, prettyPrint, nextIndent);
		}
	}
	// array
	if(dojo.isArray(it)){
		var res = [];
		for(var i = 0; i < it.length; i++){
			var val = recurse(it[i], prettyPrint, nextIndent);
			if(typeof(val) != "string"){
				val = "undefined";
			}
			res.push(newLine + nextIndent + val);
		}
		return "[" + res.join(",") + newLine + _indentStr + "]";
	}
	/*
	// look in the registry
	try {
		window.o = it;
		newObj = dojo.json.jsonRegistry.match(it);
		return recurse(newObj, prettyPrint, nextIndent);
	}catch(e){
		// console.debug(e);
	}
	// it's a function with no adapter, skip it
	*/
	if(objtype == "function"){
		return null;
	}
	// generic object code path
	var output = [];
	for(var key in it){
		var keyStr;
		if(typeof(key) == "number"){
			keyStr = '"' + key + '"';
		}else if(typeof(key) == "string"){
			keyStr = dojo._escapeString(key);
		}else{
			// skip non-string or number keys
			continue;
		}
		val = recurse(it[key], prettyPrint, nextIndent);
		if(typeof(val) != "string"){
			// skip non-serializable values
			continue;
		}
		// FIXME: use += on Moz!!
		//	 MOW NOTE: using += is a pain because you have to account for the dangling comma...
		output.push(newLine + nextIndent + keyStr + ":" + val);
	}
	return "{" + output.join(",") + newLine + _indentStr + "}";
}


dojo.provide("dojo._base.array");

(function(){
	var d = dojo;
	if(Array.forEach){
		// fast, if we can
		var tn = ["indexOf", "lastIndexOf", "every", "some", "forEach", "filter", "map"];
		for(var x=0; x<tn.length; x++){
			d[tn[x]] = Array[tn[x]];
		}
	}else{
		var _getParts = function(arr, obj){
			return [ (d.isString(arr) ? arr.split("") : arr), (obj||d.global) ];
		}

		d.mixin(d, {
			indexOf: function(	/*Array*/		array, 
								/*Object*/		value,
								/*Integer*/		fromIndex,
								/*Boolean?*/	findLast){
				// summary:
				//		locates the first index of the provided value in the passed
				//		array. If the value is not found, -1 is returned.
				// description:
				//		For details on this method, see:
				// 			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf

				/* // negative indexes
				if(fromIndex < 0){
					fromIndex = array.length+fromIndex;
				}
				*/

				// FIXME: use built in indexOf and lastIndexOf if available.
				if(findLast){
					var step = -1, i = (fromIndex||array.length - 1), end = -1;
				}else{
					var step = 1, i = (fromIndex||0), end = array.length;
				}
				for(; i!=end; i+=step){
					if(array[i] == value){ return i; }
				}
				return -1;	// number
			},

			lastIndexOf: function(/*Array*/array, /*Object*/value, /*boolean?*/identity){
				// summary:
				//		locates the lat index of the provided value in the passed
				//		array. If the value is not found, -1 is returned.
				// description:
				//		For details on this method, see:
				// 			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:lastIndexOf
				return d.indexOf(array, value, identity, true); // number
			},

			map: function(/*Array*/arr, /*Function*/func, /*Function?*/obj){
				// summary:
				//		applies a function to each element of an Array and creates
				//		an Array with the results
				// description:
				//		returns a new array constituted from the return values of
				//		passing each element of arr into unary_func. The obj parameter
				//		may be passed to enable the passed function to be called in
				//		that scope.  In environments that support JavaScript 1.6, this
				//		function is a passthrough to the built-in map() function
				//		provided by Array instances. For details on this, see:
				// 			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
				// usage:
				//		dojo.map([1, 2, 3, 4], function(item){ return item+1 });
				//		// returns [2, 3, 4, 5]
				var _p = _getParts(arr, obj); arr = _p[0]; obj = _p[1];
				var outArr = [];
				for(var i=0;i<arr.length;++i){
					outArr.push(func.call(obj, arr[i]));
				}
				return outArr; // Array
			},

			forEach: function(/*Array*/arr, /*Function*/callback, /*Object?*/obj){
				// summary:
				//		for every item in arr, call callback with that item as its
				//		only parameter.
				// description:
				//		Return values are ignored. This function
				//		corresponds (and wraps) the JavaScript 1.6 forEach method. For
				//		more details, see:
				//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach

				// match the behavior of the built-in forEach WRT empty arrs
				if((!arr)||(!arr.length)){ return; }

				// FIXME: there are several ways of handilng thisObject. Is
				// dojo.global always the default context?
				var _p = _getParts(arr, obj); arr = _p[0]; obj = _p[1];
				for(var i=0,l=arr.length; i<l; i++){ 
					callback.call(obj, arr[i], i, arr);
				}
			},

			_everyOrSome: function(/*Boolean*/every, /*Array*/arr, /*Function*/callback, /*Object?*/obj){
				var _p = _getParts(arr, obj); arr = _p[0]; obj = _p[1];
				for(var i=0,l=arr.length; i<l; i++){
					var result = callback.call(obj, arr[i], i, arr);
					if(every && !result){
						return false; // Boolean
					}else if((!every)&&(result)){
						return true; // Boolean
					}
				}
				return (!!every); // Boolean
			},

			every: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
				// summary:
				//		determines whether or not every item in the array satisfies the
				//		condition implemented by callback. thisObject may be used to
				//		scope the call to callback. The function signature is derived
				//		from the JavaScript 1.6 Array.every() function. More
				//		information on this can be found here:
				//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every
				// usage:
				//		dojo.every([1, 2, 3, 4], function(item){ return item>1; });
				//		// returns false
				//		dojo.every([1, 2, 3, 4], function(item){ return item>0; });
				//		// returns true 
				return this._everyOrSome(true, arr, callback, thisObject); // Boolean
			},

			some: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
				// summary:
				//		determines whether or not any item in the array satisfies the
				//		condition implemented by callback. thisObject may be used to
				//		scope the call to callback. The function signature is derived
				//		from the JavaScript 1.6 Array.some() function. More
				//		information on this can be found here:
				//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
				// examples:
				//		dojo.some([1, 2, 3, 4], function(item){ return item>1; });
				//		// returns true
				//		dojo.some([1, 2, 3, 4], function(item){ return item<1; });
				//		// returns false
				return this._everyOrSome(false, arr, callback, thisObject); // Boolean
			},

			filter: function(/*Array*/arr, /*Function*/callback, /*Object?*/obj){
				// summary:
				//		returns a new Array with those items from arr that match the
				//		condition implemented by callback. ob may be used to
				//		scope the call to callback. The function signature is derived
				//		from the JavaScript 1.6 Array.filter() function.
				//
				//		More information on the JS 1.6 API can be found here:
				//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
				// examples:
				//		dojo.filter([1, 2, 3, 4], function(item){ return item>1; });
				//		// returns [2, 3, 4]

				var _p = _getParts(arr, obj); arr = _p[0]; obj = _p[1];
				var outArr = [];
				for(var i = 0; i < arr.length; i++){
					if(callback.call(obj, arr[i], i, arr)){
						outArr.push(arr[i]);
					}
				}
				return outArr; // Array
			}
		});
	}
})();

dojo.provide("dojo._base");






// dojo.requireIf(dojo.isBrowser, "dojo._base.browserConnect");







// dojo.requireIf(dojo.isBrowser, "dojo._base.cookie");

dojo.provide("dojo._base.event");


// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

(function(){
	// DOM event machinery
	var de = {
		addListener: function(/*DOMNode*/node, /*String*/event, /*Function*/fp){
			if(!node){return;} 
			event = de._normalizeEventName(event)
			fp = de._fixCallback(event, fp);
			node.addEventListener(event, fp, false);
			return fp; /*Handle*/
		},
		removeListener: function(/*DOMNode*/node, /*String*/event, /*Handle*/handle){
			// summary:
			//		clobbers the listener from the node
			// evtName:
			//		the name of the handler to remove the function from
			// node:
			//		DOM node to attach the event to
			// handle:
			//		the handle returned from addListener
			(node)&&(node.removeEventListener(de._normalizeEventName(event), handle, false));
		},
		_normalizeEventName: function(/*String*/name){
			// Generally, name should be lower case, unless it is special
			// somehow (e.g. a Mozilla DOM event).
			// Remove 'on'.
			return (name.slice(0,2)=="on" ? name.slice(2) : name);
		},
		_fixCallback: function(/*String*/name, fp){
			// By default, we only invoke _fixEvent for 'keypress'
			// If code is added to _fixEvent for other events, we have
			// to revisit this optimization.
			// This also applies to _fixEvent overrides for Safari and Opera
			// below.
			return (name!="keypress" ? fp : function(e){ return fp.call(this, de._fixEvent(e, this)); });	
		},
		_fixEvent: function(evt, sender){
			// _fixCallback only attaches us to keypress.
			// Switch on evt.type anyway because we might 
			// be called directly from dojo.fixEvent.
			switch(evt.type){
				case "keypress":
					de._setKeyChar(evt);
					break;
			}
			return evt;
		},
		_setKeyChar: function(evt){
			evt.keyChar = (evt.charCode ? String.fromCharCode(evt.charCode) : '');
		}
	};

	// DOM events
	
	// FIXME: no reason to make this public, use connect
	dojo.addListener = function(node, event, context, method){
		return de.addListener(node, event, dojo.hitch(context, method)); // Handle
	}

	// FIXME: no reason to make this public, use disconnect
	dojo.removeListener = function(node, event, handle){
		de.removeListener(node, event, handle);
	}

	dojo.fixEvent = function(/*Event*/evt, /*DOMNode*/sender){
		// summary:
		//		normalizes properties on the event object including event
		//		bubbling methods, keystroke normalization, and x/y positions
		// evt: native event object
		// sender: node to treat as "currentTarget"
		return de._fixEvent(evt, sender);
	}

	dojo.stopEvent = function(/*Event*/evt){
		// summary:
		//		prevents propagation and clobbers the default action of the
		//		passed event
		// evt: Optional for IE. The native event object.
		evt.preventDefault();
		evt.stopPropagation();
	}

	// cache baseline implementations

	var dc = dojo._connect;
	var dd = dojo._disconnect;

	// Unify connect/disconnect and add/removeListener
	
	dojo._connect = function(obj, event, context, method, dontFix){
		// use listener code (event fixing) for nodes that look like objects, unless told not to
		dontFix = Boolean(!obj || !(obj.nodeType||obj.attachEvent||obj.addEventListener) || dontFix);
		// grab up the result of baseline disconnect, or construct one using addListener
		var h = (dontFix ? dc.apply(this, arguments) : [obj, event, dojo.addListener.apply(this, arguments)]);
		// append flag to the result identifying the kind of listener 
		h.push(dontFix);
		return h;
	}											

	dojo._disconnect = function(obj, event, handle, dontFix){
		// dispatch this disconnect either to the baseline code or to removeListener
		(dontFix ? dd : dojo.removeListener).apply(this, arguments);
	}											

	// Constants

	// Public: client code must test
	// keyCode against these named constants, as the
	// actual codes can vary by browser.
	dojo.keys = {
		BACKSPACE: 8,
		TAB: 9,
		CLEAR: 12,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		PAUSE: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,
		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40,
		INSERT: 45,
		DELETE: 46,
		HELP: 47,
		LEFT_WINDOW: 91,
		RIGHT_WINDOW: 92,
		SELECT: 93,
		NUMPAD_0: 96,
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_PLUS: 107,
		NUMPAD_ENTER: 108,
		NUMPAD_MINUS: 109,
		NUMPAD_PERIOD: 110,
		NUMPAD_DIVIDE: 111,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		F13: 124,
		F14: 125,
		F15: 126,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145
	};
	
	// IE event normalization
	if(dojo.isIE){ 
		_trySetKeyCode = function(e, code){
			try{
				// squelch errors when keyCode is read-only
				// (e.g. if keyCode is ctrl or shift)
				return e.keyCode = code;
			}catch(e){
				return 0;
			}
		}

		var ap = Array.prototype;
		// by default, use the standard listener
		var iel = dojo._listener;
		// dispatcher tracking property
		if((dojo.isIE<7)&&(!djConfig._allow_leaks)){
			// custom listener to handle leak protection for DOM events
			iel = dojo._ie_listener = {
				// support handler indirection: 
				// all event handler functions are actually referenced 
				// here and event dispatchers reference only indices.
				handlers: [],
				// add a listener to an object
				add: function(/*Object*/ source, /*String*/ method, /*Function*/ listener){
					source = source || dojo.global;
					var f = d = source[method];
					if(!d||!d.listeners){
						d = source[method] = dojo._getIeDispatcher();
						// initialize listeners with original event code (or just empty)
						d.listeners = (f ? [ieh.push(f) - 1] : []);
					}
					return d.listeners.push(ieh.push(listener) - 1) ; /*Handle*/
				},
				// remove a listener from an object
				remove: function(/*Object*/ source, /*String*/ method, /*Handle*/ handle){
					var f = (source||dojo.global)[method], l = f&&f.listeners;
					if(f && l && handle--){	
						delete ieh[l[handle]];
						delete l[handle]; 
					}
				}
			};
			// alias used above
			var ieh = iel.handlers;
		}

		dojo.mixin(de, {
			addListener: function(/*DOMNode*/node, /*String*/event, /*Function*/fp){
				if(!node){return;} // undefined
				event = de._normalizeEventName(event);
				if(event=="onkeypress"){
					// we need to listen to onkeydown to synthesize 
					// keypress events that otherwise won't fire
					// on IE
					var kd = node.onkeydown;
					if(!kd||!kd.listeners||!kd._stealthKeydown){
						// we simply ignore this connection when disconnecting
						// because it's harmless 
						de.addListener(node, "onkeydown", de._stealthKeyDown);
						// we only want one stealth listener per node
						node.onkeydown._stealthKeydown = true;
					} 
				}
				return iel.add(node, event, de._fixCallback(fp, node));
			},
			removeListener: function(/*DOMNode*/node, /*String*/event, /*Handle*/handle){
				iel.remove(node, de._normalizeEventName(event), handle); 
			},
			_normalizeEventName: function(/*String*/eventName){
				// Generally, eventName should be lower case, unless it is
				// special somehow (e.g. a Mozilla event)
				// ensure 'on'
				return (eventName.slice(0,2)!="on" ? "on"+eventName : eventName);
			},
			_nop: function(){},
			_fixCallback: function(fp, sender){
				return function(e){ 
					return fp.call(this, de._fixEvent(e, sender));
				};
			},
			_fixEvent: function(/*Event*/evt, /*DOMNode*/sender){
				// summary:
				//   normalizes properties on the event object including event
				//   bubbling methods, keystroke normalization, and x/y positions
				// evt: native event object
				// sender: node to treat as "currentTarget"
				if(!evt){
					var w = (sender)&&((sender.ownerDocument || sender.document || sender).parentWindow)||window;
					evt = w.event; 
				}
				evt.target = evt.srcElement; 
				evt.currentTarget = (sender || evt.srcElement); 
				evt.layerX = evt.offsetX;
				evt.layerY = evt.offsetY;
				// FIXME: scroll position query is duped from dojo.html to
				// avoid dependency on that entire module. Now that HTML is in
				// Base, we should convert back to something similar there.
				var se = evt.srcElement, doc = (se && se.ownerDocument) || document;
				// DO NOT replace the following to use dojo.body(), in IE, document.documentElement should be used
				// here rather than document.body
				var docBody = ((dojo.isIE<6)||(doc["compatMode"]=="BackCompat")) ? doc.body : doc.documentElement;
				evt.pageX = evt.clientX + (docBody.scrollLeft || 0);
				evt.pageY = evt.clientY + (docBody.scrollTop || 0);
				if(evt.type == "mouseover"){ 
					evt.relatedTarget = evt.fromElement;
				}
				if(evt.type == "mouseout"){ 
					evt.relatedTarget = evt.toElement;
				}
				evt.stopPropagation = this._stopPropagation;
				evt.preventDefault = this._preventDefault;
				return this._fixKeys(evt);
			},
			_fixKeys: function(evt){
				switch(evt.type){
					case "keypress":
						var c = ("charCode" in evt ? evt.charCode : evt.keyCode);
						if (c==10){
							// CTRL-ENTER is CTRL-ASCII(10) on IE, but CTRL-ENTER on Mozilla
							c=0;
							evt.keyCode = 13;
						}else if(c==13||c==27){
							c=0; // Mozilla considers ENTER and ESC non-printable
						}else if(c==3){
							c=99; // Mozilla maps CTRL-BREAK to CTRL-c
						}
						// Mozilla sets keyCode to 0 when there is a charCode
						// but that stops the event on IE.
						evt.charCode = c;
						de._setKeyChar(evt);
						break;
				}
				return evt;
			},
			// some ctrl-key combinations (mostly w/punctuation) do not emit a char code in IE
			// we map those virtual key codes to ascii here
			// not valid for all (non-US) keyboards, so maybe we shouldn't bother
			_punctMap: { 
				106:42, 
				111:47, 
				186:59, 
				187:43, 
				188:44, 
				189:45, 
				190:46, 
				191:47, 
				192:96, 
				219:91, 
				220:92, 
				221:93, 
				222:39 
			},
			_stealthKeyDown: function(evt){
				// IE doesn't fire keypress for most non-printable characters.
				// other browsers do, we simulate it here.
				var kp=evt.currentTarget.onkeypress;
				// only works if kp exists and is a dispatcher
				if(!kp||!kp.listeners)return;
				// munge key/charCode
				var k=evt.keyCode;
				// These are Windows Virtual Key Codes
				// http://msdn.microsoft.com/library/default.asp?url=/library/en-us/winui/WinUI/WindowsUserInterface/UserInput/VirtualKeyCodes.asp
				var unprintable = (k!=13)&&(k!=32)&&(k!=27)&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);
				// synthesize keypress for most unprintables and CTRL-keys
				if(unprintable||evt.ctrlKey){
					var c = (unprintable ? 0 : k);
					if(evt.ctrlKey){
						if(k==3 || k==13){
							return; // IE will post CTRL-BREAK, CTRL-ENTER as keypress natively 									
						}else if(c>95 && c<106){ 
							c -= 48; // map CTRL-[numpad 0-9] to ASCII
						}else if((!evt.shiftKey)&&(c>=65&&c<=90)){ 
							c += 32; // map CTRL-[A-Z] to lowercase
						}else{ 
							c = de._punctMap[c] || c; // map other problematic CTRL combinations to ASCII
						}
					}
					// simulate a keypress event
					var faux = de._synthesizeEvent(evt, {type: 'keypress', faux: true, charCode: c});
					kp.call(evt.currentTarget, faux);
					evt.cancelBubble = faux.cancelBubble;
					evt.returnValue = faux.returnValue;
					_trySetKeyCode(evt, faux.keyCode);
				}
			},
			// Called in Event scope
			_stopPropagation: function(){
				this.cancelBubble = true; 
			},
			_preventDefault: function(){
				_trySetKeyCode(this, 0);
				this.returnValue = false;
			}
		});
				
		// override stopEvent for IE
		dojo.stopEvent = function(evt){
			evt = evt || window.event;
			de._stopPropagation.call(evt);
			de._preventDefault.call(evt);
		}
	}

	de._synthesizeEvent = function(evt, props) {
			var faux = dojo.mixin({}, evt, props);
			de._setKeyChar(faux);
			// FIXME: would prefer to use dojo.hitch: dojo.hitch(evt, evt.preventDefault); 
			// but it throws an error when preventDefault is invoked on Safari
			// does Event.preventDefault not support "apply" on Safari?
			faux.preventDefault = function(){ evt.preventDefault(); }; 
			faux.stopPropagation = function(){ evt.stopPropagation(); }; 
			return faux;
	}
	
	// Opera event normalization
	if(dojo.isOpera){
		dojo.mixin(de, {
			_fixEvent: function(evt, sender){
				switch(evt.type){
					case "keypress":
						var c = evt.which;
						if(c==3){
							c=99; // Mozilla maps CTRL-BREAK to CTRL-c
						}
						// can't trap some keys at all, like INSERT and DELETE
						// there is no differentiating info between DELETE and ".", or INSERT and "-"
						c = ((c<41)&&(!evt.shiftKey) ? 0 : c);
						if((evt.ctrlKey)&&(!evt.shiftKey)&&(c>=65)&&(c<=90)){
							// lowercase CTRL-[A-Z] keys
							c += 32;
						}
						return de._synthesizeEvent(evt, { charCode: c });
				}
				return evt;
			}
		});
	}

	// Safari event normalization
	if(dojo.isSafari){ 
		dojo.mixin(de, {
			_fixEvent: function(evt, sender){
				switch(evt.type){
					case "keypress":
						var c = evt.charCode, s = evt.shiftKey;
						if(evt.keyIdentifier=="Enter"){
							c = 0; // differentiate Enter from CTRL-m (both code 13)
						}else if((evt.ctrlKey)&&(c>0)&&(c<27)){
							c += 96; // map CTRL-[A-Z] codes to ASCII
						} else if (c==dojo.keys.SHIFT_TAB) {
							c = dojo.keys.TAB; // morph SHIFT_TAB into TAB + shiftKey: true
							s = true;
						} else {
							c = (c>=32 && c<63232 ? c : 0); // avoid generating keyChar for non-printables
						}
						return de._synthesizeEvent(evt, {charCode: c, shiftKey: s});
				}
				return evt;
			}
		});
		dojo.mixin(dojo.keys, {
			SHIFT_TAB: 25,		
			UP_ARROW: 63232,
			DOWN_ARROW: 63233,
			LEFT_ARROW: 63234,
			RIGHT_ARROW: 63235,
			F1: 63236,
			F2: 63237,
			F3: 63238,
			F4: 63239,
			F5: 63240,
			F6: 63241,
			F7: 63242,
			F8: 63243,
			F9: 63244,
			F10: 63245,
			F11: 63246,
			F12: 63247,
			PAUSE: 63250,
			DELETE: 63272,
			HOME: 63273,
			END: 63275,
			PAGE_UP: 63276,
			PAGE_DOWN: 63277,
			INSERT: 63302,
			PRINT_SCREEN: 63248,
			SCROLL_LOCK: 63249,
			NUM_LOCK: 63289
		});
	}
})();

if(dojo.isIE<7){
	// keep this out of the closure
	// closing over 'iel' or 'ieh' borks leak prevention
	// ls[i] is an index into the master handler array
	dojo._getIeDispatcher = function(){
		return function(){
			var ap=Array.prototype, ls=arguments.callee.listeners, h=dojo._ie_listener.handlers;
			for(var i in ls){
				if(!(i in ap)){
					h[ls[i]].apply(this, arguments);
				}
			}
		}
	}
}


dojo.provide("dojo._base.html");

// FIXME: need to add unit tests for all the semi-public methods

try{
	document.execCommand("BackgroundImageCache", false, true);
}catch(e){
	// sane browsers don't have cache "issues"
}

// =============================
// DOM Functions
// =============================

dojo.createElement = function(obj, parent, position){
	// TODO: need to finish this!
}

if(dojo.isIE && (dojo.isIE<7)){ // || dojo.isOpera){
	dojo.byId = function(/*String*/id, /*DocumentElement*/doc){
		// summary:
		// 		similar to other library's "$" function, takes a
		// 		string representing a DOM id or a DomNode and
		// 		returns the corresponding DomNode. If a Node is
		// 		passed, this function is a no-op. Returns a
		// 		single DOM node or null, working around several
		// 		browser-specific bugs to do so.
		// id: DOM id or DOM Node
		// doc:
		//		optional, defaults to the current value of
		//		dojo.doc.  Can be used to retreive
		//		node references from other documents.
		if(dojo.isString(id)){
			var _d = (doc||dojo.doc);
			var te = _d.getElementById(id);
			if((te) && (te.id == id)){
				return te;
			}else{
				var eles = _d.all[id];
				if(!eles){ return; }
				if(!eles.length){ return eles; }
				// if more than 1, choose first with the correct id
				var i=0;
				while(te=eles[i++]){
					if(te.id == id){ return te; }
				}
			}
		}else{
			return id; // DomNode
		}
	}
}else{
	dojo.byId = function(/*String*/id, /*DocumentElement*/doc){
		// summary:
		// 		similar to other library's "$" function, takes a
		// 		string representing a DOM id or a DomNode and
		// 		returns the corresponding DomNode. If a Node is
		// 		passed, this function is a no-op. Returns a
		// 		single DOM node or null, working around several
		// 		browser-specific bugs to do so.
		// id: DOM id or DOM Node
		// doc:
		//		optional, defaults to the current value of
		//		dojo.doc.  Can be used to retreive
		//		node references from other documents.
		if(dojo.isString(id)){
			return (doc||dojo.doc).getElementById(id);
		}else{
			return id; // DomNode
		}
	}
}

(function(){
	var _insertBefore = function(/*Node*/node, /*Node*/ref){
		ref.parentNode.insertBefore(node, ref);
		return true;	//	boolean
	}

	var _insertAfter = function(/*Node*/node, /*Node*/ref){
		//	summary:
		//		Try to insert node after ref
		var pn = ref.parentNode;
		if(ref == pn.lastChild){
			pn.appendChild(node);
		}else{
			return _insertBefore(node, ref.nextSibling);	//	boolean
		}
		return true;	//	boolean
	}

	dojo.place = function(/*DOMNode*/node, /*DOMNode*/refNode, /*String|Number*/position){
		//	summary:
		//		attempt to insert node in relation to ref based on position

		// FIXME: need to write tests for this!!!!
		if((!node)||(!refNode)||(typeof position == "undefined")){ 
			return false;	//	boolean 
		}
		if(typeof position == "number"){
			var cn = refNode.childNodes;
			if(((position == 0)&&(cn.length == 0)) ||
				(cn.length == position)){
				refNode.appendChild(node); return true;
			}
			if(position == 0){
				return _insertBefore(node, refNode.firstChild);
			}
			return _insertAfter(node, cn[position-1]);
		}
		switch(position.toLowerCase()){
			case "before":
				return _insertBefore(node, refNode);	//	boolean
			case "after":
				return _insertAfter(node, refNode);		//	boolean
			case "first":
				if(refNode.firstChild){
					return _insertBefore(node, refNode.firstChild);	//	boolean
				}else{
					refNode.appendChild(node);
					return true;	//	boolean
				}
				break;
			default: // aka: last
				refNode.appendChild(node);
				return true;	//	boolean
		}
	}

	// Box functions will assume this model.
	// On IE/Opera, BORDER_BOX will be set if the primary document is in quirks mode.
	// Can be set to change behavior of box setters.
	
	// can be either:
	//	"border-box"
	//	"content-box" (default)
	dojo.boxModel = "content-box";

	// We punt per-node box mode testing completely.
	// If anybody cares, we can provide an additional (optional) unit 
	// that overrides existing code to include per-node box sensitivity.

	// Opera documentation claims that Opera 9 uses border-box in BackCompat mode.
	// but experiments (Opera 9.10.8679 on Windows Vista) indicate that it actually continues to use content-box.
	// IIRC, earlier versions of Opera did in fact use border-box.
	// Opera guys, this is really confusing. Opera being broken in quirks mode is not our fault.

	if(dojo.isIE /*|| dojo.isOpera*/){
		var _dcm = document.compatMode;
		// client code may have to adjust if compatMode varies across iframes
		dojo.boxModel = (_dcm=="BackCompat")||(_dcm=="QuirksMode")||(dojo.isIE<6) ? "border-box" : "content-box";
	}

	// =============================
	// Style Functions
	// =============================
	
	// getComputedStyle drives most of the style code.
	// Wherever possible, reuse the returned object.
	//
	// API functions below that need to access computed styles accept an 
	// optional computedStyle parameter.
	//
	// If this parameter is omitted, the functions will call getComputedStyle themselves.
	//
	// This way, calling code can access computedStyle once, and then pass the reference to 
	// multiple API functions. 
	if(!dojo.isIE){
		// non-IE branch
		var dv = document.defaultView;
		dojo.getComputedStyle = ((dojo.isSafari) ? function(node){
				var s = dv.getComputedStyle(node, null);
				if(!s){ 
					node.style.display = ""; 
					s = dv.getComputedStyle(node, null);
				}
				return s;
			} : function(node){
				return dv.getComputedStyle(node, null);
			}
		)

		dojo._toPixelValue = function(element, value){
			// style values can be floats, client code may want
			// to round for integer pixels.
			return (parseFloat(value) || 0); 
		}
	}else{
		// IE branch
		dojo.getComputedStyle = function(node){
			return node.currentStyle;
		}

		dojo._toPixelValue = function(element, avalue){
			if(!avalue){return 0;}
			// style values can be floats, client code may
			// want to round this value for integer pixels.
			if(avalue.slice&&(avalue.slice(-2)=='px')){ return parseFloat(avalue); }
			with(element){
				var sLeft = style.left;
				var rsLeft = runtimeStyle.left;
				runtimeStyle.left = currentStyle.left;
				try{
					// 'avalue' may be incompatible with style.left, which can cause IE to throw
					// this has been observed for border widths using "thin", "medium", "thick" constants
					// those particular constants could be trapped by a lookup
					// but perhaps there are more
					style.left = avalue;
					avalue = style.pixelLeft;
				}catch(e){
					avalue = 0;
				}
				style.left = sLeft;
				runtimeStyle.left = rsLeft;
			}
			return avalue;
		}
	}

	// FIXME: there opacity quirks on FF that we haven't ported over. Hrm.

	dojo._getOpacity = ((dojo.isIE) ? function(node){
			try{
				return (node.filters.alpha.opacity / 100);
			}catch(e){
				return 1;
			}
		} : function(node){
			// FIXME: should we get using the computedStyle of the node?
			return node.style.opacity;
		}
	);

	dojo._setOpacity = ((dojo.isIE) ? function(node, opacity){
			var o = "Alpha(Opacity="+(opacity*100)+")";
			node.style.filter = o;
			if(node.nodeName.toLowerCase == "tr"){
				dojo.query("> td", node).forEach(function(i){
					i.style.filter = o;
				});
			}
			return opacity;
		} : function(node, opacity){
			node.style.opacity = opacity;
		}
	);

	var _pixelNamesCache = {
		width: true, height: true, left: true, top: true
	};
	var _toStyleValue = function(node, type, value){
		if(_pixelNamesCache[type] === true){
			return dojo._toPixelValue(node, value)
		}else if(_pixelNamesCache[type] === false){
			return value;
		}else{
			type = type.toLowerCase();
			if(
				(type.indexOf("margin") >= 0) ||
				// (type.indexOf("border") >= 0) ||
				(type.indexOf("padding") >= 0) ||
				(type.indexOf("width") >= 0) ||
				(type.indexOf("height") >= 0) ||
				(type.indexOf("max") >= 0) ||
				(type.indexOf("min") >= 0) ||
				(type.indexOf("offset") >= 0)
			){
				_pixelNamesCache[type] = true;
				return dojo._toPixelValue(node, value)
			}else{
				_pixelNamesCache[type] = false;
				return value;
			}
		}
	}

	// public API
	
	dojo.style = function(){
		var _a = arguments;
		var _a_l = _a.length;
		if(!_a_l){ return; }
		var node = dojo.byId(_a[0]);
		var io = ((dojo.isIE)&&(_a[1] == "opacity"));
		if(_a_l == 3){
			return (io) ? dojo._setOpacity(node, _a[2]) : node.style[_a[1]] = _a[2];
		}
		var s = dojo.getComputedStyle(node);
		if(_a_l == 1){ return s; }
		if(_a_l == 2){
			return (io) ? dojo._getOpacity(node) : _toStyleValue(node, _a[1], s[_a[1]]);
		}
	}

	// =============================
	// Box Functions
	// =============================

	dojo._getPadBounds = function(n, computedStyle){
		// Returns special values specifically useful 
		// for node fitting.
		// l, t = left and top padding
		// w = the total of the left and right padding 
		// h = the total of the top and bottom padding
		// If 'node' has position, l/t forms the origin for child nodes. 
		// The w/h are used for calculating boxes.
		// Normally application code will not need to invoke this directly,
		// and will use the ...box... functions instead.
		var 
			s=computedStyle||dojo.getComputedStyle(n), 
			px=dojo._toPixelValue,
			l=px(n, s.paddingLeft), 
			t=px(n, s.paddingTop);
		return { 
			l: l,
			t: t,
			w: l+px(n, s.paddingRight),
			h: t+px(n, s.paddingBottom)
		};
	}
	
	dojo._getPadBorderExtents = function(n, computedStyle){
		// w = the total of the left/right padding and left/right border
		// h = the total of the top/bottom padding and top/bottom border
		// The w/h are used for calculating boxes.
		// Normally application code will not need to invoke this directly,
		// and will use the ...box... functions instead.
		var 
			s=computedStyle||dojo.getComputedStyle(n), 
			px=dojo._toPixelValue, 
			p=dojo._getPadBounds(n, s),
			bw=(s.borderLeftStyle!='none' ? px(n, s.borderLeftWidth) : 0) + (s.borderRightStyle!='none' ? px(n, s.borderRightWidth) : 0),
			bh=(s.borderTopStyle!='none' ? px(n, s.borderTopWidth) : 0) + (s.borderBottomStyle!='none' ? px(n, s.borderBottomWidth) : 0);
		return { 
			w: p.w + bw,
			h: p.h + bh
		};
	}

	dojo._getMarginExtents = function(n, computedStyle){
		var 
			s=computedStyle||dojo.getComputedStyle(n), 
			px=dojo._toPixelValue;
		return { 
			w: px(n, s.marginLeft)+px(n, s.marginRight),
			h: px(n, s.marginTop)+px(n, s.marginBottom)
		};
	}

	// Box getters work in any box context because offsetWidth/clientWidth
	// are invariant wrt box context
	//
	// They do *not* work for display: inline objects that have padding styles
	// because the user agent ignores padding (it's bogus styling in any case)
	//
	// Be careful with IMGs because they are inline or block depending on 
	// browser and browser mode.

	if (dojo.isMoz) {
		dojo._getMarginBox = function(node, computedStyle){
			var s = computedStyle||dojo.getComputedStyle(node);
			var mb = dojo._getMarginExtents(node, s);
			return { l:parseFloat(s.left)||0, t:parseFloat(s.top)||0, w: node.offsetWidth + mb.w, h: node.offsetHeight + mb.h };
		}
	} else {
		dojo._getMarginBox = function(node, computedStyle){
			var mb=dojo._getMarginExtents(node, computedStyle);
			return { l:node.offsetLeft, t:node.offsetTop, w: node.offsetWidth + mb.w, h: node.offsetHeight + mb.h };
		}
	}
	
	dojo._getContentBox = function(node, computedStyle){
		var pb=dojo._getPadBounds(node, computedStyle);
		return { l: pb.l, t: pb.t, w: node.clientWidth - pb.w, h: node.clientHeight - pb.h };
	}
	
	dojo._setBox = function(node, l, t, w, h, u){
		u = u || "px";
		with(node.style){
			if(!isNaN(l)){ left = l+u; }
			if(!isNaN(t)){ top = t+u; }
			if(w>=0){ width = w+u; }
			if(h>=0){ height = h+u; }
		}
	}

	// Box setters depend on box context because interpretation of width/height styles
	// vary wrt box context.
	//
	// The value of dojo.boxModel is used to determine box context.
	// dojo.boxModel can be set directly to change behavior.
	//
	// Beware of display: inline objects that have padding styles
	// because the user agent ignores padding (it's a bogus setup anyway)
	//
	// Be careful with IMGs because they are inline or block depending on 
	// browser and browser mode.
	
	dojo._setContentBox = function(node, leftPx, topPx, widthPx, heightPx, computedStyle){
		if(dojo.boxModel == "border-box"){
			var pb = dojo._getPadBorderExtents(node, computedStyle);
			if(widthPx>=0){ widthPx += pb.w; }
			if(heightPx>=0){ heightPx += pb.h; }
		}
		dojo._setBox(node, leftPx, topPx, widthPx, heightPx);
	}

	dojo._nilExtents = { w: 0, h: 0 };

	dojo._setMarginBox = function(node, leftPx, topPx, widthPx, heightPx, computedStyle){
		var s = computedStyle || dojo.getComputedStyle(node);
		var pb = ((dojo.boxModel == "border-box") ? dojo._nilExtents : dojo._getPadBorderExtents(node, s));
		var mb = dojo._getMarginExtents(node, s);
		if(widthPx>=0){
			widthPx = Math.max(widthPx - pb.w - mb.w, 0);
		}
		if(heightPx>=0){
			heightPx = Math.max(heightPx - pb.h - mb.h, 0);
		}
		dojo._setBox(node, leftPx, topPx, widthPx, heightPx);
	}

	// public API
	
	dojo.marginBox = function(node, boxObj){
		node = dojo.byId(node);
		var s = dojo.getComputedStyle(node), b=boxObj;
		return !b ? dojo._getMarginBox(node, s) : dojo._setMarginBox(node, b.l, b.t, b.w, b.h, s);
	}

	dojo.contentBox = function(node, boxObj){
		node = dojo.byId(node);
		var s = dojo.getComputedStyle(node), b=boxObj;
		return !b ? dojo._getContentBox(node, s) : dojo._setContentBox(node, b.l, b.t, b.w, b.h, s);
	}
	
	// =============================
	// Positioning 
	// =============================
	
	var _sumAncestorProperties = function(node, prop){
		if(!node){ return 0; } // FIXME: throw an error?
		var _b = dojo.body();
		var retVal = 0;
		while(node){
			try{
				if(dojo.getComputedStyle(node).position == "fixed"){
					return 0;
				}
			}catch(e){}
			var val = node[prop];
			if(val){
				retVal += val - 0;
				// opera and khtml #body & #html has the same values, we only
				// need one value
				if(node == _b){ break; }
			}
			node = node.parentNode;
		}
		return retVal;	//	integer
	}

	dojo._docScroll = function(){
		var _b = dojo.body();
		var _w = dojo.global;
		var de = dojo.doc.documentElement;
		return {
			y: (_w.pageYOffset || de.scrollTop || _b.scrollTop || 0),
			x: (_w.pageXOffset || de.scrollLeft || _b.scrollLeft || 0)
		};
	};

	// IE version and quirks dependent. ugg.
	var _d_off = ((dojo.isIE >= 7)&&(dojo.boxModel != "border-box")) ? 2 : 0; 
	dojo._abs = function(/*HTMLElement*/node, /*boolean?*/includeScroll){
		//	summary
		//		Gets the absolute position of the passed element based on the
		//		document itself.

		// FIXME: need to decide in the brave-new-world if we're going to be
		// margin-box or border-box.
		var ownerDocument = dojo.doc;
		var ret = {
			x: 0,
			y: 0
		};

		// targetBoxType == "border-box"
		var db = dojo.body();

		if(dojo.isIE){
			with(node.getBoundingClientRect()){
				ret.x = left-_d_off;
				ret.y = top-_d_off;
			}
		}else if(ownerDocument["getBoxObjectFor"]){
			// mozilla
			var bo = ownerDocument.getBoxObjectFor(node);
			ret.x = bo.x - _sumAncestorProperties(node, "scrollLeft");
			ret.y = bo.y - _sumAncestorProperties(node, "scrollTop");
		}else{
			if(node["offsetParent"]){
				var endNode;
				// in Safari, if the node is an absolutely positioned child of
				// the body and the body has a margin the offset of the child
				// and the body contain the body's margins, so we need to end
				// at the body
				if(	(dojo.isSafari) &&
					(node.style.getPropertyValue("position") == "absolute") &&
					(node.parentNode == db)){
					endNode = db;
				}else{
					endNode = db.parentNode;
				}

				if(node.parentNode != db){
					var nd = node;
					if(dojo.isOpera){ nd = db; }
					ret.x -= _sumAncestorProperties(nd, "scrollLeft");
					ret.y -= _sumAncestorProperties(nd, "scrollTop");
				}
				var curnode = node;
				do{
					var n = curnode["offsetLeft"];
					//FIXME: ugly hack to workaround the submenu in 
					//popupmenu2 does not shown up correctly in opera. 
					//Someone have a better workaround?
					if(!dojo.isOpera || n>0){
						ret.x += isNaN(n) ? 0 : n;
					}
					var m = curnode["offsetTop"];
					ret.y += isNaN(m) ? 0 : m;
					curnode = curnode.offsetParent;
				}while((curnode != endNode)&&(curnode != null));
			}else if(node["x"]&&node["y"]){
				ret.x += isNaN(node.x) ? 0 : node.x;
				ret.y += isNaN(node.y) ? 0 : node.y;
			}
		}

		// account for document scrolling!
		if(includeScroll){
			var scroll = dojo._docScroll();
			ret.y += scroll.y;
			ret.x += scroll.x;
		}

		/*
		// FIXME
		var _getMarginExtents = function(node, s){
			var px = _getPixelizer(node);
			return { 
				w: px(s.marginLeft) + px(s.marginRight),
				h: px(s.marginTop) + px(s.marginBottom)
			};
		}

		var _getMarginBox = function(node, computedStyle){
			var mb = _getMarginExtents(node, computedStyle);
			return {
				w: node.offsetWidth + mb.w, 
				h: node.offsetHeight + mb.h
			};
		}

		var extentFuncArray=[dojo.html.getPaddingExtent, dojo.html.getBorderExtent, dojo.html.getMarginExtent];
		if(nativeBoxType > targetBoxType){
			for(var i=targetBoxType;i<nativeBoxType;++i){
				ret.y += extentFuncArray[i](node, 'top');
				ret.x += extentFuncArray[i](node, 'left');
			}
		}else if(nativeBoxType < targetBoxType){
			for(var i=targetBoxType;i>nativeBoxType;--i){
				ret.y -= extentFuncArray[i-1](node, 'top');
				ret.x -= extentFuncArray[i-1](node, 'left');
			}
		}
		*/
		// ret.t = ret.y;
		// ret.l = ret.x;
		return ret;	//	object
	}

	// FIXME: need a setter for coords or a moveTo!!
	dojo.coords = function(node, includeScroll){
		node = dojo.byId(node);
		var s = dojo.getComputedStyle(node);
		var mb = dojo._getMarginBox(node, s);
		var abs = dojo._abs(node, includeScroll);
		mb.x = abs.x;
		mb.y = abs.y;
		return mb;
	}
})();

// =============================
// (CSS) Class Functions
// =============================

dojo.hasClass = function(/*HTMLElement*/node, /*String*/classStr){
	//	summary:
	//		Returns whether or not the specified classes are a portion of the
	//		class list currently applied to the node. 
	return ((" "+node.className+" ").indexOf(" "+classStr+" ") >= 0);  // Boolean
}

dojo.addClass = function(/*HTMLElement*/node, /*String*/classStr){
	//	summary:
	//		Adds the specified classes to the end of the class list on the
	//		passed node.
	var cls = node.className;
	if((" "+cls+" ").indexOf(" "+classStr+" ") < 0){
		node.className = cls + (cls ? ' ' : '') + classStr;
	}
}

dojo.removeClass = function(/*HTMLElement*/node, /*String*/classStr){
	//	summary: Removes classes from node.
	var cls = node.className;
	if(cls && cls.indexOf(classStr) >= 0){
		node.className = cls.replace(new RegExp('(^|\\s+)'+classStr+'(\\s+|$)'), "$1$2");
	}
}
dojo.toggleClass = function(/*HTMLElement*/node, /*String*/classStr, /*Boolean?*/condition){
	//	summary: 	Adds a class to node if not present, or removes if present.
	//				Pass a boolean condition if you want to explicitly add or remove.
	//	condition:	If passed, true means to add the class, false means to remove.
	if(typeof condition == "undefined"){
		condition = !dojo.hasClass(node, classStr);
	}
	dojo[condition ? "addClass" : "removeClass"](node, classStr);
}

dojo.provide("dojo._base.NodeList");



// FIXME: need to provide a location to extend this object!!
// FIXME: need to write explicit tests for NodeList
// FIXME: animation?
// FIXME: what do the builtin's that we deferr to do when you concat? What gets
// 			returned? Seems (on FF) to be an Array, not a NodeList!

(function(){

	var d = dojo;

	dojo.NodeList = function(){
		// NodeList constructor...should probably call down to the superclass ctor?
		// Array.apply(this, arguments);

		// make it behave like the Array constructor
		if((arguments.length == 1)&&(typeof arguments[0] == "number")){
			this.length = parseInt(arguments[0]);
		}else if((arguments.length == 1)&&(arguments[0].constructor == dojo.NodeList)){
			// FIXME: implement!
		}else{
			for(var x=0; x<arguments.length; x++){
				this.push(arguments[x]);
			}
		}
	}
	dojo.NodeList.prototype = new Array;

	dojo.extend(dojo.NodeList,
		{
			box: function(){
				// summary:
				// 		returns a box object for the first element in a node list
				return dojo.coords(this[0]);
			},

			boxes: function(){
				// summary:
				// 		returns the box objects all elements in a node list as
				// 		an Array
				
				// FIXME: should we just tack a box property onto each element
				// instead? Also, is this really that useful anyway?
				var ret = [];
				this.forEach(function(item){
					ret.push(dojo.coords(item));
				});
				return ret;
			},

			style: function(prop){
				// (key, value)
				// (props, ...)
				var aa = dojo._toArray(arguments);
				aa.unshift(this[0]);
				return dojo.style.apply(dojo, aa);
			},

			styles: function(prop){
				// (key, value)
				// (props, ...)
				var aa = dojo._toArray(arguments);
				aa.unshift(null);
				return this.map(function(i){
					aa[0] = i;
					return dojo.style.apply(dojo, aa);
				});
			},

			place: function(queryOrNode, /*String*/ position){
				// summary:
				//		placement always relative to the first element matched
				//		by queryOrNode
				// position:
				//		can be one of:
				//			"last"||"end" (default)
				//			"first||"start"
				//			"before"
				//			"after"
				// 		or an offset in the childNodes property
				var item = d.query(queryOrNode)[0];
				position = position||"last";

				for(var x=0; x<this.length; x++){
					d.place(this[x], item, position);
				}
				return this;
			},

			orphan: function(/*String*/ simpleFilter){
				// summary:
				//		removes elements in this list that match the simple
				//		filter from their parents and returns them as a new
				//		NodeList.
				// simpleFilter: single-expression CSS filter
				var orphans = d._filterQueryResult(this, simpleFilter);
				orphans.forEach(function(item){
					if(item["parentNode"]){
						item.parentNode.removeChild(item);
					}
				});
				return orphans;
			},

			adopt: function(queryOrListOrNode, /*String*/ position){
				// summary:
				//		places any/all elements in queryOrListOrNode at a
				//		position relative to the first element in this list.
				// position:
				//		can be one of:
				//			"last"||"end" (default)
				//			"first||"start"
				//			"before"
				//			"after"
				// 		or an offset in the childNodes property
				var item = this[0];
				position = position||"last";
				var adoptees = d.query(queryOrListOrNode);

				for(var x=0; x<adoptees.length; x++){
					d.place(adoptees[x], item, position);
				}
				return adoptees;
			},

			// may have name changed to "get" if dojo.query becomes dojo.get
			// FIXME: do we need this?
			query: function(/*String*/ queryStr){
				// summary:
				//		returns a new NodeList. Elements of the new NodeList
				//		satisfy the passed query but use elements of the
				//		current NodeList as query roots.

				queryStr = queryStr||"";

				// FIXME: probably slow
				var ret = new d.NodeList();
				this.forEach(function(item){
					d.query(queryStr, item).forEach(function(subItem){
						if(typeof subItem != "undefined"){
							ret.push(subItem);
						}
					});
				});
				return ret;
			},

			filter: function(/*String*/ simpleQuery){
				//			(callback, [thisObject])
				//			(simpleQuery, callback, [thisObject])
				// "masks" the built-in javascript filter() method to support
				// passing a simple string filter in addition to supporting
				// filtering function objects.

				var items = this;
				var _a = arguments;
				var r = new d.NodeList();
				var rp = function(t){ 
					if(typeof t != "undefined"){
						r.push(t); 
					}
				}
				if(dojo.isString(simpleQuery)){
					items = d._filterQueryResult(this, _a[0]);
					if(_a.length == 1){
						// if we only got a string query, pass back the filtered results
						return items;
					}
					// if we got a callback, run it over the filtered items
					d.forEach(d.filter(items, _a[1], _a[2]), rp);
					return r;
				}
				// handle the (callback, [thisObject]) case
				d.forEach(d.filter(items, _a[0], _a[1]), rp);
				return r;

			},

			addContent: function(content, position){
				// position can be one of:
				//		"last"||"end" (default)
				//		"first||"start"
				//		"before"
				//		"after"
				// or an offset in the childNodes property
				var ta = dojo.doc.createElement("span");
				if(dojo.isString(content)){
					ta.innerHTML = content;
				}else{
					ta.appendChild(content);
				}
				var ct = ((position == "first")||(position == "after")) ? "lastChild" : "firstChild";
				this.forEach(function(item){
					var tn = ta.cloneNode(true);
					while(tn[ct]){
						d.place(tn[ct], item, position);
					}
				});
				// FIXME: what to return!?
				return this;
			}
		}
	);

	// now, make sure it's an array subclass on IE:
	// 
	// huge thanks to Dean Edwards and Hedger Wang for a solution to
	// subclassing arrays on IE
	//		http://dean.edwards.name/weblog/2006/11/hooray/?full
	//		http://www.hedgerwow.com/360/dhtml/js-array2.html
	if(!Array.forEach){
		// make sure that it has all the JS 1.6 things we need before we subclass
		dojo.extend(dojo.NodeList,
			{
				// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array#Methods
				// must implement the following JS 1.6 methods:

				// FIXME: would it be smaller if we set these w/ iteration?
				indexOf: function(value, identity){
					return d.indexOf(this, value, identity);
				},

				lastIndexOf: function(value, identity){
					return d.lastIndexOf(this, value, identity);
				},

				forEach: function(callback, thisObj){
					return d.forEach(this, callback, thisObj);
				},

				every: function(callback, thisObj){
					return d.every(this, callback, thisObj);
				},

				some: function(callback, thisObj){
					return d.some(this, callback, thisObj);
				},

				map: function(unary_func, obj){
					return d.map(this, unary_func, obj);
				}

				// NOTE: filter() is handled in NodeList by default
			}
		);
	}
	if(d.isIE){

		var subClassStr = function(className){
			return (
				// "parent.dojo.debug('setting it up...'); " +
				"var a2 = parent."+className+"; " +
				"var ap = Array.prototype; " +
				"var a2p = a2.prototype; " +
				"for(var x in a2p){ ap[x] = a2p[x]; } " +
				"parent."+className+" = Array; "
			);
		}
		var scs = subClassStr("dojo.NodeList");
		// Hedger's excellent invention
		var popup = window.createPopup()
		popup.document.write("<script>"+scs+"</script>");
		// our fix to ensure that we don't hit strange scoping/timing issues
		// insisde of setTimeout() blocks
		popup.show(1, 1, 1, 1);

	}
})();

dojo.provide("dojo._base.query");


;(function(){
	var d = dojo;

	////////////////////////////////////////////////////////////////////////
	// Utility code
	////////////////////////////////////////////////////////////////////////

	var _getIndexes = function(q){
		return [ q.indexOf("#"), q.indexOf("."), q.indexOf("["), q.indexOf(":") ];
	}

	var _lowestFromIndex = function(query, index){
		// spammy and verbose, but fast
		var ql = query.length;
		var i = _getIndexes(query);
		var end = ql;
		for(var x=index; x<i.length; x++){
			if(i[x] >= 0){
				if(i[x] < end){
					end = i[x];
				}
			}
		}
		return (end < 0) ? ql : end;
	}

	var getIdEnd = function(query){
		return _lowestFromIndex(query, 1);
	}

	var getId = function(query){
		var i = _getIndexes(query);
		if(i[0] != -1){
			return query.substring(i[0]+1, getIdEnd(query));
		}else{
			return "";
		}
	}

	var getTagNameEnd = function(query){
		var i = _getIndexes(query);
		if((i[0] == 0)||(i[1] == 0)){
			// hash or dot at the front, no tagname
			return 0;
		}else{
			return _lowestFromIndex(query, 0);
		}
	}


	var getTagName = function(query){
		var tagNameEnd = getTagNameEnd(query);
		// FIXME: should this be ">=" to account for tags like <a> ?
		return ((tagNameEnd > 0) ? query.substr(0, tagNameEnd).toLowerCase() : "*");
	}

	var smallest = function(arr){
		var ret = -1;
		for(var x=0; x<arr.length; x++){
			var ta = arr[x];
			if(ta >= 0){
				if((ta > ret)||(ret == -1)){
					ret = ta;
				}
			}
		}
		return ret;
	}

	var getClassName = function(query){
		// [ "#", ".", "[", ":" ];
		var i = _getIndexes(query);
		if(-1 == i[1]){ return ""; } // no class component
		var di = i[1]+1;

		var othersStart = smallest(i.slice(2));
		if(di < othersStart){
			return query.substring(di, othersStart);
		}else if(-1 == othersStart){
			return query.substr(di);
		}else{
			return "";
		}
	}

	////////////////////////////////////////////////////////////////////////
	// XPath query code
	////////////////////////////////////////////////////////////////////////

	var xPathAttrs = [
		// FIXME: need to re-order in order of likelyness to be used in matches
		{
			key: "|=",
			match: function(attr, value){
				return "[contains(concat(' ',@"+attr+",' '), ' "+ value +"-')]";
			}
		},
		{
			key: "~=",
			match: function(attr, value){
				return "[contains(concat(' ',@"+attr+",' '), ' "+ value +" ')]";
			}
		},
		{
			key: "^=",
			match: function(attr, value){
				return "[starts-with(@"+attr+", '"+ value +"')]";
			}
		},
		{
			key: "*=",
			match: function(attr, value){
				return "[contains(@"+attr+", '"+ value +"')]";
			}
		},
		{
			key: "$=",
			match: function(attr, value){
				return "[substring(@"+attr+", string-length(@"+attr+")-"+(value.length-1)+")='"+value+"']";
			}
		},
		{
			key: "!=",
			match: function(attr, value){
				return "[not(@"+attr+"='"+ value +"')]";
			}
		},
		// NOTE: the "=" match MUST come last!
		{
			key: "=",
			match: function(attr, value){
				return "[@"+attr+"='"+ value +"']";
			}
		}
	];

	var strip = function(val){
		var re = /^\s+|\s+$/g;
		return val.replace(re, "");	//	string
	}

	var handleAttrs = function(	attrList, 
								query, 
								getDefault, 
								handleMatch){
		var matcher;
		var i = _getIndexes(query);
		if(i[2] >= 0){
			var lBktIdx = query.indexOf("]", i[2]);
			var condition = query.substring(i[2]+1, lBktIdx);
			while(condition && condition.length){
				if(condition.charAt(0) == "@"){
					condition = condition.slice(1);
				}

				matcher = null;
				// http://www.w3.org/TR/css3-selectors/#attribute-selectors
				for(var x=0; x<attrList.length; x++){
					var ta = attrList[x];
					var tci = condition.indexOf(ta.key);
					if(tci >= 0){
						var attr = condition.substring(0, tci);
						var value = condition.substring(tci+ta.key.length);
						if(	(value.charAt(0) == "\"")||
							(value.charAt(0) == "\'")){
							value = value.substring(1, value.length-1);
						}
						matcher = ta.match(strip(attr), strip(value));
						break;
					}
				}
				if((!matcher)&&(condition.length)){
					matcher = getDefault(condition);
				}
				if(matcher){
					handleMatch(matcher);
					// ff = agree(ff, matcher);
				}

				condition = null;
				var nbktIdx = query.indexOf("[", lBktIdx);
				if(0 <= nbktIdx){
					lBktIdx = query.indexOf("]", nbktIdx);
					if(0 <= lBktIdx){
						condition = query.substring(nbktIdx+1, lBktIdx);
					}
				}
			}
		}
	}

	var buildPath = function(query){
		var xpath = ".";
		var qparts = query.split(" "); // FIXME: this break on span[thinger = foo]
		while(qparts.length){
			var tqp = qparts.shift();
			var prefix;
			// FIXME: need to add support for ~ and +
			if(tqp == ">"){
				prefix = "/";
				// prefix = "/child::node()";
				tqp = qparts.shift();
			}else{
				prefix = "//";
				// prefix = "/descendant::node()"
			}

			// get the tag name (if any)
			var tagName = getTagName(tqp);

			xpath += prefix + tagName;
			
			// check to see if it's got an id. Needs to come first in xpath.
			var id = getId(tqp);
			if(id.length){
				xpath += "[@id='"+id+"'][1]";
			}

			var cn = getClassName(tqp);
			// check the class name component
			if(cn.length){
				var padding = " ";
				if(cn.charAt(cn.length-1) == "*"){
					padding = ""; cn = cn.substr(0, cn.length-1);
				}
				xpath += 
					"[contains(concat(' ',@class,' '), ' "+
					cn + padding + "')]";
			}

			handleAttrs(xPathAttrs, tqp, 
				function(condition){
						return "[@"+condition+"]";
				},
				function(matcher){
					xpath += matcher;
				}
			);

			// FIXME: need to implement pseudo-class checks!!
		};
		return xpath;
	};

	var _xpathFuncCache = {};
	var getXPathFunc = function(path){
		if(_xpathFuncCache[path]){
			return _xpathFuncCache[path];
		}

		var doc = d.doc;
		// var parent = d.body(); // FIXME
		// FIXME: don't need to memoize. The closure scope handles it for us.
		var xpath = buildPath(path);
		// console.debug(xpath);

		var tf = function(parent){
			// XPath query strings are memoized.
			var ret = [];
			var xpathResult;
			try{
				xpathResult = doc.evaluate(xpath, parent, null, 
												// XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
												XPathResult.ANY_TYPE, null);
			}catch(e){
				console.debug("failure in exprssion:", xpath, "under:", parent);
				console.debug(e);
			}
			var result = xpathResult.iterateNext();
			while(result){
				ret.push(result);
				result = xpathResult.iterateNext();
			}
			return ret;
		}
		return _xpathFuncCache[path] = tf;
	};

	/*
	d.xPathMatch = function(query){
		// XPath based DOM query system. Handles a small subset of CSS
		// selectors, subset is identical to the non-XPath version of this
		// function. 

		// FIXME: need to add support for alternate roots
		return getXPathFunc(query)();
	}
	*/

	////////////////////////////////////////////////////////////////////////
	// DOM query code
	////////////////////////////////////////////////////////////////////////

	var _filtersCache = {};
	var _simpleFiltersCache = {};

	var agree = function(first, second){
		if(!first){
			return second;
		}
		if(!second){
			return first;
		}

		return function(){
			return first.apply(window, arguments) && second.apply(window, arguments);
		}
	}

	var _filterDown = function(element, queryParts, matchArr, idx){
		var nidx = idx+1;
		var isFinal = (queryParts.length == nidx);
		var tqp = queryParts[idx];

		// see if we can constrain our next level to direct children
		if(tqp == ">"){
			var ecn = element.childNodes;
			if(!ecn.length){
				return;
			}
			nidx++;
			// kinda janky, too much array alloc
			var isFinal = (queryParts.length == nidx);

			var tf = getFilterFunc(queryParts[idx+1]);
			for(var x=ecn.length-1, te; x>=0, te=ecn[x]; x--){
				if(tf(te)){
					if(isFinal){
						matchArr.push(te);
					}else{
						_filterDown(te, queryParts, matchArr, nidx);
					}
				}
				if(x==0){
					break;
				}
			}
		}

		// otherwise, keep going down, unless we'er at the end
		var candidates = getElementsFunc(tqp)(element);
		if(isFinal){
			while(candidates.length){
				matchArr.push(candidates.shift());
			}
			/*
			candidates.unshift(0, matchArr.length-1);
			matchArr.splice.apply(matchArr, candidates);
			*/
		}else{
			// if we're not yet at the bottom, keep going!
			while(candidates.length){
				_filterDown(candidates.shift(), queryParts, matchArr, nidx);
			}
		}
	}

	var filterDown = function(elements, queryParts){
		ret = [];

		// for every root, get the elements that match the descendant selector
		// for(var x=elements.length-1, te; x>=0, te=elements[x]; x--){
		var x=elements.length-1, te;
		while(te=elements[x--]){
			_filterDown(te, queryParts, ret, 0);
		}
		return ret;
	}

	var getFilterFunc = function(query){
		// note: query can't have spaces!
		if(_filtersCache[query]){
			return _filtersCache[query];
		}
		var ff = null;
		var tagName = getTagName(query);

		// does it have a tagName component?
		if(tagName != "*"){
			// tag name match
			ff = agree(ff, 
				function(elem){
					var isTn = (
						(elem.nodeType == 1) &&
						(tagName == elem.tagName.toLowerCase())
					);
					return isTn;
				}
			);
		}

		var idComponent = getId(query);

		// does the node have an ID?
		if(idComponent.length){
			ff = agree(ff, 
				function(elem){
					return (
						(elem.nodeType == 1) &&
						(elem.id == idComponent)
					);
				}
			);
		}

		if(	Math.max.apply(this, _getIndexes(query).slice(1)) >= 0){
			// if we have other query param parts, make sure we add them to the
			// filter chain
			ff = agree(ff, getSimpleFilterFunc(query));
		}

		return _filtersCache[query] = ff;
	}

	var getNodeIndex = function(node){
		// NOTE: we could have a more accurate caching mechanism by
		// invalidating caches after the query has finished, but I think that'd
		// lead to significantly more cache churn than the cache would provide
		// value for in the common case. Generally, we're more conservative
		// (and therefore, more accurate) than jQuery and DomQuery WRT node
		// node indexes, but there may be corner cases in which we fall down.
		// How much we care about them is TBD.

		var pn = node.parentNode;
		var pnc = pn.childNodes;

		// check to see if we can trust the cache. If not, re-key the whole
		// thing and return our node match from that.

		var nidx = -1;
		var child = pn.firstChild;
		if(!child){
			return nidx;
		}

		var ci = node["__cachedIndex"];
		var cl = pn["__cachedLength"];

		// only handle cache building if we've gone out of sync
		if(((typeof cl == "number")&&(cl != pnc.length))||(typeof ci != "number")){
			// rip though the whole set, building cache indexes as we go
			pn["__cachedLength"] = pnc.length;
			var idx = 1;
			do{
				// we only assign indexes for nodes with nodeType == 1, as per:
				//		http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
				// only elements are counted in the search order, and they
				// begin at 1 for the first child's index

				if(child === node){
					nidx = idx;
				}
				if(child.nodeType == 1){
					child["__cachedIndex"] = idx;
					idx++;
				}
				child = child.nextSibling;
			}while(child);
		}else{
			// FIXME: could be incorrect in some cases (node swaps involving
			// the passed node, etc.), but we ignore those for now.
			nidx = ci;
		}
		return nidx;
	}

	var firedCount = 0;

	var _getAttr = function(elem, attr){
		var blank = "";
		if(attr == "class"){
			return elem.className || blank;
		}
		if(attr == "for"){
			return elem.htmlFor || blank;
		}
		return elem.getAttribute(attr, 2) || blank;
	}

	var attrs = [
		// FIXME: need to re-order in order of likelyness to be used in matches
		{
			key: "|=",
			match: function(attr, value){
				// E[hreflang|="en"]
				//		an E element whose "hreflang" attribute has a
				//		hyphen-separated list of values beginning (from the
				//		left) with "en"
				var valueDash = " "+value+"-";
				return function(elem){
					var ea = " "+(elem.getAttribute(attr, 2) || "");
					return (
						(ea == value) ||
						(ea.indexOf(valueDash)==0)
					);
				}
			}
		},
		{
			key: "^=",
			match: function(attr, value){
				return function(elem){
					return (_getAttr(elem, attr).indexOf(value)==0);
				}
			}
		},
		{
			key: "*=",
			match: function(attr, value){
				return function(elem){
					return (_getAttr(elem, attr).indexOf(value)>=0);
				}
			}
		},
		{
			key: "~=",
			match: function(attr, value){
				// return "[contains(concat(' ',@"+attr+",' '), ' "+ value +" ')]";
				var tval = " "+value+" ";
				return function(elem){
					var ea = " "+_getAttr(elem, attr)+" ";
					return (ea.indexOf(tval)>=0);
				}
			}
		},
		{
			key: "$=",
			match: function(attr, value){
				var tval = " "+value;
				return function(elem){
					var ea = " "+_getAttr(elem, attr);
					return (ea.lastIndexOf(value)==(ea.length-value.length));
				}
			}
		},
		{
			key: "!=",
			match: function(attr, value){
				return function(elem){
					return (_getAttr(elem, attr) != value);
				}
			}
		},
		// NOTE: the "=" match MUST come last!
		{
			key: "=",
			match: function(attr, value){
				return function(elem){
					return (_getAttr(elem, attr) == value);
				}
			}
		}
	];

	var pseudos = [
		{
			key: "first-child",
			match: function(name, condition){
				return function(elem){
					if(elem.nodeType != 1){ return false; }
					// check to see if any of the previous siblings are elements
					var fc = elem.previousSibling;
					while(fc && (fc.nodeType != 1)){
						fc = fc.previousSibling;
					}
					return (!fc);
				}
			}
		},
		{
			key: "last-child",
			match: function(name, condition){
				return function(elem){
					if(elem.nodeType != 1){ return false; }
					// check to see if any of the next siblings are elements
					var nc = elem.nextSibling;
					while(nc && (nc.nodeType != 1)){
						nc = nc.nextSibling;
					}
					return (!nc);
				}
			}
		},
		{
			key: "empty",
			match: function(name, condition){
				return function(elem){
					// DomQuery and jQuery get this wrong, oddly enough.
					// The CSS 3 selectors spec is pretty explicit about
					// it, too.
					var cn = elem.childNodes;
					var cnl = elem.childNodes.length;
					// if(!cnl){ return true; }
					for(var x=cnl-1; x >= 0; x--){
						var nt = cn[x].nodeType;
						if((nt == 1)||(nt == 3)){ return false; }
					}
					return true;
				}
			}
		},
		{
			key: "contains",
			match: function(name, condition){
				return function(elem){
					// FIXME: I dislike this version of "contains", as
					// whimsical attribute could set it off. An inner-text
					// based version might be more accurate, but since
					// jQuery and DomQuery also potentially get this wrong,
					// I'm leaving it for now.
					return (elem.innerHTML.indexOf(condition) >= 0);
				}
			}
		},
		{
			key: "not",
			match: function(name, condition){
				var ntf = getFilterFunc(condition);
				return function(elem){
					// FIXME: I dislike this version of "contains", as
					// whimsical attribute could set it off. An inner-text
					// based version might be more accurate, but since
					// jQuery and DomQuery also potentially get this wrong,
					// I'm leaving it for now.
					return (!ntf(elem));
				}
			}
		},
		{
			key: "nth-child",
			match: function(name, condition){
				var pi = parseInt;
				if(condition == "odd"){
					return function(elem){
						return (
							((getNodeIndex(elem)) % 2) == 1
						);
					}
				}else if((condition == "2n")||
					(condition == "even")){
					return function(elem){
						return ((getNodeIndex(elem) % 2) == 0);
					}
				}else if(condition.indexOf("0n+") == 0){
					var ncount = pi(condition.substr(3));
					return function(elem){
						return (elem.parentNode.childNodes[ncount-1] === elem);
					}
				}else if(	(condition.indexOf("n+") > 0) &&
							(condition.length > 3) ){
					var tparts = condition.split("n+", 2);
					var pred = pi(tparts[0]);
					var idx = pi(tparts[1]);
					return function(elem){
						return ((getNodeIndex(elem) % pred) == idx);
					}
				}else if(condition.indexOf("n") == -1){
					var ncount = pi(condition);
					return function(elem){
						return (getNodeIndex(elem) == ncount);
					}
				}
			}
		}
	];

	var getSimpleFilterFunc = function(query){
		// FIXME: this function currently doesn't support chaining of the same
		// sub-selector. E.g., we can't yet search on 
		//		span.thinger.thud 
		// or
		//		div:nth-child(even):last-child

		var fcHit = (_simpleFiltersCache[query]||_filtersCache[query]);
		if(fcHit){ return fcHit; }

		var ff = null;

		// [ q.indexOf("#"), q.indexOf("."), q.indexOf("["), q.indexOf(":") ];
		var i = _getIndexes(query);

		// the only case where we'll need the tag name is if we came from an ID query
		if(i[0] >= 0){
			var tn = getTagName(query);
			if(tn != "*"){
				ff = agree(ff, function(elem){
					return (elem.tagName.toLowerCase() == tn);
				});
			}
		}

		var matcher;

		// if there's a class in our query, generate a match function for it
		var className = getClassName(query);
		if(className.length){
			// get the class name
			var isWildcard = className.charAt(className.length-1) == "*";
			if(isWildcard){
				className = className.substr(0, className.length-1);
			}
			// I dislike the regex thing, even if memozied in a cache, but it's VERY short
			var re = new RegExp("(?:^|\\s)" + className + (isWildcard ? ".*" : "") + "(?:\\s|$)");
			ff = agree(ff, function(elem){
				return re.test(elem.className);
			});
		}

		if(i[3]>= 0){
			// NOTE: we count on the pseudo name being at the end
			// FIXME: this is clearly a bug!!!
			var pseudoName = query.substr(i[3]+1);
			var condition = "";
			var obi = pseudoName.indexOf("(");
			var cbi = pseudoName.lastIndexOf(")");
			if(	(0 <= obi)&&
				(0 <= cbi)&&
				(cbi > obi)){
				condition = pseudoName.substring(obi+1, cbi);
				pseudoName = pseudoName.substr(0, obi);
			}

			// NOTE: NOT extensible on purpose until I figure out
			// the portable xpath pseudos extensibility plan.

			// http://www.w3.org/TR/css3-selectors/#structural-pseudos
			matcher = null;
			for(var x=0; x<pseudos.length; x++){
				var ta = pseudos[x];
				if(ta.key == pseudoName){
					matcher = ta.match(pseudoName, condition);
					break;
				}
			}
			if(matcher){
				ff = agree(ff, matcher);
			}
		}

		// [ "#", ".", "[", ":" ];
		var defaultGetter = (d.isIE) ?
			function(cond){
				return function(elem){
					return elem[cond];
				}
			} : function(cond){
				return function(elem){
					return elem.hasAttribute(cond);
				}
			};
		handleAttrs(attrs, query, defaultGetter,
			function(tmatcher){
				ff = agree(ff, tmatcher);
			}
		);
		if(!ff){
			ff = function(){ return true; };
		}
		return _simpleFiltersCache[query] = ff;
	}

	var isTagOnly = function(query){
		return (Math.max.apply(this, _getIndexes(query)) == -1);
	}

	var _getElementsFuncCache = {};

	var getElementsFunc = function(query, root){
		var fHit = _getElementsFuncCache[query];
		if(fHit){ return fHit; }
		// NOTE: this function is in the fast path! not memoized!!!

		// the query doesn't contain any spaces, so there's only so many
		// things it could be
		// [ q.indexOf("#"), q.indexOf("."), q.indexOf("["), q.indexOf(":") ];
		var i = _getIndexes(query);
		var id = getId(query);
		if(i[0] == 0){
			// ID query. Easy.
			return _getElementsFuncCache[query] = function(root){
				return [ d.byId(id) ];
			}
		}

		var filterFunc = getSimpleFilterFunc(query);

		var retFunc;
		if(i[0] >= 0){
			// we got a filtered ID search (e.g., "h4#thinger")
			retFunc = function(root){
				var te = d.byId(id);
				if(filterFunc(te)){
					return [ te ];
				}
			}
		}else{
			// var ret = [];
			var tret;
			var tn = getTagName(query);

			if(isTagOnly(query)){
				// it's just a plain-ol elements-by-tag-name query from the root
				retFunc = function(root){
					var ret = [];
					var te, x=0, tret = root.getElementsByTagName(tn);
					while(te=tret[x++]){
						ret.push(te);
					}
					return ret;
				}
			}else{
				retFunc = function(root){
					var ret = [];
					var te, x=0, tret = root.getElementsByTagName(tn);
					while(te=tret[x++]){
						if(filterFunc(te)){
							ret.push(te);
						}
					}
					return ret;
				}
			}
		}
		return _getElementsFuncCache[query] = retFunc;
	}

	var _partsCache = {};

	////////////////////////////////////////////////////////////////////////
	// the query runner
	////////////////////////////////////////////////////////////////////////

	var _queryFuncCache = {};
	var getStepQueryFunc = function(query){
		if(0 > query.indexOf(" ")){
			return getElementsFunc(query);
		}

		var sqf = function(root){
			var qparts = query.split(" "); // FIXME: this is an inaccurate tokenizer!

			/*
			// FIXME: need to make root popping more explicit and cache it somehow

			// see if we can't pop a root off the front
			var partIndex = 0;
			var lastRoot;
			while((partIndex < qparts.length)&&(0 <= qparts[partIndex].indexOf("#"))){
				// FIXME: should we try to cache such that the step function
				// only ever looks for the last ID-based query part, thereby
				// avoiding re-runs and potential array alloc?

				lastRoot = root;
				root = getElementsFunc(qparts[partIndex])()[0];
				if(!root){ root = lastRoot; break; }
				partIndex++;
			}
			// console.debug(qparts[partIndex], root);
			if(qparts.length == partIndex){
				return [ root ];
			}
			// FIXME: need to handle tight-loop "div div div" style queries
			// here so as to avoid huge amounts of array alloc in repeated
			// getElements calls by filterDown
			var candidates;

			// FIXME: this isn't very generic. It lets us run like a bat outta
			// hell on queries like:
			//		div div span
			// and:
			//		#thinger span#blah div span span
			// but we might still fall apart on searches like:
			//		foo.bar span[blah="thonk"] div div span code.example
			// in short, we need to move the look-ahead logic into _filterDown()
			// console.debug(qparts[partIndex]);
			if( isTagOnly(qparts[partIndex]) && 
				(qparts[partIndex+1] != ">")
			){
				// go as far as we can down the chain without any intermediate
				// array allocation
				qparts = qparts.slice(partIndex);
				var searchParts = [];
				var idx = 0;
				while(qparts[idx] && isTagOnly(qparts[idx]) && (qparts[idx+1] != ">" )){
					searchParts.push(qparts[idx]);
					idx++;
				}
				var curLevelItems = [ root ];
				var nextLevelItems;
				for(var x=0; x<searchParts.length; x++){
					nextLevelItems = [];
					var tsp = qparts.shift();
					for(var y=0; y<curLevelItems.length; y++){
						var tze, z=0, tcol = curLevelItems[y].getElementsByTagName(tsp);
						while(tze=tcol[z++]){
							nextLevelItems.push(tze);
						}
					}
					curLevelItems = nextLevelItems;
				}
				candidates = curLevelItems;
				if(!qparts.length){
					return candidates;
				}
			}else{
				// console.debug(qparts);
				candidates = getElementsFunc(qparts.shift())(root);
			}
			*/
			var candidates;
			if(qparts[0] == ">"){
				candidates = [ root ];
				root = document;
			}else{
				candidates = getElementsFunc(qparts.shift())(root);
			}
			return filterDown(candidates, qparts);
		}
		return sqf;
	}

	var _getQueryFunc = (
		// NOTE: 
		//		XPath on the Webkit nighlies is slower than it's DOM iteration
		//		for most test cases
		// FIXME: 
		//		we should try to capture some runtime speed data for each query
		//		function to determine on the fly if we should stick w/ the
		//		potentially optimized variant or if we should try something
		//		new.
		(document["evaluate"] && !d.isSafari) ? 
		function(query){
			// has xpath support that's faster than DOM
			var qparts = query.split(" ");
			// can we handle it?
			if(	(document["evaluate"])&&
				(query.indexOf(":") == -1)&&
				(
					(true) // ||
					// (query.indexOf("[") == -1) ||
					// (query.indexOf("=") == -1)
				)
			){
				// dojo.debug(query);
				// should we handle it?

				// var gtIdx = query.indexOf(">")

				// kind of a lame heuristic, but it works
				if(	
					// a "div div div" style query
					((qparts.length > 2)&&(query.indexOf(">") == -1))||
					// or something else with moderate complexity. kinda janky
					(qparts.length > 3)||
					(query.indexOf("[")>=0)||
					// or if it's a ".thinger" query
					((1 == qparts.length)&&(0 <= query.indexOf(".")))

				){
					// use get and cache a xpath runner for this selector
					return getXPathFunc(query);
				}
			}

			// fallthrough
			return getStepQueryFunc(query);
		} : getStepQueryFunc
	);
	// uncomment to disable XPath for testing and tuning the DOM path
	// _getQueryFunc = getStepQueryFunc;

	// FIXME: we've got problems w/ the NodeList query()/filter() functions if we go XPath for everything

	// uncomment to disable DOM queries for testing and tuning XPath
	// _getQueryFunc = getXPathFunc;

	var getQueryFunc = function(query){
		if(_queryFuncCache[query]){ return _queryFuncCache[query]; }
		if(0 > query.indexOf(",")){
			return _queryFuncCache[query] = _getQueryFunc(query);
		}else{
			var parts = query.split(", ");
			var tf = function(root){
				var pindex = 0; // avoid array alloc for every invocation
				var ret = [];
				var tp;
				while(tp = parts[pindex++]){
					ret = ret.concat(_getQueryFunc(tp, tp.indexOf(" "))(root));
				}
				return ret;
			}
			return _queryFuncCache[query] = tf;
		}
	}

	/*
	// experimental implementation of _zip for IE
	var _zip = function(arr){
		if(!arr){ return []; }
		var al = arr.length;
		if(al < 2){ return arr; }
		var ret = [arr[0]];
		var lastIdx = arr[0].sourceIndex;
		for(var x=1, te; te = arr[x]; x++){
		// for(var x=1; x<arr.length; x++){
			var nsi = te.sourceIndex;
			if(nsi > lastIdx){
				ret.push(te);
				lastIdx = nsi;
			}
		}
		return ret;
	}
	*/

	// FIXME: 
	//		Dean's new Base2 uses a system whereby queries themselves note if
	//		they'll need duplicate filtering. We need to get on that plan!!

	var _zipIdx = 0;
	var _zip = function(arr){
		var ret = new d.NodeList();
		if(!arr){ return ret; }
		if(arr[0]){
			ret.push(arr[0]);
		}
		if(arr.length < 2){ return ret; }
		_zipIdx++;
		arr[0]["_zipIdx"] = _zipIdx;
		for(var x=1, te; te = arr[x]; x++){
			if(arr[x]["_zipIdx"] != _zipIdx){ 
				ret.push(te);
			}
			te["_zipIdx"] = _zipIdx;
		}
		// FIXME: should we consider stripping these properties?
		return ret;
	}

	d.query = function(query, root){
		// return is always an array
		// NOTE: elementsById is not currently supported
		// NOTE: ignores xpath-ish queries for now
		if(typeof query != "string"){
			return new d.NodeList(query);
		}
		if(typeof root == "string"){
			root = dojo.byId(root);
		}

		// FIXME: should support more methods on the return than the stock array.
		return _zip(getQueryFunc(query)(root||dojo.doc));
	}

	/*
	// exposing these was a mistake
	d.query.attrs = attrs;
	d.query.pseudos = pseudos;
	*/

	d._filterQueryResult = function(nodeList, simpleFilter){
		var tnl = new d.NodeList();
		var ff = (simpleFilter) ? getFilterFunc(simpleFilter) : function(){ return true; };
		// dojo.debug(ff);
		for(var x=0, te; te = nodeList[x]; x++){
			if(ff(te)){ tnl.push(te); }
		}
		return tnl;
	}
})();

dojo.provide("dojo._base.xhr");





dojo.formToObject = function(/*DOMNode||String*/ formNode){
	// summary:
	//		dojo.formToObject returns the values encoded in an HTML form as
	//		string properties in an object which it then returns. Disabled form
	//		elements, buttons, and other non-value form elements are skipped.
	//		Multi-select elements are returned as an array of string values.
	// description:
	//		This form:
	//
	//			<form id="test_form">
	//				<input type="text" name="blah" value="blah">
	//				<input type="text" name="no_value" value="blah" disabled>
	//				<input type="button" name="no_value2" value="blah">
	//				<select type="select" multiple name="multi" size="5">
	//					<option value="blah">blah</option>
	//					<option value="thud" selected>thud</option>
	//					<option value="thonk" selected>thonk</option>
	//				</select>
	//			</form>
	//
	//		yeilds this object structure as the result of a call to
	//		formToObject():
	//
	//			{ 
	//				blah: "blah",
	//				multi: [
	//					"thud",
	//					"thonk"
	//				]
	//			};

	// FIXME: seems that dojo.query needs negation operators!!
	var ret = {};
	var iq = "input[type!=file][type!=submit][type!=image][type!=reset][type!=button], select, textarea";
	dojo.query(iq, formNode).filter(function(node){
		return (!node.disabled);
	}).forEach(function(item){
		var _in = item.name;
		var type = (item.type||"").toLowerCase();
		if((type == "radio")||(type == "checkbox")){
			if(item.checked){ ret[_in] = item.value; }
		}else if(item.multiple){
			var ria = ret[_in] = [];
			dojo.query("option[selected]", item).forEach(function(opt){
				ria.push(opt.value);
			});
		}else{ 
			ret[_in] = item.value;
			if(type == "image"){
				ret[_in+".x"] = ret[_in+".y"] = ret[_in].x = ret[_in].y = 0;
			}
		}
	});
	return ret;
}

dojo.objectToQuery = function(/*Object*/ map){
	// FIXME: need to implement encodeAscii!!
	var ec = encodeURIComponent;
	var ret = "";
	var backstop = {};
	for(var x in map){
		if(map[x] != backstop[x]){
			if(dojo.isArray(map[x])){
				for(var y=0; y<map[x].length; y++){
					ret += ec(x) + "=" + ec(map[x][y]) + "&";
				}
			}else{
				ret += ec(x) + "=" + ec(map[x]) + "&";
			}
		}
	}
	if((ret.length)&&(ret.charAt(ret.length-1)== "&")){
		ret = ret.substr(0, ret.length-1);
	}
	return ret; // string
}

dojo.formToQuery = function(/*DOMNode||String*/ formNode){
	// summary:
	//		return URL-encoded string representing the form passed as either a
	//		node or string ID identifying the form to serialize
	return dojo.objectToQuery(dojo.formToObject(formNode)); // string
}

dojo.formToJson = function(/*DOMNode||String*/ formNode){
	// summary:
	//		return a serialized JSON string from a form node or string
	//		ID identifying the form to serialize
	return dojo.toJson(dojo.formToObject(formNode)); // string
}

dojo.queryToObject = function(/*String*/ str){
	// summary:
	//		returns an object representing a de-serialized query section of a
	//		URL. Query keys with multiple values are returned in an array.
	// description:
	//		This string:
	//
	//			"foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
	//		
	//		returns this object structure:
	//
	//			{
	//				foo: [ "bar", "baz" ],
	//				thinger: " spaces =blah",
	//				zonk: "blarg"
	//			}
	//	
	//		Note that spaces and other urlencoded entities are correctly
	//		handled.

	// FIXME: should we grab the URL string if we're not passed one?
	var ret = {};
	var qp = str.split("&");
	var dc = decodeURIComponent;
	dojo.forEach(qp, function(item){
		if(item.length){
			var parts = item.split("=");
			var name = parts.shift();
			var val = dc(parts.join("="));
			if(dojo.isString(ret[name])){
				ret[name] = [ret[name]];
			}
			if(dojo.isArray(ret[name])){
				ret[name].push(val);
			}else{
				ret[name] = val;
			}
		}
	});
	return ret;
}

/*
	from refactor.txt:

	all bind() replacement APIs take the following argument structure:

		{
			url: "blah.html",

			// all below are optional, but must be supported in some form by
			// every IO API
			timeout: 1000, // milliseconds
			handleAs: "text", // replaces the always-wrong "mimetype"
			content: { 
				key: "value"
			},

			// browser-specific, MAY be unsupported
			sync: true, // defaults to false
			form: dojo.byId("someForm") 
		}
*/

// need to block async callbacks from snatching this thread as the result
// of an async callback might call another sync XHR, this hangs khtml forever
// must checked by watchInFlight()

dojo._blockAsync = false;

dojo._contentHandlers = {
	"text": function(xhr){ return xhr.responseText; },
	"json": function(xhr){ 
		console.debug("please consider using a mimetype of text/json-comment-filtered to avoid potential security issues with JSON endpoints");
		return dojo.fromJson(xhr.responseText);
	},
	"json-comment-optional": function(xhr){ 
		// NOTE: we provide the json-comment-filtered option as one solution to
		// the "JavaScript Hijacking" issue noted by Fortify and others. It is
		// not appropriate for all circumstances.
		var value = xhr.responseText;
		var cStartIdx = value.indexOf("\/*");
		var cEndIdx = value.lastIndexOf("*\/");
		if((cStartIdx == -1)||(cEndIdx == -1)){
			return dojo.fromJson(xhr.responseText);
		}
		return dojo.fromJson(value.substring(cStartIdx+2, cEndIdx));
	},
	"json-comment-filtered": function(xhr){ 
		// NOTE: we provide the json-comment-filtered option as one solution to
		// the "JavaScript Hijacking" issue noted by Fortify and others. It is
		// not appropriate for all circumstances.
		var value = xhr.responseText;
		var cStartIdx = value.indexOf("\/*");
		var cEndIdx = value.lastIndexOf("*\/");
		if((cStartIdx == -1)||(cEndIdx == -1)){
			// FIXME: throw exception instead?
			console.debug("your JSON wasn't comment filtered!"); 
			return "";
		}
		return dojo.fromJson(value.substring(cStartIdx+2, cEndIdx));
	},
	"javascript": function(xhr){ 
		// FIXME: try Moz and IE specific eval variants?
		return dojo.eval(xhr.responseText);
	},
	"xml": function(xhr){ 
		return xhr.responseXML;
	}
};

(function(){

	dojo._ioSetArgs = function(/*Object*/args,
			/*Function*/canceller,
			/*Function*/okHandler,
			/*Function*/errHandler){
		//summary: sets up the Deferred and ioArgs property on the Deferred so it
		//can be used in an io call.
		//args:
		//		The args object passed into the public io call.
		//canceller:
		//		The canceller function used for the Deferred object. The function
		//		will receive one argument, the Deferred object that is related to the
		//		canceller.
		//okHandler:
		//		The first OK callback to be registered with Deferred. It has the opportunity
		//		to transform the OK response. It will receive one argument -- the Deferred
		//		object returned from this function.
		//errHandler:
		//		The first error callback to be registered with Deferred. It has the opportunity
		//		to do cleanup on an error. It will receive two arguments: error (the 
		//		Error object) and dfd, the Deferred object returned from this function.

		var ioArgs = {};
		ioArgs.args = args;

		//Get values from form if requestd.
		var formQuery = null;
		if(args.form){ 
			var form = dojo.byId(args.form);
			ioArgs.url = args.url || form.getAttribute("action");
			formQuery = dojo.formToQuery(form);
		}else{
			ioArgs.url = args.url;
		}

		// set up the query params
		var qi = ioArgs.url.indexOf("?");
		var miArgs = [{}];
		if(qi != -1){ // url-provided params are the baseline
			miArgs.push(dojo.queryToObject(ioArgs.url.substr(qi+1)));
			ioArgs.url = ioArgs.url.substr(0, qi);
		}
	
		if(formQuery){
			// potentially over-ride url-provided params w/ form values
			miArgs.push(dojo.queryToObject(formQuery));
		}
		if(args.content){
			// stuff in content over-rides what's set by form
			miArgs.push(args.content);
		}
		if(args.preventCache){
			miArgs.push({"dojo.preventCache": new Date().valueOf()});
		}
		ioArgs.query = dojo.objectToQuery(dojo.mixin.apply(null, miArgs));
	
		// .. and the real work of getting the deferred in order, etc.
		ioArgs.ha = args.handleAs || "text";
		var d = new dojo.Deferred(canceller);
		d.addCallbacks(okHandler, function(error){
				return errHandler(error, d);
		});
		
		/*
		//Support specifying load and error callback functions from the args.
		//For those callbacks, the "this" object will be the args object.
		//The load and error callback will get the deferred result value as the
		//first argument and the ioArgs object as the second argument.
		var ld = args.load;
		if(ld && dojo.isFunction(ld)){
			d.addCallback(function(value){
				return ld.call(args, value, ioArgs);
			});
		}
		var err = args.error;
		if(err && dojo.isFunction(err)){
			d.addErrback(function(value){
				return err.call(args, value, ioArgs);
			});
		}
		*/

		d.ioArgs = ioArgs;
	
		// FIXME: need to wire up the xhr object's abort method to something
		// analagous in the Deferred
		return d;
	
	}

	var _deferredCancel = function(/*Deferred*/dfd){
		//summary: canceller function for dojo._ioSetArgs call.
		
		dfd.canceled = true;
		dfd.ioArgs.xhr.abort();
	}
	var _deferredOk = function(/*Deferred*/dfd){
		//summary: okHandler function for dojo._ioSetArgs call.
		
		return dojo._contentHandlers[dfd.ioArgs.ha](dfd.ioArgs.xhr);
	}
	var _deferError = function(/*Error*/error, /*Deferred*/dfd){
		//summary: errHandler function for dojo._ioSetArgs call.
		
		// dfd.ioArgs.xhr.abort();
		console.debug("xhr error in:", dfd.ioArgs.xhr);
		console.debug(error);
		return error;
	}

	var _makeXhrDeferred = function(/*Object*/args){
		//summary: makes the Deferred object for this xhr request.
		var dfd = dojo._ioSetArgs(args, _deferredCancel, _deferredOk, _deferError);
		dfd.ioArgs.xhr = dojo._xhrObj();
		return dfd;
	}

	// avoid setting a timer per request. It degrades performance on IE
	// something fierece if we don't use unified loops.
	var _inFlightIntvl = null;
	var _inFlight = [];
	var _watchInFlight = function(){
		//summary: 
		//		internal method that checks each inflight XMLHttpRequest to see
		//		if it has completed or if the timeout situation applies.
		
		var now = (new Date()).getTime();
		// make sure sync calls stay thread safe, if this callback is called
		// during a sync call and this results in another sync call before the
		// first sync call ends the browser hangs
		if(!dojo._blockAsync){
			dojo.forEach(_inFlight, function(tif, arrIdx){
				if(!tif){ return; }
				var dfd = tif.dfd;
				try{
					if(!dfd || dfd.canceled || !tif.validCheck(dfd)){
						_inFlight.splice(arrIdx, 1); return;
					}
					if(tif.ioCheck(dfd)){
						_inFlight.splice(arrIdx, 1); // clean refs
						tif.resHandle(dfd);
					}else if(dfd.startTime){
						//did we timeout?
						if(dfd.startTime + (dfd.ioArgs.args.timeout||0) < now){
							//Stop the request.
							dfd.cancel();
							_inFlight.splice(arrIdx, 1); // clean refs
							var err = new Error("timeout exceeded");
							err.dojoType = "timeout";
							dfd.errback(err);
						}
					}
				}catch(e){
					// FIXME: make sure we errback!
					console.debug(e);
					dfd.errback(new Error("_watchInFlightError!"));
				}
			});
		}

		if(!_inFlight.length){
			clearInterval(_inFlightIntvl);
			_inFlightIntvl = null;
			return;
		}
	}

	dojo._ioWatch = function(/*Deferred*/dfd,
		/*Function*/validCheck,
		/*Function*/ioCheck,
		/*Function*/resHandle){
		//summary: watches the io request represented by dfd to see if it completes.
		//dfd:
		//		The Deferred object to watch.
		//validCheck:
		//		Function used to check if the IO request is still valid. Gets the dfd
		//		object as its only argument.
		//ioCheck:
		//		Function used to check if basic IO call worked. Gets the dfd
		//		object as its only argument.
		//resHandle:
		//		Function used to process response. Gets the dfd
		//		object as its only argument.
		if(dfd.ioArgs.args.timeout){
			dfd.startTime = (new Date()).getTime();
		}
		_inFlight.push({dfd: dfd, validCheck: validCheck, ioCheck: ioCheck, resHandle: resHandle});
		if(!_inFlightIntvl){
			_inFlightIntvl = setInterval(_watchInFlight, 50);
		}
		_watchInFlight(); // handle sync requests
	}

	var _defaultContentType = "application/x-www-form-urlencoded";

	var _validCheck = function(/*Deferred*/dfd){
		return dfd.ioArgs.xhr.readyState; //boolean
	}
	var _ioCheck = function(/*Deferred*/dfd){
		return 4 == dfd.ioArgs.xhr.readyState; //boolean
	}
	var _resHandle = function(/*Deferred*/dfd){
		if(dojo._isDocumentOk(dfd.ioArgs.xhr)){
			dfd.callback(dfd);
		}else{
			dfd.errback(new Error("bad http response code:" + dfd.ioArgs.xhr.status));
		}
	}

	var _doIt = function(/*String*/type, /*Deferred*/dfd){
		// IE 6 is a steaming pile. It won't let you call apply() on the native function (xhr.open).
		// workaround for IE6's apply() "issues"
		var ioArgs = dfd.ioArgs;
		var args = ioArgs.args;
		ioArgs.xhr.open(type, ioArgs.url, (args.sync !== true), (args.user ? args.user : undefined), (args.password ? args.password: undefined));
		// FIXME: is this appropriate for all content types?
		ioArgs.xhr.setRequestHeader("Content-Type", (args.contentType||_defaultContentType));
		// FIXME: set other headers here!
		try{
			ioArgs.xhr.send(ioArgs.query);
		}catch(e){
			// dfd.cancel();
			ioArgs.cancel();
		}
		dojo._ioWatch(dfd, _validCheck, _ioCheck, _resHandle);
		return dfd; //Deferred
	}

	// TODOC: FIXME!!!

	dojo.xhrGet = function(/*Object*/ args){
		var dfd = _makeXhrDeferred(args);
		var ioArgs = dfd.ioArgs;
		if(ioArgs.query.length){
			ioArgs.url += "?" + ioArgs.query;
			ioArgs.query = null;
		}
		return _doIt("GET", dfd); // dojo.Deferred
	}

	dojo.xhrPost = function(/*Object*/ args){
		return _doIt("POST", _makeXhrDeferred(args)); // dojo.Deferred
	}

	dojo.rawXhrPost = function(/*Object*/ args){
		var dfd = _makeXhrDeferred(args);
		dfd.ioArgs.query = args.postData;
		return _doIt("POST", dfd); // dojo.Deferred
	}

	dojo.wrapForm = function(formNode){
		// was FormBind
		// FIXME: waiting on connect
		// FIXME: need to think harder about what extensions to this we might
		// want. What should we allow folks to do w/ this? What events to
		// set/send?
		throw new Error("dojo.wrapForm not yet implemented");
	}
})();

dojo.provide("dojo._base.fx");






/*
	Animation losely package based on Dan Pupius' work: 
		http://pupius.co.uk/js/Toolkit.Drawing.js
*/
dojo._Line = function(/*int*/ start, /*int*/ end){
	// summary: dojo._Line is the object used to generate values
	//			from a start value to an end value
	this.start = start;
	this.end = end;
	this.getValue = function(/*float*/ n){
		//	summary: returns the point on the line
		//	n: a floating point number greater than 0 and less than 1
		return ((this.end - this.start) * n) + this.start; // Decimal
	}
}

dojo.Color = function(/*r, g, b, a*/){
	this.setColor.apply(this, arguments);
}

// FIXME: there's got to be a more space-efficient way to encode or discover these!!
// eugene: let's support at least HTML4 colors (a standard subset of CSS3 color module),
// we can add the rest later (with compact representation, of course)
dojo.Color.named = {
	black:      [0,0,0],
	silver:     [192,192,192],
	gray:       [128,128,128],
	white:      [255,255,255],
	maroon:		[128,0,0],
	red:        [255,0,0],
	purple:		[128,0,128],
	fuchsia:	[255,0,255],
	green:	    [0,128,0],
	lime:	    [0,255,0],
	olive:		[128,128,0],
	yellow:		[255,255,0],
	navy:       [0,0,128],
	blue:       [0,0,255],
	teal:		[0,128,128],
	aqua:		[0,255,255]
};

dojo.extend(dojo.Color, {
	// FIXME: implement caching of the RGBA array generation!! It's stupid that we realloc
	_cache: null,
	setColor: function(/*r, g, b, a*/){
		// summary:
		// 		takes an r, g, b, a(lpha) value, [r, g, b, a] array, "rgb(...)"
		// 		string, hex string (#aaa, #aaaaaa, aaaaaaa)

		this._cache = [];
		var d = dojo;
		var a = arguments;
		var a0 = a[0];
		var pmap = (d.isArray(a0) ? a0 : (d.isString(a0) ? d.extractRgb(a0) : d._toArray(a)) );
		d.forEach(["r", "g", "b", "a"], function(p, i){
			this._cache[i] = this[p] = parseFloat(pmap[i]);
		}, this);
		this._cache[3] = this.a = this.a || 1.0;
	},
	toRgb: function(includeAlpha){
		return this._cache.slice(0, ((includeAlpha) ? 4 : 3));
	},
	toRgba: function(){
		return this._cache.slice(0, 4);
	},
	toHex: function(){
		return dojo.rgb2hex(this.toRgb());
	},
	toCss: function(){
		return "rgb(" + this.toRgb().join(", ") + ")";
	},
	toString: function(){
		return this.toHex(); // decent default?
	}
});

dojo.blendColors = function(a, b, weight){
	// summary: 
	//		blend colors a and b with weight
	//		from -1 to +1, 0 being a 50/50 blend
	if(typeof a == "string"){ a = dojo.extractRgb(a); }
	if(typeof b == "string"){ b = dojo.extractRgb(b); }
	if(a["_cache"]){ a = a._cache; }
	if(b["_cache"]){ b = b._cache; }
	weight = Math.min(Math.max(-1, (weight||0)), 1);

	// alex: this interface blows.
	// map -1 to 1 to the range 0 to 1
	weight = ((weight + 1)/2);
	
	var c = [];

	// var stop = (1000*weight);
	for(var x = 0; x < 3; x++){
		// console.debug(b[x] + ((a[x] - b[x]) * weight));
		c[x] = parseInt( b[x] + ( (a[x] - b[x]) * weight) );
	}
	return c;
}

// get RGB array from css-style color declarations
dojo.extractRgb = function(color){
	color = color.toLowerCase();
	if(color.indexOf("rgb") == 0 ){
		var matches = color.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
		var ret = dojo.map(matches.splice(1, 3), parseFloat);
		return ret;
	}else{
		return dojo.hex2rgb(color) || dojo.Color.named[color] || [255, 255, 255];
	}
}

dojo.hex2rgb = function(hex){
	var hexNum = "0123456789abcdef";
	var rgb = new Array(3);
	if( hex.charAt(0) == "#" ){ hex = hex.substr(1); }
	hex = hex.toLowerCase();
	if(hex.replace(new RegExp("["+hexNum+"]", "g"), "") != ""){
		return null;
	}
	if( hex.length == 3 ){
		rgb[0] = hex.charAt(0) + hex.charAt(0);
		rgb[1] = hex.charAt(1) + hex.charAt(1);
		rgb[2] = hex.charAt(2) + hex.charAt(2);
	}else{
		rgb[0] = hex.substr(0, 2);
		rgb[1] = hex.substr(2, 2);
		rgb[2] = hex.substr(4);
	}
	for(var i = 0; i < rgb.length; i++){
		rgb[i] = hexNum.indexOf(rgb[i].charAt(0)) * 16 + hexNum.indexOf(rgb[i].charAt(1));
	}
	return rgb;
}

dojo.rgb2hex = function(r, g, b){
	var ret = dojo.map(((r._cache)||((!g) ? r : [r, g, b])), function(x, i){
		var s = (new Number(x)).toString(16);
		while(s.length < 2){ s = "0" + s; }
		return s;
	});
	ret.unshift("#");
	return ret.join("");
}

//FIXME: _Animation must be a Deferred?
dojo.declare("dojo._Animation", null,
	function(/*Object*/ args){
		//	summary
		//		a generic animation object that fires callbacks into it's handlers
		//		object at various states
		//  FIXME: document args object
		dojo.mixin(this, args);
		if(dojo.isArray(this.curve)){
			/* curve: Array
			   pId: a */
			this.curve = new dojo._Line(this.curve[0], this.curve[1]);
		}
	},
	{
		// public properties
		curve: null,
		duration: 1000,
		easing: null,
		repeat: 0,
		rate: 10, // 100 fps
		delay: null,
		
		// events
		beforeBegin: null,
		onBegin: null,
		onAnimate: null,
		onEnd: null,
		onPlay: null,
		onPause: null,
		onStop: null,

		// private properties
		_active: false,
		_paused: false,
		_startTime: null,
		_endTime: null,
		_timer: null,
		_percent: 0,
		_startRepeatCount: 0,

		fire: function(/*Event*/ evt, /*Array?*/ args){
			// summary: Convenience function.  Fire event "evt" and pass it
			//			the arguments specified in "args".
			// evt: The event to fire.
			// args: The arguments to pass to the event.
			if(this[evt]){
				this[evt].apply(this, args||[]);
			}
			return this; // dojo._Animation
		},
		
		chain: function(/*dojo._Animation[]*/ anims){
			dojo.forEach(anims, function(anim, i){
				var prev = (i==0) ? this : anims[i-1];
				dojo.connect(prev, "onEnd", anim, "play");
			}, this);
			return this; // dojo._Animation
		},

		combine: function(/*dojo._Animation[]*/ anims){
			dojo.forEach(anims, function(anim){
				dojo.connect(this, "play", anim, "play");
			}, this);
			return this; // dojo._Animation
		},

		play: function(/*int?*/ delay, /*boolean?*/ gotoStart){
			// summary: Start the animation.
			// delay: How many milliseconds to delay before starting.
			// gotoStart: If true, starts the animation from the beginning; otherwise,
			//            starts it from its current position.
			if(gotoStart){
				clearTimeout(this._timer);
				this._active = this._paused = false;
				this._percent = 0;
			}else if(this._active && !this._paused){
				return this; // dojo._Animation
			}

			this.fire("beforeBegin");

			var d = delay||this.delay;
			if(d > 0){
				setTimeout(dojo.hitch(this, function(){ this.play(null, gotoStart); }), d);
				return this; // dojo._Animation
			}
		
			this._startTime = new Date().valueOf();
			if(this._paused){
				this._startTime -= this.duration * this._percent;
			}
			this._endTime = this._startTime + this.duration;

			this._active = true;
			this._paused = false;
		
			var value = this.curve.getValue(this._percent);
			if(this._percent == 0){
				if(!this._startRepeatCount){
					this._startRepeatCount = this.repeat;
				}
				this.fire("onBegin", [value]);
			}

			this.fire("onPlay", [value]);

			this._cycle();
			return this; // dojo._Animation
		},

		pause: function(){
			// summary: Pauses a running animation.
			clearTimeout(this._timer);
			if(!this._active){ return this; /*dojo._Animation*/}
			this._paused = true;
			this.fire("onPause", [this.curve.getValue(this._percent)]);
			return this; // dojo._Animation
		},

		gotoPercent: function(/*Decimal*/ pct, /*boolean?*/ andPlay){
			// summary: Sets the progress of the animation.
			// pct: A percentage in decimal notation (between and including 0.0 and 1.0).
			// andPlay: If true, play the animation after setting the progress.
			clearTimeout(this._timer);
			this._active = this._paused = true;
			this._percent = pct * 100;
			if(andPlay){ this.play(); }
			return this; // dojo._Animation
		},

		stop: function(/*boolean?*/ gotoEnd){
			// summary: Stops a running animation.
			// gotoEnd: If true, the animation will end.
			clearTimeout(this._timer);
			if(gotoEnd){
				this._percent = 1;
			}
			this.fire("onStop", [this.curve.getValue(this._percent)]);
			this._active = this._paused = false;
			return this; // dojo._Animation
		},

		status: function(){
			// summary: Returns a string representation of the status of
			//			the animation.
			if(this._active){
				return this._paused ? "paused" : "playing"; // String
			}
			return "stopped"; // String
		},

		// "private" methods
		_cycle: function(){
			clearTimeout(this._timer);
			if(this._active){
				var curr = new Date().valueOf();
				var step = (curr - this._startTime) / (this._endTime - this._startTime);

				if(step >= 1){
					step = 1;
				}
				this._percent = step;

				// Perform easing
				if(this.easing){
					step = this.easing(step);
				}

				this.fire("onAnimate", [this.curve.getValue(step)]);

				if(step < 1){
					this._timer = setTimeout(dojo.hitch(this, "_cycle"), this.rate);
				}else{
					this._active = false;

					if(this.repeat > 0){
						this.repeat--;
						this.play(null, true);
					}else if(this.repeat == -1){
						this.play(null, true);
					}else{
						if(this._startRepeatCount){
							this.repeat = this._startRepeatCount;
							this._startRepeatCount = 0;
						}
					}
					this.fire("onEnd");
				}
			}
			return this; // dojo._Animation
		}
	}
);

(function(){
	var _makeFadeable = function(node){
		if(dojo.isIE){
			// only set the zoom if the "tickle" value would be the same as the
			// default
			if(node.style.zoom.length == 0 && dojo.style(node, "zoom") == "normal"){
				// make sure the node "hasLayout"
				// NOTE: this has been tested with larger and smaller user-set text
				// sizes and works fine
				node.style.zoom = "1";
				// node.style.zoom = "normal";
			}
			// don't set the width to auto if it didn't already cascade that way.
			// We don't want to f anyones designs
			if(node.style.width.length == 0 && dojo.style(node, "width") == "auto"){
				node.style.width = "auto";
			}
		}
	}

	dojo._fade = function(/*Object*/ args){
		// summary:Returns an animation that will fade the "nodes" from the start to end values passed.

		//FIXME: remove arg checking?  Change docs above to show that end is not optional.  Just make sure this blows up in a reliable way?
		if(typeof args.end == "undefined"){
			throw new Error("dojo._fade needs an end value");
		}
		args.node = dojo.byId(args.node);
		var fArgs = dojo.mixin({ properties: {} }, args);
		var props = fArgs.properties.opacity = {};
		props.start = (typeof fArgs.start == "undefined") ?
			function(){ return Number(dojo.style(fArgs.node, "opacity")); } : fArgs.start;
		props.end = fArgs.end;

		var anim = dojo.animateProperty(fArgs);
		dojo.connect(anim, "beforeBegin", null, function(){
			_makeFadeable(fArgs.node);
		});

		return anim; // dojo._Animation
	}

	dojo.fadeIn = function(/*Object*/ args){
		// summary: Returns an animation that will fade "nodes" from its current opacity to fully opaque.
		// nodes: An array of DOMNodes or one DOMNode.
		// duration: Duration of the animation in milliseconds.
		// easing: An easing function.
		return dojo._fade(dojo.mixin({ end: 1 }, args)); // dojo._Animation
	}

	dojo.fadeOut = function(/*Object*/ args){
		// summary: Returns an animation that will fade "nodes" from its current opacity to fully transparent.
		// nodes: An array of DOMNodes or one DOMNode.
		// duration: Duration of the animation in milliseconds.
		// easing: An easing function.
		return dojo._fade(dojo.mixin({ end: 0 }, args)); // dojo._Animation
	}

	if(dojo.isKhtml && !dojo.isSafari){
		// the cool kids are obviously not using konqueror...
		// found a very wierd bug in floats constants, 1.5 evals as 1
		// seems somebody mixed up ints and floats in 3.5.4 ??
		// FIXME: investigate more and post a KDE bug (Fredrik)
		dojo._defaultEasing = function(/*Decimal?*/ n){
			//	summary: Returns the point for point n on a sin wave.
			return parseFloat("0.5")+((Math.sin((n+parseFloat("1.5")) * Math.PI))/2); //FIXME: Does this still occur in the supported Safari version?
		}
	}else{
		dojo._defaultEasing = function(/*Decimal?*/ n){
			return 0.5+((Math.sin((n+1.5) * Math.PI))/2);
		}
	}

	dojo.animateProperty = function(/*Object*/ args){
		// summary: Returns an animation that will transition the properties of "nodes"
		//			depending how they are defined in "propertyMap".
		args.node = dojo.byId(args.node);
		if (!args.easing){ args.easing = dojo._defaultEasing; }
		
		var PropLine = function(properties){
			this._properties = properties;
			for (var p in properties){
				var prop = properties[p];
				// calculate the end - start to optimize a bit
				if(dojo.isFunction(prop.start)){
					prop.start = prop.start(prop);
				}
				if(dojo.isFunction(prop.end)){
					prop.end = prop.end(prop);
				}
				/*
				if(prop.start instanceof dojo.Color){
					// save these so we don't have to call toRgb() every getValue() call
					prop.startRgb = prop.start.toRgb();
					prop.endRgb = prop.end.toRgb();
				}
				*/
			}
			this.getValue = function(n){
				var ret = {};
				for(var p in this._properties){
					var prop = this._properties[p];
					var value = null;
					if(prop.start instanceof dojo.Color){
						value = dojo.rgb2hex(dojo.blendColors(prop.end, prop.start, n));
						// value = "rbg("+dojo.blendColors(prop.end, prop.start, n).join(",")+")";
					}else if(!dojo.isArray(prop.start)){
						value = ((prop.end - prop.start) * n) + prop.start + (p != "opacity" ? prop.units||"px" : "");
					}
					ret[p] = value;
				}
				return ret;
			}
		}
		
		var anim = new dojo._Animation(args);
		dojo.connect(anim, "beforeBegin", anim, function(){
			var pm = this.properties;
			for(var p in pm){
				var prop = pm[p];

				if(dojo.isFunction(prop.start)){
					prop.start = prop.start();
				}
				if(dojo.isFunction(prop.end)){
					prop.end = prop.end();
				}

				var isColor = (p.toLowerCase().indexOf("color") >= 0);
				if(typeof prop.end == "undefined"){
					prop.end = dojo.style(this.node, p);
				}else if(typeof prop.start == "undefined"){
					prop.start = dojo.style(this.node, p);
				}

				if(isColor){
					// console.debug("it's a color!");
					prop.start = new dojo.Color(prop.start);
					prop.end = new dojo.Color(prop.end);
				}else{
					prop.start = (p == "opacity") ? Number(prop.start) : parseInt(prop.start);
				}
				// console.debug("start:", prop.start);
				// console.debug("end:", prop.end);
			}
			this.curve = new PropLine(pm);
		});
		dojo.connect(anim, "onAnimate", anim, function(propValues){
			// try{
			for(var s in propValues){
				// console.debug(s, propValues[s], this.node.style[s]);
				dojo.style(this.node, s, propValues[s]);
				// this.node.style[s] = propValues[s];
			}
			// }catch(e){ console.debug(dojo.toJson(e)); }
		});

		return anim; // dojo._Animation
	}
})();

