# Case Study: AI Lead Qualifier (demo build)

**Status:** demo scenario, not yet built or measured. Every result below is either a design target or a blank for you to fill in after testing. Do not publish a number you have not measured. Use a fictional or anonymized business, never a real client name without written permission.

## The situation (before)
A small service business gets leads from a website form. The owner checks the inbox when they can.
- Leads wait hours for a reply, so the best ones go cold.
- Every lead looks the same, so hot and cold leads get the same attention.
- Details are copied into the CRM by hand, and some leads never get logged.
- Nobody can say how many leads came in this week or which ones were worth chasing.

## What was built (after)
One Make scenario connects the website form, Claude, HubSpot and Slack.
1. **Form submission arrives** and starts the scenario instantly (webhook).
2. **Clean and validate:** trims text, standardizes the email, checks required fields and consent.
3. **Duplicate check:** a lead already seen is stopped, so no double tasks or alerts.
4. **AI scoring:** Claude scores the lead on five criteria and returns structured JSON with a confidence value.
5. **Safety check:** Make verifies the answer and works out hot, warm or cold itself from the score.
6. **CRM record:** the contact is created or updated in HubSpot with the score, tier and reason.
7. **Routing:**
   - **Hot:** a follow-up task in HubSpot plus an instant Slack alert.
   - **Unsure or invalid answer:** a Slack message asks a person to decide. The AI never acts on its own in doubtful cases.
   - **Warm or cold:** logged quietly, no alert.

## Before and after
| | Before | After (design) | Measured result |
|---|---|---|---|
| Time to first look at a new lead | When someone checks the inbox | Scored and routed automatically, target about a minute | [fill in after testing] |
| Hot leads noticed | Whenever seen | Alert in Slack as they arrive | [fill in] |
| CRM entry | Manual copy and paste | Automatic, with score and reason | [fill in] |
| Duplicates | Possible | Stopped at the door | [fill in] |
| Uncertain cases | Missed or guessed | Sent to a person for review | [fill in] |
| Cost per lead (Make credits) | n/a | about 7 to 10 operations (estimate) | [fill in from execution log] |

## Safety built in
- A person reviews anything the AI is unsure about.
- Make, not the AI, assigns the hot/warm/cold label.
- Duplicate leads are stopped before any task or alert.
- Lead text is treated as untrusted, so instructions hidden in a form message cannot steer the AI.
- Demo records are tagged so they can be deleted in one step.
- The scenario is delivered switched off until the owner approves going live.

## How to fill in real numbers
1. Run the 19 test cases and a batch of sample leads.
2. Read operations, credits and duration from Make's execution log (the Flow Studio "Real runs" tab shows them).
3. Time one manual lead from arrival to CRM entry for the "before" figure, and say how you measured it.
4. Replace each blank above. Leave out any figure you cannot show a source for.

## What the client needs to provide
A HubSpot account, a Slack channel, their own AI provider key (they own the usage cost), and a form that can post to a webhook.
