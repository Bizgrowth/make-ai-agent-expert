# Make.com AI Agent Expert

A personal Claude Code agent that designs, builds, reviews, tests and documents Make.com scenarios to a consistent best-practice standard. Human in the loop at every gate; never client-facing; never activates a scenario.

## How to use
1. Open this repo in Claude Code and make sure the Make connection is enabled. Run `/check-connection` to confirm.
2. Run `/new-gig` followed by the client's request (paste it after the command). The agent asks which client folder, then runs intake.
3. Approve at each gate (see `checklists/approval-gates.md`). Final sign-off and client delivery are yours.

## Layout
- `CLAUDE.md` — orchestrator rules and workflow
- `.claude/agents/` — 7 specialist sub-agents (intake-brief, architect, builder, best-practice-reviewer, qa-tester, handoff-writer, template-showcase)
- `playbooks/` — Make best practices, AI guardrails, pricing/scoping, pattern libraries
- `templates/` — brief, process doc, test report, Loom script
- `checklists/` — approval gates
- `clients/` — per-client working files
- `showcase/` — reusable templates for Upwork, social media and the website

- `docs/shared-core.md` — what the sibling n8n agent can reuse

## Make plan note
The current plan has one team, so clients are separated by folder and labels inside "My Team". Showcase assets are blueprint exports plus listing copy, since public template publishing is not available on this plan.

## Notion
"Make Agent HQ" holds the Clients tracker, Gigs & Briefs, and Template Library.
