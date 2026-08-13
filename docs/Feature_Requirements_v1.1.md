# Feature Requirements v1.1
## LeafLOG Header Update and Language Switcher

---

## Feature 1. Header Layout Update

### Goal
Improve header stability and layout consistency across modes and screen sizes.

### Requirements

**HF-001.** The header shall have a three-part layout:
- left area,
- centered logo area,
- right control area.

**HF-002.** The **Add Plant** button shall be placed in the left header area.

**HF-003.** The logo shall be centered in the header and shall contain:
- a watering can icon above,
- the `LeafLOG` title below.

**HF-004.** The right header area shall contain the existing mode/action controls and reserved space for a future language switcher.

**HF-005.** In Caretaker mode, the **Add Plant** button shall remain hidden.

**HF-006.** Hiding the Add Plant button in Caretaker mode shall not cause the centered logo or right-side controls to shift position.

**HF-007.** The left header area shall preserve reserved space for the Add Plant button even when the button is hidden.

**HF-008.** Header controls shall remain visually stable across hover, press, active, and toggle states, without changing size or position.

**HF-009.** The same header stability behavior shall apply on mobile devices.

**HF-010.** The header shall remain readable and usable in normal mode, Caretaker mode, bulk-select mode, and reorder mode.

### Acceptance Criteria

**AC-H-01.** In normal mode, the Add Plant button is shown on the left, the logo is centered, and action controls are displayed on the right.

**AC-H-02.** The logo displays the watering can icon above the `LeafLOG` title.

**AC-H-03.** When Caretaker mode is enabled, the Add Plant button is hidden, but the logo and right-side controls do not shift.

**AC-H-04.** Header buttons do not visually jump, resize, or move when hovered, pressed, or toggled on desktop or mobile.

---

## Feature 2. Language Switcher (UA / EN)

### Goal
Allow users to switch the site UI between Ukrainian and English.

### Requirements

**LF-001.** The application shall provide a language switcher in the right side of the header, after the Caretaker mode control.

**LF-002.** The language switcher shall be displayed as a dropdown button with at least two options:
- Ukrainian (`UA`)
- English (`EN`)

**LF-003.** Changing the selected language shall update visible UI text across the application, including:
- header controls,
- buttons,
- form labels,
- empty states,
- detail view labels,
- bulk action labels,
- caretaker mode labels,
- AI section labels,
- generic system messages currently shown in the UI.

**LF-004.** The selected language shall persist after page refresh in the same browser.

**LF-005.** AI-generated care suggestions shall be returned in the currently selected language.

**LF-006.** AI answers in the plant problem/question flow shall be returned in the currently selected language.

**LF-007.** Switching the UI language shall not automatically translate user-entered plant data already stored in the list.

**LF-008.** Adding or using the language switcher shall not cause header controls to shift or resize unexpectedly.

### Acceptance Criteria

**AC-L-01.** A language switcher is visible in the right side of the header after the Caretaker mode control.

**AC-L-02.** The user can switch between Ukrainian and English.

**AC-L-03.** When English is selected, visible UI labels are displayed in English.

**AC-L-04.** When Ukrainian is selected, visible UI labels are displayed in Ukrainian.

**AC-L-05.** AI-generated care suggestions and AI answers are returned in the currently selected language.

**AC-L-06.** User-entered plant data is not auto-translated when the UI language is changed.

**AC-L-07.** The selected language remains active after page refresh.

**AC-L-08.** Opening or using the language switcher does not cause header layout instability.
