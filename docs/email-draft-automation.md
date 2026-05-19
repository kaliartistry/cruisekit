# CruiseKit Email Draft Automation

CruiseKit uses `info@cruisekit.app` as the public support and lead email.
Incoming messages are forwarded into Gmail. The first automation phase is
draft-only: the system may create Gmail drafts for review, but it must not send,
archive, delete, or mark messages read.

## Scope

The automation should only process messages addressed or delivered to:

```text
info@cruisekit.app
```

It should ignore spam, trash, sent mail, and any message already labeled:

```text
CruiseKit/Draft Created
CruiseKit/Needs Human Review
```

## Labels

```text
CruiseKit/Needs Draft
CruiseKit/Draft Created
CruiseKit/Needs Human Review
```

## Reply Rules

- Create drafts only. Never auto-send.
- Keep replies short, warm, and specific.
- Do not promise live cruise pricing or availability.
- For deal requests, say that prices and availability can change and should be
  confirmed with the cruise line before booking.
- If required details are missing, ask for only the next useful details:
  preferred dates, number of travelers, cabin type, departure port, budget, and
  whether they are flexible.
- For support requests, answer from known CruiseKit behavior and ask for device,
  app version, and screenshot only when useful.
- For data corrections, thank the sender, restate the correction, and say it
  will be reviewed against source material.
- For partnerships, sponsorships, legal, billing, or anything uncertain, create
  a draft that acknowledges receipt and label the message
  `CruiseKit/Needs Human Review`.

## Research Rules

When research is needed, use CruiseKit public pages, repository docs/data, and
official cruise-line sources first. Do not rely on random travel blogs for
pricing, policies, or availability.

## Future Upgrade

After draft quality is reliable, add a notification/export layer for new
`dealLeadRequests` Firestore documents and Gmail messages:

- email notification to `info@cruisekit.app`
- Google Sheet/CRM sync
- App Check and abuse controls
- narrow auto-replies only for safe receipt confirmations
