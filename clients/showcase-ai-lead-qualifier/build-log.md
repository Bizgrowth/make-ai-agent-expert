# Build Log: AI Lead Qualifier (SHOW-001)

**Status: BUILT, INACTIVE (draft), fix round 1 applied 2026-10-18.** Scenario 6677285 exists in folder Showcase and is not active. It has never been run. No test data was sent to HubSpot, Slack or Anthropic. Reviewed once (review.md, sent back); fix round 1 below; needs a quick re-check, then the separate qa-tester.

## Step 1: HubSpot properties (resolved)
Live field list of "Create or Update a Contact" (connection 11443000, All Fields) now shows all six: demo_record (boolean), ai_lead_score (number), ai_lead_tier (text), ai_lead_reason (text), ai_lead_confidence (number), ai_prompt_version (text). Earlier runs (1 to 3) did not show them; the list had been cached.

## Created in Make (org 6032089, team 1686600)
| Item | ID |
|---|---|
| Folder `Showcase` | 287596 |
| Data structure `lead_webhook_v1` | 541922 |
| Data structure `lead_score_v1` (used by Parse JSON) | 541923 |
| Data structure `showcase_lead_log_v1` | 541924 |
| Data store `showcase_lead_log` (1 MB) | 176442 |
| Webhook "SHOW-001 AI Lead Qualifier - Lead Intake" | 2949839 (URL not recorded here) |
| Scenario `SHOWCASE \| AI Lead Qualifier \| Webhook -> Score + HubSpot + Slack \| v1` | 6677285 (inactive) |
| Labels `showcase` / `SHOW-001` / `draft` | 1707 / 1708 / 1709 (all assigned to the scenario) |

Connections used: HubSpot 11443000, Slack 11454186, Anthropic Claude 11764663. Scenarios 6483275 and 6476840 were not touched (only listed). Extra data structures were needed beyond the design's two because the data store needs its own record structure.

## Step 3: duplicate stop is supported
Data store "Add/replace a record" has the field "Overwrite an existing record" (boolean, default false). With it off, an existing key raises an error, so the claim-first design works. Claim module (id 5) has overwrite false. Rejected-lead log (id 4) uses overwrite true and the key prefix `rejected-` so a later valid resubmission of the same lead is not blocked.

## Flow as built (module ids), after fix round 1
1 Receive lead (webhook) > 2 Normalize and validate (Set variables) > 3 Router "Valid or not"
- Route "Invalid or no consent": 4 Log rejected lead (status rejected, no name/message). Ends.
- Route "Valid and consent": 5 Claim lead (duplicate: quiet Ignore, other error: Slack alert then Break) > 6 Score lead with Claude (Haiku 4.5, temperature 0.1, max 400 tokens, lead text inside `<lead_data>` markers, `<` `>` and control characters stripped from all lead fields) > 7 Parse AI answer (repair call 8 + parse 9 on failure, then fallback to review) > **52 Check 1: add up criteria, spot gaps > 53 Check 2: tier from score, rule flags** > 11 Decide route > 12 Router: junk (13 log only) or proceed: 14 Save contact in HubSpot (DEMO flag, AI fields written only for hot and warm/cold; review leads saved unscored) > 15 Update log > 16 Router: hot (17 HubSpot task, 18 Slack hot alert) or review (19 Slack review message, now also the catch-all for any unexpected code). Warm/cold: nothing more.
Error handlers: Break (3 tries, 10 min, incomplete executions stored) on data store, HubSpot and Slack steps; Slack failure alert (then Break) on claim, Claude, HubSpot contact and task; Claude failure resumes with a "AI fallback" answer that always routes to review.
Rubric 5 x 20, hot 70+, warm 40-69, cold below 40, computed by Make (tier_final in module 53). Confidence threshold 0.70. Prompt version v1. All as in the design. Cut-offs and threshold are variables in module 2.

## Deviations from the design (and why)
1. **Webhook data structure not attached.** There is no tool to edit an existing webhook, and I created it before deciding. `lead_webhook_v1` (541922) exists but the webhook has no structure set. Mapping still works. Owner step below.
2. **Webhook API key list is empty.** API key authentication is switched on (header `x-make-apikey`) but no key exists yet; the owner creates it (never in files). Until then the scenario cannot be activated safely.
3. ~~Failure alert link generic~~ Fixed in fix round 1 (direct link to this scenario's logs page).
4. **Dedupe key** is md5(email) + "-" + md5(submission_id, else message, else submitted_at). The design said hash of email + submission_id (or message + company). Company was dropped because email already identifies the sender. Gap: two submissions from the same email with no submission_id, empty message and no submitted_at look like duplicates.
5. **Validate and decide outputs a decision_code** (invalid, injection, junk, low_confidence, hot, warm_cold) instead of separate decision/review_reason fields; routers filter on it. Review reason text is built in the Slack message. Same rules, same order. Since fix round 1 the checks are spread over modules 52, 53 and 11.
6. ~~No fallback route on router 16~~ Addressed in fix round 1 (see item 6 below).
7. **Hot-lead task link to the contact** uses the module field "Assigned Customer Contacts" with the contact ID from module 14. See "not verified".
8. **Portal ID** is a placeholder variable `portal_id` = `SET_HUBSPOT_PORTAL_ID` in module 2 (I do not know the portal ID). HubSpot links in Slack are wrong until the owner sets it.
9. **Validation depth.** Each changed module configuration was checked with validate_module_configuration and the full blueprint with validate_blueprint_schema (both valid). The Set variables tool does not check formula syntax, so the Make formulas in modules 2, 52, 53 and 11 were not machine-checked. The tester must run the scenario to prove them.
10. **Model call module** is `anthropic-claude:createAMessage` (label "Create a Message"), not "Create a Prompt" as named in the design. Same function.

## Fix round 1 (after best-practice review, 2026-10-18)
Blueprint updated in place (scenario ID unchanged, still inactive, not run). Every changed Set variables and Slack config passed validate_module_configuration; the full blueprint passed validate_blueprint_schema before the update.

| # | Change | Done |
|---|---|---|
| 1 (M1) | All four failure alerts (modules 33, 36, 42, 47) now link to `https://us2.make.com/1686600/scenarios/6677285/logs`. No execution-ID variable used: the tools cannot show whether the editor offers one, and I did not invent one. Owner may check the mapping panel and add it. | Yes |
| 2 (F7) | `decision_code` split into chained steps. Module 52 "Check 1": `score_final` (sum of five criteria), `flag_ai_fallback`, `flag_criterion_missing`. Module 53 "Check 2": `tier_final` (hot 70+, warm 40-69, cold below 40, from the sum, cut-offs from module 2), `flag_out_of_range`, `flag_score_mismatch`, `flag_not_whole_number`, `flag_confidence_bad`, `flag_tier_mismatch`, `flag_reason_too_long`. Module 11 keeps its id and output names (`score_final`, `tier_final`, `decision_code`, `reason_clean`), so no downstream reference changed. Rule order unchanged: any flag = invalid; injection; junk (confident); low confidence (0.70); hot; warm/cold. Cost: +2 operations on every run that reaches the AI (hot 12, review 11, warm/cold 10, junk 9; invalid and duplicate unchanged at 3; repair call still +2). | Yes |
| 3 (F1) | `ifempty(x; -1)` removed. Missing = `length(toString(x)) = 0`; a criterion or confidence of 0 now stays 0 (cold). Negative and over-20 checks are separate explicit comparisons. | Yes (formula unproven until run) |
| 4 (F12) | `consent_ok` accepts true, yes, 1, y and on (case-insensitive, trimmed). | Yes |
| 5 (F13) | `last_name` = text after the first name's length in the trimmed full name, trimmed. "Ann Annabel" gives "Annabel"; one-word name gives empty. Uses `substring`, not `slice`, because slice indexing is not verified. | Yes (unproven until run) |
| 6 (F14, F15) | Router 16: route 2 (module 19) now has the filter "decision_code not hot AND not warm_cold", so any unexpected code lands in the review message instead of vanishing. Warm/cold still ends quietly by design. I did not add a literal empty route because a route without modules is not reliably accepted in the blueprint, and the tools cannot show Make's "fallback" flag. Duplicate names fixed: Break modules are now "Retry later: <what it protects>" (ids 30, 35, 44, 45, 46, 49, 50, 51); Resume modules are "Fallback to review: ..." (38, 39, 40); the four Ignore modules are "Ignore alert failure: ..." (34, 37, 43, 48). | Yes |
| 7 (F11, F16) | In module 2, company, role_title, company_size, budget_range, timeline, source and message now have all control characters (including newlines, tabs, carriage returns) replaced by a space, using a pattern match (`/[\x00-\x1f\x7f]/g`), before `<`, `>` and truncation. This replaces the `newline` constant, which was never verified. The link sanitiser now also removes `://` and `www` (in `reason_clean` and the review message excerpt), in addition to `http`. | Yes (pattern-match support unproven until run) |
| 8 (F10) | Failure alerts now read: module name, error type (`error.name`) and the logs link. No error text, so no lead data is echoed. | Yes |
| 9 (F6) | Not possible with the tools. The HubSpot "Create or Update a Contact" module (v2) schema shows no option to omit blank fields. Blank first name, last name, job title or company, and the blank AI fields on review leads, may overwrite stored values. Left as is and handed to QA (cases 4 and 9). Fallback if QA shows overwriting: split the path so blanks are never mapped, or use HubSpot "Make an API Call" to send only filled properties. | No |

Not done from the review (outside this round's scope): M2 webhook key and structure (owner), M3 cost figure and Anthropic spend limit (cost per run still not looked up, see below), M4 portal ID (owner), F17 channel as variable (optional), F8 model dropdown (owner/QA), F18 to F20 notes for the process doc.

Layout note: modules 52 and 53 were placed above module 11 in the designer; the owner may want to drag them into a left-to-right row.

## Not verified (left for the tester or owner)
- HubSpot task-to-contact link (field "Assigned Customer Contacts" accepted by Make, but not proven to create the association). Fallback: HubSpot "Make an API Call".
- Output field name of the contact ID in module 14 (`id` assumed). Used in task, and in Slack links.
- Duplicate-error filter: assumes the error message or name contains "duplicate". Test case 8. Note: the "Other error" alert now shows only `error.name`, so check the real error name in the first duplicate test.
- Claude model id `claude-haiku-4-5` is typed as text (not checked by Make) and the output path `6.content[1].text` is assumed. Check in the first run; pick the model from the dropdown in the editor if offered.
- Alert-chain behaviour when Slack itself fails (does Ignore on the alert let the next step, Resume or Break, still run?). Test cases 16 and 18.
- New formulas (modules 2, 52, 53, 11): pattern replace with control characters, `toString`, `floor`, `max`, `substring` on short text, comparisons on empty values. Run the 19 cases, starting with a cold lead with zeros (case 3), a two-word and a one-word name, a lead with a newline in the company field, and `consent = on`.
- Whether empty first/last name or job title overwrite HubSpot values (item 9 above).
- Premium status of apps: the tools do not show it. Confirm on the first save in the editor.
- Cost per run: not looked up on Anthropic's price page this session (review M3b still open).

## Manual steps left for the owner
1. In Make: open webhook 2949839 (Webhooks list), create the API key, and attach data structure `lead_webhook_v1`. The key goes only into the caller (test tool or form backend). Never into chat or files.
2. Set `portal_id` in module 2 "Normalize and validate" to the HubSpot portal ID.
3. Confirm the Slack app can post in `#leads` (invite the app to the channel if needed).
4. Set a monthly spend limit in the Anthropic console.
5. Confirm Make error e-mail notifications are on (backstop when Slack itself fails).
6. Open the scenario once in the Make editor, check no module shows a warning icon (HubSpot contact fields, Claude model dropdown, Slack channel), and save. Optionally check whether the mapping panel offers an execution ID for the alerts.
7. Do not activate until the best-practice re-check and the separate tester (Gate 2) are done.

## Ops estimate (updated)
Per run: 3 for invalid or duplicate, 9 junk, 10 warm/cold, 11 review, 12 hot, plus 2 on a repair call (was 7 / 8 / 9 / 10 before the two extra check steps). Assumed mix of 100 runs (20 invalid or duplicate, 15 junk, 20 hot, 35 warm/cold, 10 review) gives about 9.5 per run, roughly 950 a month. Not re-measured; nothing has run.

## Rollback
Scenario is inactive. To remove: delete scenario 6677285, then data store 176442, webhook 2949839 and data structures 541922 to 541924 in Make; delete the DEMO contacts in HubSpot by filtering demo_record = true.

## Confirmation
**Scenario 6677285 is INACTIVE. It was not run. No activation was attempted. Scenarios 6483275 and 6476840 were not touched.**
