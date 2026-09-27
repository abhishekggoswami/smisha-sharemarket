# Workshops

Page: `/workshops`. Direct tab links: `#upcoming`, `#past`, `#host`.

## Publishing

Edit `lib/workshops.js`. Only confirmed workshop material is published. The archive displays up to 10 events. Each event supports photos, highlights, videos (`src`, `title`), public certificates (`src`, `title`), and approved testimonials (`quote`, `name`). Keep private attendee certificates out of public assets.

Upcoming events require `id`, `title`, `description`, `startsAt` (ISO timestamp including timezone), `location`, and positive integer `capacity`. Adding a future event enables its countdown, live seat availability, and registration form. Expired events are hidden from upcoming; move completed events to the archive when approved material is available. No upcoming date was supplied, so the initial page offers an interest form.

## Submissions and deployment

Requires Node.js 22.13+ with `node:sqlite` support (validated on Node 25). Requests are validated server-side and saved to `.data/workshops.sqlite`. Set `WORKSHOP_DATA_DIR` to a private persistent directory on your server. Back it up and limit its filesystem access. Do not deploy this storage unchanged on ephemeral/serverless hosts: use a persistent Node server or replace the storage layer with a managed database first.

The `submissions` table stores `id`, `kind` (`host`, `interest`, `register`), `workshop_id`, `email`, `created_at`, and the JSON `payload`. Inspect/export it using a trusted SQLite client on the server. No public lead-reading endpoint is provided. Seat allocation and duplicate checks run in a database transaction. A maximum of five requests per email per hour limits repeated submissions; public deployment should also use host-level rate limiting.

Submission confirmations mean the request is saved. Email notifications, CRM delivery, payments, and an authenticated staff dashboard are not connected. The team must review saved submissions. Add a delivery integration before promising automatic email follow-up.

Verification: `npm run build` and `node scripts/test-workshops.mjs`. Tests use an isolated temporary database and synthetic events, never published workshop data.
