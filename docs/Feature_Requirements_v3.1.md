# Feature Requirements v3.1
> **Status:** Draft for review (2026-11-09). Describes a feature that is **not implemented yet**. Implementation is planned in stages (form, display, tests) and this document is the baseline for it.

## Localized Plant Content

---

## Feature 8. English Version of Plant Name and Care Instructions

### Goal
Plant data is typed by the user in one language (usually Ukrainian), so in the English UI the names and care instructions stay in Ukrainian (LF-007). The goal is to let the user store an optional English version of the plant name and of the care instructions, and to show it automatically when the interface language is English.

Nothing is translated automatically at display time: the English text is entered by the user (manually or with the AI generation button) and stored together with the plant.

### Terms
- **Original** — the existing fields `name` and `instructions`.
- **English version** — the new optional fields `nameEn` and `instructionsEn`.
- **Display name / display instructions** — the text the interface shows for the current UI language (see LC-010 … LC-012).

### Requirements

#### Data

**LC-001.** A plant record may contain two optional fields with an English version of user-entered text: `nameEn` (plant name) and `instructionsEn` (care instructions). The existing fields `name` and `instructions` remain the original values and are used whenever no English version exists.

**LC-002.** Plants saved before this feature have no English fields and remain valid. No data migration is required.

**LC-003.** The English fields are saved and loaded together with the plant record (shared list storage and the local fallback storage), so they are visible to every user of the shared list.

**LC-004.** The Latin name and the room / location are not localized; they are shown as entered in every language.

#### Display

**LC-010.** When the UI language is Ukrainian, the system shall always show `name` and `instructions`.

**LC-011.** When the UI language is English, the system shall show `nameEn` if it is not empty (a value with only spaces counts as empty); otherwise it shall show `name`.

**LC-012.** The same rule applies to the care instructions independently of the name: `instructionsEn` if it is not empty, otherwise `instructions`.

**LC-013.** The display name and display instructions shall be used in all of the following places:

| Place | Name | Instructions |
|---|---|---|
| Plant card | name text, photo `alt` text | instructions block (visible in Caretaker mode) |
| Plant detail view | heading, main photo `alt` text | instructions block |
| Before/after comparison | plant name in the header | — |
| Fertilizing calendar | plant names listed under the selected date | — |
| Ask AI request | `name` sent to the API | — |

**LC-014.** If a plant has neither `instructions` nor `instructionsEn`, the detail view shall show the standard «no instructions yet» text in the UI language.

**LC-015.** Switching the UI language shall update every place from LC-013 without a page reload, including an open detail view, an open comparison and an open fertilizing calendar.

**LC-016.** Filtering, bulk selection, reorder and the order of plants shall not depend on the UI language or on which version of the name is shown.

#### Add / Edit form

**LC-020.** The Add/Edit form works with the version of the text that matches the UI language at the moment the form is opened. In the Ukrainian UI the Plant name and Care instructions fields represent `name` / `instructions`. In the English UI they represent `nameEn` / `instructionsEn`.

**LC-021.** The language of the form is fixed when it opens. Switching the UI language while the form is open shall not change the form fields or what they will be saved to.

**LC-022.** Edit form, Ukrainian UI: the fields are prefilled with `name` and `instructions`. Saving changes only these fields; `nameEn` and `instructionsEn` remain unchanged.

**LC-023.** Edit form, English UI: the name field is prefilled with `nameEn`, or with `name` if `nameEn` is empty; the instructions field is prefilled with `instructionsEn`, or with `instructions` if `instructionsEn` is empty. Saving writes `nameEn` / `instructionsEn` and leaves `name` / `instructions` unchanged.

**LC-024.** Edit form, English UI: a value is saved to `nameEn` only if it is not empty and differs (after trimming spaces) from `name`; otherwise `nameEn` is removed and the original is shown again. The same rule applies to `instructionsEn`. In this mode the name field is not required.

**LC-025.** Add form, Ukrainian UI: the entered values are saved to `name` / `instructions` only. Plant name is required (FR-028).

**LC-026.** Add form, English UI: Plant name is required. The entered name and instructions are saved to both the original fields and the English fields.

**LC-027.** Saving a plant in any other way (changing watering or fertilizing dates, photos, intervals, bulk actions, Caretaker quick actions, reorder) shall not remove or change `nameEn` / `instructionsEn`, except as described in LC-022 … LC-024.

**LC-028.** Deleting a plant removes its English fields together with the record.

#### Hint when the name is changed in one language

**LC-030.** In the Edit form, when the user changes the name so that the field value differs from the value it had when the form was opened, a hint shall appear directly under the Plant name field:
- Ukrainian form: «Зміна застосується лише до української версії»;
- English form: «This change applies to the English version only».

**LC-031.** The hint shall disappear if the user returns the name to its initial value. It is not shown in the Add form. It is informational and does not block saving. No hint is shown for the care instructions.

**LC-032.** The hint text follows the language of the form (LC-021).

#### AI generation

**LC-040.** «Generate with AI» puts the result into the care instructions field of the form. In the English form the text is therefore in English (LF-005) and is saved as `instructionsEn` according to LC-023 / LC-024. The plant name sent to the API is the current value of the Plant name field.

**LC-041.** The automatic suggestion after leaving the name field (FR-177) works the same way: in the English Add form it fills the English instructions.

**LC-042.** The overwrite confirmation (FR-178) applies whenever the instructions field is not empty, including the case when the English form is prefilled with the original Ukrainian text (LC-023).

**LC-043.** Ask AI in the detail view sends the display name and the UI language (LF-006).

### Acceptance Criteria

**AC-LC-01.** A plant without English fields is shown in the English UI with its original name and instructions.

**AC-LC-02.** A plant with `nameEn` is shown with `nameEn` on the card, in the detail view, in the comparison header and in the fertilizing calendar in the English UI, and with `name` in the Ukrainian UI.

**AC-LC-03.** A plant with `instructionsEn` but without `nameEn` shows the English instructions and the original name in the English UI (fields fall back independently).

**AC-LC-04.** Switching the language with the detail view open updates the name and instructions immediately.

**AC-LC-05.** Editing a plant in the Ukrainian UI (any field) does not remove existing `nameEn` / `instructionsEn`; after reload the English version is still shown in the English UI.

**AC-LC-06.** Editing a plant in the English UI and saving a new name stores it as `nameEn`; the Ukrainian UI still shows the original name.

**AC-LC-07.** In the English Edit form the name field can be cleared and saved; the English UI then shows the original name again.

**AC-LC-08.** Opening the English Edit form and saving without changes does not create `nameEn` / `instructionsEn`.

**AC-LC-09.** Creating a plant in the English UI makes it appear with the same name in the Ukrainian UI, and the name is also stored as `nameEn`.

**AC-LC-10.** Changing the name in the Edit form shows the hint in the form's language; restoring the initial value hides it; the Add form never shows it.

**AC-LC-11.** Switching the UI language while the form is open does not change the field contents or the saved target.

**AC-LC-12.** In the English form, «Generate with AI» fills the instructions field with English text and, after Save, the text is shown in the English UI.

**AC-LC-13.** Ask AI sends the display name and `lang` of the current UI language.

**AC-LC-14.** The English versions survive a page reload and are visible when the same list is opened in another browser through the shared link.

### Known Limitations
These are recorded as KL-014 … KL-017 in Functional Requirements v2.1.

- Nothing is translated automatically; a plant without English fields shows the original in the English UI.
- Editing one language does not update the other. Only a name change shows a hint.
- Latin name and room / location are not localized.
- The English form is prefilled with the original text when no English version exists, and its language is fixed when it opens.

### Related Requirements
- Feature Requirements v1.2: LF-003, LF-005, LF-006, LF-007 (updated to point here).
- Functional Requirements v2.1: FR-023, FR-024, FR-028, FR-038, FR-150, FR-177, FR-178, FR-181 … FR-184, KL-014 … KL-017.
