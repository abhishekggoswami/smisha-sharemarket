import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { upcomingWorkshops } from '../../../lib/workshops';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function database() {
  const directory = process.env.WORKSHOP_DATA_DIR || path.join(process.cwd(), '.data');
  mkdirSync(directory, { recursive: true });
  const db = new DatabaseSync(path.join(directory, 'workshops.sqlite'));
  db.exec('PRAGMA busy_timeout = 5000; CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY, kind TEXT NOT NULL, workshop_id TEXT, email TEXT NOT NULL, created_at TEXT NOT NULL, payload TEXT NOT NULL); CREATE UNIQUE INDEX IF NOT EXISTS unique_registration ON submissions(workshop_id, email) WHERE kind = \'register\';');
  return db;
}

export async function GET() {
  let db;
  try {
    db = database();
    const seats = Object.fromEntries(upcomingWorkshops.map(event => [event.id, Math.max(0, event.capacity - db.prepare("SELECT count(*) AS total FROM submissions WHERE kind = 'register' AND workshop_id = ?").get(event.id).total)]));
    return Response.json(seats, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Availability is temporarily unavailable.' }, { status: 503 }); }
  finally { db?.close(); }
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  let body;
  try { const raw = await request.text(); if (raw.length > 12000) return Response.json({ error: 'Request is too large.' }, { status: 413 }); body = JSON.parse(raw); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 });
  const allowed = ['kind', 'name', 'email', 'phone', 'city', 'company', 'organization', 'participants', 'date', 'budget', 'format', 'message', 'consent', 'workshopId'];
  const data = Object.fromEntries(allowed.map(key => [key, typeof body[key] === 'string' ? body[key].trim() : '']));
  const fail = error => Response.json({ error }, { status: 400 });
  if (!['host', 'interest', 'register'].includes(data.kind)) return fail('Please choose a valid enquiry type.');
  if (!data.name || !data.city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !/^[+0-9 ()-]{7,20}$/.test(data.phone) || data.consent !== 'yes') return fail('Please complete your name, valid email, phone, city, and contact consent.');
  if (Object.entries(data).some(([key, value]) => value.length > (key === 'message' ? 3000 : 200))) return fail('One or more fields are too long.');
  data.email = data.email.toLowerCase();
  if (data.kind === 'host') {
    if (!data.company || !data.organization || !data.budget || !data.format) return fail('Please complete your organisation and workshop preferences.');
    if (!/^\d+$/.test(data.participants) || Number(data.participants) < 1 || Number(data.participants) > 100000) return fail('Enter a valid number of participants.');
    const date = new Date(`${data.date}T23:59:59+05:30`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(date.getTime()) || date.getTime() < Date.now()) return fail('Choose a preferred date today or in the future.');
  }
  const event = upcomingWorkshops.find(w => w.id === data.workshopId);
  if (data.kind === 'register' && (!event || new Date(event.startsAt).getTime() <= Date.now())) return fail('This workshop is not open for registration.');
  let db;
  try {
    db = database(); db.exec('BEGIN IMMEDIATE');
    if (data.kind === 'register') {
      if (db.prepare("SELECT id FROM submissions WHERE kind = 'register' AND workshop_id = ? AND email = ?").get(event.id, data.email)) { db.exec('ROLLBACK'); return Response.json({ error: 'This email is already registered for this workshop.' }, { status: 409 }); }
      const { total } = db.prepare("SELECT count(*) AS total FROM submissions WHERE kind = 'register' AND workshop_id = ?").get(event.id);
      if (total >= event.capacity) { db.exec('ROLLBACK'); return Response.json({ error: 'This workshop is now fully booked.' }, { status: 409 }); }
    }
    const recent = db.prepare('SELECT count(*) AS total FROM submissions WHERE email = ? AND created_at > ?').get(data.email, new Date(Date.now() - 3600000).toISOString());
    if (recent.total >= 5) { db.exec('ROLLBACK'); return Response.json({ error: 'You have sent several requests. Please try again later or call our team.' }, { status: 429 }); }
    const reference = `WS-${randomUUID()}`;
    db.prepare('INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?)').run(reference, data.kind, data.kind === 'register' ? event.id : null, data.email, new Date().toISOString(), JSON.stringify(data));
    db.exec('COMMIT');
    return Response.json({ reference }, { status: 201 });
  } catch { try { db?.exec('ROLLBACK'); } catch {} return Response.json({ error: 'We could not save your request. Please try again or call +91 7420001687.' }, { status: 503 }); }
  finally { db?.close(); }
}
