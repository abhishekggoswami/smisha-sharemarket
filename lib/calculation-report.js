import { jsPDF } from 'jspdf';

// Mirrors the shared navy and cyan system used throughout the Smisha website.
const navy = [12, 45, 115];
const blue = [28, 78, 181];
const line = [49, 112, 211];
const cyan = [75, 200, 255];
const sky = [205, 239, 255];
const ink = [16, 39, 91];
const muted = [77, 108, 159];
const pale = [241, 248, 255];
const money = value => Number.isFinite(Number(value)) ? `INR ${Math.round(value).toLocaleString('en-IN')}` : 'Not available';
const clean = value => String(value ?? '').replace(/₹/g, 'INR ').replace(/[–—]/g, '-').replace(/[‘’]/g, "'");

export function createCalculationReport(bundle, logo = null, generated = new Date()) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 42;
  const content = width - margin * 2;
  const text = (value, x, y, size = 10, color = ink, bold = false, options = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(clean(value), x, y, options);
  };
  const fit = (value, x, y, maximum, size, color, bold, options = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const fitted = Math.min(size, size * maximum / Math.max(1, doc.getTextWidth(clean(value))));
    text(value, x, y, fitted, color, bold, options);
  };
  const rule = (y, color = [220, 232, 249]) => { doc.setDrawColor(...color); doc.setLineWidth(.7); doc.line(margin, y, width - margin, y); };
  const rows = (heading, entries, y) => {
    text(heading, margin, y, 8.5, muted, true);
    y += 15;
    entries.forEach(([label, value], index) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
      const left = doc.splitTextToSize(clean(label), content * .57 - 28);
      doc.setFont('helvetica', 'bold');
      const right = doc.splitTextToSize(clean(value), content * .43 - 28);
      const rowHeight = Math.max(35, Math.max(left.length, right.length) * 12 + 17);
      doc.setFillColor(...(index % 2 ? [255, 255, 255] : pale));
      doc.roundedRect(margin, y, content, rowHeight, 6, 6, 'F');
      text(left.join('\n'), margin + 15, y + 21, 9.5, muted);
      text(right.join('\n'), width - margin - 15, y + 21, 9.5, ink, true, { align: 'right' });
      y += rowHeight + 3;
    });
    return y;
  };
  const header = (page, pages) => {
    doc.setFillColor(255, 255, 255); doc.rect(0, 0, width, height, 'F');
    doc.setFillColor(247, 251, 255); doc.rect(0, 0, width, 152, 'F');
    doc.setFillColor(225, 244, 255); doc.circle(width + 26, -12, 165, 'F');
    doc.setFillColor(210, 237, 255); doc.circle(width + 36, -12, 112, 'F');
    doc.setDrawColor(165, 216, 246); doc.setLineWidth(.5);
    for (let offset = 0; offset < 6; offset += 1) doc.line(377, 27 + offset * 19, width - 22, 27 + offset * 19);
    for (let offset = 0; offset < 6; offset += 1) doc.line(395 + offset * 25, 20, 395 + offset * 25, 125);
    if (logo) doc.addImage(logo, 'PNG', margin, 35, 50, 50);
    const brandX = logo ? margin + 65 : margin;
    text('SMISHA SHARE MARKET', brandX, 60, 17, navy, true);
    text('PERSONAL CALCULATION REPORT', brandX, 80, 8.5, blue, true);
    text(`GENERATED ${generated.toLocaleDateString('en-IN')}`, brandX, 103, 8, muted);
    doc.setFillColor(255, 255, 255); doc.setDrawColor(...line); doc.setLineWidth(1); doc.roundedRect(width - margin - 105, 38, 105, 24, 12, 12, 'FD');
    text('PLAN WITH CLARITY', width - margin - 52.5, 54, 7.7, navy, true, { align: 'center' });
    doc.setFillColor(...cyan); doc.rect(0, 147, width, 5, 'F');
    doc.setFillColor(...navy); doc.rect(0, height - 47, width, 47, 'F');
    text('SMISHA SHARE MARKET  /  EDUCATION FIRST', margin, height - 27, 7.5, sky, true);
    text(`${page} / ${pages}`, width - margin, height - 27, 8, sky, false, { align: 'right' });
  };

  bundle.forEach((item, index) => {
    if (index) doc.addPage();
    header(index + 1, bundle.length);
    const result = item.result;
    const value = !Number.isFinite(result.value) ? 'Not available' : result.valueType === 'percent' ? `${result.value.toFixed(2)}%` : result.valueType === 'years' ? `${result.value.toFixed(1)} years` : money(result.value);
    text(`CALCULATION ${String(index + 1).padStart(2, '0')}  /  ${String(bundle.length).padStart(2, '0')}`, margin, 184, 8.5, muted, true);
    text(`Saved ${item.date}`, width - margin, 184, 8.5, muted, false, { align: 'right' });
    rule(197);
    fit(item.title, margin, 230, content, 28, ink, true);
    doc.setFillColor(...navy); doc.roundedRect(margin, 247, content, 112, 16, 16, 'F');
    doc.setFillColor(...blue); doc.circle(width - 73, 288, 53, 'F');
    doc.setFillColor(...cyan); doc.circle(width - 73, 288, 32, 'F');
    doc.setFillColor(...cyan); doc.roundedRect(margin + 20, 267, 5, 70, 3, 3, 'F');
    text(result.label, margin + 40, 283, 10.5, sky);
    fit(value, margin + 40, 322, content - 115, 31, [255, 255, 255], true);
    text('ILLUSTRATIVE ESTIMATE', margin + 40, 342, 8, sky, true);
    doc.setFillColor(...pale); doc.roundedRect(margin, 374, content, 54, 11, 11, 'F');
    doc.setFillColor(...cyan); doc.circle(margin + 26, 401, 11, 'F');
    text('+', margin + 26, 405, 12, navy, true, { align: 'center' });
    text(result.secondary, margin + 47, 395, 8.8, muted, true);
    fit(money(result.secondaryValue), margin + 47, 415, content - 75, 15, ink, true);
    const inputRows = item.inputs.map(([label, raw]) => {
      const numeric = Number(raw);
      const valueText = !Number.isFinite(numeric) ? 'Not available' : /%/.test(label) ? `${numeric.toLocaleString('en-IN')}%` : /year/i.test(label) ? `${numeric.toLocaleString('en-IN')} years` : money(numeric);
      return [label, valueText];
    });
    const inputsEnd = rows('01   INPUTS USED FOR THIS ESTIMATE', inputRows, 449);
    rows('02   RESULT BREAKDOWN', result.details, inputsEnd + 16);
    text('Educational illustration only. Calculations are estimates, not assured returns or financial advice.', margin, height - 66, 7.8, muted);
  });
  return doc;
}
