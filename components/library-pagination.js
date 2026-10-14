// Fit actual text to the available paper area. Never discard or truncate words.
export function sectionBlocks(section) {
 const sameHeading=section.paragraphs?.[0]?.replace(/\s+/g," ").trim()===section.title.replace(/\s+/g," ").trim();
 return [
 ...(!sameHeading?[{kind:"heading",text:section.title}]:[]),
 ...(section.paragraphs||[]).map((text,i)=>({kind:sameHeading&&i===0?"heading":"paragraph",text:text.replace(/\s+/g," ").trim()})),
 ...(section.bullets||[]).map(text=>({kind:"bullet",text:text})),
 ...(section.exercise?[{kind:"exercise",text:section.exercise}]:[])
 ].filter(b=>b.text);
}
export function paginateSection(section,probe){
 const output=[],blocks=sectionBlocks(section);let page=[];probe.replaceChildren();
 const nodeFor=block=>{const node=document.createElement(block.kind==="heading"?"h2":"p");node.className="flip-block-"+block.kind;node.textContent=block.text;return node;};
 const fits=()=>probe.scrollHeight<=probe.clientHeight+1;
 const finish=()=>{if(page.length)output.push({blocks:page});page=[];probe.replaceChildren();};
 for(const block of blocks){
  let words=block.text.split(/\s+/),offset=0;
  while(offset<words.length){
   const node=nodeFor({...block,text:words.slice(offset).join(" ")});probe.appendChild(node);
   if(fits()){page.push({...block,text:words.slice(offset).join(" "),continued:offset>0});break;}
   node.remove();
   let low=0,high=words.length-offset;
   // Binary search how many words fit alongside the preceding paragraphs.
   while(low<high){const mid=Math.ceil((low+high)/2);const trial=nodeFor({...block,text:words.slice(offset,offset+mid).join(" ")});probe.appendChild(trial);const okay=fits();trial.remove();if(okay)low=mid;else high=mid-1;}
   if(low===0&&page.length){finish();continue;}
   if(low===0)throw Error("The page area is too small for this text size.");
   const fragment={...block,text:words.slice(offset,offset+low).join(" "),continued:offset>0};page.push(fragment);offset+=low;finish();
  }
 }
 finish();return output.length?output:[{blocks:[]}];
}
