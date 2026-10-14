// Local SVG icons: no icon-font/CDN dependency within the Library.
const shapes={
 growth:<><path d="M3 20h18M5 17v-4M10 17V9M15 17V5"/><path d="m4 10 6-5 5 2 6-5M16 2h5v5"/></>,
 candles:<><path d="M5 3v18M12 2v20M19 4v16"/><rect x="3" y="7" width="4" height="7" rx="1"/><rect x="10" y="5" width="4" height="10" rx="1"/><rect x="17" y="9" width="4" height="6" rx="1"/></>,
 research:<><path d="M3 4h11v16H3Z M6 15l3-4 3 2"/><circle cx="17" cy="8" r="4"/><path d="m20 11 3 3M6 7h4"/></>,
 book:<><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v14M6 9h3M6 12h3M15 9h3M15 12h3"/></>,
 bookmark:<path d="M6 3h12v18l-6-4-6 4Z"/>,
 arrow:<><path d="M4 12h16M14 6l6 6-6 6"/></>,
 external:<><path d="M14 3h7v7M21 3l-11 11M10 4H4v16h16v-6"/></>,
 download:<><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
 search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
 shield:<><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
 seed:<><path d="M12 21V10M12 14C5 14 3 9 3 5c6 0 9 2 9 9ZM12 10c0-5 3-7 9-7 0 4-2 7-9 7Z"/></>,
 chart:<><path d="M3 3v18h18M7 16v-5M12 16V7M17 16V4"/></>,
 layers:<><path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/></>,
 wave:<path d="M2 12h4V5h6v14h6v-7h4"/>,
 clipboard:<><path d="M8 5H5v16h14V5h-3M8 3h8v4H8Z"/><path d="m8 14 3 3 5-6"/></>,
 bank:<><path d="m3 8 9-5 9 5ZM2 21h20M4 18h16M5 9v9M10 9v9M14 9v9M19 9v9"/></>,
 line:<><path d="M3 3v18h18M6 15l5-5 4 3 6-8"/></>,
 compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/></>,
 people:<><circle cx="12" cy="7" r="3"/><path d="M6 21v-3c0-4 12-4 12 0v3M4 4a3 3 0 0 0 0 6M20 4a3 3 0 0 1 0 6M2 19v-3c0-2 2-3 4-3M22 19v-3c0-2-2-3-4-3"/></>,
 check:<path d="m5 12 5 5L20 6"/>,
 circlecheck:<><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-6"/></>,
 quote:<><path d="M10 5H3v8h5c0 3-2 5-5 6M21 5h-7v8h5c0 3-2 5-5 6"/></>,
 moon:<path d="M20 14A9 9 0 0 1 10 4a9 9 0 1 0 10 10Z"/>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
 expand:<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>,
 pen:<><path d="m4 16 12-12 4 4L8 20H4ZM13 7l4 4"/></>,
 close:<path d="m5 5 14 14M19 5 5 19"/>,
 sparkle:<><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4M18 4h4"/></>
};
const aliases={"book-open":"book","arrow-right":"arrow","arrow-left":"arrow","arrow-down":"arrow","arrow-up-right-from-square":"external","magnifying-glass":"search","shield-halved":"shield","seedling":"seed","chart-column":"chart","chart-simple":"chart","layer-group":"layers","wave-square":"wave","clipboard-check":"clipboard","magnifying-glass-chart":"search","building-columns":"bank","landmark":"bank","chart-line":"line","people-group":"people","circle-check":"circlecheck","quote-left":"quote","pen-to-square":"pen"};
export default function LibraryIcon({name,className="",...props}){
 const token=name||className.split(/\s+/).filter(x=>x.startsWith("fa-")&&!["fa-solid","fa-regular"].includes(x)).at(-1)?.slice(3)||"book";
 const icon=aliases[token]||token;
 return <span {...props} className={"knowledge-icon "+className.split(/\s+/).filter(x=>!x.startsWith("fa-")).join(" ")} data-icon={icon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={token==="arrow-left"?{transform:"rotate(180deg)"}:token==="arrow-down"?{transform:"rotate(90deg)"}:undefined}>{shapes[icon]||shapes.book}</svg></span>;
}
