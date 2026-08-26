# Checklist
## LeafLOG Web Application

**Version:** 2.2  
**Status:** Draft  
**Application Under Test:** LeafLOG  
**Test Environment URL:** https://leaf-log-six.vercel.app/?id=rycu0sei  
**Reference Documents:** Functional Requirements v2.0, Feature Requirements v1.2, Feature Requirements v2.1

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

## 2. Header Layout and Stability

- [ ] Header renders as a three-row structure: row 1, row 2, filter row below
- [ ] Row 1 displays centered `LeafLOG` title
- [ ] Row 1 displays language switcher in the right corner
- [ ] Row 2 displays mode/action controls: Select multiple, Caretaker mode, Change order, Add plant
- [ ] Filter labels render in a separate row below the header, not inside header rows
- [ ] Add Plant button is hidden when Caretaker mode is enabled
- [ ] Hiding Add Plant in Caretaker mode does not shift centered title or right-side controls
- [ ] Reserved space for Add Plant is preserved even while hidden
- [ ] Header controls do not resize or shift position on hover/press/active/toggle states
- [ ] Header remains stable and usable on mobile viewport
- [ ] Header remains stable and usable in normal, Caretaker, bulk-select, and reorder modes
- [ ] Horizontal padding of header, main content, and footer is visually consistent on mobile

---

## 3. Language Switcher (UA / EN)

- [ ] Language switcher is visible in header row 1, right corner
- [ ] Switcher shows current language (UA / EN)
- [ ] User can switch from Ukrainian to English
- [ ] User can switch from English to Ukrainian
- [ ] Switching language updates header controls, buttons, form labels, empty states
- [ ] Switching language updates filter labels
- [ ] Switching language updates detail view labels
- [ ] Switching language updates bulk action labels
- [ ] Switching language updates Caretaker mode labels
- [ ] Switching language updates AI section labels and system messages
- [ ] Switching language updates Fertilizing Calendar labels (title, month, tags)
- [ ] Switching language updates footer text
- [ ] Selected language persists after page refresh
- [ ] AI-generated care suggestions are returned in the currently selected language
- [ ] AI plant-problem answers are returned in the currently selected language
- [ ] Switching UI language does not auto-translate already-saved plant data
- [ ] Using the language switcher does not shift or resize header layout

---

## 4. Footer

- [ ] Footer is visible at the bottom of the page
- [ ] Footer displays copyright text with product name
- [ ] Footer displays tagline in the currently selected language
- [ ] Footer provides "Copy share link" action
- [ ] Footer provides "Create your own list" action
- [ ] Copy share link copies the current shared list URL
- [ ] Create your own list generates a new list without modifying current list data
- [ ] Footer remains readable and responsive on desktop and mobile
- [ ] Footer stays attached to bottom of viewport when page content is short
- [ ] Footer appears below content (no overlap) when page content exceeds viewport height
- [ ] Footer does not obscure modal content or the bulk action bar

---

## 5. Main Screen and Plant List

- [ ] Main screen displays product name
- [ ] Main screen displays top actions: Change order, Select multiple, Caretaker mode, Add plant
- [ ] Empty state is shown when no plants exist
- [ ] Empty state contains explanatory text
- [ ] Empty state contains Add Plant CTA
- [ ] Plant cards are shown when at least one plant exists
- [ ] Each plant card displays photo or placeholder
- [ ] Photo count badge is shown when more than one photo exists
- [ ] Plant card displays plant name
- [ ] Plant card displays watering frequency text
- [ ] Plant card displays watering status badge
- [ ] Plant card displays fertilizing frequency text or "not needed" text
- [ ] Plant card displays fertilizing status badge
- [ ] Status badges are always visible on plant cards
- [ ] Saved plant order is displayed correctly

---

## 6. Status Filters

- [ ] Status badges in the legend row are clickable filter controls
- [ ] Clicking a status badge filters the list to matching plants only
- [ ] Only one status filter can be active at a time
- [ ] Selecting a new filter clears the previously active filter
- [ ] Clicking the active filter again clears it and restores the full list
- [ ] Active filter is visually indicated (highlighted chip)
- [ ] Filtering does not modify saved plant data
- [ ] Filtering does not change plant order within filtered results
- [ ] Empty filtered state is shown when no plants match selected filter
- [ ] Empty filtered state provides a way to reset the filter
- [ ] Clicking the site logo clears the active filter
- [ ] Clicking the site logo exits Caretaker mode
- [ ] Clicking the site logo returns to the default full list view

---

## 7. Add Plant

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
- [ ] Fertilizing checkbox label reads "Увімкнути підживлення" (UA) / "Fertilizing enabled" (EN)
- [ ] Form closes automatically after successful save
- [ ] Closing form without save discards unsaved changes
- [ ] Backdrop click closes form without saving
- [ ] Cancel/Close closes form without saving

---

## 8. Edit Plant

- [ ] Edit Plant form opens successfully
- [ ] Edit form is prefilled with existing data
- [ ] User can modify editable fields
- [ ] Edited data is saved in current shared list
- [ ] Fertilizing checkbox label reads "Увімкнути підживлення" (UA) / "Fertilizing enabled" (EN)
- [ ] Form closes automatically after save
- [ ] Closing Edit form without saving discards changes
- [ ] Native date inputs are used in Edit mode
- [ ] User can manually type dates if browser allows
- [ ] User can pick dates from date picker

---

## 9. Delete Plant

- [ ] Delete action is available only inside Edit form
- [ ] Delete action opens confirmation prompt
- [ ] Confirmation message is generic
- [ ] Confirmation message does not include plant name
- [ ] Confirmed deletion permanently removes plant
- [ ] Deleted plant is removed from current shared list only
- [ ] Delete action has no undo

---

## 10. Plant Photos

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

## 11. Before/After Photo Comparison

- [ ] Comparison option is available when plant has multiple photos
- [ ] Comparison view opens successfully
- [ ] First uploaded photo is used as "before"
- [ ] Most recent uploaded photo is used as "after"
- [ ] Comparison view can be closed
- [ ] Closing comparison view does not affect saved plant data

---

## 12. Plant Detail View

- [ ] Plant detail view opens from plant card in normal mode
- [ ] Plant detail view opens from plant card in Caretaker mode
- [ ] Plant detail view does not open from card click in bulk-select mode
- [ ] Plant detail view does not open from card click in reorder mode
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

## 13. Watering Logic

- [ ] Watering interval is stored for plant
- [ ] Last watered date is stored for plant
- [ ] Watering status is calculated from current date, last watered date, and interval
- [ ] Status "Полито" / "Watered" is shown when interval has not yet elapsed
- [ ] Status "Полити" / "Water" is shown when due date is today
- [ ] Status "Полити" / "Water" is shown when due date has passed (no separate "overdue" status)
- [ ] Missing last watered date results in "Полити" / "Water" status
- [ ] Only two watering statuses exist: Watered and Water (no Overdue badge or color)
- [ ] Single-plant Watered action opens date picker
- [ ] Single-plant Watered action does not save immediately
- [ ] Care action date picker defaults to current date
- [ ] Future dates are blocked for Watered action
- [ ] Confirming Watered updates last watered date
- [ ] Watering status recalculates after save

---

## 14. Fertilizing Logic

- [ ] Fertilizing enabled flag is supported
- [ ] Disabled fertilizing shows "Do not fertilize" status
- [ ] Disabled fertilizing shows "not needed" frequency text
- [ ] Enabled fertilizing supports interval and last fertilized date
- [ ] Fertilizing status is calculated from current date, last fertilized date, and interval
- [ ] Status "Fertilized" is shown when interval has not yet elapsed
- [ ] Status "Fertilize" is shown when due date is today
- [ ] Status "Fertilize" is shown when due date has passed
- [ ] Missing last fertilized date with fertilizing enabled results in "Fertilize"
- [ ] Single-plant Fertilized action opens date picker
- [ ] Single-plant Fertilized action does not save immediately
- [ ] Care action date picker defaults to current date
- [ ] Future dates are blocked for Fertilized action
- [ ] Confirming Fertilized updates last fertilized date
- [ ] Fertilizing status recalculates after save

---

## 15. Interval Input Behavior

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

## 16. Bulk Actions

- [ ] User can enter bulk-select mode
- [ ] Plant cards become selectable in bulk-select mode
- [ ] Clicking plant card toggles selection instead of opening details
- [ ] Number of selected plants is displayed
- [ ] Bulk action bar is hidden when no plants are selected
- [ ] Bulk action bar appears only when bulk-select mode is active and at least one plant is selected
- [ ] Bulk action bar contains: Watered toggle, Fertilized toggle, Apply, Cancel
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

## 17. Undo for Bulk Actions

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

## 18. Reorder Mode

- [ ] User can enter reorder mode
- [ ] Plant list remains in tile/card view (not switched to compact list)
- [ ] Plant cards remain recognizable by photo and name while in reorder mode
- [ ] Filter labels are hidden while reorder mode is active
- [ ] Enabling reorder mode exits Caretaker mode
- [ ] Enabling reorder mode exits bulk-select mode
- [ ] Each plant tile shows a dedicated drag handle icon
- [ ] Dragging starts only when the handle is grabbed
- [ ] Dragging does not start from other areas of the tile
- [ ] Tapping/clicking a card in reorder mode does not open detail view
- [ ] Normal page scroll still works on mobile outside the drag handle
- [ ] User can drag a tile to a new position
- [ ] Dragging near the top edge of the viewport auto-scrolls upward
- [ ] Dragging near the bottom edge of the viewport auto-scrolls downward
- [ ] Auto-scroll allows continuing the same drag without releasing
- [ ] User can move a tile across a long list in one continuous drag
- [ ] Updated plant order is saved after drop
- [ ] Updated order persists after page refresh
- [ ] Exiting reorder mode restores normal card click behavior (opens detail view)

---

## 19. Caretaker Mode

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

## 20. Fertilizing Calendar

- [ ] Calendar trigger is accessible from the legend/filter area, top-right corner
- [ ] Trigger is icon-only (no text label), pink-colored to match "Удобрити"/"Удобрено" family
- [ ] Trigger is positioned top-right on both desktop and mobile
- [ ] Trigger does not visually overlap or touch adjacent filter chips
- [ ] Trigger hover behavior matches legend chip hover (darkens/increases opacity on hover, not lightens)
- [ ] Activating trigger opens a sidebar
- [ ] Sidebar opens showing the current month by default
- [ ] Sidebar displays a title identifying it as the Fertilizing Calendar
- [ ] Sidebar displays month/year label without stray suffix characters
- [ ] Sidebar provides previous/next month navigation arrows
- [ ] Sidebar displays a monthly calendar grid with weekday headers
- [ ] Today's date is visually outlined in the calendar
- [ ] Only plants with fertilizing enabled contribute dates to the calendar
- [ ] Calendar highlights each plant's last fertilized date
- [ ] Calendar highlights each plant's predicted next fertilizing date
- [ ] Highlight intensity is lighter for a single plant on a date
- [ ] Highlight intensity increases gradually as more plants share a date
- [ ] Highlight intensity caps at a defined maximum for a high plant count (e.g. 10+)
- [ ] Date number text remains readable (dark/black) regardless of highlight intensity
- [ ] Selection ring on a clicked date stays fully inside that cell and never bleeds into an adjacent cell
- [ ] Clicking a date displays the list of plants associated with that date below the calendar
- [ ] Plant list under a selected date uses existing app terminology ("Удобрено" / "Удобрити") rather than custom labels
- [ ] Selecting a date with no fertilizing activity shows an appropriate empty message
- [ ] Calendar is view-only (no care actions can be triggered from the sidebar)
- [ ] Sidebar closes via the X icon
- [ ] Sidebar closes via outside/backdrop click
- [ ] Sidebar closes via clicking the site logo
- [ ] Calendar labels and tags follow the currently selected UI language
- [ ] Calendar reflects data from the current shared list only
- [ ] If a plant's fertilized date changes, calendar highlights update accordingly on next open/render
- [ ] Calendar remains visible without highlighted dates when nothing applicable exists for the shown month

---

## 21. AI Care Suggestions

- [ ] Add/Edit form contains AI generation action
- [ ] AI request returns care instructions field value
- [ ] AI request returns suggested watering interval
- [ ] AI request returns suggested fertilizing interval
- [ ] AI response populates form fields only
- [ ] AI-generated values are not auto-saved
- [ ] AI-generated values persist only after user clicks Save
- [ ] AI-generated care suggestions are returned in the currently selected UI language
- [ ] If AI generation fails, existing field values remain unchanged
- [ ] A transient empty AI response is retried automatically before surfacing an error
- [ ] Current AI failure handling is consistent with implemented behavior (alert or silent fail)

---

## 22. AI Plant Problem Q&A

- [ ] Detail view contains Ask AI action
- [ ] User must enter question before request is sent
- [ ] Empty question shows alert
- [ ] Empty question does not send request
- [ ] Non-empty question sends request
- [ ] AI answer is displayed in UI
- [ ] AI answer is returned in the currently selected UI language
- [ ] AI answer is not stored in plant data
- [ ] AI answer is cleared when switching to another plant
- [ ] AI answer is cleared when closing detail view
- [ ] AI answer is displayed without extra disclaimer text
- [ ] A transient empty AI response is retried automatically before surfacing an error

---

## 23. Shared Access and Synchronization

- [ ] Anyone with same shared URL can access same list
- [ ] App uses link-based anonymous access only
- [ ] Changes from one session are not shown in another session in real time
- [ ] Other session sees changes after manual refresh/reopen
- [ ] App fetches data on initial page load
- [ ] Concurrent changes behave as last-write-wins
- [ ] No stale data or conflict warning is displayed

---

## 24. Non-Functional / General Checks

- [ ] App is usable in modern desktop browser
- [ ] App is usable in mobile browser
- [ ] UI is available in both Ukrainian and English
- [ ] List data persists after refresh for same shared list ID
- [ ] Native date input behavior is functional in tested browser
- [ ] Multi-photo support works within current backend constraints
- [ ] Buttons, chips, and badges use visually consistent corner radius across the app
- [ ] AI-backend requests (Groq) complete successfully with the currently configured model
- [ ] No obvious blocking visual issue prevents core flow execution

---

## 25. Regression Focus Areas

- [ ] Add/edit/delete plant regression
- [ ] Watering status regression (two-state: Watered / Water)
- [ ] Fertilizing status regression
- [ ] Status filter regression
- [ ] Fertilizing Calendar regression (highlighting, selection, language, open/close)
- [ ] Bulk actions regression
- [ ] Undo regression
- [ ] Reorder persistence and drag-handle regression
- [ ] Caretaker restrictions regression
- [ ] Language switch regression (UA/EN across all screens)
- [ ] Header/footer layout stability regression (desktop and mobile)
- [ ] AI flow regression (care suggestions, Q&A, retry-on-empty behavior)
- [ ] Shared list persistence regression
- [ ] Detail view open/close regression
