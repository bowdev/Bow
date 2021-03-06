function padding(length) {
    if (length==1) {
        return "    ";
    }
    if (length==2) {
        return "   ";
    }
    if (length==3) {
        return "  ";
    }
    if (length==4) {
        return " ";
    }
    return " ";
}

exports = module.exports = nano = function() {
	var window = {skipStep:false};
	var fs = require('fs');
    var self = {
		delay : function(ms) {
		  var timer = setTimeout(function(){ /*console.log(timer);*/ }, ms);	
		},
		saveState : function(state) {
		//console.log("[BDD][DEBUG] saveState : state - "+JSON.stringify(state));
		    fs.writeFile('./config/window-state.json', JSON.stringify(state));
		    self.delay(50);
		},
		loadState : function() {
		    var data = fs.readFileSync('./config/window-state.json');
			//console.log("[BDD][DEBUG] loadState : data - "+data);
			if (data && data!="undefined") {
			    return JSON.parse(data);		
			}
                        else {
                            return {skipStep:true};
                        }
		},
		step_skip : function(test) {
                    if (test.World!="undefined") {
			//console.log("[BDD][DEBUG] step_skip: test.World is "+JSON.stringify(test.World));
		        window = test.World;
                    }
                    else {
                        window.skipStep = true;
                    }
		    self.saveState(window);
		    if (test && test.testParams && test.testParams.match && test.testParams.feature && test.testParams.line) {
                      var len = String(test.testParams.line).length;
		      console.log("[BDD] @["+test.testParams.feature+":"+test.testParams.line+"]"+padding(len)+"\033[1;30m--- "+test.testParams.match+"\033[m");
		      var docStr = test.testParams.documentStrings;
		      var docLine = test.testParams.documentAtLine;
		      if (docStr && docLine) {
		        docStr.forEach(function(line) {
		          docLine++;
                          var len = String(docLine).length;
		          console.log("[BDD] @["+test.testParams.feature+":"+docLine+"]"+padding(len)+"\033[1;30m---    "+line+"\033[m");
		        });
		      }
		    }
		},
		begin_step : function begin_step (test) {
		    if (test.testParams.step==1) {
		        window.skipStep = false;
				test.World = window;
				//console.log("[BDD][DEBUG] begin_step: test.World is "+JSON.stringify(test.World));
		    }
		    else {
			    window = self.loadState();
			    if (window.skipStep) {
			        self.step_skip(test);
					test.World = window;
					//console.log("[BDD][DEBUG] begin_step: test.World is "+JSON.stringify(test.World));
			        test.A.fail("I decided to skip this.");
			    }
				test.World = window;
		    }
		},
		step_pass : function(test) {
			//console.log("[BDD][DEBUG] step_pass: test.World is "+JSON.stringify(test.World));
			window = test.World;
		    self.saveState(window);
		    if (test && test.testParams && test.testParams.match && test.testParams.feature && test.testParams.line) {
                      var len = String(test.testParams.line).length;
		      console.log("[BDD] @["+test.testParams.feature+":"+test.testParams.line+"]"+padding(len)+"\033[0;32m[.] "+test.testParams.match+"\033[m");
		      var docStr = test.testParams.documentStrings;
		      var docLine = test.testParams.documentAtLine;
		      if (docStr && docLine) {
		        docStr.forEach(function(line) {
		          docLine++;
                          var len = String(docLine).length;
		          console.log("[BDD] @["+test.testParams.feature+":"+docLine+"]"+padding(len)+"\033[0;32m[.]    "+line+"\033[m");
		        });
		      }
		    }
		},
		step_fail : function(test) {
			//console.log("[BDD][DEBUG] step_fail: test.World is "+JSON.stringify(test.World));
			window = test.World;
		    window.skipStep = true; // skip the remaining steps in the same scenario
		    self.saveState(window);
                    var len = String(test.testParams.line).length;
		    if (test && test.testParams && test.testParams.match && test.testParams.feature && test.testParams.line) {
		        console.log("[BDD] @["+test.testParams.feature+":"+test.testParams.line+"]"+padding(len)+"\033[0;31m[X] "+test.testParams.match+"\033[m");
		        var docStr = test.testParams.documentStrings;
		        var docLine = test.testParams.documentAtLine;
		        if (docStr && docLine) {
		            docStr.forEach( function(line) {
		                docLine++;
                                var len = String(docLine).length;
		                console.log("[BDD] @["+test.testParams.feature+":"+docLine+"]"+padding(len)+"\033[0;31m[X]    "+line+"\033[m");
		            });
		        }
		    }
		}
    };
	return self;
}
