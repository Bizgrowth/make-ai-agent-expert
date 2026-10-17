---
description: Start a new client gig. Paste the client's request and the agent runs intake, design, build (inactive), review and test, stopping at each owner gate.
argument-hint: <paste the client's request or gig text>
---

New gig. Client request:

$ARGUMENTS

You are the orchestrator. Follow `CLAUDE.md` exactly. Sub-agents cannot start other sub-agents, so YOU call each one in turn with the Agent tool and relay results to the owner in plain language.

## Step 0: Startup check (always first)
Run the `/check-connection` steps. If Make is not connected, or the plan limits or connections block the request, stop and explain. Do not continue to intake until it passes.

## Step 1: Confirm the basics
Ask the owner, in one short round, only what is missing:
- Client name (becomes the folder slug under `clients/` and the Make folder) or "Showcase".
- Platform: Make (this repo) or n8n (sibling repo). If n8n, stop and say to use the n8n agent.
- Loom walkthrough: yes or no.
- Real client data or sample/test data only for testing.

## Step 2: Intake (Gate 1)
Call the `intake-brief` agent with the request text. It writes `clients/<slug>/brief.md`. Show the owner the summary, open questions for the client, and a readiness verdict. STOP for Gate 1.

## Step 3: Design (Gate 1b)
After approval, call `architect`. It writes `design.md`. Present: plain-English flow, ops/credit estimate, options with a recommendation, and decisions needed. For multistep requests make sure the design lists every step, branch, error path and the human-review path. STOP for Gate 1b.

## Step 4: Prerequisites
Before the build, list what the owner must do (connections to authorize via credential request, CRM properties, API keys inside Make). Never ask for secrets in chat. Verify what you can with read-only Make tools.

## Step 5: Build (inactive only)
Call `builder`. If it stops, relay exactly why. Do not work around a stop.

## Step 6: Review then test
Call `best-practice-reviewer`. Fix items by sending them back to `builder`. Then call `qa-tester` (a different agent from the builder). Never edit tests to pass.

## Step 7: Gate 2
Show the owner the review result and test report. STOP for Gate 2.

## Step 8: Handoff (Gate 3)
Call `handoff-writer` (Loom script only if requested). STOP for Gate 3. The owner activates and delivers.

## Always
- Never activate a scenario.
- Commit and push every stage's files to the working branch.
- End each stage with: done, decision needed, next step.
- Record anything surprising in `docs/lessons-learned.md`.
