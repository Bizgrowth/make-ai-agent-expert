# Pattern Library: AI / LLM Workflows

All patterns must meet `playbooks/ai-guardrails.md`.

| Pattern | Flow | Key safeguards |
|---|---|---|
| Classify & route | Inbound text → LLM labels (fixed label set + confidence) → router by label → action; low confidence → review queue | Fixed labels, low temperature, review path |
| Extract from documents | File/email → text/OCR → LLM extracts JSON schema → validate → write to Sheet/CRM/accounting | Schema validation, source link kept, human check on money fields |
| Summarize & brief | Calls/threads/tickets → LLM summary + action items → post to Slack/CRM note | PII minimization, length caps |
| Draft & approve | Trigger → LLM drafts reply/content → approval step (Slack/email button) → send only after approval | Never auto-send high-stakes content |
| Enrich & research | Company/lead → fetch public data → LLM structures profile → CRM fields | Cite sources, flag uncertain fields |
| Agentic multi-step | Make AI Agent or chained scenarios with tools; each tool call validated against allow-lists | Strict tool scopes, step limits, cost caps, full logging |

Prefer deterministic modules for anything a rule can decide; use the LLM only where judgment or language is required.
