// Publish only confirmed events. Upcoming events require id, title, startsAt
// (ISO timestamp with timezone), location, description, and capacity.
export const upcomingWorkshops = [];

export const pastWorkshops = [{
  id: 'iiebm-2025', title: 'A first step into the stock market',
  organization: 'IIEBM · Indus Business School', date: '9 July 2025',
  speaker: 'Sushil Kamboj',
  description: 'A stock-market learning session with Sushil Kamboj, Founder & Managing Director of Smisha Share Market, at IIEBM Indus Business School.',
  photos: [
    { src: '/assets/workshops/pic7.webp', alt: 'Sushil Kamboj presenting the stock-market workshop at IIEBM' },
    { src: '/assets/workshops/pic6.webp', alt: 'Students attending the stock-market session in the auditorium' },
    { src: '/assets/workshops/pic5.webp', alt: 'Sushil Kamboj explaining stock-market concepts on stage' },
    { src: '/assets/workshops/smisha-pic-1.webp', alt: 'A view of the workshop presentation and student audience' },
  ],
  highlights: ['Introduction to the stock market', 'Market participants & how markets work', 'Market segments & trading types'],
  videos: [], certificates: [], testimonials: [],
}];
