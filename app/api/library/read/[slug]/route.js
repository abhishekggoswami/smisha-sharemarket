import {getLibraryContent} from '../../../../../lib/library-content';
export const runtime='nodejs';
export async function GET(request,{params}){
 const {slug}=await params;const resource=getLibraryContent(slug);if(!resource)return Response.json({error:'Resource not found.'},{status:404});
 const raw=new URL(request.url).searchParams.get('part')||'0';if(!/^\d+$/.test(raw))return Response.json({error:'Invalid reading section.'},{status:400});const part=Number(raw);
 if(part>=resource.sections.length)return Response.json({error:'Section not found.'},{status:404});
 return Response.json(resource.sections[part],{headers:{'Cache-Control':'public, max-age=3600'}});
}
