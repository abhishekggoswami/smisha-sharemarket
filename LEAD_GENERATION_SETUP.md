# Smisha Smart Lead Generation — Google Sheets integration

## Created Sheet
https://docs.google.com/spreadsheets/d/1njJ-D5ZjonIHHyploAw5IUoRvuIlEhuMBuKhv9_TzBM/edit

## Required one-time connection (no database / no visitor login)
1. Open the Google Sheet as owner. Choose **Extensions → Apps Script**.
2. Replace the default Apps Script code with the exact content of `scripts/smisha-leads-apps-script.js`.
3. In Apps Script, open **Project Settings → Script properties**. Add property `LEADS_SECRET` with a unique strong random secret (at least 32 characters). Do not put it into Git or client code.
4. **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Authorize access to the Sheet using the owner account.
5. Copy the deployed `https://script.google.com/macros/s/.../exec` URL.
6. Add Vercel environment variables `SMISHA_LEADS_WEBHOOK_URL` = that URL and `SMISHA_LEADS_WEBHOOK_SECRET` = the exact secret. Add locally to ignored `.env.local` too. Redeploy after setting them.
7. Submit a consented test enquiry. Check the newly appended row in **All Leads** and the corresponding filtered category tab. Delete the test row after checking.
8. Share the Google Sheet with the client as Viewer/Editor as appropriate; do **not** publicly publish the Sheet.

## Architecture
Form → Next.js server endpoint `/api/leads` → secret-authenticated Apps Script webhook → Google Sheet All Leads → filtered category tabs.
Visitor submissions never access the secret or Sheet permissions. No database and no user authentication. Keep the Google Sheet owner account active. Limit Sheet access to staff. Do not collect PAN, KYC, brokerage passwords, or payment details through these forms.

## Limitations
- The webhook is NOT operational until the Apps Script deployment and server environment variables are configured.
- Google Apps Script is a lightweight integration, not an enterprise CRM; add rate limiting / abuse protection before major paid ad traffic.
- Apps Script web apps return JSON and may redirect. The server verifies its response and shows an error instead of pretending that a lead was stored.
- Newsletter is an expression of interest, not an automated email marketing system. Webinar registration records interest; it does not reserve a dated event.
