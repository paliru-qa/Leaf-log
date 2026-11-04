# LeafLOG QA Portfolio Project

Manual QA portfolio project based on a live web application: **LeafLOG** — a bilingual (UA/EN) plant care tracker for watering, fertilizing, shared plant lists, a fertilizing calendar, and AI-assisted care features.

**Live app:** https://leaf-log-six.vercel.app  
**Note:** Personal shared-list links are omitted for privacy   
**DEMO:** https://leaf-log-six.vercel.app/?id=rycu0sei

## Overview

This repository contains QA documentation created by analyzing the implemented behavior of the live application.

The project demonstrates how a manual QA engineer can:
- reverse-engineer functional requirements from a working product,
- identify business rules and edge cases,
- track requirements and QA artifacts across incremental feature releases,
- prepare structured QA artifacts for testing and portfolio use.

## Included / Planned QA Artifacts

- `docs/Functional_Requirements_v2_0.md`
- `docs/Feature_Requirements_v1.2.md` — header layout, language switcher, footer
- `docs/Feature_Requirements_v2.1.md` — status filters, fertilizing calendar, reorder mode update
- `docs/Test_Plan.md` (v2.2)
- `docs/Check_List.md` (v2.2)
- `docs/test-cases-v1.0.md` (pending update to match v2.2 scope)
- `docs/bug-reports.md`
- `assets/screenshots/`

## Scope Covered

- shared list behavior via URL `id`
- plant list and detail view
- add / edit / delete plant flows
- watering and fertilizing logic
- status filtering by badge
- fertilizing calendar (monthly highlight view, forecasted dates)
- bulk-select mode and bulk actions
- reorder mode via dedicated drag handle
- Caretaker mode
- photo upload and before/after comparison
- header, footer, and layout stability across modes and viewports
- UI language switcher (Ukrainian / English); AI output follows the selected UI language
- AI-generated care instructions
- AI plant problem Q&A
- shared access and sync limitations

## Skills Demonstrated

- Manual Testing
- Requirements Analysis
- Test Planning
- Checklist Design
- Test Case Design
- Bug Reporting
- Localization Testing
- Reverse Engineering of Product Behavior

## Notes

- The QA artifacts reflect the app version analyzed at the time of documentation and are versioned alongside feature updates.
- Requirements were derived from actual implemented behavior, including current limitations.
- This repository is intended as a QA portfolio project rather than a product development repository.
