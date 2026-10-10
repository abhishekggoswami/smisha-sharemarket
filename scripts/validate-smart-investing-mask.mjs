import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { svgPathProperties } from 'svg-path-properties';
import { smartInvestingOutline } from '../lib/generated/smartInvestingOutline.js';
import { smartInvestingWritingGuides } from '../lib/smartInvestingWritingGuides.js';

const { viewBox, outlinePath } = smartInvestingOutline;
const width = 1800;
const height = Math.round(width * viewBox.height / viewBox.width);
const target = path.join(process.cwd(), 'tmp', 'hero-animation-validation');
const guides = smartInvestingWritingGuides.map(({ d, width: strokeWidth }) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${strokeWidth + 270}" stroke-linecap="round" stroke-linejoin="round" />`).join('');
const shell = (content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" width="${width}" height="${height}">${content}</svg>`;
const source = shell(`<path fill="#0c2d73" d="${outlinePath}" />`);
const masked = shell(`<defs><mask id="ink" maskUnits="userSpaceOnUse" x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}"><rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="#000" />${guides}</mask></defs><path fill="#0c2d73" mask="url(#ink)" d="${outlinePath}" />`);
const pathMetrics = smartInvestingWritingGuides.map((guide) => new svgPathProperties(guide.d));
const pathLengths = pathMetrics.map((metric) => metric.getTotalLength());
const boardHold = .16;
const entryTime = .32;
const liftTime = .025;
const drawingBudget = 4.65;
const minimumStrokeTime = .08;
const pathLengthTotal = pathLengths.reduce((sum, length) => sum + length, 0);
const drawingTime = pathLengths.map((length) => minimumStrokeTime + (drawingBudget - minimumStrokeTime * pathLengths.length) * (length / pathLengthTotal));
const totalTime = entryTime + drawingTime.reduce((sum, duration) => sum + duration, 0) + liftTime * (pathLengths.length - 1);
const totalAnimationTime = boardHold + totalTime + .3;
const schedule = [];
let cursor = entryTime;
pathLengths.forEach((length, index) => {
  schedule.push({ type: 'draw', index, start: cursor, end: cursor + drawingTime[index], length });
  cursor += drawingTime[index];
  if (index < pathLengths.length - 1) {
    schedule.push({ type: 'lift', index, start: cursor, end: cursor + liftTime });
    cursor += liftTime;
  }
});

function makeFrame(progress) {
  const animationTime = progress * totalAnimationTime;
  const time = animationTime - boardHold;
  if (progress === 1) {
    return shell(`<rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="#f7fbff"/><path fill="#0c2d73" d="${outlinePath}"/>`);
  }
  const partialGuides = smartInvestingWritingGuides.map((guide, index) => {
    const segment = schedule.find((item) => item.type === 'draw' && item.index === index);
    const amount = Math.max(0, Math.min(1, (time - segment.start) / (segment.end - segment.start)));
    if (amount <= 0) return '';
    const length = pathLengths[index];
    return `<path d="${guide.d}" fill="none" stroke="#fff" stroke-width="${guide.width + 270}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${length}" stroke-dashoffset="${length * (1 - amount)}"/>`;
  }).join('');
  // These files validate the actual ink mask only. The browser owns the
  // raster pen transform, so this harness intentionally does not render a
  // surrogate marker that could misrepresent the production animation.
  let pen = '';
  if (time >= 0 && time < entryTime) {
    pen = '';
  } else if (time >= entryTime && time <= totalTime) {
    pen = '';
  }
  return shell(`<rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="#f7fbff"/><defs><mask id="ink" maskUnits="userSpaceOnUse" x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}"><rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="#000"/>${partialGuides}</mask></defs><path fill="#0c2d73" mask="url(#ink)" d="${outlinePath}"/>${pen}`);
}
const [sourcePixels, maskedPixels] = await Promise.all([
  sharp(Buffer.from(source)).ensureAlpha().raw().toBuffer(),
  sharp(Buffer.from(masked)).ensureAlpha().raw().toBuffer(),
]);

let totalInk = 0;
let revealedInk = 0;
for (let index = 3; index < sourcePixels.length; index += 4) {
  if (sourcePixels[index] > 16) {
    totalInk += 1;
    if (maskedPixels[index] > 16) revealedInk += 1;
  }
}
const coverage = revealedInk / totalInk;
const overlay = shell(`<path fill="#e43d53" fill-opacity=".88" d="${outlinePath}" /><defs><mask id="ink" maskUnits="userSpaceOnUse" x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}"><rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="#000" />${guides}</mask></defs><path fill="#0c2d73" mask="url(#ink)" d="${outlinePath}" />`);

await mkdir(target, { recursive: true });
await Promise.all([
  writeFile(path.join(target, 'smart-investing-full-mask.svg'), masked),
  sharp(Buffer.from(overlay)).png().toFile(path.join(target, 'smart-investing-mask-coverage.png')),
  ...[0, .25, .5, .75, 1].map((progress) => sharp(Buffer.from(makeFrame(progress))).png().toFile(path.join(target, `smart-investing-frame-${Math.round(progress * 100)}.png`))),
]);

console.log(JSON.stringify({ totalInk, revealedInk, coverage: Number(coverage.toFixed(4)), totalAnimationTime: Number(totalAnimationTime.toFixed(3)) }, null, 2));
if (coverage < .985) process.exitCode = 1;
