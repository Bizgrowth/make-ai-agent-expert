---
description: Verify the Make connection, plan limits and required connections before any gig work
---

Run the startup check for the Make agent. Read-only. Do not create or change anything in Make.

1. Call `mcp__Make__users_me` (load it with ToolSearch if needed). If it fails or the Make tools are missing, STOP and tell the owner in plain words:
   - "Make is not connected in this session."
   - Fix: in Claude Code run `/mcp` and sign in to the Make server; if the server is not listed, add `https://mcp.make.com` and sign in to the Make account. In claude.ai sessions, enable the Make connector in the connector settings. Then run `/check-connection` again.
2. Call `mcp__Make__organizations_list`. Record the organization ID, name, team(s), and license limits (teams, operations/credits, interval, template publishing, bring-your-own LLM key). Compare with the "Make plan constraints" in `CLAUDE.md` and flag any difference.
3. Call `mcp__Make__connections_list` for the team. List app connections present (HubSpot, Slack, Gmail, Anthropic Claude, etc.).
4. Report a short table: **Connected / Plan limits / Connections available / Problems**, then one line: "Ready for `/new-gig`" or "Not ready: <what to fix>".
Never ask for or display API keys or tokens.
