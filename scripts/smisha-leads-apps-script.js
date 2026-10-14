/**
 * Smisha leads webhook (Google Apps Script).
 * Bind this script to the lead register and deploy as Web app:
 * Execute as: Me; Who has access: Anyone.
 * Set Script Property LEADS_SECRET to a strong random value.
 * Add the deployment /exec URL and same secret to Vercel's
 * SMISHA_LEADS_WEBHOOK_URL and SMISHA_LEADS_WEBHOOK_SECRET.
 */
const SHEET_ID = "1njJ-D5ZjonIHHyploAw5IUoRvuIlEhuMBuKhv9_TzBM";
const TYPES = ["Consultation","Guide Download","Webinar","Callback","Newsletter","Free Session","Contact","Course Enquiry","Workshop","Library"];
function doPost(e){
 const json = (ok,reason)=>ContentService.createTextOutput(JSON.stringify({ok,error:reason||""})).setMimeType(ContentService.MimeType.JSON);
 try{
  const data=JSON.parse(e.postData.contents||"{}");
  const secret=PropertiesService.getScriptProperties().getProperty("LEADS_SECRET");
  if(!secret||data.secret!==secret)return json(false,"Unauthorized");
  if(!TYPES.includes(data.category))return json(false,"Invalid category");
  const safe=value=>{const s=String(value||"").slice(0,1500);return /^[=+@\-\t\r]/.test(s)?"'"+s:s};
  const sheet=SpreadsheetApp.openById(SHEET_ID).getSheetByName("All Leads");
  if(!sheet)throw Error("All Leads sheet not found");
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000))throw Error("Concurrent submissions busy");
  try{
   const row=[new Date(),"SM-"+Utilities.getUuid(),data.category,data.sourcePage,data.form,data.name,data.email,data.phone,data.interest,data.message,data.consent,data.utmSource,data.utmMedium,data.utmCampaign,"New","",""].map((v,i)=>i===0?v:safe(v));
   sheet.appendRow(row);
  }finally{lock.releaseLock()}
  return json(true);
 }catch(err){console.error(err);return json(false,"Save failed")}
}
