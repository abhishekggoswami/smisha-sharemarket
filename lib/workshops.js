// Publish only confirmed events. Upcoming events require id, title, startsAt
// (ISO timestamp with timezone), location, description, and capacity.
export const upcomingWorkshops = [
  {
    "id": "read-the-market-online",
    "title": "Read the Market. Build Your Plan.",
    "status": "planned",
    "startsAt": null,
    "capacity": null,
    "mode": "Online",
    "location": "Online · Join from wherever you are",
    "description": "An upcoming online learning session on reading price action, planning risk and building a disciplined trading routine. Bring your questions and explore market concepts with the Smisha learning team.",
    "thumbnail": "/assets/workshops/read-the-market-upcoming.webp",
    "thumbnailAlt": "Upcoming Smisha online workshop banner: Read the Market. Build Your Plan. Date to be announced.",
    "highlights": [
      {
        "icon": "chart-line",
        "title": "Read price action",
        "copy": "Understand trends, support and resistance, and the context behind a chart."
      },
      {
        "icon": "shield-halved",
        "title": "Plan your risk",
        "copy": "Explore position sizing, risk-reward and the limits to set before a trade."
      },
      {
        "icon": "brain",
        "title": "Build your routine",
        "copy": "Discuss trading psychology, journaling and disciplined decisions."
      }
    ]
  }
];

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
