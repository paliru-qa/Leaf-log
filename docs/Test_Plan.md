# Test Plan
## LeafLOG Web Application

**Version:** 1.0  
**Status:** Draft  
**Application Under Test:** LeafLOG  
**Test Environment URL:** https://leaf-log-six.vercel.app/?id=rycu0sei  
**Reference Document:** Functional Requirements v1.0  
**Test Basis:** Reverse-engineered implemented behavior from live application UI

---

## 1. Objective

The purpose of this test plan is to define the scope, approach, resources, test levels, and deliverables for manual testing of the LeafLOG web application.

This test plan is intended to verify that the current implemented version of the application behaves according to the documented **Functional Requirements v1.0**, including expected business rules, current limitations, and known non-ideal behavior.

---

## 2. Product Overview

LeafLOG is a web application for managing household plants. The application allows users to:

- create and maintain plant records;
- upload one or more plant photos;
- track watering and fertilizing activities;
- update care-related dates for individual plants or multiple plants at once;
- reorder plants;
- use Caretaker mode for simplified quick care actions;
- share the same plant list through a URL-based `id` parameter;
- use AI assistance for care suggestions and plant problem questions.

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

2. **Main Screen and Plant List**
   - top bar actions
   - empty state
   - plant card rendering
   - status badges
   - saved plant order display

3. **Plant CRUD**
   - add plant
   - edit plant
   - delete plant
   - required and optional fields
   - unsaved changes discard behavior

4. **Plant Photos**
   - image upload
   - multiple photo support
   - photo preview
   - photo removal before save
   - before/after comparison

5. **Plant Detail View**
   - detail view opening/closing
   - displayed plant information
   - navigation between plants
   - restrictions by mode

6. **Watering Logic**
   - watering interval behavior
   - watering statuses
   - single-plant Watered flow
   - date validation for future dates

7. **Fertilizing Logic**
   - fertilizing enabled/disabled behavior
   - fertilizing statuses
   - single-plant Fertilized flow
   - date validation for future dates

8. **Interval Input Behavior**
   - default fallback values
   - empty / NaN handling
   - acceptance of `0` and negative values in current implementation

9. **Bulk Actions**
   - bulk-select mode
   - plant selection behavior
   - Watered / Fertilized toggles
   - Apply / Cancel flow
   - shared date application
   - recalculation of statuses

10. **Undo for Bulk Actions**
    - toast visibility
    - single-level undo
    - 15-second timeout
    - session-scoped behavior

11. **Reorder Mode**
    - entering reorder mode
    - changing order
    - persistence after refresh

12. **Caretaker Mode**
    - entering/exiting caretaker mode
    - mutual exclusivity with other modes
    - hidden Add Plant / Edit actions
    - quick actions on cards
    - instruction highlight behavior

13. **AI Features**
    - AI care suggestion generation in form
    - AI plant problem Q&A in detail view
    - validation for empty question
    - temporary nature of AI output

14. **Shared Access and Synchronization**
    - shared access through URL
    - absence of real-time synchronization
    - refresh-based visibility of remote changes
    - last-write-wins behavior

### 3.2 Out of Scope

The following items are out of scope for this test cycle because they are not part of the current implementation:

- user registration / login / authentication;
- role-based authorization;
- notifications / reminders;
- real-time synchronization;
- conflict detection and merge resolution;
- plant history timeline;
- multilingual support;
- summer schedule feature;
- clear-all-data feature;
- clickable filtering via status badges.

---

## 4. Test Items

The following items will be tested:

- live deployed web application at  
  `https://leaf-log-six.vercel.app/?id=rycu0sei`
- client-side UI behavior
- interaction flows and state changes
- browser-native date input behavior
- shared-list behavior through URL
- AI-related front-end request flows
- persistence behavior after refresh
- visible error handling and user feedback where implemented

---

## 5. Features to Be Tested

### 5.1 Functional Areas
- shared list initialization and switching;
- plant list display;
- plant add/edit/delete flows;
- multi-photo handling;
- photo comparison flow;
- plant detail rendering;
- watering status calculation;
- fertilizing status calculation;
- date picker flows;
- bulk actions and undo;
- reorder behavior;
- caretaker mode behavior;
- AI-assisted instruction generation;
- AI question-answer flow;
- shared access limitations.

### 5.2 UI/UX Behavior
- visibility and hiding of controls depending on mode;
- consistency of action availability;
- correct rendering of badges, buttons, placeholders, and instructions blocks;
- proper modal/panel opening and closing behavior.

### 5.3 Data Persistence
- persistence after save;
- persistence after refresh;
- discard behavior after closing form without save;
- session-scoped undo limitation.

---

## 6. Features Not to Be Tested in Depth

The following areas may be sanity-checked but are not primary validation targets in this plan:

- visual design polish and branding consistency;
- backend internals and database structure;
- exact AI answer quality/content correctness;
- exact compression ratio for every uploaded photo;
- cross-device camera integration specifics;
- browser-specific native date input UI differences beyond core functional behavior.

---

## 7. Test Approach

### 7.1 Test Type
This test cycle will use:

- **manual functional testing**
- **exploratory testing**
- **UI validation**
- **business rule validation**
- **state transition testing**
- **basic regression testing**

### 7.2 Test Design Techniques
The following test design techniques will be applied where relevant:

- equivalence partitioning;
- boundary value analysis;
- decision table thinking for statuses and mode restrictions;
- state transition testing;
- error guessing;
- exploratory scenario-based testing.

### 7.3 Testing Strategy
Testing will be executed module by module using the Functional Requirements v1.0 as the baseline.  
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
- non-persistent UI states after refresh.

---

## 8. Test Levels

### 8.1 Smoke Testing
A short smoke test shall be executed before detailed testing to confirm that the environment is usable.

Smoke coverage:
- app opens successfully;
- list loads;
- top bar actions are visible;
- plant can be added;
- detail view opens;
- save works;
- refresh does not break the list.

### 8.2 Functional Testing
Detailed manual functional testing shall validate compliance with documented requirements and business rules.

### 8.3 Regression Testing
Regression testing shall be performed:
- after bug fixes;
- after UI changes;
- after logic changes to watering/fertilizing/modes;
- after color/theme updates if they affect visibility or action states.

---

## 9. Entry Criteria

Testing may start when the following conditions are met:

- live environment is accessible;
- test URL is available;
- Functional Requirements v1.0 is approved as the baseline;
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

### 12.2 Recommended Platforms
Testing should cover modern desktop and mobile browsers where possible.

Recommended minimum coverage:
- Google Chrome (desktop)
- Mozilla Firefox (desktop)
- Safari or Chrome on mobile device
- Edge (optional)

### 12.3 Environment Notes
- shared-list data is mutable and may be changed by anyone with the same URL;
- there is no real-time sync;
- refresh may be required to observe changes made in another session;
- browser-native date controls may differ visually by browser/OS.

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
- plant with interval values left empty;
- plant with interval value `0`;
- plant with negative interval value.

### 13.2 Suggested Named Test Plants
Example test data set:
- Monstera Basic
- Ficus Full Data
- Pothos No Fertilizer
- Calathea Multi Photo
- Aloe Missing Dates
- Orchid Zero Interval
- Fern Negative Interval

### 13.3 AI Test Data
- valid plant name only
- valid plant name + Latin name + room
- empty question
- non-empty plant problem question
- question with symptoms text

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

- Functional Requirements v1.0
- Test Plan v1.0
- Checklist v1.0
- Detailed Test Cases v1.0
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
- AI endpoints may fail intermittently;
- image upload success may vary depending on file size and backend constraints;
- live environment may change while documentation is being prepared.

### 17.2 Assumptions
- the current Functional Requirements v1.0 correctly reflect implemented behavior;
- the provided test URL remains accessible during the test cycle;
- browser-native date input behavior is acceptable if functionally consistent with requirements;
- AI correctness is evaluated only from integration/behavior perspective, not botanical accuracy.

---

## 18. Traceability

Testing shall be traceable to:
- Functional Requirements (`FR-*`)
- Business Rules (`BR-*`)
- Non-Functional Requirements (`NFR-*`)
- Known Limitations (`KL-*`)

Each checklist item and test case should reference related requirement IDs where applicable.

---

## 19. High-Level Test Scenarios

The following high-level scenarios shall be covered:

1. Open application with shared list ID and validate list loading.
2. Create a new plant with only required data.
3. Create a plant with full optional data.
4. Edit existing plant and validate persistence.
5. Delete plant from Edit form and validate permanent removal.
6. Upload multiple photos and validate preview and saved display.
7. Open before/after comparison for multi-photo plant.
8. Validate watering statuses across due states.
9. Validate fertilizing statuses across enabled/disabled/due states.
10. Perform single-plant Watered and Fertilized actions.
11. Validate future-date blocking in care actions.
12. Validate interval fallback behavior for empty/invalid input.
13. Validate acceptance of `0` and negative intervals as current behavior.
14. Enter bulk-select mode and apply Watered to multiple plants.
15. Apply Fertilized in bulk and validate dependent Watered behavior.
16. Apply both bulk actions and verify same date is used.
17. Undo the latest bulk action within 15 seconds.
18. Validate undo loss after refresh or subsequent bulk action.
19. Reorder plants and verify persistence after refresh.
20. Enable Caretaker mode and validate restricted UI.
21. Use quick actions in Caretaker mode from plant cards.
22. Generate AI care suggestions in Add/Edit form.
23. Ask AI a plant problem question in detail view.
24. Validate AI answer reset when switching plants or closing detail view.
25. Validate shared access behavior in two separate sessions.
26. Validate lack of real-time sync and manual refresh requirement.

---

## 20. Pass / Fail Criteria

A test is considered **Pass** if the observed behavior matches the documented expected behavior for the current version, including accepted limitations.

A test is considered **Fail** if:
- actual behavior contradicts the documented requirement;
- required UI element or action is missing;
- incorrect state/data is saved;
- restriction or business rule is violated unexpectedly;
- visible behavior is inconsistent with current documented implementation.

---

## 21. Approval

| Name | Role | Status |
|---|---|---|
| QA Portfolio Author | Manual QA Engineer | Draft |
| Reviewer | Optional | Pending |
