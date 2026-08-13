# Checklist
## LeafLOG Web Application

**Version:** 1.0  
**Status:** Draft  
**Application Under Test:** LeafLOG  
**Test Environment URL:** https://leaf-log-six.vercel.app/?id=rycu0sei  
**Reference Document:** Functional Requirements v1.0

---

## 1. Shared List Model

- [ ] App opens successfully with valid URL `id`
- [ ] Data is loaded for the current shared list ID only
- [ ] Opening app without `id` generates a new list ID
- [ ] Generated ID is added to the URL automatically
- [ ] Current list ID is stored locally in browser
- [ ] URL `id` takes precedence over locally stored list ID
- [ ] Local stored list ID is overwritten when URL `id` differs
- [ ] User can copy current shared link
- [ ] User can create a new separate list
- [ ] Creating a new list does not modify previous list data
- [ ] List has no visible custom title and remains anonymous

---

## 2. Main Screen and Plant List

- [ ] Main screen displays product name
- [ ] Main screen displays top actions:
  - [ ] Change order
  - [ ] Select multiple
  - [ ] Caretaker mode
  - [ ] Add plant
- [ ] Empty state is shown when no plants exist
- [ ] Empty state contains explanatory text
- [ ] Empty state contains Add Plant CTA
- [ ] Plant cards are shown when at least one plant exists
- [ ] Each plant card displays photo or placeholder
- [ ] Photo count badge is shown when more than one photo exists
- [ ] Plant card displays plant name
- [ ] Plant card displays watering frequency text
- [ ] Plant card displays watering status badge
- [ ] Plant card displays fertilizing frequency text or “not needed” text
- [ ] Plant card displays fertilizing status badge
- [ ] Status badges are always visible on plant cards
- [ ] Status badges are informational only
- [ ] Clicking status badges does not trigger filtering or other action
- [ ] Saved plant order is displayed correctly

---

## 3. Add Plant

- [ ] Add Plant form opens successfully
- [ ] Add Plant form contains all expected fields
- [ ] Plant name is required
- [ ] Plant can be saved with only required field filled
- [ ] Plant can be saved with all optional fields filled
- [ ] Plant can be created without photos
- [ ] User can upload multiple photos in Add form
- [ ] Last watered field uses native date input
- [ ] Last fertilized field uses native date input
- [ ] New plant date fields default to current date
- [ ] User can type date manually if browser allows
- [ ] User can pick date from date picker
- [ ] Form closes automatically after successful save
- [ ] Closing form without save discards unsaved changes
- [ ] Backdrop click closes form without saving
- [ ] Cancel/Close closes form without saving

---

## 4. Edit Plant

- [ ] Edit Plant form opens successfully
- [ ] Edit form is prefilled with existing data
- [ ] User can modify editable fields
- [ ] Edited data is saved in current shared list
- [ ] Form closes automatically after save
- [ ] Closing Edit form without saving discards changes
- [ ] Native date inputs are used in Edit mode
- [ ] User can manually type dates if browser allows
- [ ] User can pick dates from date picker

---

## 5. Delete Plant

- [ ] Delete action is available only inside Edit form
- [ ] Delete action opens confirmation prompt
- [ ] Confirmation message is generic
- [ ] Confirmation message does not include plant name
- [ ] Confirmed deletion permanently removes plant
- [ ] Deleted plant is removed from current shared list only
- [ ] Delete action has no undo

---

## 6. Plant Photos

- [ ] App accepts image files through file picker
- [ ] Uploaded images are added to pending photo list
- [ ] Multiple photos can be uploaded for one plant
- [ ] No fixed client-side photo limit is enforced
- [ ] Pending photo can be removed before save
- [ ] Saved photo/photos are displayed after save
- [ ] Plant with no photo shows placeholder
- [ ] Photo count badge is accurate for multi-photo plant
- [ ] Failed image processing does not add broken image to pending list
- [ ] Current version does not show user-facing error for compression failure
- [ ] Upload behavior remains functional with larger images within allowed constraints

---

## 7. Before/After Photo Comparison

- [ ] Comparison option is available when plant has multiple photos
- [ ] Comparison view opens successfully
- [ ] First uploaded photo is used as “before”
- [ ] Most recent uploaded photo is used as “after”
- [ ] Comparison view can be closed
- [ ] Closing comparison view does not affect saved plant data

---

## 8. Plant Detail View

- [ ] Plant detail view opens from plant card in normal mode
- [ ] Plant detail view opens from plant card in Caretaker mode
- [ ] Plant detail view does not open from card click in bulk-select mode
- [ ] Detail view displays plant photos
- [ ] Detail view displays location
- [ ] Detail view displays watering section
- [ ] Detail view displays fertilizing section
- [ ] Detail view displays care instructions
- [ ] Detail view displays plant problem/question section
- [ ] Detail view displays actions for Watered / Fertilized / Edit in normal mode
- [ ] Edit action is hidden in Caretaker mode
- [ ] Detail view can be closed

---

## 9. Watering Logic

- [ ] Watering interval is stored for plant
- [ ] Last watered date is stored for plant
- [ ] Watering status is calculated from current date, last watered date, and interval
- [ ] Status “Watered” is shown when interval has not yet elapsed
- [ ] Status “Water today” is shown when due date is today
- [ ] Status “Overdue” is shown when due date has passed
- [ ] Missing last watered date results in “Overdue”
- [ ] Single-plant Watered action opens date picker
- [ ] Single-plant Watered action does not save immediately
- [ ] Care action date picker defaults to current date
- [ ] Future dates are blocked for Watered action
- [ ] Confirming Watered updates last watered date
- [ ] Watering status recalculates after save

---

## 10. Fertilizing Logic

- [ ] Fertilizing enabled flag is supported
- [ ] Disabled fertilizing shows “Do not fertilize” status
- [ ] Disabled fertilizing shows “not needed” frequency text
- [ ] Enabled fertilizing supports interval and last fertilized date
- [ ] Fertilizing status is calculated from current date, last fertilized date, and interval
- [ ] Status “Fertilized” is shown when interval has not yet elapsed
- [ ] Status “Fertilize” is shown when due date is today
- [ ] Status “Fertilize” is shown when due date has passed
- [ ] Missing last fertilized date with fertilizing enabled results in “Fertilize”
- [ ] Single-plant Fertilized action opens date picker
- [ ] Single-plant Fertilized action does not save immediately
- [ ] Care action date picker defaults to current date
- [ ] Future dates are blocked for Fertilized action
- [ ] Confirming Fertilized updates last fertilized date
- [ ] Fertilizing status recalculates after save

---

## 11. Interval Input Behavior

- [ ] Watering interval input is optional in form
- [ ] Empty watering interval stores default value `7`
- [ ] NaN watering interval stores default value `7`
- [ ] Fertilizing interval input is optional in form
- [ ] Empty fertilizing interval stores default value `30`
- [ ] NaN fertilizing interval stores default value `30`
- [ ] Current version allows typing `0` into interval fields
- [ ] Current version allows typing negative interval values
- [ ] Current version does not block invalid positive-range business values on submit

---

## 12. Bulk Actions

- [ ] User can enter bulk-select mode
- [ ] Plant cards become selectable in bulk-select mode
- [ ] Clicking plant card toggles selection instead of opening details
- [ ] Number of selected plants is displayed
- [ ] Bulk action bar is hidden when no plants are selected
- [ ] Bulk action bar appears only when bulk-select mode is active and at least one plant is selected
- [ ] Bulk action bar contains:
  - [ ] Watered toggle
  - [ ] Fertilized toggle
  - [ ] Apply
  - [ ] Cancel
- [ ] Watered toggle is OFF by default
- [ ] Fertilized toggle is OFF by default
- [ ] Selecting Fertilized auto-enables Watered
- [ ] User can manually turn Watered OFF again after Fertilized auto-enables it
- [ ] Selecting toggles does not immediately save changes
- [ ] Clicking Apply with no toggles selected shows alert
- [ ] Clicking Apply with no toggles selected does not open date picker
- [ ] Clicking Apply with at least one toggle opens shared date picker
- [ ] Shared bulk date picker defaults to current date
- [ ] Shared bulk date picker blocks future dates
- [ ] Confirmed Watered bulk action updates last watered date for all selected plants
- [ ] Confirmed Fertilized bulk action updates last fertilized date for all selected plants
- [ ] If both toggles are selected, same confirmed date is applied to both actions
- [ ] Relevant statuses recalculate after bulk apply
- [ ] Cancel exits bulk-select mode without applying unconfirmed changes

---

## 13. Undo for Bulk Actions

- [ ] Successful bulk action shows Undo toast
- [ ] Undo toast contains Undo action
- [ ] Undo is available only for most recent bulk action
- [ ] Undo remains available for 15 seconds
- [ ] Undo restores previous dates for affected plants only
- [ ] Undo is single-level only
- [ ] Undo is lost after page refresh
- [ ] Undo is lost after page reopen
- [ ] Undo is lost after another bulk action
- [ ] Single-plant Watered action does not support undo
- [ ] Single-plant Fertilized action does not support undo
- [ ] Delete action does not support undo

---

## 14. Reorder Mode

- [ ] User can enter reorder mode
- [ ] Plant order can be changed in reorder mode
- [ ] Updated plant order is saved
- [ ] Updated order persists after refresh
- [ ] Reorder mode is exited when Caretaker mode is enabled

---

## 15. Caretaker Mode

- [ ] User can enable Caretaker mode from main screen
- [ ] Interface changes for quick care usage
- [ ] Add Plant action is hidden in Caretaker mode
- [ ] Plant card displays care instructions block in Caretaker mode
- [ ] Plant card displays quick Watered action in Caretaker mode
- [ ] Plant card displays quick Fertilized action in Caretaker mode
- [ ] Clicking quick-action buttons does not open plant detail view
- [ ] Plant detail view remains accessible in Caretaker mode
- [ ] Edit action is hidden in plant detail view in Caretaker mode
- [ ] Deletion is effectively unavailable in Caretaker mode
- [ ] Care instructions block is visually highlighted in Caretaker mode
- [ ] Enabling Caretaker mode exits bulk-select mode
- [ ] Enabling Caretaker mode exits reorder mode
- [ ] Caretaker mode, bulk-select mode, and reorder mode are mutually exclusive
- [ ] Caretaker mode does not persist after refresh

---

## 16. AI Care Suggestions

- [ ] Add/Edit form contains AI generation action
- [ ] AI request returns care instructions field value
- [ ] AI request returns suggested watering interval
- [ ] AI request returns suggested fertilizing interval
- [ ] AI response populates form fields only
- [ ] AI-generated values are not auto-saved
- [ ] AI-generated values persist only after user clicks Save
- [ ] If AI generation fails, existing field values remain unchanged
- [ ] Current AI failure handling is consistent with implemented behavior (alert or silent fail)

---

## 17. AI Plant Problem Q&A

- [ ] Detail view contains Ask AI action
- [ ] User must enter question before request is sent
- [ ] Empty question shows alert
- [ ] Empty question does not send request
- [ ] Non-empty question sends request
- [ ] AI answer is displayed in UI
- [ ] AI answer is not stored in plant data
- [ ] AI answer is cleared when switching to another plant
- [ ] AI answer is cleared when closing detail view
- [ ] AI answer is displayed without extra disclaimer text

---

## 18. Shared Access and Synchronization

- [ ] Anyone with same shared URL can access same list
- [ ] App uses link-based anonymous access only
- [ ] Changes from one session are not shown in another session in real time
- [ ] Other session sees changes after manual refresh/reopen
- [ ] App fetches data on initial page load
- [ ] Concurrent changes behave as last-write-wins
- [ ] No stale data or conflict warning is displayed

---

## 19. Non-Functional / General Checks

- [ ] App is usable in modern desktop browser
- [ ] App is usable in mobile browser
- [ ] UI language is Ukrainian only
- [ ] List data persists after refresh for same shared list ID
- [ ] Native date input behavior is functional in tested browser
- [ ] Multi-photo support works within current backend constraints
- [ ] No obvious blocking visual issue prevents core flow execution

---

## 20. Regression Focus Areas

- [ ] Add/edit/delete plant regression
- [ ] Watering status regression
- [ ] Fertilizing status regression
- [ ] Bulk actions regression
- [ ] Undo regression
- [ ] Reorder persistence regression
- [ ] Caretaker restrictions regression
- [ ] AI flow regression
- [ ] Shared list persistence regression
- [ ] Detail view open/close regression
