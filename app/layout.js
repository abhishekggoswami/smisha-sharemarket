import './globals.css';
import './hero-refresh.css';
import MediaLifecycle from '../components/MediaLifecycle';
import ClientNavigation from '../components/ClientNavigation';
import LeadCapture from '../components/LeadCapture';
import SmishaLoader from '../components/SmishaLoader';

export const metadata = {
  title: 'Smisha Share Market Classes',
  description: 'Practical stock market education, mentorship, and live market training.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link href="https://fonts.googleapis.com/css2?family=Allura&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Great+Vibes&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body><SmishaLoader /><ClientNavigation /><MediaLifecycle />{children}<LeadCapture /></body>
    </html>
  );
}
