Feature: Landing Page

  Scenario: Page loads with meeting controls
    Given I am on the landing page
    Then I should see a "Start Meeting" button
    And I should see a meeting PIN input
    And I should see a name input

  Scenario: Cannot join without a name
    Given I am on the landing page
    When I clear the name input
    And I click "Start Meeting"
    Then I should see a validation error
