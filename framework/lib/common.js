YUI.add("common", function (Y) {
    var A = Y.Assert;
    var self = Y.namespace("Bow").Common = 
	{
                begin_step : function(test) {
                    if (test.testParams.step==1) {
                        window.skipStep = false;
                    }
                    else if (window.skipStep) {
                        self.step_skip(test);
                        A.fail("I decided to skip this.");
                    }
                },

		step_pass : function(test) {
		    if (test && test.testParams && test.testParams.match && test.testParams.feature && test.testParams.line) {
		      console.log("[BDD] @["+test.testParams.feature+":"+test.testParams.line+"] [.] "+test.testParams.match);
                      var docStr = test.testParams.documentStrings;
                      var docLine = test.testParams.documentAtLine;
                      if (docStr && docLine) {
                        docStr.forEach(function(line) {
                          docLine++;
		          console.log("[BDD] @["+test.testParams.feature+":"+docLine+"] [.]    "+line);
                        });
                      }
		    }
		},

		step_skip : function(test) {
		    if (test && test.testParams && test.testParams.match && test.testParams.feature && test.testParams.line) {
		      console.log("[BDD] @["+test.testParams.feature+":"+test.testParams.line+"] --- "+test.testParams.match);
                      var docStr = test.testParams.documentStrings;
                      var docLine = test.testParams.documentAtLine;
                      if (docStr && docLine) {
                        docStr.forEach(function(line) {
                          docLine++;
		          console.log("[BDD] @["+test.testParams.feature+":"+docLine+"] ---    "+line);
                        });
                      }
		    }
		},

		step_fail : function(test) {
                    window.skipStep = true; // skip the remaining steps in the same scenario
		    if (test && test.testParams && test.testParams.match && test.testParams.feature && test.testParams.line) {
		      console.log("[BDD] @["+test.testParams.feature+":"+test.testParams.line+"] [X] "+test.testParams.match);
                      var docStr = test.testParams.documentStrings;
                      var docLine = test.testParams.documentAtLine;
                      if (docStr && docLine) {
                        docStr.forEach(function(line) {
                          docLine++;
		          console.log("[BDD] @["+test.testParams.feature+":"+docLine+"] [X]    "+line);
                        });
                      }
		    }
		}
	};
}, "0.1", { requires: ["arrow", "event", "node", "node-event-simulate", "test"]});
