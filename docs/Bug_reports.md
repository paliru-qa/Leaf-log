# User Story

## BR-001

## Rename fertilizing toggle label to improve clarity

```txt
*Summary:*
As a user, I want the fertilizing toggle label in the Add/Edit Plant form to clearly indicate that it enables fertilizing tracking for a plant, so that I do not confuse it with an immediate one-time fertilizing action.

*Description:*
* The current fertilizing toggle label is ambiguous
* It may imply that fertilizing is needed right now instead of representing an enabled/disabled plant setting
* The label should be updated to clearer wording in both supported languages

*Proposed Label:*
* English: Fertilizing enabled
* Ukrainian: Увімкнути підживлення

*Expected Result:*
* The toggle label clearly communicates that fertilizing tracking is enabled for the plant
* Users understand that enabling the toggle reveals fertilizing-related fields and includes the plant in fertilizing logic where applicable
* The wording is used consistently in:
** Add Plant form
** Edit Plant form
** related requirements documentation
** checklist
** test cases

*Acceptance Criteria:*
* The fertilizing toggle label is updated to `Fertilizing enabled` in English
* The fertilizing toggle label is updated to `Увімкнути підживлення` in Ukrainian
* The label meaning matches the actual product behavior
* The label no longer implies an immediate one-time fertilizing action
* Related documentation uses the same terminology consistently
