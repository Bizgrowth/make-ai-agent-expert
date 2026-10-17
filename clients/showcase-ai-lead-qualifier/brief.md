# Automation Brief — AI Lead Qualifier → CRM (Showcase)

**Client:** Internal showcase (AI Ops Expert) · **Make team:** My Team (ID 1686600) — the only team on the plan; folder `Showcase` · **Gig ID:** SHOW-001 · **Source:** Website / Upwork / Social (marketing template)
**Date:** 2026-10-17 · **Loom walkthrough?** [ ] yes [ ] no — TBD (owner to tick)

## 1. Business goal
- Problem today: inbound leads wait for manual review, hot leads get slow replies, CRM data is inconsistent.
- Desired outcome and success metric: every lead is scored and routed within about a minute; hot leads alert the owner immediately. Metric for demo: time from submission to alert/CRM record.
- Time/cost saved (estimate): TBD — to be stated as a typical range only after the demo is tested.

## 2. Trigger
- Web-form submission via **Make custom webhook** (assumed; owner did not choose a source). Demo volume is low and on demand.

## 3. Systems & access
| App | Role | Make module exists? | Connection ready? | Notes |
|---|---|---|---|---|
| Webhook (Make) | Lead intake | Yes (built-in) | n/a | Needs a data structure for form fields |
| HubSpot | CRM contacts + tasks | To verify in design | Yes — "HubSpot - AI Ops Expert" (ID 11443000) | Existing scenario "Setup - Create HubSpot Contact Property" may already cover the DEMO property; verify |
| Slack | Hot-lead and review alerts | To verify in design | Yes — owner's Slack (ID 11454186) | Channel TBD |
| Claude or OpenAI | Lead scoring | To verify in design | Not in Make yet | Plan allows bring-your-own-key; owner authorizes in Make, never in chat |

## 4. Data
- Fields in: name, email, company, role/title, company size, budget range, timeline, free-text message, source/UTM, consent flag.
- Fields out: HubSpot contact (with DEMO tag and AI score fields), task for hot leads, Slack alert, log row.
- Sensitive/personal data: contact details only. Send the model only the fields needed for scoring.
- Sample data available? No — use synthetic leads only.

## 5. Logic & rules
1. Receive lead, validate required fields (email, company), normalize (trim, lowercase email).
2. Dedupe by email against HubSpot; update the existing contact instead of creating a duplicate.
3. LLM scores fit with a **generic B2B rubric** (company size, role seniority, budget signal, urgency, service fit) and returns JSON: `score`, `tier` (hot/warm/cold), `reason`, `confidence`.
4. Validate the JSON. Route:
   - **Hot:** HubSpot contact + task, and instant Slack alert (owner-selected).
   - **Warm / Cold:** HubSpot contact with DEMO tag, no alert. *(Proposed default; owner only specified Hot. Confirm.)*
   - **Low confidence or invalid output:** Slack review message for owner decision. *(Required by AI guardrails.)*
5. All HubSpot records carry a **DEMO** tag so they can be filtered or deleted.
- Edge cases: missing fields, duplicates, spam/junk text, prompt-injection text in the message field, HubSpot or Slack outage.

## 6. AI / LLM step
- Task: classify and score a lead. Risk level: low (internal demo), but guardrails apply because this is a sellable template.
- Human-review rule: confidence below the threshold (value to set in design) or failed validation goes to Slack review.
- Acceptable error rate: to set after a 10-case test set.

## 7. Volume & cost
- Runs per month: demo only, assume up to 100.
- Estimated operations per run: about 9–10 (webhook, validate, HubSpot search, LLM, parse, router, HubSpot write, task or alert). → about 1,000 per month, roughly 10% of the plan's 10,000. *(Estimate; architect to confirm.)*
- Plan: Make Core, 10,000 operations per month, 1 team, webhook logs kept 3 days.

## 8. Failure handling
- Owner alerted in Slack with scenario name, failing module and execution link. HubSpot or LLM errors retry with backoff, then go to the review path.

## 9. Delivery
- Deadline: none · Budget: n/a (internal) · Delivered inactive; owner activates.
- Showcase outputs after QA: blueprint export, Upwork gig draft, social posts, website blurb. Publishing a public Make template is not available on this plan.

## 10. Open questions
- Which Slack channel for hot-lead alerts and for review items?
- Confirm Warm/Cold handling (HubSpot only, no alert).
- Which LLM (Claude or OpenAI) and who adds the key in Make?
- Does the DEMO property already exist in HubSpot?
- Loom walkthrough: yes or no?

## Summary & readiness
A web-form lead is scored by an AI against a standard B2B rubric and routed: hot leads create a HubSpot task and a Slack alert, warm and cold leads are logged quietly, and uncertain results go to you for review. Everything is tagged DEMO and built inactive in your single Make team. **Ready for design? Yes**, once the open questions above are answered (the Slack channel and LLM choice are needed before build, not design).

**Gate 1 — Owner approval:** [x] approved on 2026-10-17

### Owner decisions at Gate 1
- Warm/Cold: HubSpot contact with DEMO tag only, no alert (confirmed).
- Slack channel for hot-lead alerts and review items: `#leads`.
- LLM: Claude. Owner adds the API key in Make (never in chat).
- DEMO property in HubSpot: unknown. Architect/builder must verify before relying on it.
- Loom walkthrough: no (do not create `loom-script.md`).
- Scenario is new and separate; "Showcase Hub – Lead, Inbox, Scorecard (router)" is not modified.
