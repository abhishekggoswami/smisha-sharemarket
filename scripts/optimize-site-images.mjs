import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd();
const sources=[];
async function walk(dir) { for(const e of await fs.readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(/\.(js|tsx|css)$/.test(f))sources.push(f);} }
await walk(path.join(root,'components'));await walk(path.join(root,'lib'));await walk(path.join(root,'app'));sources.push(path.join(root,'styles.css'));
const texts=new Map(await Promise.all(sources.map(async f=>[f,await fs.readFile(f,'utf8')])));
const refs=new Set([...texts.values()].flatMap(s=>[...s.matchAll(/\/assets\/[\w/.-]+\.png/g)].map(m=>m[0])));
const replacements=[];let saved=0;
for(const url of refs){
 if(/logo|wordmark/.test(url))continue;
 const file=path.join(root,'public',url);let stat;try{stat=await fs.stat(file)}catch{continue;}
 if(stat.size<100000)continue;
 const output=file.replace(/\.png$/,'.webp');
 const encoded=await sharp(file).webp({lossless:true,effort:6}).toBuffer();
 if(encoded.length>=stat.size*.85)continue;
 const [a,b]=await Promise.all([sharp(file).ensureAlpha().raw().toBuffer(),sharp(encoded).ensureAlpha().raw().toBuffer()]);
 if(a.length!==b.length)throw Error('Pixel dimensions changed '+url);
 for(let i=0;i<a.length;i+=4){if(a[i+3]!==b[i+3]||(a[i+3]>0&&(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])))throw Error('Visible pixel mismatch '+url);}
 await fs.writeFile(output,encoded);
 const next=url.replace(/\.png$/,'.webp');replacements.push({url,next,original:stat.size,optimized:encoded.length});saved+=stat.size-encoded.length;
}
for(const [f,original] of texts){let s=original;for(const r of replacements)s=s.replaceAll(r.url,r.next);if(s!==original)await fs.writeFile(f,s);}
await fs.writeFile(path.join(root,'tmp/course-animation-review/image-optimization.json'),JSON.stringify({count:replacements.length,savedBytes:saved,replacements},null,2));
console.log(JSON.stringify({count:replacements.length,savedBytes:saved,losslessPixelVerification:true}));
