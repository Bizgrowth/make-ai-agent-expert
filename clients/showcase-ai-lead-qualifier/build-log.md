# Build Log: AI Lead Qualifier (SHOW-001)

**Status: BUILD STILL STOPPED before any create call (re-checked 2026-10-17, third run). Nothing was created in Make. No scenario exists, so nothing is active.**

## Why it stopped (third check)
After the owner reported creating the six properties by hand, re-ran the read-only live resolve of the HubSpot "Create or Update a Contact" field list (All Fields view, `_method = all`, connection "HubSpot - AI Ops Expert" 11443000, org 6032089, team 1686600). The response was fresh (about 4,000 lines) but still does not contain the six required properties.

| Required property | Result (run 3) |
|---|---|
| demo_record | MISSING |
| ai_lead_score | MISSING |
| ai_lead_tier | MISSING |
| ai_lead_reason | MISSING |
| ai_lead_confidence | MISSING |
| ai_prompt_version | MISSING |

A text search of the full response for "demo", "prompt_version", "confidence" and "ai_lead" found only the existing ai_lead_source and ai_lead_temp. Related custom properties that do exist (unchanged from runs 1 and 2): ai_budget_level, ai_lead_source, ai_lead_temp, ai_timeline.

Possible causes (the tools cannot tell which):
- Make caches the field list per connection; a refresh from the module in the Make editor may be needed.
- The properties were saved under different internal names (HubSpot generates the internal name from the label unless set; for example "AI Lead Score" becomes ai_lead_score only if the internal name was left to default, and "Demo Record" would be demo_record).
- The properties were created in a different HubSpot account/portal than the one connection 11443000 points to.
- The properties are on another object (Companies or Deals) rather than Contacts.
- Not saved yet.

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
1. In HubSpot, Settings > Properties > Contacts, check that all six exist with these exact internal names (open each property, the internal name is shown under the label): demo_record, ai_lead_score, ai_lead_tier, ai_lead_reason, ai_lead_confidence, ai_prompt_version. Confirm it is the same HubSpot account that connection "HubSpot - AI Ops Expert" is linked to.
2. If they exist under other names, tell the builder the names and the design mapping will use those (needs your OK, as it changes the design).
3. Optionally open any HubSpot module in the Make editor with that connection and reload the field list, then tell the builder to re-run.
