import {randomUUID} from 'node:crypto';
import {openLibraryDatabase} from '../../../../lib/library-storage';
import {mirrorLeadToSheet} from '../../../../lib/smisha-lead-sync';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 let body;try{const raw=await request.text();if(raw.length>8000)return Response.json({error:'Submission is too large.'},{status:413});body=JSON.parse(raw);}catch{return Response.json({error:'Invalid submission.'},{status:400});}
 const fail=error=>Response.json({error},{status:400});
 if(!body||typeof body!=='object'||Array.isArray(body))return fail('Invalid submission.');
 if(body.website)return fail('Please leave the website field empty.');
 const clean=k=>typeof body[k]==='string'?body[k].trim().replace(/[\u0000-\u001f]/g,' '):'';
 const title=clean('title'),author=clean('author'),reason=clean('reason'),name=clean('name'),email=clean('email').toLowerCase();
 if(title.length<2||title.length>160||author.length<2||author.length>120||name.length<2||name.length>80||reason.length<30||reason.length>1200||email.length>200||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||body.consent!==true)return fail('Complete the book, author, name, valid email, consent and a recommendation of 30–1,200 characters.');
 let db;try{
 db=openLibraryDatabase();db.exec('BEGIN IMMEDIATE');
 if(db.prepare('SELECT id FROM recommendations WHERE email=? AND title=? COLLATE NOCASE AND author=? COLLATE NOCASE').get(email,title,author)){db.exec('ROLLBACK');return Response.json({error:'You have already recommended this book. Thank you!'},{status:409});}
 if(db.prepare('SELECT count(*) AS count FROM recommendations WHERE email=? AND created_at>?').get(email,new Date(Date.now()-86400000).toISOString()).count>=3){db.exec('ROLLBACK');return Response.json({error:'Please wait a day before recommending another book.'},{status:429});}
 const reference='BK-'+randomUUID();
 db.prepare('INSERT INTO recommendations (id,title,author,reason,name,email,status,created_at) VALUES (?,?,?,?,?,?,?,?)').run(reference,title,author,reason,name,email,'pending',new Date().toISOString());db.exec('COMMIT');
 const syncedToSheet=await mirrorLeadToSheet({category:'Library',name,email,phone:'',sourcePage:'/library',form:'Recommend a book',interest:title+' by '+author,message:reason});
 return Response.json({reference,status:'pending',syncedToSheet},{status:201});
 }catch{try{db?.exec('ROLLBACK');}catch{}return Response.json({error:'We could not save your recommendation. Please try again.'},{status:503});}finally{db?.close();}
}
