#!/usr/bin/env node
var generate_arrow_scenario = require("../framework/lib/generate_arrow_scenario.js");
var init_project_env = require("../framework/lib/init_project_env.js");
var fs = require('fs');
var path = [];
var arrow = [];
if (process.argv.length==2) {
	console.log("Usage:\t"+process.argv[1]+" \"[file path]\" \"[arrow options]\"");
	console.log("Example:\n\t"+process.argv[1]+" \"features/*.feature\" \"--group smoke --browser=firefox --report\"");
	console.log("\nYou could filter the console log to get the reports.");
	console.log("Example:\n\t"+process.argv[1]+' \"features/*.feature\" "--browser=firefox --report" | grep -E "(\\[BDD\\]|Total Number of|Total Test Execution Time|Report Created)"')
	console.log("\nYou could easily set up a project folder.");
	console.log("Example:\n\t"+process.argv[1]+' --init [your project folder]');
	console.log("\nBow can validate its own feature spec. Please run the following command.");
	console.log("Example:\n\t"+process.argv[1]+" \"framework/features/*.feature\" | grep -o -E \"\\[BDD\\].*$\"");
	return;
}
if (process.argv.length>2) {
	if (process.argv[2].match(/--init/i)) {
		init_project_env(process.argv[3]);
		return;
	}
	else {
		//console.log("The second argv is "+process.argv[2]);
		path.push(process.argv[2]);		
	}
}
if (process.argv.length>3) arrow.push(process.argv[3]);
if (path.length>0) {
  var glob = require("glob");
  var options = {mark: true, sync:true, nocase:true, debug:false, globDebug:true};
  //var files = glob.sync(path[0], options);
  var files = glob.sync(path[0]);
  //console.log("The path is "+path[0]);
  var count = 0;
  files.forEach(function(file) {
    if (file.match(/\.feature/i)) {
        count++;
    }
  });
  console.log("Processing "+count+" file(s).");
  files.forEach(function(file) {
    if (file.match(/\.feature/i)) {
      console.log("Processing "+file);
      input = fs.readFileSync(file,'utf8');
      generate_arrow_scenario(input,file,arrow);
    }
  });
}
