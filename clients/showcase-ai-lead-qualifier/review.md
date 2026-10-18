# Best-Practice Review: AI Lead Qualifier (SHOW-001)

**Scenario:** 6677285 `SHOWCASE | AI Lead Qualifier | Webhook → Score + HubSpot + Slack | v1` (inactive, folder Showcase 287596, team 1686600)
**Reviewed against:** `playbooks/make-best-practices.md`, `playbooks/ai-guardrails.md`, `design.md`, `build-log.md`
**Reviewer:** best-practice-reviewer (read-only; nothing in Make was changed). Date: 2026-10-18.
**Method:** read the live blueprint via `scenarios_get`, traced every module, router, filter and handler, counted parentheses and logic in the formulas by hand, and listed connections. Nothing was run, so runtime behaviour (formula results, field names, error text) is "not proven" until QA.

## Verdict (first review): SEND BACK TO BUILDER (one small fix round)
**Superseded by the "Re-review after fix round 1" section at the end of this file: Approve for QA once owner steps are done.**

Reason: one **[must]** item fails (failure alert has no usable link to the scenario or execution) and two [must] items depend on owner steps that are not done. The design is otherwise followed closely: the flow, routers, decision rules, thresholds, error handlers and ops count match the approved design. The list below is short and mostly quick edits. After it, this can go to QA.

## Must failures (fix before QA)

| # | Item | Standard | Result | Exact change needed |
|---|---|---|---|---|
| M1 | Failure alert content | best-practices [must] "Slack/email with scenario name, module, and execution link" | **Fix** | All four alerts (modules 34's parent 33, 36, 42, 47) link to the generic page `https://us2.make.com/1686600/scenarios` plus a "open the folder" instruction. The scenario ID is now known. Change the link in all four texts to `https://us2.make.com/1686600/scenarios/6677285/logs` (owner: confirm the `us2` region matches the browser address bar when editing the scenario). Also open the mapping panel and check whether Make offers an execution ID variable; use it only if it is listed there. Do not invent one. |
| M2 | Webhook protection | best-practices Security, design section 3 | **Fix (owner step, blocks QA of the real entry and blocks activation)** | The blueprint cannot show webhook settings, so this is unproven. Owner creates the API key on webhook 2949839 (header `x-make-apikey`) and attaches data structure `lead_webhook_v1`. Key goes only into the caller. QA should confirm a call without the key is rejected. |
| M3 | AI cost cap | guardrail 4 [must] | **Fix (partly owner)** | In-scenario caps pass (message cut to 1,000 chars, other fields 100 to 200, `max_tokens` 400, Haiku 4.5, invalid leads never reach the AI). Still missing: (a) the Anthropic monthly spend limit (owner, build-log manual step 4, not confirmed done); (b) a dollar cost per run recorded in the design or build log (design says "fraction of a cent", price page never looked up). Builder: look up the current Haiku 4.5 price and write a figure in `build-log.md`. Note in the process doc that Make cannot cap runs per day, so the API key and the Anthropic limit are the only hard stops. |
| M4 | Placeholder `portal_id` | best-practices "never hard-code environment values", design section 9 | **Fix (owner step)** | Module 2 variable `portal_id` is still `SET_HUBSPOT_PORTAL_ID`, so the HubSpot link in the hot and review Slack messages is broken. Owner sets the real portal ID. Not a secret. Must be done before QA checks Slack message content. |

## Fix items, ranked by risk (should fix, not blocking on their own)

| # | Risk | Item | Result | Exact change needed |
|---|---|---|---|---|
| F1 | High (cold path) | `ifempty(x; -1)` used on criteria in `decision_code` (module 11) | **Fix / verify** | If Make treats the number 0 as empty, every legitimate zero criterion becomes -1 and the lead is wrongly marked "invalid" and sent to review. The cold test case (student, no budget) would show it. Safe failure (review) but noisy and would hide cold leads. Test first with a criterion of 0. If it misbehaves, replace with a check that does not treat 0 as empty, for example `if(length(7.criteria.x) = 0; 1; 0)`, or rely on the Parse JSON "required" fields. |
| F2 | High (hot path) | Contact ID from module 14 assumed to be `id` | **Fix / verify** | Used in the task association (`hs_task_assigned_contacts`) and in both Slack links. QA: run the module once and read the real output field name. If it is not `id`, change all three references (modules 17, 18, 19). |
| F3 | High (hot path) | Task-to-contact link | **Fix / verify** | The field is accepted by Make, but it is not proven that the task appears on the contact's timeline. QA must open the contact in HubSpot and confirm. If it does not, add HubSpot > Make an API Call (v4 association) after module 17. Also check `hs_timestamp` = `addDays(now; 1)` is accepted by HubSpot (date format). |
| F4 | Medium | Duplicate-stop filter (module 5 handler, routes "Duplicate key" / "Other error") | **Fix / verify** | The filter matches the text "duplicate" in `error.message` or `error.name` (case-insensitive). I cannot confirm Make's wording. It fails safe: if the text differs, the lead goes to the "Other error" route, which posts a Slack alert and Breaks. That means no double task or second AI call, but the owner gets noise and three retries for a plain duplicate. QA case 8 must show the quiet stop (no Slack alert, no retry). If it does not, change both filters to the real error name shown in the execution log. The two routes are mutually exclusive and cover all errors, which is correct. |
| F5 | Medium | Slack alert Ignore inside a handler chain (modules 34, 37, 43, 48) | **Fix / verify** | Each failure alert has its own Ignore. Check by test (cases 16 and 18) that when the alert itself fails, the next step (Resume on Claude, Break on claim, HubSpot and task) still runs. If Ignore ends the whole handler, the lead would be lost silently. |
| F6 | Medium | Contact upsert may blank real data | **Fix / verify** | Empty first name, last name, job title or company may be sent to HubSpot as empty and overwrite existing values (design: must not). Review leads also send blank AI fields, which could erase an earlier score. Test cases 4 and 9. Fix if needed: only map a field when it is not empty, or leave those fields out in a second route. |
| F7 | Medium | Maintainability of `decision_code` (module 11) | **Fix** | One formula of about 1,300 characters repeats the five-criteria sum seven times. A non-author cannot read it in 10 minutes. Split into two chained "Set multiple variables" modules (a variable cannot read another in the same module, which is why it was inlined): first `sum`, then flags `parse_ok`, `range_ok`, `tier_ok`, `reason_ok`, then a short `decision_code`. Add a plain-English module note. Design already asked for `valid_ai` as a separate output. Ops cost +1 per run (11 on the hot path vs 10); update the estimate. |
| F8 | Medium | Model ID typed as text (`claude-haiku-4-5`) | **Fix / verify** | A typed ID is not checked by Make. If wrong the Claude module fails on every run and the fallback sends every lead to review (safe, but the demo then looks broken). Open module 6 in the editor and pick the model from the dropdown if it lists one, or confirm in the first test run. Repeat in module 8 (it uses the same variable `2.model`, so only one place to edit). |
| F9 | Medium | Claude output path `6.content[1].text` | **Verify** | Check in the first run. Wrong path means every lead goes to the repair call and then to review. Also note the module is `createAMessage`, not "Create a Prompt" as named in the design; harmless, but record in the build log. |
| F10 | Low-Med | Slack failure alerts may echo lead data | **Fix** | `error.message` (200 chars) can include lead fields, for example HubSpot error text may quote an email. The `@` and `<` are stripped, so no pings or links, but PII can leak into `#leads`. Cut to 120 characters or replace the message with the error name plus the module. Design principle: "never echo sensitive payloads into notifications". |
| F11 | Low-Med | Newlines in fields other than `message` | **Fix** | Only `message_clean` has line breaks collapsed. A lead can put a newline plus `message: ...` inside `company`, `role_title`, `budget_range` and so on to fake extra lines inside the `<lead_data>` block. Apply the same `replace(...; newline; " ")` to all fields sent to the model. `<` and `>` are already stripped, so the closing tag cannot be forged (good). Also confirm `newline` is a valid Make constant in the editor (build log says unverified); `\r` from Windows line breaks would remain. |
| F12 | Low | `consent_ok` accepts only true/yes/1/y | **Fix** | HTML checkboxes send `on` by default. Add `"on"; true` to the `switch`. Otherwise real form consents are rejected as "no_consent". |
| F13 | Low | Last name formula | **Fix** | `replace(name; first_name; "")` removes every occurrence ("Ann Annabel" becomes "abel"). Use `join(slice(split(trim(1.name); " "); 2); " ")` (verify `slice` in the editor). Test with a two-word and a one-word name. |
| F14 | Low | Router 16 has no fallback route | **Fix** | Best practice: clear fallback route. Add an empty third route labelled "Warm / cold: saved only (no alert)". No ops cost. Behaviour is unchanged today. |
| F15 | Low | Module names reused | **Fix** | Four Break modules are all called "Retry later" and four Resume modules "Continue to review with fallback". Rename to say what they protect (for example "Retry later: HubSpot task"). |
| F16 | Low | Slack text sanitiser leaves `://` | **Fix** | `reason_clean` and the excerpt remove `http` only, so `://evil.com` remains and may auto-link (link previews are off). Also remove `://` and `www`. Optional: also strip phone-like digits from the 200-char excerpt (PII in free text). |
| F17 | Low | Hard-coded channel `#leads` in 8 modules, `app.hubspot.com` in links | **Fix (optional)** | Put the channel name in module 2 next to `portal_id` and map it. HubSpot EU portals use a different host; note in the process doc. |
| F18 | Low | Email validity check is weak | **Note** | `valid` accepts `a@b.` or `@.`. Fine for a demo; mention in the process doc. |
| F19 | Low | Failed AI draft shown to reviewer | **Note** | When AI fails, the review message shows "AI draft: cold, score 0, confidence 0". The reason text says AI fallback, but consider showing "no valid AI draft" when `decision_code = invalid`. |
| F20 | Low | Data store retention | **Note** | 1 MB store, rows never expire. Rows hold md5 of the email (a hash is still personal data in principle). Note the owner cleanup in the process doc. |

## Checklist: make-best-practices.md

| Item | Result | Evidence / change |
|---|---|---|
| **[must]** Name format `<CLIENT> \| <Process> \| <Trigger> → <Outcome> \| vN` | **Pass** | Matches. One folder per client (Showcase). |
| Labels: client slug, gig ID, status | **Pass** | `showcase`, `SHOW-001`, `draft`. Switch `draft` to `qa` when QA starts. |
| Plain-English module names | **Pass** (see F15 for duplicates) | |
| Note on scenario: purpose, owner, trigger, last change | **Pass** | Description present. Optional: add pause/rollback line and ops estimate. |
| One responsibility per scenario | **Pass** | |
| Prefer instant trigger | **Pass** | Instant webhook. |
| Polling limits | **N/A** | |
| **[must]** Dedupe | **Pass pending test** | Claim-first data store, overwrite off, plus HubSpot match on email. See F4 and build-log gap (same email, no submission ID, no message, no timestamp = false duplicate). |
| Filter early | **Pass** | Validity router runs right after normalization, before any AI cost. |
| Routers: clear fallback, labelled routes/filters | **Fix (low)** | Router 3 and 12 are exhaustive and labelled. Router 16 has no fallback (F14). |
| Aggregate before writing / iterators | **N/A** | One lead per run. |
| **[must]** Error handler on every external module | **Pass** | Walked all of them. Data store 4, 5, 13, 15: handler present. Claude 6 and 8: Resume. Parse 7 and 9: repair and fallback. HubSpot 14, 17: alert plus Break. Slack 18, 19: Break. Failure-alert Slack modules: Ignore. Webhook 1 cannot take one (rejected before the run). Set variables and routers are not external. |
| Break + retries for outages | **Pass** | 3 tries, 10 min, on data store, HubSpot, Slack. |
| Right directive per case | **Pass** | Matches design section 11. Note: AI errors are Resume-to-review with no retry (approved option A), so a short Anthropic overload goes straight to review. |
| **[must]** Failure alert with scenario, module, execution link | **Fix** | See M1. Data store (4, 13, 15) and Slack (18, 19) failures have no Slack alert, only Make's error e-mail (design-approved; owner confirmed e-mail on at Gate 1b). |
| Store incomplete executions | **Pass** | `dlq: true`, `dataloss: false`. |
| Define data structures; validate required fields | **Pass / owner step** | `lead_webhook_v1` exists but is not attached (M2). Required fields validated in module 2. |
| Normalize early | **Pass** | Trim, lowercase email, truncation. Date format is Make's `now`. |
| No hard-coded environment IDs | **Fix (low)** | Placeholder portal ID (M4), channel (F17). |
| Missing fields treated as expected | **Pass** | `valid` flag, no error path. |
| **[must]** No secrets in fields, notes, logs | **Pass** | None found. Connections referenced by ID only. Description has no key. |
| Least-privilege scopes | **Not verifiable** | Slack connection is a user OAuth (posts as the owner, shared with another scenario, 8 scopes). HubSpot connection has 19 scopes and is shared with 2 other scenarios. Owner to confirm scopes are acceptable; builder cannot narrow them here. |
| Webhook secret/header check | **Fix (owner)** | M2. |
| Never echo sensitive payloads into notifications | **Pass with notes** | Hot alert: company, score, confidence, role, sanitised reason, link. No email, no name, no message. Review alert adds a 200-char sanitised excerpt (design-approved). See F10, F16. |
| Minimise personal data stored; retention | **Pass with note** | Log has no name, email or message; F20. |
| Estimate ops per run and record | **Pass** | Hot 10, review 9, warm/cold 8, junk 7, invalid/duplicate 3: matches the built flow module by module. +1 if F7 is done. Failure alerts, Break retries and repair (+2) are extra. |
| No search in loops | **N/A** | |
| Max cycles / off-peak | **N/A** | Instant, low volume. |
| Understandable in 10 minutes | **Fix** | Left-to-right layout and names are good. `decision_code` is not (F7). Add notes at the claim handler and the validator. |
| Version bump / change log | **Pass** | v1 and build-log. |
| Documented rollback | **Pass** | In build-log; copy into the process doc at handoff. |

## Checklist: ai-guardrails.md

| # | Item | Result | Evidence / change |
|---|---|---|---|
| 1 | **[must]** Structured output (fixed schema, confidence, reason) | **Pass** | Full schema, enums and ranges in the system prompt; `lead_score_v1` structure on Parse JSON. |
| 2 | **[must]** Validation step | **Pass pending test** | Parse (7), then repair call (8 + 9), then fallback to review. Module 11 checks presence, range (0 to 20), score = sum, tier matches recomputed tier, confidence 0 to 1, reason length. Weakness: the integer check is on the sum only (0.5 + 0.5 passes), and a parsable but wrong answer goes straight to review without a repair call (design-consistent). Formula parentheses balance and the rule order matches the design. F1 must be tested. |
| 3 | **[must]** Human-review path | **Pass** | Low confidence, invalid, injection and AI outage all route to Slack review with company, AI draft, reason and excerpt. Routing order verified against design: invalid, injection, junk (confident), low confidence, hot, warm_cold. |
| 4 | **[must]** Cost cap | **Fix** | M3. |
| 5 | Prompt hygiene | **Pass** | Role, task, format, uncertainty rule, version `v1`, kept in module 2. |
| 6 | Injection safety | **Pass with Fix (F11)** | Lead fields delimited by `<lead_data>`, `<` and `>` stripped so the tag cannot be closed, "ignore instructions" rule, `injection_suspected` flag routes to review and never auto-hot, Make recomputes the tier from criteria (the model's own tier and score are not trusted), model output never selects URLs, recipients or actions, Slack text stripped of `@`, `<`, `>`, `http`. Remaining gap: a successful injection could still raise criteria for a lead with confident, valid JSON; that would be a false hot alert only (task and Slack ping), no data leak. Cover with QA cases 10 and 11. |
| 7 | PII minimisation | **Pass** | Name, email, phone not sent. Company, role, size, budget, timeline, source and message are sent. Free-text message may hold PII typed by the lead. For real client use, note the Anthropic data-processing terms in the handoff doc. |
| 8 | Determinism | **Pass** | Temperature 0.1, fixed labels. |
| 9 | Logging | **Pass** | Data store row: key, status, tier, score, confidence, decision path, prompt version, model. Optional: add the AI reason; not required by the design. |
| 10 | Test set | **N/A for this stage** | Design has 19 cases; QA runs them. |
| 11 | Fallbacks | **Pass** | Provider error: Slack failure alert, then a fallback answer that always routes to review (the contact is still saved). No retry before review (approved option A). |

## Specific checks requested

| Check | Finding |
|---|---|
| Hot 70+, warm 40-69, cold below 40, Make computes tier, threshold 0.70 | **Pass.** `hot_min` 70, `warm_min` 40, `conf_threshold` 0.7 in module 2. `tier_final` computed from the criteria sum, not from the model's tier. A mismatch with the model's tier marks the answer invalid (review). |
| Router filters vs design | **Pass.** Router 3: OR route for invalid or no consent, AND route for valid. Router 12: junk vs not junk. Router 16: hot, and review (invalid, injection, low_confidence). Warm_cold falls out without a route (F14). |
| Claim-first duplicate stop and error text | **Fix / verify (F4).** Fails safe. |
| Prompt injection of lead text | **Pass with F11, F16.** |
| Slack content | **Pass with F10, F16.** No email or name. Excerpt in review messages only. |
| HubSpot task link, `id` field | **Fix / verify (F2, F3).** |
| Formula syntax (validator does not check) | Hand-checked: parentheses in all formulas balance, `switch`, `if`, `contains`, `md5`, `substring`, `get(split())`, `addDays` are used in valid form. Not proven at runtime: `newline`, `ifempty` with 0, `min`/`max` with several arguments, `content[1]`, `substring` when the text is shorter than the end index (confirm with short inputs). Bugs found by reading: F12, F13. |
| Model ID typed as text | **Fix / verify (F8).** |
| Webhook API key and data structure | **Fix (owner), M2.** |
| `portal_id` placeholder | **Fix (owner), M4.** |
| Ops per run vs design | **Pass.** Matches the design table path by path (3 / 3 / 7 / 8 / 9 / 10, +2 repair). Measure on the Make usage page after QA. |

## What QA should prioritise (hand to qa-tester)
1. Case 3 (cold, zeros): proves F1.
2. Case 8 (exact duplicate): quiet stop, no Slack alert, no retry (F4).
3. Case 1 (hot): the contact ID field, the task on the contact in HubSpot, the Slack link with the real portal ID (F2, F3, M4).
4. Cases 4 and 9: no blanks written over existing HubSpot data (F6).
5. Cases 10, 11, 12, 15, 16, 18: injection, junk, repair, provider failure, Slack failure (F5).
6. A call without the API key is rejected (M2).

## Owner actions still open
Create the webhook API key and attach `lead_webhook_v1`; set `portal_id`; invite the Slack app to `#leads`; set the Anthropic monthly spend limit; confirm Make error e-mail is on; open the scenario once in the editor, confirm no warning icons, pick the Claude model from the dropdown if offered.

## Sign-off (first review)
Reviewer does not activate or modify the scenario. Return to builder for M1, M3(b) and the Fix items F1, F7, F10 to F16 as you see fit, then resubmit for a quick re-check before QA. M2, M3(a) and M4 are owner steps.

---

# Re-review after fix round 1

**Date:** 2026-10-18. **Method:** pulled the live blueprint again (`scenarios_get` 6677285, last edit 2026-10-18T05:04, still inactive, `isActive: false`), compared each item with the build-log "Fix round 1" table, and re-traced modules 2, 52, 53, 11, routers 12 and 16 and every Slack alert by hand. Nothing in Make was changed. Formulas are still unproven at runtime; "Fixed" below means the blueprint now contains the correct change.

## Verdict: APPROVE FOR QA once the owner steps below are done

No builder rework is needed to start QA. Every builder-side [must] is closed except the dollar cost figure (M3b), which is a documentation item and does not block testing. It must be closed before the handoff document and before activation. Three small new notes (N1 to N3) are optional.

## Status of every earlier item

| # | Status | Evidence from the live blueprint |
|---|---|---|
| M1 | **Fixed** | Failure alerts in modules 33, 36, 42, 47 all end with `logs: https://us2.make.com/1686600/scenarios/6677285/logs` and carry the module name. No execution ID (not invented, correct). Owner still to check the `us2` host and optionally the mapping panel for an execution ID. |
| M2 | **Still open (owner)** | Not visible in the blueprint. Owner creates the API key on webhook 2949839 and attaches `lead_webhook_v1`. Needed before QA of the real entry and before activation. |
| M3a | **Still open (owner)** | Anthropic monthly spend limit. |
| M3b | **Still open (builder, non-blocking for QA)** | Build log still says cost per run "not looked up". Record a dollar figure for Haiku 4.5 (about 600 in, 200 out tokens) before handoff. The builder had no price source; the owner or a session with web access can supply it. |
| M4 | **Still open (owner)** | `portal_id` in module 2 is still `SET_HUBSPOT_PORTAL_ID`. Needed before QA checks Slack links. |
| F1 | **Fixed (needs run)** | `ifempty` is gone. Missing is `length(toString(x)) = 0` (modules 52, 53). A zero gives `toString(0)` = "0", length 1, so zero stays valid. Negative and over-20 are explicit comparisons (module 53 `flag_out_of_range`). QA case 3 proves it. |
| F2 | **Still open (QA verify)** | `14.id` still used in modules 17, 18, 19. |
| F3 | **Still open (QA verify)** | `hs_task_assigned_contacts` = `14.id`, `hs_timestamp` = `addDays(now; 1)` unchanged. |
| F4 | **Still open (QA verify)** | Filters on module 5 handler unchanged ("duplicate" in message or name). Note: the "Other error" alert now shows only `error.name`, so QA should record the real duplicate error name from case 8. |
| F5 | **Still open (QA verify)** | Ignore inside each alert (34, 37, 43, 48) unchanged. Cases 16 and 18. |
| F6 | **Still open (QA verify, builder says tools cannot fix)** | Module 14 still maps blank first/last name, job title, company, and `""` for the AI fields on review leads (`switch(...; "")`). Cases 4 and 9 decide whether a second route is needed. Accepted as a QA item. |
| F7 | **Fixed** | Split into 52 (`score_final`, `flag_ai_fallback`, `flag_criterion_missing`), 53 (`tier_final`, six rule flags) and 11 (short `decision_code`). Module 11 keeps the same output names, so routers 12 and 16, module 13, 14, 15, 17, 18, 19 are unaffected. Each module is short enough to read. Module 11 still has no scenario note; optional. |
| F8 | **Still open (owner/QA)** | `2.model` = typed `claude-haiku-4-5`. |
| F9 | **Still open (QA verify)** | `6.content[1].text` unchanged. Model module name now recorded in build-log deviation 10 (fixed). |
| F10 | **Fixed** | All four alerts show module name, `error.name` and the logs link only. No `error.message`, no lead fields. |
| F11 | **Fixed (pattern support unproven)** | Module 2 company, role_title, company_size, budget_range, timeline, source and message all run `replace(...; /[\x00-\x1f\x7f]/g; " ")`, then strip `<` and `>`, then truncate. Company and role_title also strip `@`. QA must confirm that Make accepts the regex form (a newline test in the company field, then check the Claude input in the execution log). If Make takes the pattern as plain text, nothing is stripped and the old gap returns. |
| F12 | **Fixed** | `consent_ok` = `switch(lower(trim(1.consent)); "true"; true; "yes"; true; "1"; true; "y"; true; "on"; true; false)`. |
| F13 | **Fixed (needs run)** | `last_name` = `trim(substring(trim(1.name); length(first); length(trim(1.name))))`. "Ann Annabel" gives start 3 and result "Annabel"; one-word name gives empty. Relies on `substring` being zero-based, which matches the other uses; test with two-word, one-word and empty name. |
| F14 | **Fixed in behaviour (builder's alternative accepted)** | Router 16 route 2 (module 19) now filters `decision_code != hot AND != warm_cold`, so every unexpected code, including empty, goes to the review message. Warm/cold (the only intended quiet case) matches neither route and ends. This catches everything that is not hot and not warm/cold. A literal empty fallback route was not added; acceptable. |
| F15 | **Fixed** | All 42 module names are now distinct. Break: "Retry later: <what>" (30, 35, 44, 45, 46, 49, 50, 51). Resume: "Fallback to review: ..." (38, 39, 40). Ignore: "Ignore alert failure: ..." (34, 37, 43, 48). |
| F16 | **Fixed for reason and excerpt; see N1 for company and role** | `reason_clean` (module 11) and the review excerpt (module 19) now remove `@`, `<`, `>`, `://`, `http`, `www`. |
| F17 | **Still open (optional)** | `#leads` hard-coded in 8 modules. |
| F18 to F20 | **Still open (notes for the process doc)** | Weak email check, failed-AI draft display, data-store retention and hash. |

## Specific checks requested

| Check | Result | Evidence |
|---|---|---|
| Logs link in all failure alerts | **Pass** | Modules 33, 36, 42, 47 contain the same `https://us2.make.com/1686600/scenarios/6677285/logs` link. |
| Decision rules and order kept after the split | **Pass** | Module 53 `tier_final` = `if(52.score_final >= hot_min; "hot"; if(>= warm_min; "warm"; "cold"))` with `hot_min` 70, `warm_min` 40 from module 2 (hot 70+, warm 40 to 69, cold below 40). Make computes the tier from the criteria sum, not from the model. Module 11 order: (1) any flag sum > 0 = invalid; (2) `injection_suspected` = injection; (3) `spam_or_junk` and confidence >= 0.70 = junk (spam below 0.70 = low_confidence); (4) confidence < 0.70 = low_confidence; (5) tier hot = hot; (6) warm_cold. This is the design order (section 5). `flag_tier_mismatch` recomputes the tier with the same formula, `flag_score_mismatch` compares the model's score with the sum. |
| Zero-score handling | **Pass** | A cold lead with all zeros and confidence 0.9 raises no flag and becomes warm_cold. The provider-fallback answers (modules 38, 39, 40) are also all zeros but their reason starts "AI fallback", so `flag_ai_fallback` = 1 and they route to review. A genuine zero is never confused with a fallback. Confidence 0 gives `toString(0)` = "0" and is not "missing". |
| Consent values | **Pass** | true, yes, 1, y, on, case-insensitive and trimmed. Anything else (including empty) is no consent. |
| Last-name formula | **Pass (needs run)** | See F13. |
| Router 16 catch-all | **Pass** | See F14. |
| Unique module names | **Pass** | See F15. |
| Control characters and links | **Pass for model input and for reason/excerpt**, with N1 | See F11 and F16. |
| Failure alerts no longer echo lead data | **Pass** | Only module name, `error.name`, logs link. |
| Operations per run | **Pass for per-path numbers; headline figure slightly high** | Traced module by module (routers are free): invalid or duplicate 3 (modules 1, 2, 4 or 5); junk 9 (1, 2, 5, 6, 7, 52, 53, 11, 13); warm/cold 10 (1, 2, 5, 6, 7, 52, 53, 11, 14, 15); review 11 (same plus 19); hot 12 (same plus 17, 18); repair adds 2 (8, 9). These match the build log. For the assumed 100-run mix (20 / 15 / 20 / 35 / 10 invalid-or-duplicate, junk, hot, warm-cold, review) I get 895 ops, about 9.0 per run (about 900 a month), not 9.5. The builder's 9.5 is a slightly conservative round-up; either is fine for the 10,000 plan. `design.md` section 15 still shows the old 3 / 7 / 8 / 9 / 10 and 7.4 per run; add a note there or in the process doc. |

## New notes from this round

| # | Risk | Note | Change |
|---|---|---|---|
| N1 | Low | Company and role_title go into the hot alert (module 18) and the review message (module 19) with `@`, `<`, `>` and control characters removed, but not `://`, `http` or `www`. A lead could put a plain link in the company field and it would appear clickable in `#leads` (previews are off). It can only be the lead's own text, no pings. | In module 2 apply the same `://`, `http`, `www` removals to `company` and `role_title` (note: company is also stored in HubSpot, so better to strip at the Slack message instead). Optional for the demo; list in the process doc if not done. |
| N2 | Low | `flag_ai_fallback` matches the text "AI fallback" in the model's reason. A lead cannot normally make the model write that, but if it does, the result is invalid and goes to review (safe). | None. Mention in the process doc. |
| N3 | Info | Modules 52 and 53 are placed above module 11 in the designer, so the layout is not strictly left to right. | Optional: drag into a row. The scenario description does not yet list the ops estimate; optional. |

The integer check still tests the sum only (0.5 + 0.5 passes); the earlier note stands and Parse JSON typing on `lead_score_v1` is the main guard.

## Remaining owner steps (before QA starts)
1. Webhook 2949839: create the API key (header `x-make-apikey`) and attach data structure `lead_webhook_v1`. Key only in the caller. (M2)
2. Set `portal_id` in module 2 to the HubSpot portal ID. (M4)
3. Set the monthly spend limit in the Anthropic console. (M3a)
4. Invite the Slack app to `#leads`; confirm Make error e-mail is on.
5. Open the scenario once in the editor: no warning icons, pick the Claude model from the dropdown if offered, check that the `us2` host in the alert link matches your address bar, and optionally look for an execution ID in the mapping panel.

## Before handoff (not blocking QA)
Record a dollar cost per run for Haiku 4.5 in `build-log.md` (M3b); move the label from `draft` to `qa` when QA begins; update the ops figure in the design or process doc (about 9 to 9.5 per run, 12 on a hot lead).

## QA priorities added by this round
Case 3 (zeros stay cold, not invalid); a lead with a newline in the company field (regex strip works, F11); a two-word, one-word and empty name (F13); `consent = on` (F12); a duplicate (record the real error name, F4); a company field containing a link (N1); the earlier list (F2, F3, F5, F6, F8, F9, M2).
