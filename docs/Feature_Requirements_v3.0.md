# Feature Requirements v3.0
## Select All Button for Bulk Plant Selection

**Status:** Final Draft  
**Source:** Current implemented behavior in the LeafLOG application

---

## Feature 7. Select All

### Goal
Allow users to select all plants currently shown in the plant list for a bulk care action without selecting each plant card individually.

### Requirements

**SA-001.** The main screen shall provide a `Select all` button next to the bulk-select mode control.

**SA-002.** Activating `Select all` shall enable bulk-select mode if it is not already active.

**SA-003.** When bulk-select mode is enabled by `Select all`, the system shall exit Caretaker mode and reorder mode if either is active.

**SA-004.** Activating `Select all` shall select every plant currently visible in the plant list.

**SA-005.** If a status filter is active, `Select all` shall select only visible plants that match the active filter. Plants hidden by the filter shall not be newly selected by this action.

**SA-006.** Activating `Select all` while bulk-select mode is already active shall add all currently visible plants to the selection without clearing plants already selected.

**SA-007.** Selected plant cards shall display the existing selected-state visual treatment, and the bulk action bar shall show the selected plant count.

**SA-008.** Selecting plants shall not apply watering or fertilizing actions or modify plant data. Bulk care actions shall remain subject to the existing action-toggle, Apply, and date-confirmation flow.

**SA-009.** The button label and associated interface text shall follow the currently selected UI language.

### Acceptance Criteria

**AC-SA-01.** Clicking `Select all` from normal mode enables bulk-select mode and selects all plants in the unfiltered list.

**AC-SA-02.** Clicking `Select all` while a status filter is active selects only plants currently visible under that filter.

**AC-SA-03.** Clicking `Select all` when some plants are already selected selects all currently visible plants and preserves the existing selection.

**AC-SA-04.** The bulk action bar displays the total number of selected plants after the action.

**AC-SA-05.** If `Select all` is used while Caretaker or reorder mode is active, bulk-select mode becomes active and the other mode is exited.

**AC-SA-06.** Selecting all plants alone does not change watering dates, fertilizing dates, or other plant data.

**AC-SA-07.** The button label is localized in Ukrainian and English.
