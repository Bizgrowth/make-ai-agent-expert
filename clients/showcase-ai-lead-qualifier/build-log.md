# Build Log: AI Lead Qualifier (SHOW-001)

**Status: BUILD STOPPED before any create call (2026-10-17). Nothing was created in Make. No scenario exists, so nothing is active.**

## Why it stopped
The six required HubSpot contact properties are not present on the connected HubSpot account ("HubSpot - AI Ops Expert", 11443000). Read-only check done by resolving the contact field list of the HubSpot "Create or Update a Contact" module (All Fields view) through that connection.

| Required property | Result |
|---|---|
| demo_record | MISSING |
| ai_lead_score | MISSING |
| ai_lead_tier | MISSING |
| ai_lead_reason | MISSING |
| ai_lead_confidence | MISSING |
| ai_prompt_version | MISSING |

Custom properties that DO exist and look related (different names): ai_budget_level, ai_lead_source, ai_lead_temp, ai_timeline. Possible causes: properties not saved yet, created under different internal names, or Make is showing a cached field list. Not able to tell which from here.

## Module verification (org 6032089)
Verified via app-modules_list / app-module_get / validate_module_configuration:
- Webhooks (`gateway` v1): CustomWebHook (instant trigger) exists; takes a hook ID.
- HubSpot (`hubspotcrm` v2): upsertAContact ("Create or Update a Contact"), createATask, MakeAPICall exist. Create a Task has an `associations` field (association category + type ID; offered type IDs 204, 192, 216, 230) and `hs_task_assigned_contacts`. The target record ID field for the association was not visible in the schema, so linking the task to the contact is not fully confirmed. Task owner list shows one owner only.
- Anthropic Claude (`anthropic-claude` v1): createAMessage ("Create a Prompt") has required model, max_tokens, messages, plus advanced `system` (system prompt) and `temperature` (0 to 1, default 1). Confirmed.
- Slack (`slack` v4): CreateMessage, UI label "Send a Message" (design said "Create a Message"). Channel can be entered by name. Connection types accepted: slack2 / slack3 (our connection is slack2).
- Data store (`datastore` v1): AddRecord is labelled "Add/replace a record"; UpdateRecord exists. Whether an "overwrite" switch exists (needed so a duplicate key raises an error for claim-first dedupe) is NOT confirmed; its fields depend on the data store and can only be seen after it exists. If AddRecord always replaces, claim-first needs a different approach (e.g. "Check the existence of a record" first), which changes the design. Needs the owner's decision if it turns out so.
- Tools: the app is `util` (not `tools`). "Set variables" (SetVariables, plural, label "Set variables") exists; design said "Set multiple variables".
- JSON (`json` v1): ParseJSON exists.
- Premium status not shown by the tools for any of these; org license shows premiumApps: 1 (limit), not an app-level confirmation.

## Not verified
- Cannot run modules with my tools, so the HubSpot "Make an API Call" property read was not used; the module-schema method above was used instead.
- Data store overwrite option, task-to-contact association target field, hash function names for the dedupe key.

## Created in Make
Nothing (no folder, data structure, data store, webhook, scenario or label).

## Owner actions needed
1. In HubSpot create the six contact properties (internal names exactly as above), or confirm they exist under other names.
2. Tell the builder to re-run; then the build continues (folder `Showcase`, data structures, data store `showcase_lead_log`, webhook with API-key protection, scenario inactive).
