import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import opentype from 'opentype.js';

const root = process.cwd();
const fontPath = process.env.SMISHA_SEGOE_PRINT_FONT_PATH ?? 'C:/Windows/Fonts/segoeprb.ttf';
const fontSize = 1000;
const letterSpacing = -0.055;
const baseline = 1325;
const padding = 90;

const titles = {
  'mutual-fund-wealth-builder': 'Mutual Fund\nWealth Builder',
  'technical-analysis-blueprint': 'Technical\nAnalysis',
  'professional-options-trading': 'Options\nTrading',
  'value-investing-blueprint': 'Value\nInvesting',
  'professional-equity-research-analyst-program': 'Equity\nResearch',
  'nism-xv-research-analyst-exam-prep': 'NISM XV\nExam Prep',
};

const font = opentype.parse(await readFile(fontPath));
if (font.names.windows?.fontFamily?.en !== 'Segoe Print' || font.names.windows?.fontSubfamily?.en !== 'Bold') {
  throw new Error('Expected the existing Segoe Print Bold source font.');
}

function makeLineGuide(pathData, index) {
  const bounds = pathData.getBoundingBox();
  const height = Math.max(1, bounds.y2 - bounds.y1);
  return {
    // Reveal a title line only behind the pen. This is intentionally a
    // continuous, title-specific route rather than a synthetic approximation
    // of individual letter shapes, which can produce broken fragments.
    d: `M${(bounds.x1 - 80).toFixed(1)} ${((bounds.y1 + bounds.y2) / 2).toFixed(1)} L${(bounds.x2 + 80).toFixed(1)} ${((bounds.y1 + bounds.y2) / 2).toFixed(1)}`,
    width: height + 150,
    index,
  };
}

function createTitle(text) {
  const lines = text.split('\n');
  const lineHeight = 1080;
  const linePaths = lines.map((line, lineIndex) => font.getPath(line, 0, baseline + lineIndex * lineHeight, fontSize, { kerning: true, letterSpacing }));
  const commands = linePaths.flatMap((item) => item.commands);
  const outline = new opentype.Path();
  outline.commands = commands;
  const bounds = outline.getBoundingBox();
  const viewBox = {
    x: Math.floor(bounds.x1 - padding),
    y: Math.floor(bounds.y1 - padding),
    width: Math.ceil(bounds.x2 - bounds.x1 + padding * 2),
    height: Math.ceil(bounds.y2 - bounds.y1 + padding * 2),
  };
  const trajectories = linePaths.map((linePath, index) => makeLineGuide(linePath, index));
  return { text, viewBox, outlinePath: outline.toPathData(3), trajectories };
}

const definitions = Object.fromEntries(Object.entries(titles).map(([slug, text]) => [slug, createTitle(text)]));
const header = '// Generated from the locally installed Segoe Print Bold source for the course-board titles.\n// The source font is not bundled or distributed by this project.\n';
await writeFile(path.join(root, 'lib', 'generated', 'courseBoardTitleOutlines.js'), `${header}export const courseBoardTitleOutlines = ${JSON.stringify(definitions, null, 2)};\n`);
console.log(`Generated ${Object.keys(definitions).length} course-board title outlines.`);
