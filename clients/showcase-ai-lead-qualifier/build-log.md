# Build Log: AI Lead Qualifier (SHOW-001)

**Status: BUILD STILL STOPPED before any create call (re-checked 2026-10-17, second run). Nothing was created in Make. No scenario exists, so nothing is active.**

## Why it stopped (second check)
Re-ran the read-only check: resolved the contact field list of the HubSpot "Create or Update a Contact" module (All Fields view, connection "HubSpot - AI Ops Expert" 11443000). The six required properties are still not in the list.

| Required property | Result (run 2) |
|---|---|
| demo_record | MISSING |
| ai_lead_score | MISSING |
| ai_lead_tier | MISSING |
| ai_lead_reason | MISSING |
| ai_lead_confidence | MISSING |
| ai_prompt_version | MISSING |

No field containing "demo", "prompt_version" or "confidence" appears at all. Only these related custom properties exist: ai_budget_level, ai_lead_source, ai_lead_temp, ai_timeline (unchanged from run 1).

Possible causes: properties not created or saved yet, created under different internal names, or Make serving a cached field list. The tools cannot tell which. A fresh module refresh in the Make editor, or checking HubSpot Settings > Properties > Contacts, would show it.

## Module verification (org 6032089), from run 1
- Webhooks (`gateway` v1): CustomWebHook exists; takes a hook ID.
- HubSpot (`hubspotcrm` v2): upsertAContact, createATask, MakeAPICall exist. Create a Task has `associations` (type IDs 204, 192, 216, 230) and `hs_task_assigned_contacts`; target record ID field not visible, so task-to-contact link is not confirmed.
- Anthropic Claude (`anthropic-claude` v1): createAMessage ("Create a Prompt") has model, max_tokens, messages, advanced `system` and `temperature`. Confirmed.
- Slack (`slack` v4): CreateMessage, UI label "Send a Message". Our connection is slack2.
- Data store (`datastore` v1): AddRecord labelled "Add/replace a record"; overwrite option NOT confirmed until a store exists.
- Tools app is `util`; module "Set variables" (SetVariables).
- JSON (`json` v1): ParseJSON exists.
- Premium status not shown by the tools.

## Created in Make
Nothing (no folder, data structure, data store, webhook, scenario or label).

## Owner actions needed
1. In HubSpot create the six contact properties with these exact internal names: demo_record, ai_lead_score, ai_lead_tier, ai_lead_reason, ai_lead_confidence, ai_prompt_version (or tell us they exist under other names and we map to those).
2. Tell the builder to re-run.
