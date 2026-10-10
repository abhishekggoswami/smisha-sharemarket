import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { svgPathProperties } from 'svg-path-properties';
import { smartInvestingOutline } from '../lib/generated/smartInvestingOutline.js';
import { smartInvestingWritingGuides } from '../lib/smartInvestingWritingGuides.js';

const { viewBox, outlinePath } = smartInvestingOutline;
const sGuide = smartInvestingWritingGuides[0];
const sRegion = { x: viewBox.x, y: viewBox.y, width: 710, height: viewBox.height };
const target = path.join(process.cwd(), 'tmp', 'hero-animation-validation');
const properties = new svgPathProperties(sGuide.d);
const length = properties.getTotalLength();
const width = 1000;
const height = Math.round(width * sRegion.height / sRegion.width);

function shell(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sRegion.x} ${sRegion.y} ${sRegion.width} ${sRegion.height}" width="${width}" height="${height}">${content}</svg>`;
}

function frame(progress) {
  const amount = Math.max(0, Math.min(1, progress));
  const stroke = amount === 0 ? '' : `<path d="${sGuide.d}" fill="none" stroke="#fff" stroke-width="${sGuide.width + 270}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${length} ${length}" stroke-dashoffset="${length * (1 - amount)}"/>`;
  return shell(`<rect x="${sRegion.x}" y="${sRegion.y}" width="${sRegion.width}" height="${sRegion.height}" fill="#f7fbff"/><defs><clipPath id="capital-s"><rect x="${sRegion.x}" y="${sRegion.y}" width="${sRegion.width}" height="${sRegion.height}"/></clipPath><mask id="ink" maskUnits="userSpaceOnUse" x="${sRegion.x}" y="${sRegion.y}" width="${sRegion.width}" height="${sRegion.height}"><rect x="${sRegion.x}" y="${sRegion.y}" width="${sRegion.width}" height="${sRegion.height}" fill="#000"/>${stroke}</mask></defs><path clip-path="url(#capital-s)" fill="#0c2d73" mask="url(#ink)" d="${outlinePath}"/>`);
}

const [sourcePixels, finalPixels] = await Promise.all([
  sharp(Buffer.from(shell(`<path fill="#0c2d73" d="${outlinePath}"/>`))).ensureAlpha().raw().toBuffer(),
  sharp(Buffer.from(frame(1))).ensureAlpha().raw().toBuffer(),
]);

let sourceInk = 0;
let revealedInk = 0;
for (let index = 3; index < sourcePixels.length; index += 4) {
  if (sourcePixels[index] > 16) {
    sourceInk += 1;
    if (finalPixels[index] > 16) revealedInk += 1;
  }
}

await mkdir(target, { recursive: true });
await Promise.all([0, .25, .5, .75, 1].map((progress) => sharp(Buffer.from(frame(progress))).png().toFile(path.join(target, `smart-investing-s-${Math.round(progress * 100)}.png`))));
await writeFile(path.join(target, 'smart-investing-s-mask.svg'), frame(1));

const coverage = revealedInk / sourceInk;
console.log(JSON.stringify({ sourceInk, revealedInk, coverage: Number(coverage.toFixed(4)) }, null, 2));
if (coverage < .995) process.exitCode = 1;
