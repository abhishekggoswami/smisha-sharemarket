"use client";
import {useEffect,useLayoutEffect,useRef,useState} from "react";
import LibraryIcon from "./LibraryIcon";
import {readShelf,saveShelf} from "./library-shelf";
import {paginateSection} from "./library-pagination";
import "./Library.css";
import "./LibraryEditorial.css";

function Paper({page,number,resource,bodyRef,className=""}){
 return <div className={"flip-paper "+className}>
  <div className="flip-running-head"><span>{resource.author}</span><LibraryIcon name="book"/></div>
  <div className="flip-page-body" ref={bodyRef}>{page?.blocks.map((block,i)=>block.kind==="heading"?<h2 className="flip-block-heading" key={i}>{block.text}</h2>:<p className={"flip-block-"+block.kind} key={i}>{block.kind==="bullet"?<span aria-hidden="true">• </span>:null}{block.text}</p>)}</div>
  <div className="flip-paper-footer"><span>SMISHA READING ROOM</span><span>{number||"—"}</span></div>
 </div>;
}
export default function LibraryReader({resource}){
 const [part,setPart]=useState(resource.initialPart||0),[content,setContent]=useState(resource.initialSection),[pages,setPages]=useState([]),[index,setIndex]=useState(0),[size,setSize]=useState(18),[night,setNight]=useState(false),[saved,setSaved]=useState(false),[ready,setReady]=useState(false),[compact,setCompact]=useState(false),[turn,setTurn]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[retry,setRetry]=useState(0),[info,setInfo]=useState(false);
 const bodyRef=useRef(null),timer=useRef(null),restore=useRef(0),turnLock=useRef(false),lastSlug=useRef(resource.slug);
 const progressKey="smisha-flip-reader-"+resource.slug,step=compact?1:2;
 useEffect(()=>{
  lastSlug.current=resource.slug;setContent(resource.initialSection);setPart(resource.initialPart||0);setPages([]);setIndex(0);setTurn(null);turnLock.current=false;restore.current=0;
  try{const p=JSON.parse(localStorage.getItem(progressKey)||"null");if(p&&Number.isInteger(p.part)&&p.part>=0&&p.part<resource.sections.length){setPart(p.part);restore.current=Math.max(0,p.page||0);}const prefs=JSON.parse(localStorage.getItem("smisha-flip-prefs")||"null");if(prefs){setSize(Math.min(22,Math.max(16,prefs.size||18)));setNight(!!prefs.night);}}catch{}
  setSaved(readShelf().includes(resource.slug));setReady(true);
  return()=>clearTimeout(timer.current);
 },[resource.slug,progressKey,resource.initialSection,resource.sections.length]);
 useEffect(()=>{const media=matchMedia("(max-width: 850px)");const sync=()=>setCompact(media.matches);sync();media.addEventListener("change",sync);return()=>media.removeEventListener("change",sync);},[]);
 useEffect(()=>{
  if(!ready)return;
  const controller=new AbortController();setTurn(null);turnLock.current=false;clearTimeout(timer.current);setPages([]);setError("");
  if(part===(resource.initialPart||0)){setContent(resource.initialSection);setLoading(false);return;}
  setLoading(true);
  fetch("/api/library/read/"+resource.slug+"?part="+part,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error("Reading section unavailable.");return r.json();}).then(data=>{setContent(data);setLoading(false);}).catch(e=>{if(e.name!=="AbortError"){setLoading(false);setError("This section could not load. Please retry.");}});
  return()=>controller.abort();
 },[part,resource.slug,ready,retry,resource.initialSection]);
 useLayoutEffect(()=>{
  if(!ready||loading||!content||error)return;
  let frame,cancelled=false;
  const measure=()=>{
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    if(cancelled||!bodyRef.current)return;
    const rect=bodyRef.current.getBoundingClientRect();if(rect.width<80||rect.height<80)return;
    const probe=document.createElement("div");probe.className="flip-page-body flip-pagination-probe";Object.assign(probe.style,{width:rect.width+"px",height:rect.height+"px",fontSize:size+"px"});document.body.appendChild(probe);
    try{const next=paginateSection(content,probe);setPages(next);setIndex(old=>{const desired=restore.current||old;restore.current=0;return Math.floor(Math.min(desired,next.length-1)/(compact?1:2))*(compact?1:2);});}catch(e){setError(e.message);}finally{probe.remove();}
   });
  };
  const observer=new ResizeObserver(measure);if(bodyRef.current)observer.observe(bodyRef.current);measure();document.fonts?.ready.then(()=>!cancelled&&measure());
  return()=>{cancelled=true;cancelAnimationFrame(frame);observer.disconnect();};
 },[content,size,compact,loading,ready,error]);
 useEffect(()=>{if(!ready||!pages.length||lastSlug.current!==resource.slug)return;try{localStorage.setItem(progressKey,JSON.stringify({part,page:index}));localStorage.setItem("smisha-flip-prefs",JSON.stringify({size,night}));}catch{setNotice("This browser cannot save your reading position.");}},[part,index,pages.length,size,night,ready,resource.slug,progressKey]);
 const changePart=n=>{restore.current=0;setIndex(0);setPart(n);};
 const navigate=direction=>{
  if(turnLock.current||loading||!pages.length)return;
  const target=index+direction*step;
  if(target<0){if(part>0){restore.current=99999;setPart(part-1);}return;}
  if(target>=pages.length){if(part<resource.sections.length-1)changePart(part+1);return;}
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){setIndex(target);return;}
  turnLock.current=true;setTurn({direction,from:index,to:target});
  timer.current=setTimeout(()=>{setIndex(target);setTurn(null);turnLock.current=false;},680);
 };
 const navigation=useRef(navigate);navigation.current=navigate;
 useEffect(()=>{const handler=e=>{if(e.key==="Escape"){setInfo(false);return;}if(["INPUT","SELECT","TEXTAREA","BUTTON"].includes(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==="ArrowRight"){e.preventDefault();navigation.current(1);}if(e.key==="ArrowLeft"){e.preventDefault();navigation.current(-1);}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[]);
 const touch=useRef(null);
 const bookmark=()=>{try{const shelf=readShelf();const next=shelf.includes(resource.slug)?shelf.filter(s=>s!==resource.slug):[...shelf,resource.slug];saveShelf(next);setSaved(next.includes(resource.slug));setNotice(next.includes(resource.slug)?"Book saved to your shelf.":"Bookmark removed.");}catch{setNotice("Your browser could not save this bookmark.");}};
 const left=turn&&!compact?(turn.direction>0?turn.from:turn.to):index;
 const right=turn&&!compact?(turn.direction>0?turn.to+1:turn.from+1):index+1;
 const canPrevious=index>0||part>0,canNext=index+step<pages.length||part<resource.sections.length-1;
 return <main className={"knowledge-flip-reader "+(night?"flip-night":"")} style={{"--book-font-size":size+"px"}} data-turning={!!turn}>
  <header className="flip-reader-top"><a href="/library#knowledge-collection" className="flip-back"><LibraryIcon name="arrow-left"/><span>Library</span></a><div className="flip-reader-title"><span>{resource.kind==="classic"?"THE COMPLETE ORIGINAL":"ACADEMY STUDY GUIDE"}</span><h1>{resource.title}</h1></div><button className="flip-icon-button" onClick={bookmark} aria-label={saved?"Remove bookmark":"Save book"} aria-pressed={saved}><LibraryIcon name="bookmark"/></button><button className="flip-icon-button" onClick={()=>setInfo(!info)} aria-label="Book information and source" aria-expanded={info}><LibraryIcon name="circlecheck"/></button></header>
  <div className="flip-reader-toolbar"><label><LibraryIcon name="layers"/><select aria-label="Reading section" value={part} onChange={e=>changePart(Number(e.target.value))}>{resource.sections.map((section,i)=><option value={i} key={i}>{i+1}. {section.title}</option>)}</select></label><div className="flip-reading-options"><button onClick={()=>setSize(s=>s-1)} disabled={size<=16} aria-label="Decrease text size">A−</button><button onClick={()=>setSize(s=>s+1)} disabled={size>=22} aria-label="Increase text size">A+</button><button onClick={()=>setNight(!night)} aria-label={night?"Use light paper":"Use night paper"} aria-pressed={night}><LibraryIcon name={night?"sun":"moon"}/><span>{night?"Light":"Night"}</span></button><a href={resource.download} download><LibraryIcon name="download"/><span>{resource.format}</span></a></div></div>
  <section className="flip-reading-stage" aria-label={"Read "+resource.title}>
   <div className="flip-book-shadow" aria-hidden="true"/>
   <div className={"flip-reading-surface "+(compact?"flip-single":"flip-spread")} onTouchStart={e=>touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>55&&Math.abs(dy)<70)navigate(dx<0?1:-1);touch.current=null;}}>
    <div className="flip-static-page flip-left"><Paper page={pages[left]} number={left+1} resource={resource} bodyRef={bodyRef}/></div>
    {!compact?<div className="flip-static-page flip-right"><Paper page={pages[right]} number={right<pages.length?right+1:null} resource={resource}/></div>:null}
    {!compact?<div className="flip-book-binding" aria-hidden="true"/>:null}
    {turn?<div aria-hidden="true" className={"flip-turn-leaf "+(turn.direction>0?"flip-forward":"flip-backward")+(compact?" flip-mobile-leaf":"")}>
      <div className="flip-leaf-front"><Paper page={pages[compact?turn.from:turn.direction>0?turn.from+1:turn.from]} number={compact?turn.from+1:turn.direction>0?turn.from+2:turn.from+1} resource={resource}/></div>
      <div className="flip-leaf-back"><Paper page={compact?undefined:pages[turn.direction>0?turn.to:turn.to+1]} number={turn.direction>0?turn.to+1:turn.to+2} resource={resource}/></div>
    </div>:null}
    {(loading||!pages.length)&&!error?<div className="flip-reader-loading" role="status"><LibraryIcon name="book"/><span>Preparing your pages…</span></div>:null}
    {error?<div className="flip-reader-loading" role="alert"><p>{error}</p><button onClick={()=>{setError("");setRetry(r=>r+1);}}>Retry</button></div>:null}
   </div>
  </section>
  <footer className="flip-reader-bottom"><button className="flip-turn-button" onClick={()=>navigate(-1)} disabled={!canPrevious||!!turn||loading} aria-label="Previous page"><LibraryIcon name="arrow-left"/><span>Previous</span></button><div className="flip-position" role="status"><strong>{pages.length?"Page "+(index+1)+(!compact&&index+1<pages.length?"–"+(index+2):"")+" / "+pages.length:"Setting pages"}</strong><span>Section {part+1} / {resource.sections.length} <span className="flip-keyboard-hint">· ← → to turn</span></span><button className="flip-source-note" onClick={()=>setInfo(true)}>Source &amp; licence</button></div><button className="flip-turn-button" onClick={()=>navigate(1)} disabled={!canNext||!!turn||loading} aria-label="Next page"><span>Next page</span><LibraryIcon name="arrow"/></button></footer>
  {notice?<div className="flip-toast" role="status">{notice}<button onClick={()=>setNotice("")} aria-label="Dismiss message"><LibraryIcon name="close"/></button></div>:null}
  {info?<div className="flip-info-backdrop" onClick={()=>setInfo(false)}><section className="flip-info-panel" role="dialog" aria-modal="true" aria-labelledby="flip-info-title" onClick={e=>e.stopPropagation()}><button className="flip-icon-button" onClick={()=>setInfo(false)} aria-label="Close book information" autoFocus><LibraryIcon name="close"/></button><p>ABOUT THIS EDITION</p><h2 id="flip-info-title">{resource.title}</h2><strong>{resource.author}</strong><p>{resource.description}</p><p>{resource.license}</p>{resource.kind==="classic"?<p>{resource.authorNote} This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the Project Gutenberg License included with this eBook or online at www.gutenberg.org. If you are not located in the United States, you’ll have to check the laws of the country where you are located before using this ebook.</p>:<p>Original academy educational notes, separate from published books.</p>}<a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">View original source <LibraryIcon name="external"/></a>{resource.kind==="classic"?<a href="https://www.gutenberg.org/policy/license.html" target="_blank" rel="noopener noreferrer">Read source licence <LibraryIcon name="external"/></a>:null}</section></div>:null}
 </main>;
}
