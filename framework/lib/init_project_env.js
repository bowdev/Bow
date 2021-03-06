function command(cmd) {
	console.log("\033[0;32mExecute command - " + cmd + "\033[m");
	return cmd;
}

function puts(error, stdout, stderr) {
  var result = stdout.length>0?stdout.split(/\r\n|\r|\n/):[];
  result.forEach(function(res){
    util.puts(res);
  });
}

function delay(ms) {
  var timer = setTimeout(function(){ /*console.log(timer);*/ }, ms);	
}

exports = module.exports = nano = function init(projectHome) {
  var util = require('util');
  var path = require('path');
  var exec = require('child_process').exec;
  console.log("Bow framework is installed at "+path.resolve(__dirname, '..'));
  if (typeof projectHome === "undefined") {
	projectHome = ".";
  }
  else {
    exec(command("mkdir "+projectHome),puts);
    delay(100);	
  }
  exec(command("mkdir "+projectHome+"/features"),puts);
  exec(command("mkdir "+projectHome+"/framework"),puts);
  exec(command("mkdir "+projectHome+"/config"),puts);
  delay(150);	
  exec(command("mkdir "+projectHome+"/features/step_definitions"),puts);
  exec(command("mkdir "+projectHome+"/features/support"),puts);
  delay(150);
  exec(command("cp -r "+path.resolve(__dirname, '..')+" "+projectHome+"/"),puts);
}
