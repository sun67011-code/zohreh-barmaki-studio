# Consulting Business Platform

The studio now operates as a small consulting CRM + delivery workspace rather than a lead form alone.

## Public flow

```
Visitor
  ↓
Project brief
  ↓
Secure Edge Function
  ↓
project_enquiries
  ↓
Lead qualification
  ↓
Convert to client + project
```

## Private platform

`platform.html` is an authenticated workspace powered by Supabase Auth and a server-side Edge Function called `platform-api`.

The browser never receives a service-role key.

### Studio workspace

Authorized staff can:

- Review and qualify leads
- Add internal notes and next actions
- Convert a lead into a client and project workspace
- Create standalone projects
- Manage project status and health
- Add milestones
- Publish client-visible or internal project updates
- Register shared document / design / contract / report links
- Create proposal records with fee, currency, validity and status
- Add project members
- Exchange project messages with clients
- See lead / project / client / proposal metrics
- Review operational activity

### Client workspace

Authenticated clients are matched to `project_members.email`.

Clients can only access projects where their authenticated email has an active membership. They can:

- View project status and health
- See milestones and progress
- Read client-visible updates
- Open client-visible documents and links
- View sent/accepted/declined/expired proposals
- Exchange project messages with the studio

Internal updates and internal documents are not returned to clients by the API.

## Data model

- `project_enquiries`
- `staff_users`
- `clients`
- `projects`
- `project_members`
- `proposals`
- `milestones`
- `project_updates`
- `project_documents`
- `project_messages`
- `activity_log`

## Access control

All business tables:

- have RLS enabled
- explicitly deny direct `anon` and `authenticated` table access
- are accessed through server-side Edge Functions using the service role
- do not expose service-role credentials to GitHub or browser JavaScript

The `platform-api` function performs custom JWT authentication using Supabase Auth and then checks:

1. active staff allowlist membership, or
2. active project membership matching the authenticated email.

## Edge Functions

### `submit-enquiry`

Public business-enquiry endpoint:

- origin restricted
- input validated
- rate limited
- honeypot protected
- rejects obvious secrets/credentials
- generates a public reference code

### `platform-api`

Authenticated business-platform API:

- session / identity
- dashboard
- lead list / review / conversion
- project / client listing
- project detail
- project updates
- milestones
- proposals
- members
- document links
- messaging

## Lead conversion

Conversion is transactional through the Postgres function:

`convert_enquiry_to_project(enquiry_id, project_title)`

It:

1. locks and reads the enquiry
2. creates or reuses a client by contact email
3. creates the project once
4. creates/refreshes the client membership
5. moves the lead to `qualified`
6. records an activity event

## Security posture

Supabase Security Advisor currently reports no security lint findings after the schema hardening migrations.

Performance Advisor may report new indexes as unused until production traffic begins; that is expected for a new database.
