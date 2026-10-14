# Digital Knowledge Library
17 in-site reads: 8 original guides and 9 complete historical books. Four external learning sources and a physical-book shelf. The main collection ships metadata only; the reader fetches one section at a time. Local TXT and PDF downloads.

## Recommendations and moderation
POST /api/library/recommendations validates submissions, requires publication consent, rejects duplicate submissions and limits each email to three submissions per day. New submissions are pending. Email is never public. No public admin write endpoint.
Run from the project root in a trusted server shell:
- node scripts/library-moderation.cjs list
- node scripts/library-moderation.cjs approve BK-REAL-SUBMISSION-ID
- node scripts/library-moderation.cjs reject BK-REAL-SUBMISSION-ID
Approved entries render at request time on /library. Review content before approval; reject submissions with sensitive details.

## Deployment
Uses the same SQLite approach as workshop submissions. Set LIBRARY_DATA_DIR to an absolute path on a persistent writable volume and back up library.sqlite. Supported: one long-running Node server. Ephemeral serverless disks or independent multiple instances require a shared durable database adapter first. Development uses Node 22.17+ (node:sqlite). Include public resource files in deployment.

## Sources
Historical authors: Franklin (died 1790), Barnum (1891), Smith (1790), Veblen (1929). Selected historical editions have expired literary copyright terms in USA/India; original credits and source licences are retained. Full original credits and Gutenberg licences retained. No modern copyrighted book hosted.
Source records:
https://www.gutenberg.org/ebooks/59844
https://www.gutenberg.org/ebooks/148
https://www.gutenberg.org/ebooks/43855
https://www.gutenberg.org/ebooks/8581
https://www.gutenberg.org/ebooks/3300
https://www.gutenberg.org/ebooks/833
Licence: https://www.gutenberg.org/policy/license.html
India term reference: https://ipindia.gov.in/pages/copyright/learn/basics-of-copyright
Downloaded archived source texts from GITenberg when main downloads were unavailable:
https://github.com/GITenberg/Franklin-s-Way-to-Wealthor-Poor-Richard-Improved-_43855
https://github.com/GITenberg/The-Art-of-Money-Getting--Or-Golden-Rules-for-Making-Money_8581
https://github.com/GITenberg/The-Theory-of-the-Leisure-Class_833
https://github.com/GITenberg/An-Inquiry-into-the-Nature-and-Causes-of-the-Wealth-of-Nations_3300

Guides are original educational explanations, hypothetical examples and worksheets. Official references link out for further reading; their text is not reproduced. Varsity reserves reproduction rights, so it is external only. Amazon/Flipkart links are labelled searches; prices/stock/editions are not claimed. Existing classic covers are editorial assets; CSS covers are illustrative typography, not official publisher artwork.

## Browser storage and indexing
Bookmarks and last-section progress remain in the visitor's browser. No account sync is claimed. Storage failures produce notices. Reader routes have unique metadata and server-rendered initial sections. Approved community picks are server rendered. Large books are loaded by section; PDF generation code does not enter the client bundle.

## Validation performed
Production build passed. Browser checks: search/category filtering; bookmark persistence after reload; real form submission; pending-to-approved database workflow; server-rendered community picks; email privacy; duplicate/invalid/honeypot/origin/body-size rejection; reader section navigation and restored reading position; text size/night/focus controls; all 12 reader routes and section APIs; eight valid PDF downloads and four complete TXT books; desktop 1440px and mobile 390px layouts without overflow. All 16 PDF pages visually reviewed. Temporary test submissions are removed after validation.

Guide content is maintained in lib/library-notes.json. Regenerate PDFs with python scripts/generate-library-guides.py (requires reportlab and DejaVu Sans on Linux or Segoe UI on Windows). Recheck rendering after content edits. Real browser-click PDF and TXT downloads were confirmed to complete; navigation to readers preserves the loaded app.

## Page-turn reader and visual refinement
Library-only visual update: native SVG icons, cover depth and hover states, entrance transitions, larger card/control typography, visible contrast in active/hover/disabled controls. Default shelf now shows six original public-domain books; academy guides are separately labelled. Added complete source editions of The Science of Getting Rich (Gutenberg 59844, GITenberg/The-Science-of-Getting-Rich_59844) and The Autobiography of Benjamin Franklin (Gutenberg 148, GITenberg/The-Autobiography-of-Benjamin-Franklin_148). Original credits/licences retained; source body word comparisons passed for all six books.
Reader uses an immersive viewport, two paper pages on desktop and one on smaller screens, native CSS 3D page turns, keyboard arrows, touch gestures, bookmarks, remembered page, font size and night paper. Real DOM measurements paginate loaded sections without truncating words or creating scrolling text panels. Original chapter labels are detected where present. Reduced-motion preferences disable turn animation.
Validated page fit at 320, 390, 768 and 1440px, source-text integrity, pagination integrity and readable control contrast. Changes are confined to Library components, Library routes/data and Library resource assets; shared page components were not edited.

## Editorial visual direction
Library-only styling is now isolated in components/LibraryEditorial.css, imported by LibraryPage and LibraryReader. Warm paper and deep charcoal/forest tones, Georgia editorial headlines and Segoe UI controls replace the repeated pale-blue cards. The lead book spans the collection width; subsequent entries pair covers with copy horizontally. Learning paths form an editorial index, retailer links form compact book rows, and recommendations use a dark panel with a paper form. Original source content and backend workflows are unchanged. Desktop/mobile screenshots, page-fitting integrity and normal/selected/hover control contrast checked after the redesign.

## Stock-market collection update
Added complete Project Gutenberg editions 60979 (Reminiscences of a Stock Operator), 26841 (Successful Stock Speculation) and 59518 (The Theory of Stock Exchange Speculation), with source credits and licences retained. Bespoke SVG chart covers distinguish these stock-market books. Spotlight and recommendation panels span the viewport; the recommendation form uses the Contact visual system while retaining its moderated submission workflow. Homepage and course listings share CourseCard.
