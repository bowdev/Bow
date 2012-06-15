YUI({ useBrowserConsole: true }).use("test", "common", function(Y) {
    var A = Y.Assert;

    //Get access to common.js
    var Common = Y.Bow.Common;

    //Create a test suite and name it
    var suite = new Y.Test.Suite("$$FeatureName$$");

    suite.add(new Y.Test.Case({
        "$$Step$$": function()
        {
            Common.begin_step(this);
            var step = this.testParams.match;
            var feature = this.testParams.feature;
            var line = this.testParams.line;
            var docStr = this.testParams.documentStrings;
            var NUM = this.testParams.NUM;
            var STR = this.testParams.STR;
            var pass = false;

            // To do: your test code should be here.

            if (!pass) Common.step_fail(this);
            else Common.step_pass(this);
            A.isTrue(pass,"$$FeatureName$$ - step:[\""+step+"\"]@"+feature+":"+line);
        }
    }));

    //Never "run" the tests, simply add them to the suite. Arrow takes care of running them
    Y.Test.Runner.add(suite);
});
