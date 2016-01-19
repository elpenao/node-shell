var fs = require('fs');
var request = require('request');

var commands = {
	done: function(output){
		console.log(output);
		commands.showPrompt();
	},
	pwd: function(file){
		this.done(process.env.PWD);
	},
	date: function(file){
		this.done(Date());
	}, 
	ls : function (file) {
		fs.readdir('.', function(err, files) {
		  if (err) throw err;
		  var output = "";
		  files.forEach(function(file) {
		    output += (file.toString() + "\n");
		  });
		  commands.done(output);
		});
	},
	showPrompt: function(){
		process.stdout.write('prompt > ');
	},
	cat: function (file, otherComms) {
		// fs.readFile(commands.pwd() + )
		fs.readFile('./' + file, 'utf8', function(err, file) {
		  if (err) throw err;
		  if(otherComms.length === 0) {
		  	commands.done(file.toString() + "\n");
		  }else{
		  	var firstComm = otherComms.shift();
			commands.checkInput(firstComm, otherComms, file.toString() + "\n");
		  } 

		  // process.stdout.write(file.toString() + "\n");
		});
	},
	head: function (file, otherComms, stdin) {
		// fs.readFile(commands.pwd() + )
		if(stdin){
			var lines = stdin.split("\n");
			lines = lines.slice(0,10).join("\n");
			if(otherComms.length === 0){
		  		console.log(lines);
			} else{
				var firstComm = otherComms.shift();
				commands.checkInput(firstComm, otherComms, lines);
			}
		} else {
			fs.readFile('./' + file, 'utf8', function(err, file) {
			  if (err) throw err;
			  var lines = file.split("\n");	
			  lines = lines.slice(0,10).join("\n");
			  console.log(lines);
			  // console.log(typeof file)
			  // process.stdout.write(file.toString() + "\n");
			  commands.showPrompt();
			});
		}
	},
	tail: function (file, otherComms, stdin) {
		// fs.readFile(commands.pwd() + )
		if(stdin){
			var lines = stdin.split("\n");
			lines = lines.slice(-5).join("\n");
			if(otherComms.length === 0){
		  		console.log(lines);
		  		commands.showPrompt();
			} else{
				var firstComm = otherComms.shift();
				commands.checkInput(firstComm, otherComms, lines);
			}
		} else {
			fs.readFile('./' + file, 'utf8', function(err, file) {
			  if (err) throw err;
			  var lines = file.split("\n");	
			  lines = lines.slice(-5).join("\n");
			  console.log(lines);
			  // console.log(typeof file)
			  // process.stdout.write(file.toString() + "\n");
			  commands.showPrompt();
			});
		}
	},
	soort: function (file) {
		// fs.readFile(commands.pwd() + )
		fs.readFile('./' + file, 'utf8', function(err, file) {
		  if (err) throw err;
		  var lines = file.split("\n");	
		  lines = lines.sort().join("\n");
		  console.log(lines);
		  // console.log(typeof file)
		  // process.stdout.write(file.toString() + "\n");
		  commands.showPrompt();
		});
	},

	wc: function (file, otherComms, stdin) {
		// fs.readFile(commands.pwd() + )
		if(stdin){
			var lines = stdin.split("\n");
			if(otherComms.length === 0){
			    console.log(lines.length);
			    commands.showPrompt();
			} else{
				var firstComm = otherComms.shift();
				commands.checkInput(firstComm, otherComms, lines);
			}
		}else{
			fs.readFile('./' + file, 'utf8', function(err, file) {
			  if (err) throw err;
			  var lines = file.split("\n");
			  if(otherComms.length === 0){
				  console.log(lines.length);
				  // console.log(typeof file)
				  // process.stdout.write(file.toString() + "\n");
				  commands.showPrompt();
				} else{
				var firstComm = otherComms.shift();
				commands.checkInput(firstComm, otherComms, lines);
				}
			});
		}
	},

	echo: function (cmd) {
		var words = cmd.slice(cmd.indexOf(" ") + 1);
		process.stdout.write(words);
		this.showPrompt();
	},

	curl: function (cmd, otherComms) {
		var url = cmd.slice(cmd.indexOf(" ") + 1);
		request(url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	if(!otherComms.length){
			    console.log(body);
			    commands.showPrompt();
			}else{
				var firstComm = otherComms.shift();
				commands.checkInput(firstComm, otherComms, body);
			}
		  }
		});
	},

	grep: function (cmd, otherComms, stdin) {
		var word = cmd.slice(cmd.indexOf(" ") + 1);
		var lines = stdin.split("\n");
		var found = [];
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].indexOf(word) > -1) found.push(lines[i]);
		}
		if(stdin){
			if(otherComms.length === 0){
			    console.log(found.join("\n"));
			    commands.showPrompt();
			} else{
				var firstComm = otherComms.shift();
				commands.checkInput(firstComm, otherComms, found.join("\n"));
			}
		}else{
			console.log(found.join("\n"));
			commands.showPrompt();
		}
	},

	checkInput: function(cmd, otherComms, stdin){
		if (cmd.indexOf('|') > -1) {
			var comms = cmd.split(' | ');
			var firstComm = comms.shift();
			commands.checkInput(firstComm, comms);
		} else {
			if (cmd === 'pwd') commands.pwd();
	  		if (cmd === 'date') commands.date();
	  		if (cmd === 'ls') commands.ls();
	  		if (cmd.indexOf('echo') > -1) commands.echo(cmd, otherComms, stdin);
	  		if (cmd.indexOf('grep') > -1) commands.grep(cmd, otherComms, stdin);
	  		if (cmd.indexOf('curl') > -1) commands.curl(cmd, otherComms, stdin);
	  		if (cmd.indexOf('cat') > -1) commands.cat(cmd.slice(cmd.indexOf(" ") + 1), otherComms, stdin);
	  		if (cmd.indexOf('head') > -1) commands.head(cmd.slice(cmd.indexOf(" ") + 1), otherComms, stdin);
	  		if (cmd.indexOf('tail') > -1) commands.tail(cmd.slice(cmd.indexOf(" ") + 1), otherComms, stdin);
	  		if (cmd.indexOf('sort') > -1) commands.soort(cmd.slice(cmd.indexOf(" ") + 1), otherComms, stdin);
	  		if (cmd.indexOf('wc') > -1) commands.wc(cmd.slice(cmd.indexOf(" ") + 1), otherComms, stdin);
		}
		
	}
};

module.exports = commands;