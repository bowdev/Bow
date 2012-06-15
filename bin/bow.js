#!/usr/bin/env node
var generate_arrow_scenario = require("../framework/lib/generate_arrow_scenario.js");
var init_project_env = require("../framework/lib/init_project_env.js");
var fs = require('fs');
var path = [];
var arrow = [];
if (process.argv.length==2) {
	console.log("Usage:\t"+process.argv[1]+" [file path] \"[arrow options]\"");
	console.log("Example:\n\t"+process.argv[1]+" features/greeter.feature \"--group smoke --browser=firefox --report\"");
	console.log("\nYou could filter the console log to get the reports.");
	console.log("Example:\n\t"+process.argv[1]+' features/math.feature "--browser=firefox --report" | grep -E "(\\[BDD\\]|Total Number of|Total Test Execution Time|Report Created)"')
	console.log("\nYou could easily set up a project folder.");
	console.log("Example:\n\t"+process.argv[1]+' --init [your project folder]');
	console.log("\nBow can validate its own feature spec. Please run the following command.");
	console.log("Example:\n\t"+process.argv[1]+" framework/features/bow_spec.feature | grep -o -E \"\\[BDD\\].*$\"");
	return;
}
if (process.argv.length>2) {
	if (process.argv[2].match(/--init/i)) {
		init_project_env(process.argv[3]);
		return;
	}
	else {
		path.push(process.argv[2]);		
	}
}
if (process.argv.length>3) arrow.push(process.argv[3]);
if (path.length>0) {
  input = fs.readFileSync(path[0],'utf8');
  generate_arrow_scenario(input,path[0],arrow);
}
