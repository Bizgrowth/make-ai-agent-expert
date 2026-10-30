# Playbooks: Index

How the pieces fit together:

- `CLAUDE.md` (repo root) is the overall rulebook: prime directives, the 7-stage workflow and the owner gates. Start there.
- The playbooks below are the standards and guides the rulebook points to. Each one has a single job.
- `docs/lessons-learned.md` is the diary of what each gig taught. At Gate 3, durable lessons get promoted into the playbook they belong to, so the playbooks stay the single source of truth.

## Build standards (used on every gig)
| Playbook | Use it when | Who reads it |
|---|---|---|
| `make-best-practices.md` | Designing, building and reviewing any scenario. Items marked **[must]** block approval. Includes the "Before you build" prerequisites. | architect, builder, best-practice-reviewer |
| `ai-guardrails.md` | Any scenario with an LLM step. Structured output, validation, human review, cost cap, injection safety. | architect, builder, reviewer |

## Selling and positioning
| Playbook | Use it when | Who reads it |
|---|---|---|
| `pricing-scoping.md` | Sizing a gig and drafting a quote during intake. Heuristics, not market data. | intake-brief, owner |
| `case-study-and-portfolio.md` | Packaging a finished build for Upwork, Fiverr, LinkedIn or the website. | template-showcase, owner |

## Pattern libraries (starting shapes for designs)
Always verify modules exist before use.

| File | Covers |
|---|---|
| `patterns/lead-gen-crm.md` | Form to CRM, AI lead qualifier, speed-to-lead, nurture, pipeline hygiene |
| `patterns/ai-workflows.md` | LLM-based workflows |
| `patterns/back-office.md` | Back-office operations |
| `patterns/ecommerce-support.md` | E-commerce and support |

## Related files outside this folder
- `checklists/approval-gates.md` (Gates 1, 1b, 2, 3) and `checklists/portfolio-kit.md`
- `templates/` (brief, process doc, test report, Loom script, case study, measurement plan)
- `docs/shared-core.md` (what the sibling n8n agent can reuse)

## Keeping playbooks current
1. During a gig, add anything surprising to `docs/lessons-learned.md`.
2. At Gate 3, review the new entries. Move durable ones into the matching playbook.
3. Tag each moved entry `→ promoted to <file>` in the lessons file. Untagged entries are still waiting for review.
4. Playbooks marked as shared in `docs/shared-core.md` should be mirrored to the n8n twin when they change.
