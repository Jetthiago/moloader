# Moloader

## Synopsis
This module has the intention to load the dependencies that you will be using more easily by reading the package.json or by a array of filenames or by a providing a directory with all the custom modules.

## Installation
```bash
$ npm install moloader
```
## API
### load(input)
~~If the name of a module contains a ```-``` sign it will be turned into ```_```.~~
**If the name of a module contains a ```-``` the name will be turned into a camelCase.**
```input``` can be:
- A string:
    ```js
    moloader.load("fs, url, ./my_modules/file3.js");
    // or
    moloader.load("os", "./my_molules/file4.js");
    ```
- A array of objects: 
    ```js
    moloader.load([{name: "foo", path: "./my_modules/file2.js"}, ...]);
    ```
- A object: 
    ```js
    moloader.load({name: "mod", path: "./my_modules/file.js"});
    // or
    moloader.load({name: "filesystem", path:"fs"});
    ```
- You can mix types of inputs too:
    ```js
    moloader.load("querystring, path", {name: "cheese", path:"./my_modules/cheese.js"});
    ```


### loadObj(input)
```input``` is a object describing the module:
```js
moloader.loadObj({name: "filesystem", path: "fs"});
// or
moloader.loadObj({path: "fs"});
// now you can use them normaly
filesystem
fs
```
**Remember that if the name of a module contains a ```-``` the name will be turned into a camelCase.**
Remember that ```-``` signs will be turned into ```_```.^^
### loadArr(input)
```input``` is a array of modules:
```js
moloader.loadArr(["foo", "barr", "./file.js"]);
```
The ```"./file.js"``` can be called by ```file```.
**If a module has a ```-``` sign it will be turned camelCase. ```some-module``` can be returned by ```someModule```.**
~~If a module has a ```-``` sign it will be swaped by ```_```. ```some-module``` can be returned by ```some_module```.~~
### loadStr(input)
```input``` is a single string. But it can load more than one module by writing them separated by comma.
```js
moloader.loadStr("fs, http, url");
```
### loadDir(path[, ignore])
```path``` is the path to the directory. ```ignore``` is a list of filenames to not load separeted by commas.
```js
moloader.loadDir("./my_moules","ignoreMe.js, me2.js");
```
### loadPack([customPack, ignore])
This method will load every dependencie on package.json. ```customPack``` can be used if you want to load annother json to provide the dependencies. This method is the most useful since it can save a lot of work depending of the size of the app. 
```js
var moloader = require("moloader");
moloader.loadPack();
// after that you can use every module described on pakage.dependencies or...
// you can load another json to describe your dependencies
moloader.loadPack("./my_dependencies.json", "ignoreMe, meToo");
```
With ```my_dependencies.json``` being:
```json
{
    "dependencies": {
       "express": "^4.14.0"
    }
}
```
or
```json
{
    "dependencies": ["express", "url", "./foo_module.js"]
}
```
**Remember that ```-``` signs will be turned into camelCase**
~~Remember that ```-``` signs will be turned into ```_```.~~

## Example
```js
    var moloader = require("moloader");

    // to load every dependencie on package.json
    moloader.loadPack();

    // to load every module on given directory
    moloader.loadDir("./my_modules","ignoreThis.js");
    
    // to load from a array
    stack = [
        "fs",
        "./my_modules/better-console.js",
        {path: "./my_modules/handlebars.js", name: "hb"},
        {path: "url", name: "URL"}
    ]
    moloader.load(stack);
    
    // now you can use the modules normaly
    fs
    hb
    URL
    betterConsole
```
## Debuging
You can enable verbose by adding: 
```js
    moloader.verbose = true;
```


## Side notes
- Caution when using ```"use strict"```. It alters the way that javascript sees variables by not allowing undeclared variables, what is exactly oposit the porpose of this module. If that is a problem you can nest the functions that need that strict mode.
- If you find any bug or want to add a new feature please contact me using my email: ```jetthiago@hotmail.com```
- English is not my native language so you may find some writing errors here and there. But if someone wants to help me with this readme I would realy appreciate.

## Patch Notes
### Patch 3.0.5
- Fixed ```.json``` files being associated with wrong names.

### Major update 3.0.0
- camelCase added. For backward compatibility the old method can still be acessed by adding at the start:
```js
    moloader.camel = false
```
Remember if you use this line only the old method will be used. Names with ```-``` will receive ```_```. But only use this if you are updating from a older version.
- Various bug fixes.
- Better testing and verbose.

### Patch 2.0.2
- Now you can stack calls, example: 
```js
var moloader = require("moloader");
moloader.load("http, url")
        .loadPack()
        .loadDir("./my_modules");

// or just do this:
require("moloader).load("fs, path")
        .loadPack();
```
- Bug fixes.
### Major update 2.0.0
- No more need to use ```eval()```. Remove it from your code if you are updating from 1.x.x.
### New on 1.2.0
- ```ignore``` parameter now works with ```.loadPack()```
- Now ```.loadStr()``` can receive a strign with various modules separated by comma. Example: ```moloader.loadStr("fs, os, http");```
- Added ```verbose``` option by setting ```moloader.verbose = true```
- Added ```$ npm test```
- Added some additional information to ```README.md```

## License
MIT
