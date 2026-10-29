## BR-001 Rename unclear fertilizing checkbox label in Add and Edit Plant forms

**Status:** Fixed (verified 2026-10-29): the label is now «Увімкнути підживлення» / «Fertilizing enabled».

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

**Status:** Closed, no longer reproducible (2026-10-29): «Select multiple» can be enabled together with Caretaker mode (see FR-143 in Functional Requirements).

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

## BR-003 AI replies are always in Ukrainian regardless of the selected UI language

### Summary
The language switcher changes the interface language, but AI care suggestions and AI answers stay in Ukrainian. Feature Requirements v1.2 (LF-005, LF-006) expect them to follow the selected language.

### Steps to Reproduce
1. Open the site https://leaf-log-six.vercel.app/?id=rycu0sei
2. Switch the UI language to English (`EN`).
3. Open any plant and, in the question field, type `Leaves are turning yellow`; click **Ask AI**.
4. Observe the language of the answer.
5. Close the detail view, click **New plant**, type a plant name and click **Generate with AI**.
6. Observe the language of the generated care instructions.

### Actual Result
- The answer to the question is in Ukrainian.
- The generated care instructions are in Ukrainian.

### Expected Result
- With the English UI, the answer and the generated instructions are in English; with the Ukrainian UI they are in Ukrainian.

### Notes
- Code review: the prompts in `api/diagnose.js` and `api/generate-instructions.js` are hard-coded in Ukrainian, and the requests sent from `index.html` do not include the selected language.
- Related requirements: LF-005, LF-006, AC-L-05; known limitation KL-013.
