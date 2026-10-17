# Lessons Learned

Add an entry whenever a gig surprises you. Newest first. Keep it short and factual.

## 2026-10-17 — First gig (AI lead qualifier showcase)
- **Make plan:** Core, one team ("My Team"), credits-based (10,000/month). Clients are separated by folder, not team. Public template publishing is not available.
- **Keys vs Connections:** Make's "Keys" area (AES, HTTP Basic, GPG, etc.) is not where an Anthropic API key goes. Use a credential request (`credential-requests_create`) or Connections. The app name for Claude is `anthropic-claude`.
- **Credential requests work well:** the owner clicks the returned link and pastes the key in Make's own form. The key never enters chat.
- **Module names differ from docs:** Slack is "Send a Message"; Tools is "Set variables"; Data store is "Add/replace a record". Verify names with `app-modules_list` (needs the organization ID, 6032089) before designing.
- **Sub-agents cannot run modules or raw API calls.** They can read a module's field list (including HubSpot custom properties). Anything needing a live API call goes to the owner or the main agent.
- **HubSpot custom properties:** the builder checks them through the live field list and stops if any are missing. In the first gig the six required properties were not visible after the owner created them (possible causes: wrong HubSpot account, wrong object, different internal names, stale Make cache). Always confirm the HubSpot account ID (86802464 for connection 11443000) and internal names first.
- **Stop-don't-improvise worked:** the builder halted three times instead of building against missing prerequisites. Keep that rule.
- **Open risk:** whether the data store can refuse to overwrite an existing key (claim-first dedupe). Check as soon as the store exists.
