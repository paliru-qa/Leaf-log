# Test Plan
## LeafLOG Web Application

**Version:** 2.3  
**Status:** Draft  
**Application Under Test:** LeafLOG  
**Test Environment URL:** https://leaf-log-six.vercel.app/?id=rycu0sei  
**Reference Documents:** Functional Requirements v2.0, Feature Requirements v1.2, Feature Requirements v2.1, Feature Requirements v3.1 (planned feature, Feature 8)  
**Test Basis:** Reverse-engineered implemented behavior from live application UI

---

## 1. Objective

The purpose of this test plan is to define the scope, approach, resources, test levels, and deliverables for manual testing of the LeafLOG web application.

This test plan is intended to verify that the current implemented version of the application behaves according to the documented **Functional Requirements v2.0**, **Feature Requirements v1.2** (header layout, language switcher, footer), and **Feature Requirements v2.1** (status filters, fertilizing calendar, reorder mode update), including expected business rules, current limitations, and known non-ideal behavior.

---

## 2. Product Overview

LeafLOG is a web application for managing household plants. The application allows users to:

- create and maintain plant records;
- upload one or more plant photos;
- track watering and fertilizing activities;
- update care-related dates for individual plants or multiple plants at once;
- filter the plant list by a single status;
- review fertilizing history and forecast in a dedicated calendar view;
- reorder plants via a dedicated drag handle;
- use Caretaker mode for simplified quick care actions;
- share the same plant list through a URL-based `id` parameter;
- switch the UI language between Ukrainian and English;
- use AI assistance for care suggestions and plant problem questions, returned in the currently selected language.

---

## 3. Test Scope

### 3.1 In Scope

The following functional areas are included in test scope:

1. **Shared List Model**
   - URL `id` handling
   - new list generation
   - local storage precedence behavior
   - copy share link
   - create separate list

2. **Header Layout and Stability**
   - three-row header structure
   - Add Plant reserved space when hidden
   - control stability across hover/press/toggle states
   - stability across modes and viewport sizes

3. **Language Switcher (UA / EN)**
   - switching between Ukrainian and English
   - coverage of all UI text areas
   - persistence after refresh
   - AI output language consistency
   - no auto-translation of saved plant data

4. **Footer**
   - copyright/tagline display
   - share-list actions
   - responsive positioning (short vs. long page content)

5. **Main Screen and Plant List**
   - top bar actions
   - empty state
   - plant card rendering
   - status badges
   - saved plant order display

6. **Status Filters**
   - single active filter behavior
   - filter toggle on repeated click
   - filtered empty state
   - filter reset via logo click

7. **Plant CRUD**
   - add plant
   - edit plant
   - delete plant
   - required and optional fields
   - unsaved changes discard behavior
   - fertilizing checkbox label wording

8. **Plant Photos**
   - image upload
   - multiple photo support
   - photo preview
   - photo removal before save
   - before/after comparison

9. **Plant Detail View**
   - detail view opening/closing
   - displayed plant information
   - navigation between plants
   - restrictions by mode

10. **Watering Logic**
    - watering interval behavior
    - two-state watering status (Watered / Water — no separate Overdue state)
    - single-plant Watered flow
    - date validation for future dates

11. **Fertilizing Logic**
    - fertilizing enabled/disabled behavior
    - fertilizing statuses
    - single-plant Fertilized flow
    - date validation for future dates

12. **Interval Input Behavior**
    - default fallback values
    - empty / NaN handling
    - acceptance of `0` and negative values in current implementation

13. **Bulk Actions**
    - bulk-select mode
    - plant selection behavior
    - Watered / Fertilized toggles
    - Apply / Cancel flow
    - shared date application
    - recalculation of statuses

14. **Undo for Bulk Actions**
    - toast visibility
    - single-level undo
    - 15-second timeout
    - session-scoped behavior

15. **Reorder Mode**
    - entering reorder mode
    - dedicated drag-handle interaction
    - auto-scroll near viewport edges
    - changing order
    - persistence after refresh
    - mutual exclusivity with other modes

16. **Caretaker Mode**
    - entering/exiting caretaker mode
    - mutual exclusivity with other modes
    - hidden Add Plant / Edit actions
    - quick actions on cards
    - instruction highlight behavior

17. **Fertilizing Calendar**
    - trigger visibility, placement, and styling
    - sidebar open/close behavior
    - month navigation
    - highlight intensity scaling by plant count
    - selected-date plant list and terminology
    - language and shared-list scoping

18. **AI Features**
    - AI care suggestion generation in form
    - AI plant problem Q&A in detail view
    - validation for empty question
    - temporary nature of AI output
    - output language matches selected UI language
    - retry behavior on transient empty AI response

19. **Shared Access and Synchronization**
    - shared access through URL
    - absence of real-time synchronization
    - refresh-based visibility of remote changes
    - last-write-wins behavior

20. **English Version of Plant Name and Care Instructions** *(planned feature, Feature Requirements v3.1; test after implementation)*
    - English UI shows `nameEn` / `instructionsEn` when non-empty (whitespace counts as empty), otherwise the original, per field independently
    - Ukrainian UI always shows the original
    - all display places: plant card (name, alt text, Caretaker instructions), detail view, before/after comparison, fertilizing calendar, Ask AI request
    - Edit form in English UI: prefill, optional name, saving only non-empty values that differ from the original
    - Edit form in Ukrainian UI: original values, English version preserved
    - Add form in English UI: entered values saved to both the original and the English field
    - hint under the name field when the name is changed in one language only
    - AI instruction generation in the form follows the form language
    - English fields preserved by every other save (care actions, bulk, Caretaker, reorder, reload)
    - shared list: English version visible to every session

### 3.2 Out of Scope

The following items are out of scope for this test cycle because they are not part of the current implementation:

- user registration / login / authentication;
- role-based authorization;
- notifications / reminders;
- real-time synchronization;
- conflict detection and merge resolution;
- plant history timeline;
- languages other than Ukrainian and English;
- summer schedule feature;
- clear-all-data feature;
- direct care actions (Watered/Fertilized) from within the Fertilizing Calendar sidebar.

---

## 4. Test Items

The following items will be tested:

- live deployed web application at  
  `https://leaf-log-six.vercel.app/?id=rycu0sei`
- client-side UI behavior
- interaction flows and state changes
- browser-native date input behavior
- shared-list behavior through URL
- localization behavior (UA/EN) across UI and AI output
- AI-related front-end request flows
- persistence behavior after refresh
- visible error handling and user feedback where implemented

---

## 5. Features to Be Tested

### 5.1 Functional Areas
- shared list initialization and switching;
- header layout stability across modes;
- language switching and persistence;
- footer content and positioning;
- plant list display and status filtering;
- plant add/edit/delete flows;
- multi-photo handling;
- photo comparison flow;
- plant detail rendering;
- watering status calculation (two-state);
- fertilizing status calculation;
- date picker flows;
- bulk actions and undo;
- reorder behavior via drag handle;
- caretaker mode behavior;
- fertilizing calendar rendering, navigation, and interaction;
- AI-assisted instruction generation;
- AI question-answer flow;
- shared access limitations;
- English version of plant name and care instructions (after implementation).

### 5.2 UI/UX Behavior
- visibility and hiding of controls depending on mode;
- consistency of action availability;
- correct rendering of badges, buttons, placeholders, and instructions blocks;
- proper modal/panel opening and closing behavior;
- consistent button/chip corner-radius styling;
- header and footer layout stability across desktop and mobile.

### 5.3 Data Persistence
- persistence after save;
- persistence after refresh;
- discard behavior after closing form without save;
- session-scoped undo limitation;
- selected language persistence;
- persistence of `nameEn` / `instructionsEn` after save, reload and unrelated plant updates.

---

## 6. Features Not to Be Tested in Depth

The following areas may be sanity-checked but are not primary validation targets in this plan:

- visual design polish and branding consistency;
- backend internals and database structure;
- exact AI answer quality/content correctness (botanical accuracy);
- exact compression ratio for every uploaded photo;
- cross-device camera integration specifics;
- browser-specific native date input UI differences beyond core functional behavior;
- internal AI-backend model selection and token-budget tuning, beyond confirming the feature completes successfully.

---

## 7. Test Approach

### 7.1 Test Type
This test cycle will use:

- **manual functional testing**
- **exploratory testing**
- **UI validation**
- **business rule validation**
- **state transition testing**
- **localization spot-checking**
- **basic regression testing**
- **automated regression** (Playwright, API mocked) for the English-version feature, in addition to manual checks

### 7.2 Test Design Techniques
The following test design techniques will be applied where relevant:

- equivalence partitioning;
- boundary value analysis;
- decision table thinking for statuses and mode restrictions;
- state transition testing;
- error guessing;
- exploratory scenario-based testing.

### 7.3 Testing Strategy
Testing will be executed module by module using Functional Requirements v2.0 (content version 2.1), Feature Requirements v1.2, Feature Requirements v2.1, and Feature Requirements v3.1 as the baseline.  
For each functional area, testing will cover:

- positive flows;
- negative flows;
- edge cases;
- persistence behavior;
- mode-dependent restrictions;
- interactions between features.

Special attention will be paid to:

- current limitations explicitly documented as accepted behavior;
- bulk action side effects;
- shared URL behavior;
- ephemeral AI response behavior;
- non-persistent UI states after refresh;
- consistency of behavior and labels across both supported languages;
- English version of plant data: fallback to the original, no loss of English fields on unrelated saves;
- correct mutual exclusivity between Caretaker, bulk-select, and reorder modes.

---

## 8. Test Levels

### 8.1 Smoke Testing
A short smoke test shall be executed before detailed testing to confirm that the environment is usable.

Smoke coverage:
- app opens successfully;
- list loads;
- top bar actions are visible;
- language can be switched;
- plant can be added;
- detail view opens;
- save works;
- Fertilizing Calendar opens and closes;
- refresh does not break the list.

### 8.2 Functional Testing
Detailed manual functional testing shall validate compliance with documented requirements and business rules.

### 8.3 Regression Testing
Regression testing shall be performed:
- after bug fixes;
- after UI changes;
- after logic changes to watering/fertilizing/modes;
- after color/theme updates if they affect visibility or action states;
- after AI backend/model configuration changes;
- after localization string changes.

---

## 9. Entry Criteria

Testing may start when the following conditions are met:

- live environment is accessible;
- test URL is available;
- Functional Requirements v2.0, Feature Requirements v1.2, and Feature Requirements v2.1 are approved as the baseline;
- tester has access to at least one clean browser session;
- basic test data can be created or already exists in the test list.

---

## 10. Exit Criteria

Testing may be considered complete when:

- all planned high-priority functional areas have been executed;
- all planned test cases are run or explicitly deferred;
- critical and high-severity defects are documented;
- blocked tests are identified with reasons;
- regression verification is completed for fixed issues in scope;
- a test summary is prepared.

---

## 11. Suspension Criteria and Resumption Criteria

### 11.1 Suspension Criteria
Testing may be suspended if:

- the environment becomes unavailable;
- the app fails to load consistently;
- core actions such as save, load, or navigation stop working;
- API failures prevent meaningful execution of major features;
- the AI backend consistently fails across all configured models;
- shared test list becomes corrupted or unusable.

### 11.2 Resumption Criteria
Testing may resume when:

- the environment is stable again;
- blocking issues are resolved or bypassed;
- test data is restored or recreated;
- affected modules can be retested.

---

## 12. Test Environment

### 12.1 Primary Test Environment
- **Application URL:** `https://leaf-log-six.vercel.app/?id=rycu0sei`
- **Environment Type:** Production-like live deployment
- **Data Model:** Shared anonymous plant list via URL `id`

### 12.2 Browser Coverage

Testing should include validation in the primary target environments listed below.

- **Desktop**
  - Google Chrome (latest stable)
  - Microsoft Edge (latest stable)

- **Mobile**
  - Safari on iPhone with a current iOS version
  - Chrome on Android with a current Android version

### 12.3 Screen / Viewport Coverage

| Device Category | Target Width / Resolution | Notes |
|---|---:|---|
| Mobile iPhone | `390px` width | current iPhone-sized viewport |
| Mobile Android | `412px` width | common Android viewport |
| Tablet portrait | `768px` width | tablet responsive layout |
| Tablet landscape / small laptop | `1024px` width | breakpoint validation |
| Small desktop | `1200px` width | standard desktop layout |
| Large desktop | `1900px` width | wide-screen layout validation |

### 12.4 Responsive Validation Focus

The following areas should be checked across the listed viewport sizes:

- header layout and control stability
- top-bar wrapping and alignment
- horizontal padding consistency between header, main content, and footer
- language switcher placement and behavior
- footer positioning (short vs. long page content)
- plant card grid behavior
- status filter row / legend layout
- Fertilizing Calendar trigger placement (top-right, icon-only, no overlap with filter chips)
- Fertilizing Calendar sidebar layout and readability
- modal / form usability
- date picker accessibility and visibility
- bulk action bar visibility and usability
- detail view layout
- caretaker mode card layout
- reorder mode drag-handle usability and auto-scroll
- AI sections readability
- button and badge corner-radius consistency
- button stability across interaction states
- absence of clipping, overlap, or hidden critical controls

### 12.5 Environment Notes

- Exact rendering of native date inputs may differ between desktop and mobile browsers.
- Mobile testing may be performed on real devices or browser emulation, depending on availability.
- Cross-browser coverage in this test cycle is limited to the primary browsers available for execution.
- The AI backend (Groq) model configuration may change between test cycles; confirm the currently configured model(s) before executing AI-related scenarios.

---

## 13. Test Data

### 13.1 Core Test Data
Test data should include plant records with combinations such as:

- plant with name only;
- plant with all optional fields filled;
- plant with fertilizing enabled;
- plant with fertilizing disabled;
- plant with no photo;
- plant with one photo;
- plant with multiple photos;
- plant with no last watered date;
- plant with no last fertilized date;
- plant with an English version of the name and instructions (`nameEn`, `instructionsEn`);
- plant with only one of the two English fields filled;
- plant with an English field containing only whitespace;
- plant with interval values left empty;
- plant with interval value `0`;
- plant with negative interval value;
- multiple plants sharing the same fertilizing date, in increasing counts (1, 2, 3-4, 5-9, 10+), to validate calendar highlight intensity scaling.

### 13.2 Suggested Named Test Plants
Example test data set:
- Monstera Basic
- Ficus Full Data
- Pothos No Fertilizer
- Calathea Multi Photo
- Aloe Missing Dates
- Orchid Zero Interval
- Fern Negative Interval
- Palm Group A / B / C (shared fertilizing date, for calendar intensity testing)
- Monstera Bilingual (`name` in Ukrainian, `nameEn`, `instructions` and `instructionsEn` filled)
- Ficus Name Only (`nameEn` filled, `instructionsEn` empty)

### 13.3 AI Test Data
- valid plant name only
- valid plant name + Latin name + room
- empty question
- non-empty plant problem question
- question with symptoms text
- AI requests executed in both Ukrainian and English UI language
- instruction generation from the Edit form in English UI, with and without existing instructions (overwrite confirmation)

---

## 14. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| Manual QA Engineer | prepare artifacts, execute tests, record results, report defects |
| Reviewer / Portfolio Owner | review documentation, confirm scope and artifact quality |
| Developer / App Owner | fix defects if applicable, clarify intended current behavior if needed |

---

## 15. Deliverables

The expected QA deliverables for this project are:

- Functional Requirements v2.0
- Feature Requirements v1.2
- Feature Requirements v2.1
- Feature Requirements v3.1
- Test Plan v2.3
- Checklist v2.3
- Detailed Test Cases (updated)
- Bug Reports / Known Issues
- Test Summary Report
- Supporting screenshots if needed

---

## 16. Defect Management

### 16.1 Defect Logging
All defects found during execution should be logged with:
- title;
- environment;
- preconditions;
- steps to reproduce;
- actual result;
- expected result;
- severity;
- priority;
- attachment/reference if available.

### 16.2 Severity Levels
Suggested severity model:

- **Critical** — application or core flow unusable; data loss risk in major scenario
- **High** — major feature broken or strongly misleading
- **Medium** — feature partially broken; workaround exists
- **Low** — minor UI/content/consistency issue

### 16.3 Priority Levels
Suggested priority model:

- **P1** — must be fixed before release/demo
- **P2** — should be fixed soon
- **P3** — can be fixed later
- **P4** — cosmetic / optional improvement

---

## 17. Risks and Assumptions

### 17.1 Risks
- shared test data may be modified during testing by another session/user;
- lack of real-time sync may cause apparent inconsistencies until refresh;
- last-write-wins behavior may overwrite concurrent changes;
- AI endpoints may fail intermittently, including transient empty responses from reasoning models;
- image upload success may vary depending on file size and backend constraints;
- live environment may change while documentation is being prepared;
- AI backend model availability may change (e.g. provider deprecating a model), affecting AI-dependent scenarios.

### 17.2 Assumptions
- the current Functional Requirements v2.0 and Feature Requirements v1.2 / v2.1 correctly reflect implemented behavior; Feature Requirements v3.1 describes a feature that is not live until it is released;
- the provided test URL remains accessible during the test cycle;
- browser-native date input behavior is acceptable if functionally consistent with requirements;
- AI correctness is evaluated only from integration/behavior perspective, not botanical accuracy;
- both Ukrainian and English translations are expected to be complete and consistent across the UI.

---

## 18. Traceability

Testing shall be traceable to:
- Functional Requirements (`FR-*`)
- Business Rules (`BR-*`)
- Non-Functional Requirements (`NFR-*`)
- Known Limitations (`KL-*`)
- Header Layout Requirements (`HF-*`)
- Language Switcher Requirements (`LF-*`)
- Footer Requirements (`FF-*`)
- Status Filter Requirements (`FL-*`)
- Fertilizing Calendar Requirements (`FC-*`)
- Reorder Mode Update Requirements (`RF-*`)
- Localized Content Requirements (`LC-*`, `AC-LC-*`, Feature Requirements v3.1)

Each checklist item and test case should reference related requirement IDs where applicable.

---

## 19. High-Level Test Scenarios

The following high-level scenarios shall be covered:

1. Open application with shared list ID and validate list loading.
2. Switch UI language between Ukrainian and English and validate coverage across all screens.
3. Refresh the page and validate the selected language persists.
4. Validate header layout stability across normal, Caretaker, bulk-select, and reorder modes.
5. Validate footer content, share-link action, and create-new-list action.
6. Create a new plant with only required data.
7. Create a plant with full optional data.
8. Validate fertilizing checkbox label wording in Add and Edit forms.
9. Edit existing plant and validate persistence.
10. Delete plant from Edit form and validate permanent removal.
11. Upload multiple photos and validate preview and saved display.
12. Open before/after comparison for multi-photo plant.
13. Validate the two-state watering status (Watered / Water) across due and overdue timing.
14. Validate fertilizing statuses across enabled/disabled/due states.
15. Perform single-plant Watered and Fertilized actions.
16. Validate future-date blocking in care actions.
17. Validate interval fallback behavior for empty/invalid input.
18. Validate acceptance of `0` and negative intervals as current behavior.
19. Click a status badge and validate list filtering, then clear the filter.
20. Validate filtered empty state and reset control.
21. Clear an active filter and exit Caretaker mode via logo click.
22. Enter bulk-select mode and apply Watered to multiple plants.
23. Apply Fertilized in bulk and validate dependent Watered behavior.
24. Apply both bulk actions and verify same date is used.
25. Undo the latest bulk action within 15 seconds.
26. Validate undo loss after refresh or subsequent bulk action.
27. Enter reorder mode and drag a tile using the dedicated handle to a new position.
28. Validate auto-scroll while dragging a tile near the top/bottom viewport edge.
29. Validate reordered list persists after refresh.
30. Enable Caretaker mode and validate restricted UI.
31. Use quick actions in Caretaker mode from plant cards.
32. Open the Fertilizing Calendar and validate the current month, today's outline, and navigation.
33. Validate highlight intensity scaling for dates with increasing numbers of plants.
34. Click a highlighted date and validate the plant list and terminology below the calendar.
35. Close the Fertilizing Calendar via X, backdrop click, and logo click.
36. Generate AI care suggestions in Add/Edit form and validate output language.
37. Ask AI a plant problem question in detail view and validate output language.
38. Validate AI answer reset when switching plants or closing detail view.
39. Validate AI retry behavior when a request initially returns an empty response.
40. Validate shared access behavior in two separate sessions.
41. Validate lack of real-time sync and manual refresh requirement.
42. In English UI, open a plant with English name and instructions and validate the card, detail view, comparison and fertilizing calendar show the English version.
43. In English UI, open a plant without an English version (or with whitespace only) and validate the original is shown; check each field independently.
44. In Ukrainian UI, validate the original name and instructions are always shown, even when an English version exists.
45. Edit a plant in English UI: change the name and instructions, save, and validate the original is unchanged, the English version is shown in English UI and hidden in Ukrainian UI.
46. Save the Edit form in English UI without changes (and with the name cleared) and validate no English fields are created or the original is shown again.
47. Edit a plant in Ukrainian UI and validate the English version is preserved after save and reload.
48. Create a plant in English UI and validate it is stored as both the original and the English version; create one in Ukrainian UI and validate no English version is stored.
49. Change the name in the Edit form and validate the hint text (language of the form), that it disappears when the original value is restored, and that it never appears in the Add form.
50. Generate instructions with AI in the English Edit form, confirm the overwrite prompt, and validate the result is English and saved as the English version.
51. Perform care actions (single, Caretaker, bulk), reorder, and reload, then validate the English version is still there.
52. Open the same list in a second session and validate it shows the English version after refresh.

---

## 20. Pass / Fail Criteria

A test is considered **Pass** if the observed behavior matches the documented expected behavior for the current version, including accepted limitations.

A test is considered **Fail** if:
- actual behavior contradicts the documented requirement;
- required UI element or action is missing;
- incorrect state/data is saved;
- restriction or business rule is violated unexpectedly;
- visible behavior is inconsistent with current documented implementation;
- a UI label or AI-returned text does not match the currently selected language.

---

## 21. Approval

| Name | Role | Status |
|---|---|---|
| QA Portfolio Author | Manual QA Engineer | Draft |
| Reviewer | Optional | Pending |
