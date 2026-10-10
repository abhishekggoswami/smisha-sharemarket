import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';

const root = process.cwd();
const fontPath = process.env.SMISHA_SEGOE_PRINT_FONT_PATH ?? 'C:/Windows/Fonts/segoeprb.ttf';
const text = 'Smart Investing';
const fontSize = 1000;
const letterSpacing = -0.055;
const baseline = 1325;
const padding = 90;

const fontBuffer = await readFile(fontPath);
const font = opentype.parse(fontBuffer);
const fsType = font.tables.os2?.fsType;

if (font.names.windows?.fontFamily?.en !== 'Segoe Print' || font.names.windows?.fontSubfamily?.en !== 'Bold') {
  throw new Error('Expected the existing Segoe Print Bold source font.');
}

if (fsType !== 8) {
  throw new Error(`Expected editable embedding permission (fsType 8); found ${fsType}.`);
}

const outline = font.getPath(text, 0, baseline, fontSize, { kerning: true, letterSpacing });
const bounds = outline.getBoundingBox();
const viewBox = {
  x: Math.floor(bounds.x1 - padding),
  y: Math.floor(bounds.y1 - padding),
  width: Math.ceil(bounds.x2 - bounds.x1 + padding * 2),
  height: Math.ceil(bounds.y2 - bounds.y1 + padding * 2),
};
const outlinePath = outline.toPathData(3);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" role="img" aria-label="${text}"><path fill="#0c2d73" d="${outlinePath}"/></svg>`;
const sourceHeader = `// Generated from the locally installed Segoe Print Bold source for this exact title.\n// The source font is not bundled or distributed by this project.\n`;
const moduleSource = `${sourceHeader}export const smartInvestingOutline = ${JSON.stringify({ text, viewBox, outlinePath }, null, 2)};\n`;

await mkdir(path.join(root, 'lib', 'generated'), { recursive: true });
await mkdir(path.join(root, 'public', 'assets', 'course-board-titles'), { recursive: true });
await mkdir(path.join(root, 'tmp', 'hero-animation-validation'), { recursive: true });

await Promise.all([
  writeFile(path.join(root, 'lib', 'generated', 'smartInvestingOutline.js'), moduleSource),
  writeFile(path.join(root, 'public', 'assets', 'course-board-titles', 'smart-investing-outline.svg'), svg),
  sharp(Buffer.from(svg)).png().toFile(path.join(root, 'tmp', 'hero-animation-validation', 'smart-investing-outline.png')),
]);

console.log(JSON.stringify({
  font: font.names.windows.fullName.en,
  fsType,
  commandCount: outline.commands.length,
  viewBox,
}, null, 2));
