# Pattern Library: Lead Gen / CRM / Sales Ops

Reusable shapes the architect starts from. Always verify modules exist before use.

| Pattern | Flow | Key safeguards |
|---|---|---|
| Form → CRM | Webhook/form trigger → validate → dedupe by email → create/update contact + deal → notify owner | Dedupe key, required-field check, alert on failure |
| AI lead qualifier | New lead → enrich → LLM scores fit (JSON) → route hot/warm/cold → CRM fields + task → Slack ping | AI guardrails, human review for low confidence, scoring rubric stored in a variable |
| Speed-to-lead | New lead → instant acknowledgment email/SMS → assign owner (round robin via data store) → follow-up reminder if untouched | Quiet hours, opt-in check, no duplicate sends |
| Lead nurture | Tag change/stage change → send next touch → log activity | Unsubscribe respected, throttle, stop on reply |
| Pipeline hygiene | Scheduled scan → find stale/missing-field deals → digest to owner | Read-only first, limit batch size |
| Meeting booked sync | Calendar/booking event → CRM meeting + stage update → prep brief | Time zone normalization |

Common data: lead source, UTM fields, consent flag, owner, score, stage, last-touch date.
