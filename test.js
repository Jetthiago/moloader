var moloader = require("./moloader.js");
moloader.verbose = true;
moloader.camel = true; // default;

moloader.load("fs, url, ./testDir/test-module.js")
		.load("os", "./testDir/test-module.js")
		.load([{name: "mod", path: "./testDir/test-module.js"}, {name: "fs", path: "fs"}])
		.load({name: "mod", path: "./testDir/test-module.js"})
		.load({name: "fs", path: "fs"})
		.load("path, os", {name: "mod", path:"./testDir/test-module.js"})

		.loadObj({path: "fs"})

		.loadArr(["http", "os", "./testDir/test-module.js"])

		.loadDir("./testDir", "ignore-me.js")

		.loadPack()
		.loadPack("./testDir/vanillaDependencies.json")
		.loadPack("./testDir/customDependencies.json");

try{
	http.server
	fs.readFile
	url.parse
	os.release
	mod
	path.join
	testModule
	betterConsole.debug("Working fine");
}
catch(e){
	return console.error("Something went wrong: "+e);
}