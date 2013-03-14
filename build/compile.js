var fs = require('fs'),
	path = require('path'),
	bower = require('bower'),
	uglifyjs = require('uglify-js'),
	colors = require('colors'),
	bower_cli = "bower ".cyan;

var globalizer = {};
var methods = {
	/* fileSystem */
	clean: function(file){
		if(fs.existsSync(file)){
			fs.unlinkSync(file);
		}
	},
	minify: function(files, settings, callback){
		methods.clean(settings.bower.deployment+'.min.js');
		console.log(bower_cli,'minify components');
		var result = uglifyjs.minify( files );
		fs.writeFileSync(settings.bower.deployment+'.min.js', result.code);
	
		console.log(bower_cli,'components deployed');
		callback.apply(null);
	},
	concentrate: function(files, settings, callback){
		methods.clean(settings.bower.deployment+'.js');
		console.log(bower_cli,'concentrate components');
		for(var j in files){
			var src = files[j];
			var content = fs.readFileSync(src, 'utf-8');
			fs.appendFileSync(settings.bower.deployment+'.js', ';/* '+src+' */\n'+content+'\n');
		}
	
		console.log(bower_cli,'components deployed');
		callback.apply(null);
	},
	/* bower */
	install: function(paths, settings, success){
		bower.commands
			.install(paths, {})
			.on('data', function (data) {
				data && console.log(bower_cli,data);
			})
			.on('end', function (data) {
				console.log(bower_cli,'components installed.');
				methods.deploy(settings);
			})
			.on('error', function (err) {
				globalizer.callback.apply(null, [err]);
			});
	},
	deploy: function(settings){
		bower.commands
			.list({sources:true,offline:true})
			.on('data', function (data) {
				if(settings.bower.minify){
					methods.minify( data['.js'], settings, function(){
						globalizer.callback.apply(null, [null, globalizer.doc])
					} );
				}else{
					methods.concentrate( data['.js'], settings, function(){
						globalizer.callback.apply(null, [null, globalizer.doc])
					} );
				}
			})
			.on('error', function (err) {
				globalizer.callback.apply(null, [err]);
			});
	}
}

module.exports = {
	after: "properties/queue",
	before: "attachments/add",
	run : function(root, path_loc, settings, doc, callback) {

		globalizer = { doc: doc, callback:callback };
		var paths = [], components = {};
		/* install or just deploy?
			@fix kanso does not allow command line arguments so we have to go with a settings flag :-(
		*/
		if(settings.bower.install){
			/* get dependencies from components.json or kanso.json */
			if(settings.bower.hasOwnProperty('dependencies')){
				components = settings.bower.dependencies;
			}else{
				components = require(path.resolve(__dirname, '../../../', 'component.json')).dependencies;
			}
			/* concentrate paths in array */
			for(var i in components){
				if(components[i].indexOf('http')>-1){
					paths.push(components[i]);
				}else{
					paths.push(i+'#'+components[i]);
				}
			}
			
			methods.install(paths, settings);
		}else{
			methods.deploy(settings);
		}

	}
}
