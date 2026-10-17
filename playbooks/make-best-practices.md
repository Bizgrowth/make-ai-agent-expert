# Make.com Best Practices (build standard)

Every scenario is reviewed against this list. Items marked **[must]** block approval.

## Organization
- **[must]** Name: `<CLIENT> | <Process> | <Trigger> → <Outcome> | vN`. One folder per client; labels: client slug, gig ID, status (`draft`, `qa`, `live`).
- Name every module in plain English (e.g. "Find contact by email"), not the default.
- Add a note on the scenario: purpose, owner, trigger, last change.
- One responsibility per scenario. Split reusable logic into a sub-scenario or webhook-called scenario.

## Triggers
- Prefer **instant webhooks/triggers** over polling when the app supports them (saves operations and latency).
- Polling: set the lowest frequency that meets the business need; limit results per run.
- **[must]** Dedupe: choose a unique key (email, order ID) and check it before creating records; keep a data store of processed IDs where needed.

## Flow control
- Filter early: stop irrelevant bundles right after the trigger to save operations.
- Use routers with a clear fallback route; label every route and filter.
- Aggregate before writing when sending many items to one place (one email/summary, batch API call).
- Use iterators only when needed; watch operation counts (each bundle = 1 op per module).

## Error handling
- **[must]** An error handler on every module that calls an external service.
- Pick deliberately: **Resume** (substitute value), **Ignore** (non-critical), **Break** (retry later with incomplete executions enabled), **Rollback** (all-or-nothing), **Commit** (keep what's done).
- Break + retries for rate limits and temporary outages (e.g. 3 retries, increasing interval).
- **[must]** Failure alert: Slack/email to the owner with scenario name, module, and execution link. Never silent failures.
- Enable "Store incomplete executions" for scenarios that handle money or customer data.

## Data
- Define data structures for webhooks and data stores; validate required fields before use.
- Normalize early: trim text, lowercase emails, standard date formats and time zones.
- Never hard-code IDs or secrets that vary by environment; use variables/data store config.
- Treat missing fields as an expected case, not an exception.

## Security
- **[must]** No secrets in module fields, notes, or logs; use Make connections only.
- Least-privilege scopes on every connection.
- Webhooks: use a secret/header check or IP allow-list where possible; never echo sensitive payloads into notifications.
- Minimize personal data stored; set data-store retention.

## Efficiency & cost
- Estimate ops per run × runs per month; record it in the design and the process doc.
- Avoid searching inside loops; fetch once, map in memory (arrays/`get`/`map` functions).
- Schedule heavy jobs off-peak; set the maximum number of cycles.

## Maintainability
- Another person must understand it in 10 minutes: logical left-to-right flow, grouped modules, notes at tricky logic.
- Version bump the name on material changes; keep a change log in `clients/<client>/build-log.md`.
- Keep a documented rollback: how to pause/deactivate and how to recover missed runs.
