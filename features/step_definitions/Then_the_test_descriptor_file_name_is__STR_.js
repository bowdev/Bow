YUI({ useBrowserConsole: true }).use("test", function(Y) {

    var A = Y.Assert;

    // Access to common_nodejs.js
    var Common = require("../../framework/lib/common_nodejs.js")();

    // Create a test suite and name it
    var suite = new Y.Test.Suite("Feature: Parser for Gherkin Language");

    suite.add(new Y.Test.Case({
        "test Then the test descriptor file name is \"$STR\"": function()
        {
            this.A = A;
            this.World = {};
            Common.begin_step(this);
            var step = this.testParams.match;
            var feature = this.testParams.feature;
            var line = this.testParams.line;
            var docStr = this.testParams.documentStrings;
            var NUM = this.testParams.NUM;
            var STR = this.testParams.STR;
            var pass = false;

            // To do: your test code should be here.
            pass = this.World.featureName && this.World.featureName.match(/.*/);
            this.World.featureName += " in step Then";
            var fs = require('fs');
            var expected = STR[0];
            //console.log("[BDD][DEBUG] Expected feature file name is "+expected);
            var data=null;
            try {
	            data = fs.readFileSync("./"+expected);
	            //console.log("[BDD][DEBUG][Then] data is "+JSON.stringify(JSON.parse(data)));
            }
            catch(e) {
            }
            pass = !!data;

            if (!pass) Common.step_fail(this);
            else Common.step_pass(this);
            A.isTrue(pass,"Feature: Parser for Gherkin Language - step:[\""+step+"\"]@"+feature+":"+line);
        }
    }));

	// Never "run" the tests, simply add them to the suite. Arrow takes care of running them
	Y.Test.Runner.add(suite);
});
