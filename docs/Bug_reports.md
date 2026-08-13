## BR-001 Rename unclear fertilizing checkbox label in Add and Edit Plant forms

### Summary
Fertilizing checkbox label uses unclear wording in Add Plant and Edit Plant forms and should be renamed for better clarity and future English localization

### Steps to Reproduce
1. Open the site https://leaf-log-six.vercel.app/?id=rycu0sei
2. Click **"Додати рослину"**
3. Observe the fertilizing checkbox label in the Add Plant form
4. Close the form
5. Open any existing plant card
6. Click **"Редагувати"**
7. Observe the same fertilizing checkbox label in the Edit Plant form

### Actual Result
- The checkbox label is displayed as **"Потрібне добриво зараз"**
- The wording is ambiguous and may suggest an immediate one-time fertilizing action instead of a setting that enables fertilizing tracking
- The same unclear wording is used in both Add Plant and Edit Plant forms

### Expected Result
- The checkbox label should be renamed in both Add Plant and Edit Plant forms
  - Ukrainian label should be: **"Увімкнути підживлення"**
  - English label should be: **"Fertilizing enabled"**

### Attachment
![BR-001 screenshot](../assets/screenshots/br-001-checkbox-label.png)

## BR-002 Caretaker mode does not allow entering bulk-select flow for updating multiple plants

### Summary
When Caretaker mode is enabled, the user cannot use bulk-select / bulk-edit style flow, but caretaker users should be able to mark several plants as watered at once.

### Steps to Reproduce
1. Open the site.
2. Enable **"Режим доглядача"**.
3. Try to update multiple plants at once.
4. Check whether bulk-select mode can be entered or whether a multi-plant watering action is available.

### Actual Result
- In Caretaker mode, the user cannot use bulk-select mode.
- There is no available flow for marking several plants as watered at once while staying in Caretaker mode.
- The caretaker is limited to updating plants one by one.

### Expected Result
- In Caretaker mode, the user should be able to update multiple plants in one flow.
- The caretaker should have a way to mark several plants as watered at once.
- A bulk watering option should be available for caretaker usage without requiring access to full editing functionality.
