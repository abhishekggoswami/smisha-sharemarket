import SiteHeader from './SiteHeader';
import { SiteFooter } from './SharedSiteSections';

const content = {
  terms: {
    kicker: 'TERMS & CONDITIONS',
    title: 'Learning with clarity and mutual respect.',
    intro: 'These terms explain the general conditions for using Smisha Share Market Academy’s website, programmes, and learning resources.',
    sections: [
      ['Using this website', 'Please use our website and learning materials lawfully and respectfully. Content is provided for education and should not be copied, redistributed, or used commercially without written permission.'],
      ['Education, not investment advice', 'Our courses, workshops, calculators, and resources are educational. They are not personalised investment, trading, legal, or tax advice. Market decisions remain your responsibility.'],
      ['Enquiries and enrolments', 'Submitting an enquiry does not guarantee admission or a course place. Programme availability, pricing, schedules, and access are confirmed directly by the academy.'],
      ['Updates', 'We may update these terms, the website, or learning material when needed. Continuing to use the website after an update means you accept the revised terms.'],
    ],
  },
  privacy: {
    kicker: 'PRIVACY POLICY',
    title: 'Your details are handled with care.',
    intro: 'This policy describes how Smisha Share Market Academy uses the information you share through this website.',
    sections: [
      ['Information we collect', 'We collect details you choose to provide, such as your name, phone number, email address, learning interests, and enquiry message.'],
      ['How we use it', 'We use this information to respond to your enquiry, arrange relevant learning support, share requested updates, and improve our services.'],
      ['How we protect it', 'We take reasonable measures to safeguard submitted information and do not sell your personal data. Access is limited to people who need it to support your enquiry or academy services.'],
      ['Your choices', 'You may ask to update or remove your contact information, or opt out of non-essential communications, by contacting us at support@smishasharemarket.com.'],
    ],
  },
  legal: {
    kicker: 'LEGAL INFORMATION',
    title: 'Important information for every learner.',
    intro: 'Smisha Share Market Academy provides practical financial-market education. Please read these important notices before acting on any information from our website.',
    sections: [
      ['No guarantee of returns', 'Markets involve risk. We do not promise profits, returns, or a particular outcome from any course, workshop, strategy, or resource.'],
      ['Independent decisions', 'Examples, charts, calculators, and discussions are illustrative and educational. Seek advice from an appropriately qualified professional before making financial decisions.'],
      ['Accuracy of information', 'We aim to keep website information useful and current, but market data and educational material can change. Please verify information before relying on it.'],
      ['Contact', 'For a question about these notices or the academy’s services, email support@smishasharemarket.com or contact us through WhatsApp.'],
    ],
  },
};

export default function LegalInformationPage({ type }) {
  const page = content[type];
  return <main className="course-shell legal-page-shell">
    <SiteHeader />
    <section className="legal-page-hero"><p className="section-label">{page.kicker}</p><h1>{page.title}</h1><p>{page.intro}</p></section>
    <section className="legal-page-content" aria-label={page.kicker}>
      {page.sections.map(([heading, copy], index) => <article key={heading}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h2>{heading}</h2><p>{copy}</p></div></article>)}
    </section>
    <SiteFooter />
  </main>;
}
