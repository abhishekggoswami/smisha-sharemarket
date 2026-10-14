// Trusted server-shell moderation; no public admin write endpoint.
const {DatabaseSync}=require('node:sqlite'),path=require('node:path'),fs=require('node:fs');
const dir=process.env.LIBRARY_DATA_DIR||path.join(process.cwd(),'.data');
const file=path.join(dir,'library.sqlite');if(!fs.existsSync(file)){console.log('No recommendation database yet.');process.exit(0);}
const db=new DatabaseSync(file);const [action='list',id]=process.argv.slice(2);
try{
 if(action==='list')console.table(db.prepare("SELECT id,title,author,name,reason,status,created_at FROM recommendations ORDER BY created_at DESC").all());
 else if(['approve','reject'].includes(action)&&id){const status=action==='approve'?'approved':'rejected';const result=db.prepare("UPDATE recommendations SET status=? WHERE id=?").run(status,id);if(!result.changes)throw Error('Submission not found.');console.log(id+' marked '+status);}
 else throw Error('Usage: node scripts/library-moderation.cjs [list | approve BK-id | reject BK-id]');
}finally{db.close();}
