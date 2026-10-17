# Showcase Template: AI Lead Qualifier → CRM

**Category:** Lead gen / CRM + AI · **Status:** Idea (needs intake → design → build in Sandbox team)

## Pitch
Every new lead is scored and routed in seconds: hot leads reach you instantly with context, cold leads get nurtured, nothing falls through the cracks.

## Flow (draft)
Form/webhook → validate + dedupe → enrich → LLM scores fit against a rubric (JSON: score, tier, reason, confidence) → validation → router (hot / warm / cold / review) → CRM contact + deal + task → Slack/email alert for hot leads → log to data store.

## Guardrails
Fixed rubric in a variable, confidence threshold → human review queue, cost cap, PII minimization, injection-safe handling of free-text form fields.

## Typical apps
Form tool or webhook, CRM (HubSpot or similar), Slack/Gmail, Claude/OpenAI, data store.

## Open decisions for design
Which CRM to demo, scoring rubric inputs, hot-lead SLA.
