# LeafLOG QA Portfolio Project

[![Tests](https://github.com/paliru-qa/Leaf-log/actions/workflows/tests.yml/badge.svg)](https://github.com/paliru-qa/Leaf-log/actions/workflows/tests.yml)
![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33?logo=playwright&logoColor=white)
![Automated tests](https://img.shields.io/badge/automated%20tests-120-brightgreen)
![Requirements](https://img.shields.io/badge/requirements-184-blue)
![Checklist](https://img.shields.io/badge/checklist%20items-364-blue)
![Security findings](https://img.shields.io/badge/security%20findings-7-orange)

End-to-end QA work on a **live web application**: requirements reverse-engineered from the product, a test plan and checklist, a Playwright automation suite, bug reports, and a security review.

**The application:** LeafLOG is a bilingual (UA/EN) plant care tracker: watering and fertilizing schedules, shared plant lists by link, a fertilizing calendar, photo before/after comparison and AI-assisted care features.

| | |
|---|---|
| **Live app** | https://leaf-log-six.vercel.app |
| **Demo list** | https://leaf-log-six.vercel.app/?id=rycu0sei |
| **Stack under test** | single-page web app, Vercel serverless API, Upstash Redis, Groq (LLM) |

> Personal shared-list links are omitted for privacy.

---

## What to look at in 2 minutes

| If you want to see… | Open |
|---|---|
| How I turn a working product into requirements | [`Functional_Requirements_v2_0.md`](docs/Functional_Requirements_v2_0.md) |
| How requirements evolve with each feature | [`Feature_Requirements_v1.2`](docs/Feature_Requirements_v1.2.md) · [`v2.1`](docs/Feature_Requirements_v2.1.md) · [`v3.0`](docs/Feature_Requirements_v3.0.md) · [`v3.1`](docs/Feature_Requirements_v3.1.md) |
| How I plan testing: scope, risks, environments, scenarios | [`Test_Plan.md`](docs/Test_Plan.md) |
| A working regression checklist | [`Check_List.md`](docs/Check_List.md) |
| How I report defects | [`Bug_reports.md`](docs/Bug_reports.md) |
| Automated tests | [`tests/`](tests/) (Playwright, 120 tests) |
| Security testing results | [`Security_Findings.md`](docs/Security_Findings.md) |

---

## At a glance

| Area | Result |
|---|---|
| Functional requirements | **184** (`FR-001 … FR-184`), plus business rules, known limitations, non-functional requirements |
| Feature requirement documents | **4**, each with goals, numbered requirements and acceptance criteria |
| Regression checklist | **364** checks in 26 sections |
| Automated tests | **120** tests in 13 spec files, **15** tagged `@smoke`, run by CI on every PR |
| Bug reports | **5** (2 fixed, 1 closed as not reproducible, 2 open) |
| Security review | **7** findings: 2 Medium, 4 Low, 1 Info. No XSS found. |

---

## Highlights

**Requirements before tests, tests before code.** The English-name feature (`nameEn`, `instructionsEn`) was specified first ([Feature Requirements v3.1](docs/Feature_Requirements_v3.1.md), IDs `LC-*` with acceptance criteria), then the Test Plan and Checklist were updated, then the feature was implemented together with 40 automated tests that trace back to those IDs.

**Found a gap between requirement and behaviour.** The requirements said AI answers follow the selected UI language, but the product always replied in Ukrainian ([BR-003](docs/Bug_reports.md)). The bug was fixed, and it is now covered by automated tests, including checks of the request sent to the backend.

**Tests that can fail.** For new features I removed the fix and confirmed that the new tests fail without it (for example 14 of 25 form tests), so a green run means something.

**Safe to run against production.** The suite mocks every API route (`/api/plants`, `/api/photo`, both AI endpoints). It can run against the live site and creates no data in the real database and spends no AI quota.

**Security thinking, not only a scan.** An automated OWASP ZAP baseline was combined with manual XSS attempts (5 payloads in every text field, UA and EN, across every screen; on the live site and on a local copy with a mocked API), response-header analysis and a code review of the API. Every finding has a severity, steps and a recommendation, and each is marked as confirmed on the live site or found by code review.

---

## Test automation

Playwright + TypeScript. Tests are readable Ukrainian-language scenarios with stable IDs (`C1`, `W2`, `A5`, `LC-027` …) that map to the checklist and requirements.

| Spec | What it covers |
|---|---|
| `smoke.spec.ts` | the app loads, no console errors, empty state, cards, header, forms and details open, footer |
| `crud.spec.ts` | add / edit / delete plant, validation, persistence after reload |
| `watering.spec.ts` | watering and fertilizing status logic, boundary values, date popover |
| `filters.spec.ts` | status filters and empty filter state |
| `bulk.spec.ts`, `modes.spec.ts`, `reorder-details.spec.ts` | bulk actions with undo, Caretaker mode, reorder, mode exclusivity |
| `localization.spec.ts` | UA ⇄ EN switching across screens, persistence |
| `localized-content*.spec.ts` | English plant name/instructions: display fallback, form saving, hint, data preserved by other actions |
| `ai.spec.ts`, `api-ai-language.spec.ts` | AI generation and Q&A flows, retry, language sent to the API |
| `shared-list.spec.ts` | list id in the URL, switching lists, copy link |

How it is built:
- a fixture with an **in-memory fake backend**, so tests are fast, deterministic and independent of each other;
- a **frozen clock** for date-dependent logic (watering and fertilizing due dates);
- a page object with shared selectors, and `@smoke` tags for a quick post-deploy check.

AI assistance was used to draft tests from the requirements. I review, correct and run them, and keep the checklist as the source of truth.

### Continuous integration

[GitHub Actions](.github/workflows/tests.yml) runs the full suite on every pull request and every push to `main`. It builds from the commit under test (a local static server, API mocked), so a change is checked before it is deployed. The HTML report is attached to each run as an artifact.

### Run it

```bash
npm ci
npx playwright install chromium

npm test                # full suite against the live site
npm run test:smoke      # only @smoke tests
npm run test:local      # against index.html from this repository
npm run test:headed     # watch the browser
npm run test:report     # open the HTML report
```

---

## Security testing

Full report: [`docs/Security_Findings.md`](docs/Security_Findings.md).

| ID | Finding | Severity |
|---|---|---|
| SEC-001 | Content Security Policy header is not set | Medium |
| SEC-006 | API routes have no server-side input validation or limits (code review) | Medium |
| SEC-003 | Missing anti-clickjacking header | Low |
| SEC-004 | Subresource Integrity missing on external resources | Low |
| SEC-005 | `X-Content-Type-Options` header missing | Low |
| SEC-007 | List id has low entropy, no rate limiting (code review) | Low |
| SEC-002 | CORS on a static asset (the API itself is not affected) | Info |

Checked without findings: stored and reflected XSS in all user-entered fields and in the AI answer, XSS through the `?id=` parameter, prompt-injection attempts against the AI endpoints, HSTS, CORS on the API.

---

## Bug reports

| ID | Summary | Status |
|---|---|---|
| BR-001 | Unclear fertilizing checkbox label | Fixed |
| BR-002 | Bulk-select not reachable in Caretaker mode | Closed (not reproducible) |
| BR-003 | AI replies ignore the selected UI language | Fixed, covered by tests |
| BR-004 | AI response inserted as raw JSON into the instructions field | Open ([details](docs/Security_Findings.md)) |
| BR-005 | Oversized "Add plant" icon (1.09 MB shown at 36×36 px) | Open |

---

## Scope covered

- shared list behavior via URL `id`
- plant list and detail view
- add / edit / delete plant flows
- watering and fertilizing logic
- status filtering by badge
- fertilizing calendar (monthly highlight view, forecasted dates)
- bulk-select mode, select all, bulk actions with undo
- reorder mode via a dedicated drag handle
- Caretaker mode
- photo upload and before/after comparison
- header, footer and layout stability across modes and viewports
- UI language switcher (Ukrainian / English), English version of plant name and instructions
- AI-generated care instructions and plant problem Q&A, output in the selected language
- shared access and synchronization limitations
- security: XSS, response headers, API input handling, AI prompt injection

---

## Repository structure

```
.
├── docs/
│   ├── Functional_Requirements_v2_0.md      # content version 2.1
│   ├── Feature_Requirements_v1.2.md         # header, language switcher, footer
│   ├── Feature_Requirements_v2.1.md         # status filters, fertilizing calendar, reorder
│   ├── Feature_Requirements_v3.0.md         # Select All
│   ├── Feature_Requirements_v3.1.md         # English version of plant name and instructions
│   ├── Test_Plan.md                         # v2.3
│   ├── Check_List.md                        # v2.3
│   ├── Bug_reports.md
│   └── Security_Findings.md
├── .github/workflows/tests.yml              # CI: Playwright on every PR and push to main
├── tests/                                   # Playwright suite, fixtures, page object
├── assets/screenshots/                      # evidence for bug reports
├── index.html, api/, vercel.json            # application under test
├── playwright.config.ts, package.json
└── README.md
```

Planned: a detailed test-case document (`test-cases`) matching the v2.3 scope, and live-API checks of input validation on a separate test list.

---

## Skills demonstrated

**Analysis and design:** requirements analysis, reverse engineering of product behavior, traceability from requirement to test, risk-based test planning, test design (equivalence classes, boundaries, state transitions, decision tables).
**Manual testing:** exploratory and regression testing, checklist design, localization testing, bug reporting.
**Automation:** Playwright, TypeScript, API mocking, fixtures and page objects, deterministic time, smoke tagging, test-quality checks (tests must fail without the fix), AI-assisted test authoring with human review.
**Security:** OWASP-based review, XSS and prompt-injection testing, HTTP header analysis, API input-validation review, OWASP ZAP.

---

## Notes

- The QA artifacts reflect the app version analyzed at the time of documentation and are versioned alongside feature updates.
- Requirements were derived from actual implemented behavior, including current limitations.
- This repository is a QA portfolio project, not a product development repository. The application source is included so that the tests can be reproduced.

*Last updated: 2026-11-20*
