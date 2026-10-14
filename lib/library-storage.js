import 'server-only';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
export function openLibraryDatabase(){
 const dir=process.env.LIBRARY_DATA_DIR||path.join(process.cwd(),'.data');mkdirSync(dir,{recursive:true});
 const db=new DatabaseSync(path.join(dir,'library.sqlite'));
 db.exec("PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS recommendations (id TEXT PRIMARY KEY,title TEXT NOT NULL,author TEXT NOT NULL,reason TEXT NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL); CREATE UNIQUE INDEX IF NOT EXISTS library_duplicate ON recommendations(email, title COLLATE NOCASE, author COLLATE NOCASE);");
 return db;
}
export function getApprovedRecommendations(){
 let db;try{db=openLibraryDatabase();return db.prepare("SELECT id,title,author,reason,name FROM recommendations WHERE status='approved' ORDER BY created_at DESC LIMIT 12").all().map(row=>({...row}));}catch{return [];}finally{db?.close();}
}
