'use client';

import { useEffect } from 'react';

const scriptId = 'tradingview-ticker-tape-script';

export default function TradingViewTickerTape() {
  useEffect(() => {
    if (document.getElementById(scriptId)) return undefined;
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'module';
    script.src = 'https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js';
    document.head.appendChild(script);
    return undefined;
  }, []);

  return <div className="home-market-ticker" aria-label="Live market ticker">
    <tv-ticker-tape symbols="FOREXCOM:DJI,CMCMARKETS:GOLD,NYSE:DELL,NASDAQ:INTC,NASDAQ:TSLA,NASDAQ:AMZN" item-size="compact" show-hover=""></tv-ticker-tape>
  </div>;
}
