# Feature Requirements v2.1
> **Revised 2026-10-29** to match the implemented behavior: filters are the legend chips, not the badges on cards; the Fertilizing Calendar trigger is an icon.

## Status Filters, Fertilizing Calendar and Reorder Mode Update

---

## Feature 4. Status Filters

### Goal
Allow users to filter the main plant list by a single selected status and quickly return to the default list view.

### Requirements

**FL-001.** The status legend chips displayed in the filter row (row 3) shall act as clickable filter controls: Watered, Water, Fertilized, Fertilize (English label «Needs fertilizer»), Do not fertilize. Status badges on plant cards remain non-clickable.

**FL-002.** Clicking a filter chip shall filter the visible plant list to show only plants with that status. A plant matches if its watering status or its fertilizing status equals the selected one.

**FL-003.** Only one status filter may be active at a time.

**FL-004.** Selecting a new status filter shall clear any previously active status filter.

**FL-005.** Clicking the currently active filter chip again shall clear the filter and restore the full plant list.

**FL-006.** The active filter state shall be visually indicated.

**FL-007.** Filtering shall not modify saved plant data.

**FL-008.** Filtering shall not change plant order within the filtered result set.

**FL-009.** If no plants match the selected filter, the system shall display an empty filtered state with a message and a «Reset filter» button that clears the filter.

**FL-010.** Clicking the site title/logo shall clear any active status filter.

**FL-011.** Clicking the site title/logo shall exit Caretaker mode.

**FL-012.** Clicking the site title/logo shall return the user to the default main page showing the full plant list for the current shared list.

**FL-013.** Clicking the site title/logo shall also exit bulk-select mode and reorder mode, and close the Fertilizing Calendar if it is open.

### Acceptance Criteria

**AC-FL-01.** When the user clicks a filter chip such as `Watered`, only plants with that status are displayed.

**AC-FL-02.** When the user clicks a different filter chip, the previous filter is cleared and the new single filter is applied.

**AC-FL-03.** When the user clicks the currently active filter chip again, the filter is removed and the full plant list is shown.

**AC-FL-04.** Two status filters cannot be active at the same time.

**AC-FL-05.** Clicking the site title/logo clears the active filter and exits Caretaker, bulk-select and reorder modes.

**AC-FL-06.** After clicking the site title/logo, the user is returned to the default main list view for the current shared list.

---

## Feature 5. Fertilizing Calendar

### Goal
Provide a calendar-based sidebar view for reviewing recorded fertilizing dates and predicted next fertilizing dates for plants in the current shared list.

### Requirements

**FC-001.** The main page shall provide access to the Fertilizing Calendar from row 3 of the layout.

**FC-002.** In row 3, filter controls shall be displayed on the left and the Fertilizing Calendar trigger shall be displayed on the right.

**FC-003.** The Fertilizing Calendar trigger shall be displayed as a calendar icon button (accessible name «Fertilizing Calendar» / «Календар підживлення») styled in the same color family as the fertilizing badge.

**FC-004.** Activating the Fertilizing Calendar trigger shall open a sidebar.

**FC-005.** The sidebar shall display the Fertilizing Calendar for the current month by default.

**FC-006.** The sidebar shall contain:
- a title indicating that this is the Fertilizing Calendar,
- a month/year label,
- previous and next month navigation arrows,
- a monthly calendar grid,
- an area below the calendar for displaying plant names for a selected date.

**FC-007.** The current date shall be visually outlined in the calendar.

**FC-008.** The calendar shall highlight fertilizing-related dates using a very soft pastel tint in the same color family as the fertilizing badge.

**FC-009.** Highlighted dates shall include:
- the recorded last fertilized date for each applicable plant,
- the predicted next fertilizing date for each applicable plant.

**FC-010.** The visual intensity of a highlighted date shall increase when more plants fall on the same date.

**FC-011.** Plants shall participate in the Fertilizing Calendar only when fertilizing is enabled for that plant.

**FC-012.** When fertilizing is enabled for a plant, the plant may contribute:
- its recorded last fertilized date,
- its predicted next fertilizing date based on the saved interval.

**FC-013.** If the recorded fertilized date of a plant changes, the Fertilizing Calendar shall update accordingly:
- the previously highlighted last fertilized date may be removed,
- the previously predicted next fertilizing date may be removed,
- the new last fertilized date shall be highlighted,
- the new predicted next fertilizing date shall be highlighted.

**FC-014.** Clicking a highlighted or non-highlighted calendar date shall select it and display, below the calendar, the plant names associated with that date, each tagged as «Fertilized» (recorded date) or «Fertilize» (predicted date). Before any date is selected the area shows a hint; for a date without fertilizing the area shows an «empty» message.

**FC-015.** The Fertilizing Calendar shall be view-only and shall not allow direct editing or care actions from the sidebar.

**FC-016.** The sidebar shall support closing by:
- clicking the `X` icon in the top-right corner,
- clicking outside the sidebar,
- clicking the site title/logo.

**FC-017.** Clicking the site title/logo while the Fertilizing Calendar is open shall close the sidebar and return the user to the main list view.

**FC-018.** Calendar labels, title, and visible text shall follow the currently selected UI language.

**FC-019.** The Fertilizing Calendar shall use data only from the current shared list.

**FC-020.** If no applicable fertilizing dates exist for the displayed month, the calendar shall remain visible without highlighted dates.

### Acceptance Criteria

**AC-FC-01.** The user can open the Fertilizing Calendar from the right side of row 3.

**AC-FC-02.** The Fertilizing Calendar opens as a sidebar showing the current month.

**AC-FC-03.** The current date is visually outlined in the calendar.

**AC-FC-04.** The calendar highlights both recorded last fertilized dates and predicted next fertilizing dates.

**AC-FC-05.** Dates with more associated plants are displayed with visibly stronger tint intensity than dates with fewer associated plants.

**AC-FC-06.** If a plant’s fertilized date is changed, the old and new calendar highlights are recalculated accordingly.

**AC-FC-07.** Clicking a date can display plant names associated with that date below the calendar.

**AC-FC-08.** The Fertilizing Calendar is view-only and does not allow direct care actions.

**AC-FC-09.** The sidebar can be closed by `X`, outside click, or logo click.

**AC-FC-10.** Calendar labels follow the selected UI language.

**AC-FC-11.** The Fertilizing Calendar uses data from the current shared list only.

---

## Feature 6. Reorder Mode Update

### Goal
Improve plant reordering usability by preserving the existing tile/card layout and enabling drag-and-drop through a dedicated drag handle.

### Requirements

**RF-001.** Reorder mode shall preserve the existing tile/card view of the plant list instead of switching to a compact list layout.

**RF-002.** In reorder mode, plant cards shall remain visually recognizable by photo and plant name.

**RF-003.** In reorder mode, filter labels shall be hidden together with the Fertilizing Calendar trigger (they share one row), so the calendar is not available while reorder mode is active.

**RF-004.** Enabling reorder mode shall automatically exit Caretaker mode.

**RF-005.** Enabling reorder mode shall automatically exit bulk-select mode.

**RF-006.** In reorder mode, clicking or tapping a plant card shall not open the plant detail view.

**RF-007.** In reorder mode, each plant tile shall provide a dedicated drag handle.

**RF-008.** Reordering shall start only when the user drags the dedicated handle.

**RF-009.** Reordering shall not start when the user touches or swipes other areas of the plant tile.

**RF-010.** Standard page scrolling on mobile shall remain available outside the drag handle interaction.

**RF-011.** The system shall allow the user to change plant order by dragging a plant tile to a new position.

**RF-012.** While dragging a plant tile near the top or bottom edge of the viewport, the page shall auto-scroll in the corresponding direction.

**RF-013.** Auto-scroll during drag shall allow the user to continue moving the same tile without releasing it.

**RF-014.** The user shall be able to move a tile across long lists in one continuous drag action.

**RF-015.** After drag-and-drop is completed, the updated plant order shall be saved.

**RF-016.** The saved plant order shall persist after page refresh.

**RF-017.** Exiting reorder mode shall restore normal plant card interaction, including opening the detail view on card click.

### Acceptance Criteria

**AC-R-01.** When reorder mode is enabled, the plant list remains in tile/card view.

**AC-R-02.** Filter labels and the Fertilizing Calendar trigger are hidden while reorder mode is active.

**AC-R-03.** Caretaker mode and bulk-select mode are exited when reorder mode is enabled.

**AC-R-04.** Tapping or clicking a plant card in reorder mode does not open the detail view.

**AC-R-05.** Each plant tile shows a visible drag handle in reorder mode.

**AC-R-06.** Dragging starts only from the drag handle.

**AC-R-07.** Swiping outside the drag handle still allows normal page scrolling on mobile.

**AC-R-08.** The user can drag a plant tile to a different position.

**AC-R-09.** When the dragged tile approaches the top edge of the screen, the list auto-scrolls upward.

**AC-R-10.** When the dragged tile approaches the bottom edge of the screen, the list auto-scrolls downward.

**AC-R-11.** The user can move a plant tile from a low position to a much higher position in one continuous drag action.

**AC-R-12.** After drop, the new order is saved and remains after page refresh.
