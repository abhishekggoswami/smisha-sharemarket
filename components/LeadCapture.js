"use client";
import {useEffect,useState} from "react";
import "./lead-capture.css";
const offers={
 Consultation:["Free consultation","Discuss your learning goals with the Smisha team."],
 "Guide Download":["Download a free guide","Get a complimentary market-learning course guide."],
 Webinar:["Free webinar registration","Register interest in our next free learning webinar. Date to be announced."],
 Callback:["Request a callback","Choose a convenient time for our team to contact you."],
 "Free Session":["Book a free session","Request a free introductory learning session."],
 Newsletter:["Newsletter signup","Get occasional educational updates, without spam."]
};
export async function sendLead(data){
 const q=new URLSearchParams(window.location.search);
 const r=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,sourcePage:window.location.pathname,utmSource:q.get("utm_source")||"",utmMedium:q.get("utm_medium")||"",utmCampaign:q.get("utm_campaign")||""})});
 const result=await r.json();if(!r.ok||!result.ok)throw Error(result.error||"Could not save details");return result;
}
export function openLead(category="Consultation"){window.dispatchEvent(new CustomEvent("smisha:lead",{detail:{category}}))}
export default function LeadCapture(){
 const [category,setCategory]=useState(""),[status,setStatus]=useState(""),[error,setError]=useState(""),[prefillEmail,setPrefillEmail]=useState("");
 function open(kind,email=""){setCategory(kind);setError("");setStatus("");setPrefillEmail(email)}
 useEffect(()=>{
  const trigger=e=>open(e.detail?.category||"Consultation",e.detail?.email||"");
  const newsletterClick=e=>{const button=e.target.closest?.('.newsletter-input button');if(button){e.preventDefault();const email=button.closest('.newsletter-input')?.querySelector('input')?.value||'';open('Newsletter',email)}};
  document.addEventListener('click',newsletterClick);
  const exit=e=>{if(e.clientY<=0&&!sessionStorage.getItem("smisha-exit-seen")&&!document.querySelector("[role=dialog]")){sessionStorage.setItem("smisha-exit-seen","1");open("Consultation")}};
  window.addEventListener("smisha:lead",trigger);
  if(matchMedia("(pointer:fine) and (min-width:900px)").matches)document.addEventListener("mouseout",exit);
  return()=>{window.removeEventListener("smisha:lead",trigger);document.removeEventListener('click',newsletterClick);document.removeEventListener("mouseout",exit)};
 },[]);
 useEffect(()=>{if(!category)return;let before=document.body.style.overflow;document.body.style.overflow="hidden";const escape=e=>{if(e.key==="Escape")setCategory("")};document.addEventListener("keydown",escape);return()=>{document.body.style.overflow=before;document.removeEventListener("keydown",escape)}},[category]);
 async function submit(e){
  e.preventDefault();setStatus("saving");setError("");
  const d=new FormData(e.currentTarget);
  try{await sendLead({category,form:"Site lead capture",name:String(d.get("name")||""),email:String(d.get("email")||""),phone:String(d.get("phone")||""),interest:String(d.get("interest")||""),message:String(d.get("message")||""),website:String(d.get("website")||""),consent:d.get("consent")==="yes"});setStatus("success")}
  catch(err){setStatus("");setError(err.message)}
 }
 return <>
  <div className="lead-sticky"><button onClick={()=>open("Free Session")}>Book free session <i className="fa-solid fa-arrow-right"/></button><button onClick={()=>open("Callback")} aria-label="Request callback"><i className="fa-solid fa-phone"/></button></div>
  <div className="lead-resource-strip">{Object.entries(offers).filter(([k])=>k!=="Newsletter").map(([k,v])=><button key={k} onClick={()=>open(k)}>{v[0]}</button>)}</div>
  {category&&<div className="lead-overlay" onMouseDown={e=>{if(e.currentTarget===e.target)setCategory("")}}>
   <section role="dialog" aria-modal="true" aria-label={offers[category][0]} className="lead-modal">
    <button className="lead-close" onClick={()=>setCategory("")} aria-label="Close">×</button>
    <small>SMISHA SHARE MARKET ACADEMY</small><h2>{offers[category][0]}</h2><p>{offers[category][1]}</p>
    {status==="success"?<div role="status" className="lead-success">Thank you. Your request has been recorded successfully.{category==="Guide Download"&&<p><a href="/resources/guides/investor-starter-kit.pdf" download>Download your guide</a></p>}</div>:
    <form onSubmit={submit}>
     {category!=="Newsletter"&&<label>Your name<input name="name" required minLength="2" maxLength="100" autoComplete="name"/></label>}
     <label>Email address<input name="email" type="email" autoComplete="email" key={category+prefillEmail} defaultValue={prefillEmail} required={category==="Newsletter"||category==="Guide Download"}/></label>
     {category!=="Newsletter"&&<label>Phone number<input name="phone" type="tel" autoComplete="tel" inputMode="tel"/></label>}
     {["Free Session","Consultation","Webinar"].includes(category)&&<label>Interest<input name="interest" placeholder="Courses, workshops, investing..."/></label>}
     {category==="Callback"&&<label>Preferred callback time<input name="message" placeholder="e.g. Tomorrow after 4 PM"/></label>}
     <label className="lead-consent"><input type="checkbox" required name="consent" value="yes"/><span>I agree to be contacted by Smisha regarding this request.</span></label>
     <input className="lead-trap" tabIndex="-1" aria-hidden="true" name="website" autoComplete="off"/>
     {error&&<p role="alert" className="lead-error">{error}</p>}
     <button type="submit" disabled={status==="saving"} className="lead-submit">{status==="saving"?"Submitting…":"Submit request"} <i className="fa-solid fa-arrow-right"/></button>
    </form>}
   </section></div>}
 </>;
}