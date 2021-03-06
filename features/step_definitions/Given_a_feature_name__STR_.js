YUI({ useBrowserConsole: true }).use("test", function(Y) {

    var A = Y.Assert;

    // Access to common_nodejs.js
    var Common = require("../../framework/lib/common_nodejs.js")();

    // Create a test suite and name it
    var suite = new Y.Test.Suite("Feature: Parser for Gherkin Language");

    suite.add(new Y.Test.Case({
        "test Given a feature name \"$STR\"": function()
        {
            this.A = A;
            Common.begin_step(this);
            var step = this.testParams.match;
            var feature = this.testParams.feature;
            var line = this.testParams.line;
            var docStr = this.testParams.documentStrings;
            var NUM = this.testParams.NUM;
            var STR = this.testParams.STR;
            var pass = false;

            // To do: your test code should be here.
            pass = STR&&(STR.length==1);
            if (pass) {
                //console.log("[BDD][DEBUG] STR is "+STR);
                this.World.featureName = STR[0];
            }

            if (!pass) Common.step_fail(this);
            else Common.step_pass(this);
            A.isTrue(pass,"Feature: Parser for Gherkin Language - step:[\""+step+"\"]@"+feature+":"+line);
        }
    }));

	// Never "run" the tests, simply add them to the suite. Arrow takes care of running them
	Y.Test.Runner.add(suite);
});
