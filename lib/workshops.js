// Publish only confirmed events. Upcoming events require id, title, startsAt
// (ISO timestamp with timezone), location, description, and capacity.
export const upcomingWorkshops = [];

export const pastWorkshops = [{
  id: 'iiebm-2025', title: 'A first step into the stock market',
  organization: 'IIEBM · Indus Business School', date: '9 July 2025',
  speaker: 'Sushil Kamboj',
  description: 'A stock-market learning session with Sushil Kamboj, Founder & Managing Director of Smisha Share Market, at IIEBM Indus Business School.',
  photos: [
    { src: '/assets/event-gallery/event-speaker-focus.jpg', alt: 'Sushil Kamboj speaking at a stock market event' },
    { src: '/assets/event-gallery/event-stage-audience.jpg', alt: 'Sushil Kamboj leading a stock market presentation before an audience' },
    { src: '/assets/event-gallery/event-auditorium.jpg', alt: 'A full auditorium attending a stock market learning session' },
    { src: '/assets/event-gallery/event-guests.jpg', alt: 'Guests and students attending a financial education event' },
    { src: '/assets/event-gallery/event-partnership.jpg', alt: 'Sushil Kamboj with a partner outside Indus Business School' },
    { src: '/assets/event-gallery/event-stage-portrait.jpg', alt: 'Sushil Kamboj presenting at a stock market event stage' },
    { src: '/assets/event-gallery/event-speaker-stage.jpg', alt: 'Sushil Kamboj speaking at an educational stock market event' },
  ],
  highlights: ['Introduction to the stock market', 'Market participants & how markets work', 'Market segments & trading types'],
  videos: [], certificates: [], testimonials: [],
}];
