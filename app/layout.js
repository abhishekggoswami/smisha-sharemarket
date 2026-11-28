import './globals.css';
import TradingViewTickerTape from '../components/TradingViewTickerTape';
import MediaLifecycle from '../components/MediaLifecycle';
import ClientNavigation from '../components/ClientNavigation';
import LeadCapture from '../components/LeadCapture';
import MetaPixelNavigation from '../components/MetaPixelNavigation';

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
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2389753051771497');
          fbq('track', 'PageView');
        ` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body><noscript><img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=2389753051771497&amp;ev=PageView&amp;noscript=1" alt="" /></noscript><MetaPixelNavigation /><ClientNavigation /><MediaLifecycle /><TradingViewTickerTape />{children}<LeadCapture /></body>
    </html>
  );
}
