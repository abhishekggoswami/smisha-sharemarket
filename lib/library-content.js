import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import {libraryResources} from './library-catalog';
import notes from './library-notes.json';
const cache=new Map();
export function getLibraryContent(slug){
 if(cache.has(slug))return cache.get(slug);
 const resource=libraryResources.find(r=>r.slug===slug&&r.kind!=='external');if(!resource)return null;
 if(resource.kind==='guide')return {...resource,sections:notes.find(r=>r.slug===slug).sections};
 const raw=fs.readFileSync(path.join(process.cwd(),'public',resource.download),'utf8').replace(/\r/g,'');
 const start=raw.match(/\*\*\* START OF[^\n]+\n/i),end=raw.match(/\*\*\* END OF[^\n]+/i);
 const body=start&&end?raw.slice(start.index+start[0].length,end.index):raw;
 const paragraphs=body.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
 const sections=[];let group=[],words=0,currentTitle="Title, preface & contents",continuation=0;
 const finish=()=>{if(group.length){const title=currentTitle+(continuation?' · continued '+continuation:'');continuation++;sections.push({title,paragraphs:group});group=[];words=0;}};
 for(let i=0;i<paragraphs.length;i++){const paragraph=paragraphs[i];if(paragraph.length<180&&/^(CHAPTER\s+([IVXLCDM]+|[0-9]+|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen)|PART\s+[IVXLCDM0-9]+)/i.test(paragraph)){finish();const next=paragraphs[i+1];currentTitle=paragraph.replace(/\s+/g,' ');if(next&&next.length<110&&next===next.toUpperCase())currentTitle+=' · '+next;continuation=0;}group.push(paragraph);words+=paragraph.split(/\s+/).length;if(words>=2400)finish();}finish();
 // Retain all original edition metadata and the full source licence in the reader.
 if(start&&end){const credits=[raw.slice(0,start.index),raw.slice(end.index)].join('\n\n');sections.push({title:'Edition credits & source licence',paragraphs:credits.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean)});}
 const startSection=Math.max(0,sections.findIndex(s=>/^chapter\s/i.test(s.title)));
 const value={...resource,sections,startSection};cache.set(slug,value);return value;
}
