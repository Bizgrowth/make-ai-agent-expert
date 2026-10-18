# Measurement Plan Template

Copy to `clients/<slug>/measurement-plan.md`. Purpose: every number in a case study comes from a documented measurement. Fill the "Result" and "Evidence" columns during QA, then copy them into `templates/case-study.md`.

## Rules
- Measure on test or sample data and say so. A demo result is a demo result, never a client result.
- Report the sample size (N), the date, the environment and the method next to every number.
- Prefer median and range over a single best figure. Never extrapolate to a client's volume or revenue.
- Estimates stay labelled "estimate" until replaced by a measured figure.
- Keep the evidence (execution IDs, report links, screenshots without secrets).

## Metrics
| # | Metric | Source of truth | Method | N | Result | Date | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Time from submit to routed result | Time sent in the payload vs time of the CRM record or Slack message | Send N test leads of each path; compute difference per lead; report median and max | | | | |
| 2 | Operations and credits per run, by path | Make execution log (operations, credits) | Read each test run's execution record | | | | |
| 3 | AI cost per run | Token counts from the AI module output x the provider's listed rates (state rates and date) | Average input and output tokens over N runs | | | | |
| 4 | Scoring accuracy | Expected tier for each labelled test lead vs actual tier | Count matches; list misses; note false hot and false cold separately | | | | |
| 5 | Safety behaviours | Test cases (duplicates, injection text, junk, low confidence, provider failure) | Pass or fail per case with execution ID | | | | |
| 6 | Reliability | Execution log status | Count runs that errored unexpectedly | | | | |
| 7 | Baseline: the manual process | Stopwatch timing by the owner | Time N real or realistic manual cases from arrival to finished CRM entry; state who timed them and when | | | | |

## Reporting to the case study
- One line per number: "<result>, measured on <N> <test/demo> leads on <date> by <method>."
- If a metric was not measured, leave the case study blank for it. Do not fill it.

## Sign-off
- [ ] Every figure above has evidence attached
- [ ] Owner reviewed on ____
