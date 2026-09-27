import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

process.env.WORKSHOP_DATA_DIR = mkdtempSync(path.join(tmpdir(), 'smisha-workshop-test-'));
const fixture = [{ id: 'test-event', title: 'Test only', startsAt: '2099-10-01T10:00:00+05:30', capacity: 1 }];
const source = readFileSync(new URL('../app/api/workshops/route.js', import.meta.url), 'utf8').replace("import { upcomingWorkshops } from '../../../lib/workshops';", `const upcomingWorkshops = ${JSON.stringify(fixture)};`);
const { GET, POST } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const base = { kind: 'interest', name: 'Test Attendee', email: 'attendee@example.test', phone: '+91 9999999999', city: 'Pune', consent: 'yes' };
async function post(data, origin = 'http://localhost:3000') { return POST(new Request('http://localhost:3000/api/workshops', { method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(data) })); }
assert.equal((await post({})).status, 400);
assert.equal((await post(null)).status, 400);
assert.equal((await post({ ...base, consent: '' })).status, 400);
assert.equal((await post({ ...base, email: 'invalid' })).status, 400);
assert.equal((await post(base, 'https://other.example')).status, 403);
assert.equal((await post(base)).status, 201);
const host = { ...base, kind: 'host', company: 'Test Company', organization: 'Local learning club', participants: '25', date: '2099-10-01', budget: 'Around ₹35,000', format: 'Hybrid sessions', message: 'Test enquiry' };
assert.equal((await post(host)).status, 201);
for (const field of ['organization', 'budget', 'format']) {
  assert.equal((await post({ ...host, [field]: '   ' })).status, 400);
  assert.equal((await post({ ...host, [field]: 'x'.repeat(201) })).status, 400);
}
assert.equal((await post({ ...host, participants: '0' })).status, 400);
assert.equal((await post({ ...host, date: '2020-01-01' })).status, 400);
assert.equal((await post({ ...base, kind: 'register', workshopId: 'missing' })).status, 400);
assert.equal((await (await GET()).json())['test-event'], 1);
assert.equal((await post({ ...base, kind: 'register', workshopId: 'test-event' })).status, 201);
assert.equal((await post({ ...base, kind: 'register', workshopId: 'test-event' })).status, 409);
assert.equal((await post({ ...base, email: 'second@example.test', kind: 'register', workshopId: 'test-event' })).status, 409);
assert.equal((await (await GET()).json())['test-event'], 0);
assert.equal((await post(base)).status, 201);
assert.equal((await post(base)).status, 201);
assert.equal((await post(base)).status, 429);
const db = new DatabaseSync(path.join(process.env.WORKSHOP_DATA_DIR, 'workshops.sqlite'));
assert.equal(db.prepare('SELECT count(*) AS total FROM submissions').get().total, 5);
assert.equal(JSON.parse(db.prepare("SELECT payload FROM submissions WHERE kind = 'host'").get().payload).company, 'Test Company');
db.close();
console.log('Passed: validation, consent, origin, interest and company persistence, registration, duplicates, capacity, availability, and repeat-request limits.');
