import './globals.css';
import TradingViewTickerTape from '../components/TradingViewTickerTape';

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
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body><TradingViewTickerTape />{children}</body>
    </html>
  );
}
