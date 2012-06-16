Feature: Simple maths
  In order to do maths
  As a developer
  I want to increment variables

  @smoke
  Scenario: easy maths
    Given a variable set to 1
    When I increment the variable by 1
    Then the variable should contain 2

  @func
  Scenario: much more complex stuff
    Given a variable set to 100
    When I increment the variable by 6
    Then the variable should contain 106

  @func
  Scenario: negative number
    Given a variable set to 1
    When I increment the variable by -1
    Then the variable should contain 0

  @func
  Scenario: decimal number
    Given a variable set to 100.0
    When I increment the variable by 6.0
    Then the variable should contain 106.0

  @fail
  Scenario: this should fail
    Given a variable set to -1
    When I increment the variable by 1
    Then the variable should contain 2

  @mytest
  Scenario: floating point number
    Given a variable set to 5.6e+2
    When I increment the variable by -5.6e+2
    Then the variable should contain 0.0e+1
