# Selected Work

Source of truth for the "Selected work" section on the site. Edit this file, then
ask Claude to sync it — this file is **not** read by the app directly, it only
gets applied to `src/lib/content.ts` (the `projects` array) when you ask.

Order here is the order projects appear on the page. To add a project, add a new
`##` block. To remove one, delete its block. To reorder, move the block.

---

## Souq Al Tijara
- Role: Tech lead & co-product lead
- Year: 2026 —
- Stack: NestJS, React, Node.js, RabbitMQ, Kafka, Claude AI-assisted
- Blurb: Earned-wage access and fintech platform for a Pakistan-based corporation, letting employees draw earned wages on demand. Built on a NestJS microservices backend with RabbitMQ and Kafka handling real-time processing at scale.
- Link: https://souqaltijara.com

## Testbase360
- Role: Backend lead & co-product lead
- Year: 2025 —
- Stack: NestJS, React, Node.js
- Blurb: Recruiter management portal with candidate assessments and AI-powered scoring, streamlining hiring workflows for recruitment teams.
- Link: https://testbase360.com

## Maybank Lead Management
- Role: Development lead — team of 4
- Year: 2024 — 2025
- Stack: NestJS, Kafka, Hazelcast, MSSQL
- Blurb: NestJS microservices backend replacing Malaysia's largest bank's legacy Salesforce system. Kafka streaming and Hazelcast caching power real-time product recommendations.

## Caary Capital
- Role: Lead developer
- Year: 2022 — 2024
- Stack: Node.js, .NET, React, Codat
- Blurb: Accounting and expense management module for a Canadian business credit and spend platform. QuickBooks/Xero sync via Codat, multi-currency FX, feature parity with Brex.
- Link: https://caary.com

## CreditBook
- Role: Senior full stack developer
- Year: 2022
- Stack: React Native, Node.js, AWS Lambda
- Blurb: Fintech mobile app with 700,000+ installs and 60,000+ daily active users. React Native features backed by AWS Lambda services.

---

## Field guide

- **`##` heading** — the project title, required.
- **Role** — your title/role on the project, required.
- **Year** — e.g. `2024`, `2022 — 2024`, or `2024 —` for ongoing, required.
- **Stack** — comma-separated list of technologies, required.
- **Blurb** — one or two sentences on what it is and what you did, required.
- **Link** — optional. Live URL, shown as the title with an "↗" on the site.
- **Image** — optional. If you have a real screenshot, drop it at
  `public/work/<id>.jpg` (4:3 crops read best) and add `Image: /work/<id>.jpg`
  here. Without one, the site generates an abstract plate automatically.

Anything else (numbering, id slugs, generated-plate color) is derived
automatically when this file is synced — you don't need to manage it here.
