# Owner Approval Gates

The agent stops at each gate and waits for an explicit "approved" from the owner.

## Gate 1 — Brief (and 1b — Design)
- [ ] Goal, trigger, apps and data are correct
- [ ] Open client questions answered or accepted as risks
- [ ] Volume and Make operations estimate are acceptable
- [ ] AI risk level and human-review rule agreed
- [ ] Price/scope matches the quote
- [ ] Design reviewed: module list, error handling, ops estimate, test cases

## Gate 2 — Build + test evidence
- [ ] Scenario is in the correct client team and **inactive**
- [ ] Best-practice review has no open "must" items
- [ ] Test report: all cases pass, ops per run within estimate
- [ ] Alerts go to the right people; failure path verified
- [ ] No secrets or real customer data exposed in notes or logs

## Gate 3 — Final sign-off (owner → client)
- [ ] Process doc reads clearly for a non-technical client
- [ ] Loom script ready (only if ticked)
- [ ] Client has connected their own accounts and approved go-live
- [ ] Owner activates the scenario and watches the first live run
- [ ] Support window and monitoring offer communicated
