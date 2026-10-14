// Best-effort mirror for legacy workshop and library submissions.
// The original transactional submission is still authoritative until the legacy
// SQLite workflows are migrated. Do not expose webhook secrets to visitors.
export async function mirrorLeadToSheet(lead){
 const url=process.env.SMISHA_LEADS_WEBHOOK_URL,secret=process.env.SMISHA_LEADS_WEBHOOK_SECRET;
 if(!url||!secret||!url.startsWith("https://script.google.com/"))return false;
 try{
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({secret,...lead,consent:"Yes"}),redirect:"follow",cache:"no-store",signal:AbortSignal.timeout(10000)});
  const result=await r.json().catch(()=>null);return r.ok&&result?.ok===true;
 }catch(err){console.error("Lead mirroring failed",err.message);return false}
}
