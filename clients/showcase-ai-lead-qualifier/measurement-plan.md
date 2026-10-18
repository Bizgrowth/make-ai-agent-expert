# Measurement Plan: AI Lead Qualifier (SHOW-001)

Built from `templates/measurement-plan.md`. Demo project, synthetic data. Fill the Result and Evidence columns during QA.

## Setup notes specific to this build
- Model: Claude Haiku 4.5 (owner decision, 2026-10-18). Listed rates at the time of writing: $1 per million input tokens, $5 per million output tokens (https://platform.claude.com/docs/en/about-claude/pricing). Re-check the live page before publishing a cost.
- Cost per run needs token counts from the Claude module. The builder could not add token fields to the lead log (tools cannot edit a data structure), so read `usage.input_tokens` and `usage.output_tokens` from module 6 (and module 8 for a repair call) in the Make run history of each test run, and cross-check the total against the Anthropic console. Optional: the owner can add tokens_in, tokens_out and completed_at to the log structure by hand, then the builder connects them.
- Time measurement uses the time the test sender puts in `submitted_at`, compared with the Slack message time or HubSpot record time, or the total run time in the Make run history. The log row keeps `created_at` (set about a second after arrival) but no completion time. Use the same clock source for all test leads.
- Expected operations per run (design estimate, to confirm): invalid or duplicate 3; junk 9; warm or cold 10; review 11; hot 12; a repair call adds 2.
- Make credits: 1 operation was logged as 1 credit in the existing scenario; confirm per path from the execution log.

## Test set for accuracy (create before QA)
Write at least 12 synthetic leads with the expected tier decided by the owner before running: 4 hot, 4 warm, 4 cold, plus separate safety cases from the 19-case test plan (duplicate, injection text, junk, no consent, low confidence, provider failure). Record the expected tier in advance so the result cannot be bent to fit.

## Metrics
| # | Metric | Source | Method | N | Result | Date | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Submit to routed result (seconds) | `submitted_at` vs Slack/HubSpot time | Median and max per path | | | | |
| 2 | Operations and credits per path | Make execution log | One record per test run | | | | |
| 3 | AI cost per lead | Token counts x listed Haiku 4.5 rates | Average over N scored runs | | | | |
| 4 | Tier accuracy (and false hot / false cold) | Expected vs actual tier | 12+ labelled leads | | | | |
| 5 | Safety behaviours | 19-case test plan | Pass/fail with execution IDs | | | | |
| 6 | Unexpected errors | Execution log | Count over all test runs | | | | |
| 7 | Manual baseline minutes per lead | Stopwatch by the owner | Time 5 realistic leads, arrival to CRM entry | | | | |

## Case study feed
When the table is complete, copy each result with its method line into `showcase/ai-lead-qualifier/case-study.md` (before/after table) and delete the "to be measured" placeholders it replaces.

## Sign-off
- [ ] Every figure has evidence attached
- [ ] Owner reviewed on ____
