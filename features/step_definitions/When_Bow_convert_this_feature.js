YUI({ useBrowserConsole: true }).use("test", function(Y) {

    var A = Y.Assert;

    // Access to common_nodejs.js
    var Common = require("../../framework/lib/common_nodejs.js")();

    // Create a test suite and name it
    var suite = new Y.Test.Suite("Feature: Parser for Gherkin Language");

    suite.add(new Y.Test.Case({
        "test When Bow convert this feature": function()
        {
            // console.log("[BDD][DEBUG]test When Bow convert this feature");
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
            // Access to the module under testing
            var generate = require("../../framework/lib/generate_arrow_scenario.js");
            pass = this.World.featureName && this.World.featureName.match(/.*/);
            this.World.feature_file_path = "features/bow_spec.feature";
            this.World.arrow = "--dryrun";
            var output = generate(
	            "Feature: "+this.World.featureName
	            +"\nScenario: Convert Feature name as filename of test descriptor file"
	            +"\nGiven a feature name \""+this.World.featureName+"\"",
	            this.World.feature_file_path,
	            this.World.arrow);
            // console.log("[BDD][DEBUG][When] output is "+JSON.stringify(JSON.parse(output)));
            this.World.featureName += " in step When";

            if (!pass) Common.step_fail(this);
            else Common.step_pass(this);
            A.isTrue(pass,"Feature: Parser for Gherkin Language - step:[\""+step+"\"]@"+feature+":"+line);
        }
    }));

	// Never "run" the tests, simply add them to the suite. Arrow takes care of running them
	Y.Test.Runner.add(suite);
});
