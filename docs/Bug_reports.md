# Bug Reports

## BR-001 Rename unclear fertilizing checkbox label in Add and Edit Plant forms

```txt
*Summary:*
Fertilizing checkbox label uses unclear wording in Add Plant and Edit Plant forms and should be renamed for better clarity and future English localization

*Steps to Reproduce:*
# Open the site
# Click "Додати рослину"
# Observe the fertilizing checkbox label in the Add Plant form
# Close the form
# Open any existing plant card
# Click "Редагувати"
# Observe the same fertilizing checkbox label in the Edit Plant form

*Actual Result:*
* The checkbox label is displayed as "Потрібне добриво зараз"
* The wording is ambiguous and may suggest an immediate one-time fertilizing action instead of a setting that enables fertilizing tracking
* The same unclear wording is used in both Add Plant and Edit Plant forms

*Expected Result:*
* The checkbox label should be renamed in both Add Plant and Edit Plant forms
* Ukrainian label should be: "Увімкнути підживлення"
* English label for future localization should be: "Fertilizing enabled"
* The wording should clearly indicate that the checkbox enables fertilizing tracking for the plant rather than describing an immediate fertilizing need
