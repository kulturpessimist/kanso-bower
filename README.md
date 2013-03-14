# bower kanso module

module to integrate bower and compile components into the frontend of a couchapp.

## Install

Add "kanso-bower" to your kanso.json dependencies setting:

```json
"dependencies": {
	"kanso-bower": null
}
```

Run kanso install to install into your packages directory:

```
kanso install
```

## Usage

You can use a component.json beside your kanso.json, but you can also integrate the contents of component.json into your kanso.json file.

```json
{
	"bower":{
		"install": false,
		"minify": true,
		"deployment": "frontend/libs",
		"dependencies": {
			"angular": "~1.0.5",
			"angular-resource": "http://code.angularjs.org/1.0.5/angular-resource.js",
			"jquery": "~1.8.3",
			"jquery.couch": "https://raw.github.com/apache/couchdb/master/share/www/script/jquery.couch.js",
			"bootstrap": "~2.3.1"
		}
	}
}

```

### Options

* __install:__ should the bower components be deployed with every push? this option is used until there is a way to use command line parameters with kanso packages ( [see issue #391](https://github.com/kanso/kanso/issues/391) )
* __minify:__ if true uses uglify to minify all components into a single compressed file with the suffix ".min.js". If false the components are just concentrated and saved with the suffix ".js". 
* __deployment:__ path where the deployed compressed or concentrated components should be deployed. Folder relative to kanso.json.
* __dependencies:__ Object compatible to the bower component.json with the needed components and versions (or if single script files with the key-value of name and url)

## node modules

bower: 0.8.5
colors: 0.6.0-1
uglify-js: 2.2.5