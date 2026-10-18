# Case Study: AI Lead Qualifier

**Type:** [x] Demo project, synthetic data  [ ] Real client
**Real-client permission:** not applicable (no client involved). Add a written-permission record before any real-client version.
**Status:** scenario built and under test; every result below is a design target or a blank until measured. Do not publish a number without a source.

---

## SHORT VERSION (about 150 words, for Upwork and LinkedIn)
**Demo project, synthetic data.**
**Outcome (design target, to be measured):** every new website lead is scored, saved to the CRM and routed in about a minute, and hot leads reach Slack as they arrive.
**Problem:** leads wait until someone checks the inbox, so the best ones go cold, and CRM entry is manual.
**Approach:** a Make.com automation scores each lead against a plain-English rubric, saves it to HubSpot with the reason, alerts Slack for hot leads, and asks a person whenever the AI is unsure. Duplicates are stopped and every run is logged.
**How I work:** you approve the brief and design, I test before go-live, and it is delivered switched off until you sign off.
**Result:** [to be measured after testing; add the number and how it was measured]
**Next step:** send me your form and CRM and I will map this to your business.

---

## LONG VERSION (about 500 words, for the website and portfolio)
### Outcome
New leads reach the right person in about a minute, instead of whenever someone checks the inbox. (Design target for a demo; measured result to follow.)

### The problem
A small service business gets leads from a website form. Leads wait for a reply, so the best ones go cold. Every lead looks the same, so hot and cold leads get the same attention. Details are copied into the CRM by hand, and some leads never get logged. Nobody can say how many leads arrived this week or which were worth chasing.

### The approach
One automation connects the form, an AI model, the CRM and Slack:
1. A form submission starts it instantly.
2. The details are cleaned and checked.
3. A duplicate lead is stopped before anything else happens.
4. The AI scores the lead on five criteria and explains why.
5. The automation, not the AI, decides hot, warm or cold from the score.
6. The contact is saved to the CRM with the score and reason.
7. Hot leads create a follow-up task and a Slack alert. Anything the AI is unsure about goes to a person. Warm and cold leads are logged quietly.

### The result: before and after
| Measure | Before | After | How measured (what, how, period) |
|---|---|---|---|
| Time from form submit to a scored, routed lead | Whenever the inbox is checked | [target about a minute] | [to be measured: timestamp of submit vs CRM record, over N test leads] |
| Hot lead alert | When someone notices | [in Slack on arrival] | [to be measured: Slack message time vs submit time] |
| CRM entry | Manual copy and paste | Automatic with score and reason | [to be measured: share of test leads saved correctly] |
| Duplicates | Possible | Stopped | [to be measured: duplicate test cases passed] |
| Uncertain cases | Missed or guessed | Sent to a person | [to be measured: low-confidence cases routed to review] |
| Cost per lead | n/a | estimate: about 9 to 12 Make operations plus a fraction of a cent of AI usage | estimate from the design and Anthropic's listed rates, replaced by measured figures from the test runs |

### How the work was run
- **Approval gates:** the brief, the design and the finished build were each approved before the next step.
- **Testing:** a written test plan of 19 cases, run by a separate tester, with a report. [link to excerpt after testing]
- **Handover:** a plain-English guide, and the automation is delivered switched off until sign-off.

### What's next
Tune the scoring rubric to a real business using its own past leads, and add the weekly summary.

### Next step
Send me your form and CRM, and bring your last ten leads. I will show you how they would have been scored.

---

## PROOF
- [ ] Flow Studio recording of the hot-lead run (lead with this): <link to add>
- [ ] Screenshots with no client data or secrets: <to add>
- [ ] Test report excerpt: <to add after testing>

## TESTIMONIAL
Leave empty until a real client gives one in writing.
> "<quote>" — <name, role, company, with permission>

## BEFORE PUBLISHING
- [ ] Every number has a source in the table above
- [ ] Labelled as a demo; no invented results, logos or quotes
- [ ] Platform rules checked (see `checklists/portfolio-kit.md`)
- [ ] Owner approved on ____

## What the client provides
A HubSpot account, a Slack channel, their own AI provider key (they own the usage cost), and a form that can post to a webhook.
