import {NextResponse} from "next/server";
export const runtime="nodejs";
const allowed=new Set(["Consultation","Guide Download","Webinar","Callback","Newsletter","Free Session","Contact","Course Enquiry","Workshop","Library"]);
const str=(v,n=300)=>typeof v==="string"?v.trim().slice(0,n):"";
export async function POST(req){
 try{
  const origin=req.headers.get("origin");
  if(origin && origin!==new URL(req.url).origin)return NextResponse.json({error:"Invalid request origin"},{status:403});
  if(Number(req.headers.get("content-length")||0)>16000)return NextResponse.json({error:"Request too large"},{status:413});
  const d=await req.json();if(str(d.website))return NextResponse.json({ok:true});
  if(!allowed.has(d.category)||d.consent!==true)return NextResponse.json({error:"Invalid form or missing contact consent"},{status:400});
  const name=str(d.name),email=str(d.email),phone=str(d.phone);
  if(!email&&!phone||d.category!=="Newsletter"&&name.length<2||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:"Please provide valid contact details"},{status:400});
  const url=process.env.SMISHA_LEADS_WEBHOOK_URL,secret=process.env.SMISHA_LEADS_WEBHOOK_SECRET;
  if(!url||!secret||!url.startsWith("https://script.google.com/"))return NextResponse.json({error:"Online lead registration is currently unavailable. Please contact us by phone."},{status:503});
  const payload={secret,category:d.category,name,email,phone,form:str(d.form),sourcePage:str(d.sourcePage),interest:str(d.interest),message:str(d.message,1500),consent:"Yes",utmSource:str(d.utmSource),utmMedium:str(d.utmMedium),utmCampaign:str(d.utmCampaign)};
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),redirect:"follow",cache:"no-store",signal:AbortSignal.timeout(12000)});
  const result=await r.json().catch(()=>null);if(!r.ok||!result?.ok)throw Error("Sheet did not confirm the save");
  return NextResponse.json({ok:true});
 }catch(e){console.error("Lead capture:",e.message);return NextResponse.json({error:"We could not save your details. Please try again or contact us by WhatsApp."},{status:502});}
}