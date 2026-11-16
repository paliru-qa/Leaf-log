# Feature Requirements v1.2
> **Revised 2026-10-29** to match the current header layout, the language switcher and the Caretaker-mode behavior. Items that are not implemented are marked explicitly.

## LeafLOG Header Update, Language Switcher, and Footer

---

## Feature 1. Header Layout Update

### Goal
Improve header stability and layout consistency across modes and screen sizes.

### Requirements

**HF-001.** The top page area shall use a three-row structure:
- header row 1,
- header row 2,
- a separate filter row below the header.

**HF-002.** Header row 1 shall contain:
- the Caretaker mode toggle on the left,
- the centered site title `LeafLOG`,
- on the right: a compact language switcher and the **Add Plant** action.

**HF-003.** Header row 2 shall contain the mode/action controls (right-aligned on desktop, wrapped from the left on narrow screens).

**HF-004.** The mode/action controls in header row 2 shall include:
- Select multiple / Bulk mode
- Select all
- Change order

**HF-005.** The filter labels shall be displayed in a separate row below the header and shall not be treated as part of the header rows.

**HF-006.** In Caretaker mode, the **Add Plant** button shall remain visible but disabled (dimmed and not clickable).

**HF-007.** Disabling the Add Plant button in Caretaker mode shall not cause the centered site title or other header controls to shift position.

**HF-008.** The Add Plant button shall keep its position and size whether it is enabled or disabled.

**HF-009.** Header controls shall remain visually stable across hover, press, active, and toggle states, without changing size or position.

**HF-010.** The same header stability behavior shall apply on mobile devices. On narrow screens the Caretaker toggle and the Add Plant button are shown as icons only.

**HF-011.** The header shall remain readable and usable in normal mode, Caretaker mode, bulk-select mode, and reorder mode.

### Acceptance Criteria

**AC-H-01.** In normal mode, header row 1 displays the Caretaker toggle on the left, the centered `LeafLOG` title, and the language switcher with the Add Plant button on the right.

**AC-H-02.** In normal mode, header row 2 displays the mode/action controls (Select multiple, Select all, Change order).

**AC-H-03.** Filter labels are displayed in a separate row below the header.

**AC-H-04.** When Caretaker mode is enabled, the Add Plant button is disabled (dimmed) but stays in place, and the title and other controls do not shift.

**AC-H-05.** Header buttons and controls do not visually jump, resize, or move when hovered, pressed, or toggled on desktop or mobile.

---

## Feature 2. Language Switcher (UA / EN)

### Goal
Allow users to switch the site UI between Ukrainian and English.

### Requirements

**LF-001.** The application shall provide a compact language switcher in the right corner of header row 1.

**LF-002.** The language switcher shall be displayed as a compact toggle button labeled with the currently selected language code (`UA` or `EN`). Each click switches to the other language.

**LF-003.** Changing the selected language shall update visible UI text across the application, including:
- header controls,
- buttons,
- form labels,
- empty states,
- filter labels,
- detail view labels,
- bulk action labels,
- caretaker mode labels,
- AI section labels,
- generic system messages currently shown in the UI.

**LF-004.** The selected language shall persist after page refresh in the same browser.

**LF-005.** AI-generated care suggestions shall be returned in the currently selected language.

*Status (2026-11-04): implemented. The client sends the UI language (`lang`) to `/api/generate-instructions` and `/api/diagnose`, and the server asks the model to answer in that language (bug report BR-003, fixed).*

**LF-006.** AI answers in the plant problem/question flow shall be returned in the currently selected language.

*Status (2026-11-04): implemented. The client sends the UI language (`lang`) to `/api/generate-instructions` and `/api/diagnose`, and the server asks the model to answer in that language (bug report BR-003, fixed).*

**LF-007.** Switching the UI language shall not automatically translate user-entered plant data already stored in the list. The user can add an English version of the plant name and care instructions manually (planned, see Feature Requirements v3.1, Feature 8); the English UI shows it when it is filled.

**LF-008.** Using the language switcher shall not cause header controls to shift or resize unexpectedly.

**LF-009.** The `lang` attribute of the page shall follow the selected language (`uk` / `en`).

**LF-010.** Dates shown in the UI shall be formatted according to the selected language (e.g. «15 черв.» in Ukrainian, «Jun 15» in English).

### Acceptance Criteria

**AC-L-01.** A language switcher is visible in the right corner of header row 1.

**AC-L-02.** The user can switch between Ukrainian and English.

**AC-L-03.** When English is selected, visible UI labels are displayed in English.

**AC-L-04.** When Ukrainian is selected, visible UI labels are displayed in Ukrainian.

**AC-L-05.** AI-generated care suggestions and AI answers are returned in the currently selected language.

**AC-L-06.** User-entered plant data is not auto-translated when the UI language is changed.

**AC-L-07.** The selected language remains active after page refresh.

**AC-L-08.** Opening or using the language switcher does not cause header layout instability.

---

## Feature 3. Footer

### Goal
Add a lightweight footer with product identity information, shared-list actions, and stable page-end layout behavior.

### Requirements

**FF-001.** The application shall display a footer at the bottom of the page.

**FF-002.** The footer shall contain:
- copyright text,
- the product name,
- a short tagline,
- shared-list actions.

**FF-003.** The footer tagline shall be:
- Ukrainian: `Доглядай за рослинами без зайвого клопоту`
- English: `Care for your plants with ease`

**FF-004.** Footer text shall follow the currently selected UI language.

**FF-005.** The footer shall provide access to the following shared-list actions:
- **Copy share link**
- **Create your own separate list**

**FF-006.** The behavior of shared-list actions shall remain unchanged:
- **Copy share link** shall copy the current shared list URL;
- **Create your own separate list** shall generate a new separate list without modifying the current list data.

**FF-007.** The footer shall use a lightweight, brand-aligned visual style and shall not distract from the main application content.

**FF-008.** The footer shall remain readable and responsive on desktop and mobile screen sizes.

**FF-009.** When page content is shorter than the viewport height, the footer shall remain visually attached to the bottom of the screen.

**FF-010.** When page content exceeds the viewport height, the footer shall appear below the page content and shall not overlap it.

**FF-011.** The footer shall not obscure interactive content, modal content, or the bulk action bar.

### Acceptance Criteria

**AC-F-01.** A footer is visible at the bottom of the page.

**AC-F-02.** The footer displays copyright text with the product name.

**AC-F-03.** The footer displays the approved tagline in the currently selected language.

**AC-F-04.** The footer provides access to Copy share link and Create your own separate list.

**AC-F-05.** Footer content switches together with the selected UI language.

**AC-F-06.** The footer remains readable and visually stable across supported screen sizes.

**AC-F-07.** If the page contains little or no plant content, the footer remains positioned at the bottom of the viewport.

**AC-F-08.** If the page contains enough content to scroll, the footer appears after the content and does not overlap it.
