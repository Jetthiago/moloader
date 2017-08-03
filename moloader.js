// Writed by Thiago Marques ~jetthiago
/*examples: 
	var moloader = require("moloader");
	moloader.loadPack();
	moloader.loadDir("./my_modules","log_table.js, console.js");
	stack = [
		"fs",
		"./my_modules/better-console.js",
		{path: "./my_modules/handlebars.js", name: "hb"},
		{path: "url", name: "URL"}
	]
	moloader.load(stack);
	moloader.load("http, url, express");
	better_console
	hb
	fs
*/

var console = require("better-console"),
	camel = require("camelcase"),
	fs = require("fs"),
	path = require("path"),
	regxp = {
		isPath: /\.\//,
		isJs: /\.js/i,
		isJSON: /\.json/i,
		haveMinus: /\-/g,
		haveComma: /\,/
	}

function getName(name) {
	if (!moloader.camel) var haveMinus = /\-/g;
	if (regxp.isPath.test(name)) {
		name = name.replace("./", "");
		name = name.split("/");
		name = name[name.length - 1];
		name = name.replace(regxp.isJSON, "");
		name = name.replace(regxp.isJs, "");
		// camelCase added;
		if (moloader.camel) name = camel(name);
		else name = name.replace(haveMinus, "_");
		if (moloader.verbose) console.info(">Module loaded: " + name);
		return name;
	}
	else {
		name = name.replace(regxp.isJSON, "");
		name = name.replace(regxp.isJs, "");
		// camelCase added;
		if (moloader.camel) name = camel(name);
		else name = name.replace(haveMinus, "_");
		if (moloader.verbose) console.info(">Module loaded: " + name);
		return name;
	}
}


var moloader = {
	load: function (objInput) {
		if (this.verbose) console.info("Loading dependencies...");
		// verify each arg to load
		for (var i = 0; i < arguments.length; i++) {
			var isArr = arguments[i].constructor.toString().indexOf("Array") > -1;
			// if the arg is a OBJECT
			if (typeof arguments[i] == "object" && !isArr) {
				if (this.verbose) console.info("Input is a object");
				this.loadObj(arguments[i]);
			}
			// if the arg is a ARRAY
			else if (isArr) {
				if (this.verbose) console.info("Input is a array");
				this.loadArr(arguments[i]);
			}
			// if the arg is a STRING
			else if (typeof arguments[i] == "string") {
				if (this.verbose) console.info("Input is a string");
				this.loadStr(arguments[i]);
			}
		}
		return this;
	},

	loadObj: function (elem) {
		var output = {};
		if (!elem.name) elem.name = getName(elem.path);
		output.name = elem.name;
		global[output.name] = require(elem.path);
		this.fCount();
		return this;
	},

	loadArr: function (array) {
		var output = {};
		for (var i = 0; i < array.length; i++) {
			if (typeof array[i] == "object") {
				output = this.loadObj(array[i]);
			}
			else if (typeof array[i] == "string") {
				output = this.loadStr(array[i]);
			}
		}
		return this;
	},

	loadStr: function (string) {
		if (regxp.haveComma.test(string)) {
			string = string.replace(/\s/g, "");
			string = string.split(",")
			string = string.clean("\s");
			this.loadArr(string);
		}
		else if (regxp.isPath.test(string)) {
			var name = getName(string);
			global[name] = require(string);
			this.fCount();
		}
		else {
			var name = getName(string);
			global[name] = require(string);
			//if(this.verbose) console.info(">Module loaded: "+string+" return by "+name);
			this.fCount();
		}
		return this;
	},

	loadDir: function (path, ignore) {
		// ignore is a string with the names separated by commas(,): "somefile.js, another.js"
		if (this.verbose) console.info("Loading dependencies from directory " + path);
		try {
			var stats = fs.statSync(path);
		}
		catch (e) {
			return console.error("Can\'t load " + path + " returned: " + e);
		}
		if (stats.isDirectory()) {
			if (this.verbose) console.info("Reading dir");
			this.loadDirArr(fs.readdirSync(path), path, ignore);
		}
		else {
			return console.error("Can not load module from " + path + ", this is not a directory");
		}
		return this;
	},
	loadDirArr: function (array, dirName, ignore) {
		// delete the ignore files from the array;
		if (ignore) {
			if (this.verbose) console.info("Ignoring: " + ignore);

			ignore = ignore.replace(" ", "").split(","); // global?

			array = array.toString();
			for (var i = ignore.length - 1; i >= 0; i--) {
				array = array.replace(ignore[i], "");
			}
			array = array.split(",").clean("");
		}
		// process the input
		if (this.verbose) console.info("Processing input: " + array);
		for (var i = 0; i < array.length; i++) {
			if (fs.statSync(path.resolve(dirName, array[i])).isFile()) {
				var name = array[i];
				name = getName(name);
				global[name] = require(path.resolve(dirName, array[i]));
				this.fCount();
			}
		}
		return this;
	},

	loadPack: function (customPack, ignore) {
		var package, haveMinus = /\-/g;
		if (this.verbose) console.info("Loading dependencies from file " + (customPack || "package.json"));
		if (customPack) package = fs.readFileSync(customPack, "utf8");
		else package = fs.readFileSync("package.json", "utf8");
		packageStr = package;
		package = isJSON(package);
		// error handler
		if (package instanceof Error) return console.error("package can not be loaded returned: " + package);
		var depen = package.dependencies;
		var depenReq = [];
		if (!Array.isArray(depen)) {
			depen = Object.keys(depen);
		}
		// delete the ignore files from array
		if (ignore) {
			if (this.verbose) console.info("Ignoring: " + ignore);

			ignore = ignore.replace(" ", "").split(","); // global?


			depen = depen.toString();
			for (var i = ignore.length - 1; i >= 0; i--) {
				depen = depen.replace(ignore[i], "");
			}
			depen = depen.split(",").clean("");
		}
		if (this.verbose) console.info("Processing input: " + depen);
		for (var i = depen.length - 1; i >= 0; i--) {
			depenReq[i] = depen[i];
			// camelCase added;
			if (this.camel) depen[i] = camel(depen[i]);
			else depen[i] = depen[i].replace(haveMinus, "_");
			global[depen[i]] = require(depenReq[i]);
			if (this.verbose) console.info(">Module loaded: " + depenReq[i] + " return by " + depen[i]);
			this.fCount();
		}
		return this;
	},

	fCount: function () {
		if (this.verbose) console.info("Operations count: " + (++this.count));
	},

	verbose: false,
	camel: true,
	count: 0
}


function isJSON(string) {
	try {
		var result = JSON.parse(string);
	} catch (e) {
		return e;
	} return result;
}

Array.prototype.clean = function (deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

exports = module.exports = moloader;