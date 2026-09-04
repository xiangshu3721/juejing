# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (user-selected). App Router. Server route calls DeepSeek with a server-only API key shared by all users. Client stores review history locally (no account system). Key must never be prefixed with NEXT_PUBLIC_.

## Users

Primary: therapists who have studied healing-related knowledge and are starting real client sessions (0 to 1), with limited practical experience. They sit down after a session, often on a laptop or phone, and need to know how that session went.

## Product Purpose

JueLens (觉镜) is an AI session-review and professional-growth assistant. After one client session, the therapist submits the transcript or notes; the product returns a short professional review covering the client, the therapist's work, and what to do next.

Success is not registration count. Success is: the therapist feels the AI saw something they had missed; they come back after the next session; they would pay for ongoing review.

## Positioning

Brand claim: 看见来访者，也看见自己.

The product is a structured five-part review of one completed session, written for the therapist's growth. It is not a client-facing companion, not diagnosis, not live supervision, and not a CRM.

## Operating Context

Workflow: Home → Start a review → Enter case name, session number, paste or upload transcript (TXT / DOCX / PDF), optional focus question → Start AI review → Read five-section report → Auto-save → Return home to reopen history.

Use on desktop (long paste, long reading) and phone (paste notes, reread reports). Content max width 900–1100px on desktop. Single column on mobile; primary buttons full width.

## Capabilities and Constraints

In scope:

- Paste session text or upload TXT, DOCX, PDF
- AI review in five sections plus transpersonal/mirror upgrades: client core, three clues, what went well (max 3), what was missed (max 3), next session (3 actions + 3 sample questions)
- Auto-save the review
- History list on home: case name, date, core theme; open original report

Out of scope for this version: accounts and profiles, audio/video, export/share/print, search/tags/stats, community, payments, CRM, AI roleplay, knowledge base.

AI writing rules: no diagnosis labels; distinguish facts from speculation (可能 / 似乎 / 值得进一步探索); cite specific session content; at most three points per module; tone objective, mild, non-judgmental.

Privacy: nickname/code instead of real names; warn against PII; reviews are private (not published); disclaimer that this does not replace human supervision, psychological or medical diagnosis, or crisis intervention.

Model access: server proxy using environment variables (user-selected). History storage: browser-local so session content is not kept as a public product database.

## Brand Commitments

Name: 觉镜 JueLens. Tagline: AI 个案复盘与专业成长助手. Claim: 看见来访者，也看见自己. Home copy in the PRD is binding product copy.

Voice: calm, professional, specific, not clinical-labeling, not cheerleading.

## Evidence on Hand

Product copy and report examples live in the user PRD. There are no real user transcripts, testimonials, or screenshots. Demo/history examples must be labeled as sample data.

## Product Principles

1. One job: a high-quality review of a single completed session.
2. Few, precise answers beat a long general report.
3. Feedback must be grounded in this session's words.
4. Privacy and non-diagnosis are product features, not footer legal afterthoughts.
5. Anything that does not raise the value of one review does not ship in this version.

## Accessibility & Inclusion

Responsive web, phone and desktop. Text-first reading of reports. Avoid requiring hover-only actions. Contrast must stay readable for long reading sessions.
