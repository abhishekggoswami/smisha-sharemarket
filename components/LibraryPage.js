import SiteHeader from './SiteHeader';
import { SiteCTA, SiteFAQ, SiteFooter } from './SharedSiteSections';

const books = [
  {
    title: 'The Wealth of Nations',
    author: 'Adam Smith',
    category: 'Economics',
    description: 'A foundational exploration of markets, productivity, trade and how economies create wealth.',
    cover: '/assets/library/wealth-of-nations.jpg',
    purchaseUrl: 'https://www.amazon.in/s?k=The+Wealth+of+Nations+Adam+Smith',
  },
  {
    title: 'The Art of Money Getting',
    author: 'P. T. Barnum',
    category: 'Money & Business',
    description: 'Timeless lessons about earning, saving, discipline, business judgment and financial habits.',
    cover: '/assets/library/art-of-money-getting.jpg',
    purchaseUrl: 'https://www.amazon.in/s?k=The+Art+of+Money+Getting+P.+T.+Barnum',
  },
  {
    title: 'The Way to Wealth',
    author: 'Benjamin Franklin',
    category: 'Personal Finance',
    description: 'A short classic on work, saving, frugality, debt and building long-term financial security.',
    cover: '/assets/library/way-to-wealth.jpg',
    purchaseUrl: 'https://www.amazon.in/s?k=The+Way+to+Wealth+Benjamin+Franklin',
  },
  {
    title: 'The Theory of the Leisure Class',
    author: 'Thorstein Veblen',
    category: 'Economics & Society',
    description: 'A landmark examination of wealth, consumption, status and the economic behavior of society.',
    cover: '/assets/library/theory-of-leisure-class.jpg',
    purchaseUrl: 'https://www.amazon.in/s?k=The+Theory+of+the+Leisure+Class+Thorstein+Veblen',
  },
  {
    title: 'The Richest Man in Babylon',
    author: 'George S. Clason',
    category: 'Personal Finance',
    description: 'Classic financial lessons told through simple stories about saving, wealth building and responsible money management.',
    cover: '/assets/library/richest-man-in-babylon.jpg',
    purchaseUrl: 'https://www.amazon.in/s?k=The+Richest+Man+in+Babylon+George+S.+Clason',
  },
];

export default function LibraryPage() {
  return <main className="course-shell library-shell">
    <SiteHeader active="Library" demoHref="#contact" />
    <section className="course-hero library-hero" aria-labelledby="library-title">
      <div className="course-hero-ring ring-one" />
      <div className="course-hero-ring ring-two" />
      <div className="course-hero-grid" />
      <div className="course-hero-content">
        <p className="course-kicker"><i className="fa-solid fa-book-open" /> Smisha Library</p>
        <h1 id="library-title"><span>Books that build</span><br /><strong>better investors.</strong></h1>
        <p className="course-hero-copy">A curated collection of timeless books on money, investing, economics and financial thinking.</p>
        <a className="course-primary-button" href="#book-collection">Explore the collection <i className="fa-solid fa-arrow-down" /></a>
      </div>
      <aside className="library-hero-proof" aria-label="The Smisha Library collection">
        <div className="proof-top"><span>CURATED FOR YOU</span><i className="fa-solid fa-bookmark" /></div>
        <strong>05</strong>
        <p>timeless reads for sharper financial thinking</p>
        <div className="proof-pills"><span>Money</span><span>Markets</span><span>Mindset</span></div>
      </aside>
    </section>
    <section className="library-intro" id="book-collection" aria-labelledby="library-collection-heading">
      <div><p className="section-label">CURATED READING</p><h2 id="library-collection-heading"><span>Timeless ideas about</span><strong> money &amp; markets.</strong></h2></div>
      <p>Five classics selected to deepen your understanding of wealth, behavior and economic thinking.</p>
    </section>
    <section className="library-grid" aria-label="Book collection">
      {books.map((book, index) => <article className={`library-card library-card-${index + 1}`} key={book.title}>
        <div className="library-cover-stage">
          <span className="library-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <a className="library-cover" href={book.purchaseUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${book.title} by ${book.author}`}>
          <img src={book.cover} alt={`Original editorial cover artwork for ${book.title} by ${book.author}`} width="768" height="1152" loading={index > 1 ? 'lazy' : 'eager'} />
          <span aria-hidden="true"><i className="fa-solid fa-arrow-up-right-from-square" /></span>
          </a>
        </div>
        <div className="library-card-content">
          <p className="course-subtitle">{book.category}</p>
          <h3>{book.title}</h3>
          <p className="library-author">by {book.author}</p>
          <p className="course-description">{book.description}</p>
          <a className="course-details-button" href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">View Book <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></a>
        </div>
      </article>)}
    </section>
    <SiteCTA label="READY TO LEARN WITH INTENTION?"><span>Turn timeless ideas into</span><br /><strong>your next clear decision.</strong></SiteCTA>
    <SiteFAQ />
    <SiteFooter />
  </main>;
}
