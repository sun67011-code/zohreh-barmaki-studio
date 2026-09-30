# Secure Enquiry Backend — Supabase Plan

This document defines the next production layer for the public studio website.

## Goals

- Accept structured project enquiries from the public website.
- Keep the public browser isolated from privileged database credentials.
- Avoid storing medical records, credentials or other sensitive data in a general-purpose enquiry form.
- Provide a path to client authentication and a project workspace later.
- Preserve the static-first GitHub Pages front end.

## Recommended request flow

```
Browser form
   ↓ HTTPS POST
Supabase Edge Function: submit-enquiry
   ↓ validation / spam controls / normalization
Postgres: project_enquiries
   ↓
Optional server-side notification integration
```

The browser should **not** write directly to the table. The public form should call an Edge Function and the function should perform the database insert server-side.

## Table: project_enquiries

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key, generated |
| created_at | timestamptz | default now() |
| name | text | required |
| company | text | optional |
| contact_email | text | required after backend launch |
| project_type | text | controlled values |
| project_stage | text | controlled values |
| priority | text | controlled values |
| engagement_model | text | controlled values |
| summary | text | required, length-limited |
| constraints | text | optional, length-limited |
| source | text | default `studio-site` |
| status | text | default `new` |
| consent_version | text | privacy-copy version |

## RLS

Enable Row Level Security on `project_enquiries`.

Recommended policy posture:

- Anonymous/browser role: **no SELECT**
- Anonymous/browser role: **no direct INSERT**
- Authenticated client role: no access unless a later client-portal requirement explicitly grants it
- Service role: Edge Function only

This prevents public users from enumerating or reading enquiries.

## Edge Function: submit-enquiry

Server-side responsibilities:

1. Validate required fields.
2. Normalize and trim strings.
3. Enforce maximum lengths.
4. Reject unexpected fields.
5. Reject obvious secrets / credential-shaped inputs where practical.
6. Apply rate limiting / bot controls.
7. Store the validated record.
8. Return only a generated enquiry reference — never the inserted row.
9. Trigger a notification integration server-side if required.

## Healthcare safety boundary

The public enquiry form is for project/business context only.

It must display this warning:

> Do not submit patient-identifiable health information, clinical records, passwords, API keys or confidential credentials.

If future functionality needs clinical or regulated data, it should be designed as a separate system with the appropriate security, access-control, compliance and data-processing requirements.

## Future client portal

A later authenticated layer can add:

- Supabase Auth
- `clients`
- `projects`
- `project_members`
- `milestones`
- `project_documents`
- Storage buckets with per-project access policies
- Server-side audit events

The public portfolio and enquiry flow should remain logically separate from private client data.

## Secrets

Never commit these to GitHub:

- Supabase service-role keys
- SMTP/API provider secrets
- OpenAI API keys
- webhook secrets
- private client credentials

Use Supabase project secrets / Edge Function environment variables for server-side credentials.
