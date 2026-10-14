import LibraryPage from '../../components/LibraryPage';
import {getApprovedRecommendations} from '../../lib/library-storage';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata={title:'Digital Knowledge Library | Smisha Share Market Academy',description:'Read financial classics, explore trading guides and study notes, save your reading shelf, download educational PDFs and recommend a book.'};
export default function Library(){return <LibraryPage recommendations={getApprovedRecommendations()}/>;}
