# Shared Core (Make agent ↔ n8n agent)

Two sibling repos serve two delivery paths: this one (Make.com) and `Bizgrowth/n8n-ai-agent-expert` (n8n on the owner's VPS). They share the same business process; only the build tooling differs.

## Reuse as-is (tool-agnostic)
- `templates/brief.md`, `templates/process-doc.md`, `templates/test-report.md`, `templates/loom-script.md`
- `checklists/approval-gates.md`
- `playbooks/ai-guardrails.md`
- `playbooks/pricing-scoping.md`
- `playbooks/case-study-and-portfolio.md`, `templates/case-study.md`, `checklists/portfolio-kit.md` (originated from the n8n twin's guidance; keep in sync)
- `playbooks/patterns/*.md` (flows are generic; swap module names)
- Sub-agents `intake-brief` and `handoff-writer` (change only the tool references)
- The `clients/<slug>/` file convention and the Notion "Make Agent HQ" databases (add a "Platform: Make / n8n" field when the n8n twin starts)

## Replace per platform
- `CLAUDE.md` prime directives (team/folder rules, activation rule)
- `playbooks/make-best-practices.md` → n8n best practices (error workflows, credentials, sub-workflows, execution data pruning)
- `architect`, `builder`, `best-practice-reviewer`, `qa-tester`, `template-showcase` (tool lists and platform checks)

## Choosing a platform per gig (add to intake)
- **Make:** client already uses Make, wants no hosting, low-to-moderate volume.
- **n8n:** high volume or heavy AI work, cost-sensitive, or data must stay self-hosted.
- Record the choice in the brief. The brief stays platform-neutral until the architect step.

## Before client work touches the n8n VPS
Serve it over HTTPS on a domain with authentication. Do not send client data to an instance that runs over plain HTTP on a raw IP.
