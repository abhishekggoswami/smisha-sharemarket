import {notFound} from 'next/navigation';
import {libraryResources} from '../../../lib/library-catalog';
import {getLibraryContent} from '../../../lib/library-content';
import LibraryReader from '../../../components/LibraryReader';
export function generateStaticParams(){return libraryResources.filter(r=>r.kind!=='external').map(r=>({slug:r.slug}));}
export async function generateMetadata({params}){const {slug}=await params;const r=libraryResources.find(r=>r.slug===slug);return r?{title:r.title+' | Smisha Library',description:r.description}:{};}
export default async function ResourcePage({params}){const {slug}=await params;const resource=getLibraryContent(slug);if(!resource)notFound();return <LibraryReader resource={{...resource,initialPart:resource.startSection||0,initialSection:resource.sections[resource.startSection||0],sections:resource.sections.map(s=>({title:s.title}))}}/>;}
