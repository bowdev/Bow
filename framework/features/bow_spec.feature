Feature: Parser for Gherkin Language
  In order to writing requirements and user stories in Gherkin Language for Behavior Driven Development.
  As a BDD Tool developer
  I want a new BDD tool, Bow, to convert scenarios written in Gherkin Language into a test descriptor file that Arrow framework can execute.

@smoke
Scenario: Convert Feature name as filename of test descriptor file (One)
  Given a feature name "Parser for Gherkin Language"
  When Bow convert this feature
  Then the test descriptor file name is "Feature_ParserforGherkinLanguage.json"

@functional
Scenario: Convert Feature name as filename of test descriptor file (Two)
  Given a feature name "AAA BBB CCC DDD"
  When Bow convert this feature
  Then the test descriptor file name is "Feature_AAABBBCCCDDD.json"

@functional
Scenario: Convert Feature name as filename of test descriptor file (Three)
  Given a feature name "A1234 B5678 C90"
  When Bow convert this feature
  Then the test descriptor file name is "Feature_ABC.json"

# This scenario should fail. If it is not, it could be a bug.
@fail
Scenario: Convert Feature name as filename of test descriptor file (Four)
  Given a feature name "A1234 B5678 C90"
  When Bow convert this feature
  Then the test descriptor file name is "Feature_ABCD.json"

@demo
Scenario: Convert Feature name as filename of test descriptor file (Five)
  Given a feature name "This is A _D$E1 M.2 O"
  When Bow convert this feature
  Then the test descriptor file name is "Feature_ThisisADEMO.json"

# Test if digits will be filtered out,
# the correct filename should be "Feature_.json"
@mytest
Scenario: Convert Feature name as filename of test descriptor file (Six)
  Given a feature name "12345678"
  When Bow convert this feature
  Then the test descriptor file name is "Feature_12345678.json"
