# Functional Requirements
## Version 2.0

**Status:** Final Draft  
**Source:** Reverse-engineered from implemented UI and confirmed current behavior  
**Last revised:** 2026-10-29 — aligned with the implemented behavior, including the changes described in Feature Requirements v1.2 and v2.1 (see [Revision Notes](#25-revision-notes))

---

## Table of Contents
1. [Product Purpose](#1-product-purpose)
2. [Scope](#2-scope)
   1. [In Scope](#21-in-scope)
   2. [Out of Scope](#22-out-of-scope)
3. [Users / Roles](#3-users--roles)
   1. [Primary User](#31-primary-user)
   2. [Shared User / Caretaker](#32-shared-user--caretaker)
4. [Shared List Model](#4-shared-list-model)
   1. [Shared List Access](#41-shared-list-access)
5. [Main Screen and Plant List](#5-main-screen-and-plant-list)
6. [Plant Record](#6-plant-record)
   1. [Required Field](#61-required-field)
   2. [Optional Fields](#62-optional-fields)
   3. [System Fields](#63-system-fields)
7. [Add Plant](#7-add-plant)
8. [Edit and Delete Plant](#8-edit-and-delete-plant)
9. [Plant Photos](#9-plant-photos)
10. [Before/After Photo Comparison](#10-beforeafter-photo-comparison)
11. [Plant Detail View](#11-plant-detail-view)
12. [Watering Logic](#12-watering-logic)
13. [Fertilizing Logic](#13-fertilizing-logic)
14. [Interval Input Behavior](#14-interval-input-behavior)
15. [Bulk Actions](#15-bulk-actions)
16. [Undo for Bulk Actions](#16-undo-for-bulk-actions)
17. [Reorder Mode](#17-reorder-mode)
18. [Caretaker Mode](#18-caretaker-mode)
19. [AI Features](#19-ai-features)
   1. [AI Care Suggestions](#191-ai-care-suggestions)
   2. [AI Plant Problem Q&A](#192-ai-plant-problem-qa)
20. [Shared Access and Synchronization](#20-shared-access-and-synchronization)
21. [Business Rules](#21-business-rules)
22. [Non-Functional Requirements](#22-non-functional-requirements)
23. [Known Limitations](#23-known-limitations)
24. [Summary](#24-summary)
25. [Revision Notes](#25-revision-notes)

---

## 1. Product Purpose

LeafLOG is a web application for managing household plants, tracking care activities, and sharing plant lists through a link-based access model.

The application allows users to:
- create and maintain a list of plants;
- store plant photos and care information;
- track watering and fertilizing schedules;
- record plant care actions;
- share access to the same plant list via URL;
- use AI assistance for care suggestions and plant problem questions.

---

## 2. Scope

### 2.1 In Scope

The current version includes:
- shared list access by URL parameter;
- plant list management;
- plant creation, editing, and deletion;
- multiple plant photos;
- before/after photo comparison;
- watering schedule tracking;
- fertilizing schedule tracking;
- single-plant care logging;
- bulk care actions;
- plant reorder mode;
- caretaker mode;
- AI-generated care suggestions;
- AI plant problem Q&A;
- UI language switcher (Ukrainian / English);
- status filtering through legend chips;
- fertilizing calendar;
- footer with shared-list actions.

### 2.2 Out of Scope

The current version does not include:
- user authentication or user accounts;
- real-time synchronization;
- conflict detection;
- notifications or reminders;
- plant history timeline;
- clear-all-data action;
- summer schedule functionality.

---

## 3. Users / Roles

### 3.1 Primary User

A user who creates and manages a plant list, edits plant records, and tracks plant care.

### 3.2 Shared User / Caretaker

A user who accesses the same list through a shared link and may perform care-related actions depending on the current mode.

---

## 4. Shared List Model

### 4.1 Shared List Access

**FR-001.** The system shall open a plant list in the context of a specific shared list ID passed through the URL parameter `id`.

**FR-002.** If the application is opened without an `id` parameter, the system shall use the list ID stored locally in the browser; if no ID is stored, the system shall generate a new unique list ID.

**FR-003.** After resolving the list ID (stored or newly generated), the system shall update the current URL to include the `id` parameter.

**FR-004.** The system shall store the current list ID locally in the browser.

**FR-005.** If both a URL `id` and a locally stored list ID exist, the URL `id` shall take precedence.

**FR-006.** If the URL `id` differs from the locally stored list ID, the system shall open the list from the URL for the current session and shall not overwrite the locally stored ID, so that the user's own list is not replaced after following a link to someone else's list.

**FR-007.** The system shall load and display data associated only with the current shared list ID.

**FR-008.** The system shall allow the user to copy a shareable link for the current list. On success the system shows a confirmation alert; if the clipboard cannot be used, the system shows a prompt with the link for manual copying.

**FR-009.** The system shall allow the user to create a new separate list after the user accepts a confirmation dialog. If the user cancels the dialog, nothing changes.

**FR-010.** Creating a new separate list shall generate a new list ID and shall not affect the current list data.

**FR-011.** The application shall not display a user-defined list title. Shared lists shall be anonymous and identified only by the `id` parameter.

---

## 5. Main Screen and Plant List

**FR-012.** The main screen shall display the product name and the primary actions:
- Caretaker mode
- Add plant
- Select multiple
- Select all
- Change order
- Language switcher

The header layout is defined in Feature Requirements v1.2 (HF-001…HF-011).

**FR-013.** If the list contains no plants, the system shall display an empty state with explanatory text and an Add Plant call-to-action.

**FR-014.** If the list contains one or more plants, the system shall display them as plant cards.

**FR-015.** Each plant card shall display:
- plant photo, or a placeholder if no photo exists;
- photo count badge if more than one photo exists;
- plant name;
- watering frequency text;
- watering status badge;
- fertilizing frequency text, or a message indicating fertilizing is not needed;
- fertilizing status badge.

**FR-016.** In Caretaker mode, each plant card shall additionally display:
- care instructions block;
- quick-action buttons for Watered and Fertilized.

**FR-017.** Status badges on plant cards shall be visual indicators only.

**FR-018.** Clicking a status badge on a plant card shall not trigger filtering or any other action. Filtering is performed only through the filter chips in the legend row (see Feature Requirements v2.1, FL-001…FL-015).

**FR-019.** Status badges shall always be displayed on plant cards.

**FR-020.** In normal mode and Caretaker mode, clicking a plant card shall open the plant detail view, except when clicking card quick-action buttons.

**FR-021.** In bulk-select mode, clicking a plant card shall toggle plant selection instead of opening plant details.

**FR-022.** The system shall preserve and display the saved order of plants.

---

## 6. Plant Record

Each plant record shall support the following fields.

### 6.1 Required Field

**FR-023.** Plant name shall be required.

### 6.2 Optional Fields

**FR-024.** A plant record may contain:
- one or more photos;
- Latin name;
- room / windowsill / location;
- watering interval in days;
- last watered date;
- fertilizing enabled flag;
- fertilizing interval in days;
- last fertilized date;
- care instructions.

### 6.3 System Fields

**FR-025.** A plant record shall include internal fields such as:
- plant ID;
- position in the list (display order is defined by the order of records; there is no separate order field).

The shared list ID is not a plant field: it is the key under which the list is stored. Photos are stored separately from the plant record, one record per plant.

---

## 7. Add Plant

**FR-026.** The system shall allow the user to open the Add Plant form.

**FR-027.** The Add Plant form shall contain the following fields:
- Photos
- Plant name
- Latin name
- Room / windowsill
- Water every (days)
- Last watered
- Fertilizing enabled
- Fertilize every (days)
- Last fertilized
- Care instructions

**FR-028.** The Plant name field shall be required.

**FR-029.** The system shall allow multiple photos to be uploaded for a single plant.

**FR-030.** Photos shall not be required to create a plant.

**FR-031.** The Last watered and Last fertilized fields shall use a native date input / date picker.

**FR-032.** For a newly created plant, date fields shall default to the current date when opened.

**FR-033.** The system shall allow users to type a date manually or select it from the date picker, subject to browser behavior for native date inputs.

**FR-034.** The system shall allow the user to save a new plant after the required field is completed.

**FR-035.** After saving a plant, the form shall close automatically.

**FR-036.** If the user closes the Add Plant form via Close, Cancel, or backdrop click without saving, all entered changes shall be discarded.

---

## 8. Edit and Delete Plant

**FR-037.** The system shall allow the user to open the Edit Plant form for an existing plant.

**FR-038.** When editing a plant, the form shall be prefilled with the current plant data.

**FR-039.** The system shall allow the user to modify any editable plant field.

**FR-040.** The Last watered and Last fertilized fields in Edit mode shall use a native date input / date picker.

**FR-041.** The system shall allow users to manually type date values or select them through the date picker, subject to browser behavior.

**FR-042.** After saving changes, the system shall update the plant data in the current list.

**FR-043.** After saving changes, the form shall close automatically.

**FR-044.** If the user closes the Edit form via Close, Cancel, or backdrop click without saving, all unsaved changes shall be discarded.

**FR-045.** The system shall allow the user to delete a plant only from within the Edit Plant form.

**FR-046.** The system shall request confirmation before deleting a plant.

**FR-047.** The delete confirmation message shall be generic and shall not include the plant name.

**FR-048.** After deletion is confirmed, the plant shall be permanently removed from the current shared list.

**FR-049.** Plant deletion shall not support undo.

---

## 9. Plant Photos

**FR-050.** The system shall accept uploaded image files through a file picker using the `image/*` type.

**FR-051.** Uploaded images shall be converted to JPEG format before storage.

**FR-052.** Uploaded images shall be compressed client-side before storage.

**FR-053.** The image compression target shall be approximately 180 KB per photo.

**FR-054.** The system shall support iterative client-side compression if needed to approach the target size.

**FR-055.** The application shall support multiple photos per plant.

**FR-056.** The application shall not enforce a fixed client-side photo count limit.

**FR-057.** Upload success may still be constrained by backend storage limits.

**FR-058.** If image compression or processing fails, the system shall not add the failed image to the pending photo list.

**FR-059.** Image compression or processing failures shall not display a user-facing error message in the current version.

**FR-060.** In the Add/Edit form, users shall be able to remove individual pending photos before saving.

**FR-169.** Each uploaded photo shall be stamped with the date it was added. The date is shown on the photo thumbnail in the Add/Edit form and in the before/after comparison labels.

**FR-170.** Plant photos shall be loaded after the plant list is displayed, in the background (up to 6 plants in parallel). Until a photo is loaded, the card shows the placeholder; cards update as photos arrive.

---

## 10. Before/After Photo Comparison

**FR-061.** If a plant has multiple photos, the system shall allow the user to open a before/after photo comparison view.

**FR-062.** The before/after comparison shall use:
- the first uploaded photo as the "before" image;
- the most recently uploaded photo as the "after" image.

**FR-063.** The system shall allow the user to close the comparison view without affecting saved plant data.

**FR-171.** The comparison view shall label the two images «Before» and «Now» (UA: «Було», «Зараз»), with the photo dates when available. When more than one plant has two or more photos, the user can switch between those plants in the comparison view with a horizontal swipe on touch devices; a counter «N / total» is shown.

---

## 11. Plant Detail View

**FR-064.** The system shall allow the user to open a detailed plant view.

**FR-065.** The detail view shall display:
- plant photos (with a thumbnail gallery when there are two or more);
- plant name and Latin name;
- location;
- watering section;
- fertilizing section;
- care instructions;
- plant problem / question section;
- actions for Watered, Fertilized, and Edit, subject to current mode restrictions.

**FR-066.** In Caretaker mode, the Edit action shall be hidden in the plant detail view.

**FR-067.** The system shall allow the user to close the detail view (× button or click on the backdrop).

**FR-172.** When the list contains more than one plant, the detail view shall provide previous/next navigation (arrow buttons on wide screens, horizontal swipe on touch devices) and a position counter «N / total». Navigation wraps around: next on the last plant opens the first one, previous on the first plant opens the last one.

**FR-173.** Clicking the main photo in the detail view shall open it full-screen in a lightbox. The lightbox closes with the × button or a click on the backdrop.

---

## 12. Watering Logic

**FR-068.** The system shall support a watering interval in days for each plant.

**FR-069.** The system shall support a last watered date for each plant.

**FR-070.** The system shall automatically calculate watering status based on:
- current date;
- last watered date;
- watering interval.

**FR-071.** The system shall support the following watering statuses:
- Watered
- Water (UA: «Полити»)

**FR-072.** If fewer days have passed since the last watering than the configured watering interval, the status shall be Watered.

**FR-073.** If the number of days since the last watering is equal to or greater than the configured interval (the next watering date is today or has already passed), the status shall be Water.

**FR-074.** The system shall not distinguish between «due today» and «overdue»: both are displayed with the single status Water.

**FR-075.** If the last watered date is missing, the watering status shall be Water.

**FR-076.** When the user initiates a single-plant Watered action, the system shall open a date picker instead of saving immediately.

**FR-077.** The single-plant care date picker shall default to the current date.

**FR-078.** The single-plant Watered action shall be saved only after the user confirms the selected date.

**FR-079.** When the Watered action is confirmed, the system shall update the plant’s last watered date using the selected date.

**FR-080.** The single-plant care date picker shall not allow selecting future dates (the maximum selectable date is the current date).

**FR-081.** After a watering action is saved, the system shall recalculate watering status.

---

## 13. Fertilizing Logic

**FR-082.** The system shall support a fertilizing enabled flag for each plant.

**FR-083.** If fertilizing is disabled for a plant, the system shall display:
- fertilizing frequency text indicating fertilizing is not needed;
- fertilizing status as Do not fertilize.

**FR-084.** If fertilizing is enabled for a plant, the system shall support:
- fertilizing interval in days;
- last fertilized date.

**FR-085.** The system shall automatically calculate fertilizing status based on:
- current date;
- last fertilized date;
- fertilizing interval.

**FR-086.** The system shall support the following fertilizing statuses:
- Fertilized
- Fertilize (UA: «Удобрити»; English UI label: «Needs fertilizer»)
- Do not fertilize

**FR-087.** If fewer days have passed since the last fertilizing than the configured fertilizing interval, the status shall be Fertilized.

**FR-088.** If the fertilizing due date is the current date or has already passed, the status shall be Fertilize.

**FR-089.** If the last fertilized date is missing and fertilizing is enabled, the fertilizing status shall be Fertilize.

**FR-090.** When the user initiates a single-plant Fertilized action, the system shall open a date picker instead of saving immediately.

**FR-091.** The single-plant care date picker shall default to the current date.

**FR-092.** The single-plant Fertilized action shall be saved only after the user confirms the selected date.

**FR-093.** When the Fertilized action is confirmed, the system shall update the plant’s last fertilized date using the selected date.

**FR-094.** The single-plant care date picker shall not allow selecting future dates (the maximum selectable date is the current date).

**FR-095.** After a fertilizing action is saved, the system shall recalculate fertilizing status.

**FR-174.** In the Add/Edit form, the fertilizing interval and last fertilized fields shall be hidden while the fertilizing checkbox («Fertilizing enabled») is off.

---

## 14. Interval Input Behavior

**FR-096.** The watering interval input shall be optional at the form level.

**FR-097.** If the watering interval input is left empty or is saved as NaN, the system shall store the default watering interval value of 7 days.

**FR-098.** The fertilizing interval input shall be optional at the form level.

**FR-099.** If the fertilizing interval input is left empty or is saved as NaN, the system shall store the default fertilizing interval value of 30 days.

**FR-100.** The interval inputs shall accept typing any numeric value, but the minimum accepted value is 1.

**FR-101.** When the user tries to save the form with an interval below 1 (0 or a negative number), native browser validation shall block the submission and show the browser's own message; the form stays open and nothing is saved. The application does not show custom validation messages.

---

## 15. Bulk Actions

**FR-102.** The system shall allow the user to enter bulk-select mode.

**FR-103.** In bulk-select mode, the system shall allow the user to select one or more plants using checkbox-based selection behavior.

**FR-104.** The system shall display the number of selected plants together with a summary of the chosen actions in the form «N selected · will apply: watering | fertilizing | watering and fertilizing | nothing selected», in the selected UI language.

**FR-105.** The bulk action bar shall be visible only when:
- bulk-select mode is active; and
- at least one plant is selected.

**FR-106.** In bulk-select mode, the system shall provide the following controls:
- Watered
- Fertilized
- Apply
- Cancel

**FR-107.** The Watered and Fertilized bulk actions shall behave as toggle buttons.

**FR-108.** Both bulk action toggles shall be OFF by default.

**FR-109.** Selecting Fertilized shall automatically enable Watered.

**FR-110.** The user may manually turn Watered off again after Fertilized auto-enables it. This does not change the result: when Apply is confirmed with Fertilized selected, the last watered date is updated as well (see FR-118).

**FR-111.** Bulk actions shall not execute immediately when action toggles are selected.

**FR-112.** No bulk changes shall be saved until the user clicks Apply and confirms the date.

**FR-113.** If the user clicks Apply with no action toggles enabled, the system shall show an alert and shall not open the date picker.

**FR-114.** When the user clicks Apply with at least one action selected, the system shall open a shared date picker for the selected plants.

**FR-115.** The bulk action date picker shall default to the current date.

**FR-116.** The bulk action date picker shall not allow selecting future dates (the maximum selectable date is the current date).

**FR-117.** The selected bulk action date shall be applied identically to all selected plants for all selected actions.

**FR-118.** If Watered is selected, or if Fertilized is selected (fertilizing always implies watering), the system shall update last watered date for all selected plants using the confirmed date.

**FR-119.** If Fertilized is selected, the system shall update last fertilized date for all selected plants using the confirmed date.

**FR-120.** If both Watered and Fertilized are selected, the same confirmed date shall be applied to both date fields.

**FR-121.** After a bulk action is applied, the system shall recalculate relevant watering and fertilizing statuses.

**FR-122.** Clicking Cancel in bulk-select mode shall exit the mode without applying unconfirmed changes.

**FR-175.** The system shall provide a «Select all» action in the header. If bulk-select mode is not active, the action enables it (exiting reorder and Caretaker modes). In every case it selects all plants currently visible in the list, taking the active status filter into account. Pressing it again does not deselect plants.

---

## 16. Undo for Bulk Actions

**FR-123.** The system shall support undo only for the most recent bulk action.

**FR-124.** After a bulk action is successfully applied, the system shall display a toast that states what was updated and for how many plants (e.g. «Updated watering for 2 plants»), with an Undo action and a close (×) button. Closing the toast makes Undo unavailable.

**FR-125.** The undo toast shall remain available for 15 seconds.

**FR-126.** Undo shall restore the previous watering and/or fertilizing dates for exactly the plants affected by the most recent bulk action.

**FR-127.** Undo shall be single-level only.

**FR-128.** Undo availability shall be limited to the current page session.

**FR-129.** Undo shall be lost if:
- the page is reloaded;
- the page is reopened;
- another bulk action is executed.

**FR-130.** Single-plant Watered and Fertilized actions shall not support undo.

---

## 17. Reorder Mode

**FR-131.** The system shall allow the user to enter reorder mode.

**FR-132.** In reorder mode, the system shall allow the user to change plant order.

**FR-133.** After plant order is changed, the updated order shall be saved.

**FR-134.** The saved order shall persist after page refresh.

---

## 18. Caretaker Mode

**FR-135.** The system shall support a dedicated Caretaker mode.

**FR-136.** Caretaker mode shall be accessible from the main screen.

**FR-137.** In Caretaker mode, the interface shall be optimized for quick care actions.

**FR-138.** In Caretaker mode, the Add Plant action shall remain visible in the header but disabled (dimmed and not clickable).

**FR-139.** In Caretaker mode, the Edit action shall be hidden in the plant detail view.

**FR-140.** Since deletion is only available through the Edit form, plant deletion shall be effectively unavailable in Caretaker mode.

**FR-141.** In Caretaker mode, quick Watered and Fertilized actions shall appear directly on plant cards.

**FR-142.** In Caretaker mode, the instructions block on plant cards shall be visually highlighted for easier scanning.

**FR-143.** Caretaker mode and bulk-select mode may be active at the same time: enabling one with its own toggle shall not exit the other. Exception: the «Select all» action exits Caretaker mode when it enables bulk-select mode (see FR-175).

**FR-144.** Enabling Caretaker mode shall automatically exit reorder mode if it is active.

**FR-145.** Reorder mode is mutually exclusive with both Caretaker mode and bulk-select mode: enabling reorder exits the other two, and enabling Caretaker or bulk-select mode exits reorder. Caretaker mode and bulk-select mode are compatible (see FR-143).

**FR-146.** Caretaker mode shall not persist after page refresh.

**FR-147.** In Caretaker mode, users shall still be able to open plant detail views.

**FR-176.** When Caretaker mode and bulk-select mode are both active, clicking a plant card toggles its selection, while the quick Watered / Fertilized buttons on the card keep working for that single plant.

---

## 19. AI Features

### 19.1 AI Care Suggestions

**FR-148.** The Add/Edit plant form shall provide an AI generation action for care suggestions.

**FR-149.** A single AI request shall return:
- care instructions text;
- suggested watering interval;
- suggested fertilizing interval.

**FR-150.** AI-generated suggestions shall populate the corresponding form fields only.

**FR-151.** AI-generated suggestions shall not be saved automatically.

**FR-152.** AI-generated suggestions shall persist only if the user clicks Save in the form.

**FR-153.** If AI generation fails, existing form values shall remain unchanged.

**FR-154.** AI failure shall show an alert with the error text when the action was triggered manually (Generate button), and shall fail silently when it was triggered automatically (FR-177).

**FR-177.** When a new plant is being created (not edited), the Plant name field loses focus with a non-empty value and the care instructions field is empty, the system shall automatically request AI suggestions once per opening of the form. While the request runs, the interval fields are shown in a loading state; on success the instructions and intervals are filled in as with manual generation (FR-149, FR-150).

**FR-178.** Manual AI generation with an empty plant name shall show an alert and send no request. If the instructions field is not empty, the system shall ask for confirmation before replacing it with the generated text.

### 19.2 AI Plant Problem Q&A

**FR-155.** The plant detail view shall provide an Ask AI action for plant problem questions.

**FR-156.** Ask AI shall require the user to type a question before the request is sent.

**FR-157.** If the question field is empty, the system shall show an alert and shall not send the AI request.

**FR-158.** The AI answer shall be displayed in the UI.

**FR-159.** The AI answer shall be ephemeral and shall not be stored in plant data.

**FR-160.** The AI answer shall be cleared when the user switches to another plant or closes the detail view.

**FR-161.** In the current version, the AI answer shall be displayed without any additional disclaimer text.

**FR-179.** While an Ask AI request is in progress, the Ask AI button shall be disabled and show a progress label. If the request fails (API error or network error), an alert shall show the error text and the button shall become available again; if the question is empty, focus returns to the question field.

---

## 20. Shared Access and Synchronization

**FR-162.** The application shall use link-based shared access.

**FR-163.** Anyone with the shared list URL may access the corresponding list.

**FR-164.** The application shall not provide real-time synchronization between users.

**FR-165.** Data shall be fetched from the API on initial page load only (the plant list first, then photos in the background, see FR-170).

**FR-166.** Changes made by one user shall become visible to another user only after manual page refresh or reopen.

**FR-167.** If multiple users edit the same list concurrently, the effective behavior shall be last-write-wins.

**FR-168.** The current version shall not show a warning about concurrent edits or stale data.

**FR-180.** If the shared storage (API) is unavailable when the page loads, the list shall be read from the browser's local storage on that device. When saving, if the shared storage cannot be written, the data shall be saved in the local storage of the device and an alert shall warn that part of the changes could not be saved in the shared database (with technical details if saving a photo failed).

---

## 21. Business Rules

**BR-001.** Plant name is the only required form field.

**BR-002.** Shared lists are anonymous and are identified only by the `id` URL parameter.

**BR-003.** Status badges on plant cards are informational only; filtering is done through the legend chips.

**BR-004.** Missing last watered date shall be treated as watering due (status Water).

**BR-005.** Missing last fertilized date for a plant with fertilizing enabled shall be treated as fertilizing due.

**BR-006.** Fertilizing enabled is a simple boolean field and does not include seasonal or advanced care logic.

**BR-007.** Single-plant Watered and Fertilized actions always require explicit date confirmation.

**BR-008.** Bulk actions use one shared confirmed date for all selected plants and all selected actions.

**BR-009.** Selecting Fertilized in bulk mode auto-enables Watered. If the user turns Watered off again, applying still updates the last watered date (fertilizing implies watering); the action bar summary may then list only fertilizing.

**BR-010.** Plant deletion is permanent after confirmation.

**BR-011.** Undo applies only to the most recent bulk action.

**BR-012.** Undo is temporary and session-scoped.

**BR-013.** AI-generated form suggestions are not persisted unless the form is saved.

**BR-014.** Ask AI answers are temporary and are not stored in plant records.

**BR-015.** Interval inputs use fallback defaults only when empty or invalid as NaN. Values below 1 are not saved: native browser validation blocks the submission.

---

## 22. Non-Functional Requirements

**NFR-001.** The application shall work in modern desktop and mobile browsers.

**NFR-002.** The application UI shall be available in Ukrainian (default) and English. The selected language is stored in the browser and applied to the `lang` attribute of the page.

**NFR-003.** List data shall persist across page refreshes for the same shared list ID.

**NFR-004.** The application shall use native browser date inputs for date selection.

**NFR-005.** Uploaded images shall be compressed before storage to reduce payload size.

**NFR-006.** The application shall support multiple photos per plant.

**NFR-007.** Image/photo limits may still be constrained by backend storage limits.

**NFR-008.** The application shall not provide real-time synchronization.

**NFR-009.** The application shall not provide conflict detection for concurrent edits.

**NFR-010.** The Add/Edit form closes after the save attempt completes, even if the backend save failed fully or partially; in that case a warning alert is shown (see FR-180).

**NFR-011.** In the current version, some failures such as image compression failure may not produce user-facing error feedback.

---

## 23. Known Limitations

**KL-001.** Shared access is based entirely on possession of the URL.

**KL-002.** There is no real-time sync between users.

**KL-003.** Concurrent edits follow last-write-wins behavior.

**KL-004.** Undo is available only for the latest bulk action and only for 15 seconds.

**KL-005.** Single-plant care actions cannot be undone.

**KL-006.** Plant deletion cannot be undone.

**KL-007.** Interval inputs show no custom validation messages; values below 1 are blocked only by native browser validation.

**KL-008.** The current version does not show a user-facing error if image compression fails.

**KL-009.** The Add/Edit form closes even if saving to the backend fails; the user is informed only by an alert, and the data stays in the local storage of this device only.

**KL-010.** Status badges on plant cards are not clickable; filtering is available only through the legend chips (hidden in reorder mode).

**KL-011.** The summer schedule feature is not part of the current version.

**KL-012.** The bulk action bar summary may list only «fertilizing» although the last watered date is updated as well (fertilizing implies watering).

**KL-013.** AI care suggestions and AI answers are always in Ukrainian: the language is hard-coded in the server prompts and the UI language is not sent to the API. This conflicts with LF-005 / LF-006 (see bug report BR-003 in `Bug_reports.md`).

---

## 24. Summary

The current version of LeafLOG includes the following core modules:
- shared anonymous plant lists by URL;
- plant CRUD;
- multi-photo support;
- before/after comparison;
- watering and fertilizing tracking;
- single-plant care logging with date confirmation;
- bulk care actions with limited undo;
- reorder mode;
- caretaker mode;
- AI-generated care suggestions;
- AI plant problem Q&A;
- UI language switcher (UA / EN);
- status filters;
- fertilizing calendar;
- footer with shared-list actions.

This document reflects the current implemented behavior of the project and can be used as the baseline for:
- test plan;
- checklist;
- test cases;
- bug reporting scope;
- regression coverage.

---

## 25. Revision Notes

**Revision of 2026-10-29.** The document was checked against the implemented behavior (code review plus checks in the browser). New requirement IDs continue the numbering (FR-169 … FR-180) so existing IDs stay stable.

| Area | Changed / added IDs | What changed |
|---|---|---|
| Scope | 2.1, 2.2 | Language switcher, filters and calendar moved into scope |
| Shared list | FR-002, FR-003, FR-006, FR-008, FR-009 | Stored ID is used when URL has no `id`; a foreign `id` no longer overwrites the stored one; confirm before creating a new list; clipboard fallback |
| Main screen | FR-012, FR-017, FR-018, FR-025 | New header actions; badges on cards are not filters; order and storage model |
| Photos, details | FR-169 … FR-173 | Photo dates, background loading, comparison labels and swipe, detail navigation, lightbox |
| Watering | FR-071, FR-073 … FR-075, FR-080 | Two statuses (Watered / Water); no «Overdue» |
| Fertilizing | FR-086, FR-174 | Status labels; fertilizing fields hidden when disabled |
| Intervals | FR-100, FR-101, BR-015, KL-007 | Values below 1 are blocked by native validation |
| Bulk | FR-104, FR-110, FR-116, FR-118, FR-175, BR-009, KL-012 | Summary line, «Select all», fertilizing implies watering |
| Undo | FR-124 | Toast text and close button |
| Caretaker | FR-138, FR-143, FR-145, FR-176 | «Add plant» disabled instead of hidden; Caretaker and bulk modes are compatible |
| AI | FR-154, FR-177 … FR-179, KL-013 | Automatic suggestion on name blur, overwrite confirm, Ask AI states; AI language gap |
| Sync | FR-165, FR-180, NFR-010, KL-009 | Local storage fallback and save-failure alert |
| Language | NFR-002 | UI is available in two languages |
| Filters | BR-003, KL-010 | Filtering is done through legend chips |
