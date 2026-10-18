# Build Log: AI Lead Qualifier (SHOW-001)

**Status: BUILT, INACTIVE (draft), 2026-10-18 (fourth run).** Scenario 6677285 exists in folder Showcase and is not active. It has never been run. No test data was sent to HubSpot, Slack or Anthropic. Not yet reviewed or tested (best-practice-reviewer and a separate qa-tester come next).

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

## Flow as built (module ids)
1 Receive lead (webhook) > 2 Normalize and validate (Set variables) > 3 Router "Valid or not"
- Route "Invalid or no consent": 4 Log rejected lead (status rejected, no name/message). Ends.
- Route "Valid and consent": 5 Claim lead (duplicate: quiet Ignore, other error: Slack alert then Break) > 6 Score lead with Claude (Haiku 4.5, temperature 0.1, max 400 tokens, lead text inside `<lead_data>` markers, `<` `>` stripped from all lead fields) > 7 Parse AI answer (repair call 8 + parse 9 on failure, then fallback to review) > 11 Validate AI answer and decide > 12 Router: junk (13 log only) or proceed: 14 Save contact in HubSpot (DEMO flag, AI fields written only for hot and warm/cold; review leads saved unscored) > 15 Update log > 16 Router: hot (17 HubSpot task, 18 Slack hot alert) or review (19 Slack review message). Warm/cold: nothing more.
Error handlers: Break (3 tries, 10 min, incomplete executions stored) on data store, HubSpot and Slack steps; Slack failure alert (then Break) on claim, Claude, HubSpot contact and task; Claude failure resumes with a "AI fallback" answer that always routes to review.
Rubric 5 x 20, hot 70+, warm 40-69, cold below 40, computed by Make (tier_final). Confidence threshold 0.70. Prompt version v1. All as in the design. Cut-offs and threshold are variables in module 2.

## Deviations from the design (and why)
1. **Webhook data structure not attached.** There is no tool to edit an existing webhook, and I created it before deciding. `lead_webhook_v1` (541922) exists but the webhook has no structure set. Mapping still works. Owner step below.
2. **Webhook API key list is empty.** API key authentication is switched on (header `x-make-apikey`) but no key exists yet; the owner creates it (never in files). Until then the scenario cannot be activated safely.
3. **Failure alert link** goes to the general scenarios page of team 1686600 with "open Showcase folder > this scenario > History", not a direct execution link (scenario ID was not known when writing the text; no execution-link variable verified).
4. **Dedupe key** is md5(email) + "-" + md5(submission_id, else message, else submitted_at). The design said hash of email + submission_id (or message + company). Company was dropped because email already identifies the sender. Gap: two submissions from the same email with no submission_id, empty message and no submitted_at look like duplicates.
5. **M6 "Validate and decide" outputs a decision_code** (invalid, injection, junk, low_confidence, hot, warm_cold) instead of separate decision/review_reason fields; routers filter on it. Review reason text is built in the Slack message. Same rules, same order.
6. **No empty "warm/cold" fallback route** on router 16: bundles matching neither route simply stop there (same result).
7. **Hot-lead task link to the contact** uses the module field "Assigned Customer Contacts" with the contact ID from module 14. See "not verified".
8. **Portal ID** is a placeholder variable `portal_id` = `SET_HUBSPOT_PORTAL_ID` in module 2 (I do not know the portal ID). HubSpot links in Slack are wrong until the owner sets it.
9. **Validation depth.** Each module configuration was checked with validate_module_configuration (Slack, HubSpot contact and task, data store, Parse JSON, webhook, Set variables, Claude). The Set variables tool does not check formula syntax, so the Make formulas in modules 2 and 11 were not machine-checked. The full blueprint was accepted by Make's create/update API and read back with scenarios_get (structure confirmed). A schema validation of the complete final blueprint text was not run as a single call (earlier attempts of mine to pass it failed on formatting; partial copies passed). The tester must run the scenario to prove the formulas.

## Not verified (needs the tester or owner)
- HubSpot task-to-contact link (field "Assigned Customer Contacts" accepted by Make, but not proven to create the association). Fallback: HubSpot "Make an API Call".
- Output field name of the contact ID in module 14 (`id` assumed). Used in task, and in Slack links.
- Whether empty first name, last name or job title overwrite existing HubSpot values (design: must not). Test case 4.
- Duplicate-error filter: assumes the error message or name contains "duplicate". Test case 8.
- Make formula behaviour: `ifempty(0; -1)` (if 0 counts as empty, a legitimate zero criterion would route to review: safe but noisy), switch/contains/md5/get(split()) usage, `newline` constant, array index `content[1]`.
- Model id `claude-haiku-4-5` is typed as text; Make's dropdown did not list it by that value (the field is not strictly validated). Pick it from the dropdown in the editor if it complains.
- Claude "Create a Prompt" output path `content[1].text`.
- Premium status of apps: the tools do not show it. Slack, HubSpot, Anthropic Claude, Webhooks, JSON, Tools, Data store are normally standard; confirm on the first save in the editor.
- Cost per run: not looked up on Anthropic's price page this session.

## Manual steps left for the owner
1. In Make: open webhook 2949839 (Webhooks list), create the API key, and attach data structure `lead_webhook_v1`. The key goes only into the caller (test tool or form backend). Never into chat or files.
2. Set `portal_id` in module 2 "Normalize and validate" to the HubSpot portal ID.
3. Confirm the Slack app can post in `#leads` (invite the app to the channel if needed).
4. Set a monthly spend limit in the Anthropic console.
5. Confirm Make error e-mail notifications are on (backstop when Slack itself fails).
6. Open the scenario once in the Make editor, check no module shows a warning icon (HubSpot contact fields, Claude model dropdown, Slack channel), and save.
7. Do not activate until the best-practice review and the separate tester (Gate 2) are done.

## Ops estimate (unchanged from design)
Typical about 7.4 ops per run (3 for invalid or duplicate, 8 warm/cold, 10 hot, plus 2 on a repair call). Not re-measured; nothing has run.

## Rollback
Scenario is inactive. To remove: delete scenario 6677285, then data store 176442, webhook 2949839 and data structures 541922 to 541924 in Make; delete the DEMO contacts in HubSpot by filtering demo_record = true.

## Confirmation
**Scenario 6677285 is INACTIVE. It was not run. No activation was attempted.**
