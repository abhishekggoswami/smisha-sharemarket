import { jsPDF } from 'jspdf';

const green = [18, 73, 63];
const muted = [83, 109, 101];
const lime = [191, 237, 64];
const money = value => Number.isFinite(Number(value)) ? `INR ${Math.round(value).toLocaleString('en-IN')}` : 'Not available';
const clean = value => String(value ?? '').replace(/₹/g, 'INR ').replace(/[–—]/g, '-').replace(/[‘’]/g, "'");

export function createCalculationReport(bundle, logo = null, generated = new Date()) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 42;
  const content = width - margin * 2;
  const text = (value, x, y, size = 10, color = green, bold = false, options = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(clean(value), x, y, options);
  };
  const fit = (value, x, y, maximum, size, color, bold) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const fitted = Math.min(size, size * maximum / Math.max(1, doc.getTextWidth(clean(value))));
    text(value, x, y, fitted, color, bold);
  };
  const table = (title, rows, y) => {
    text(title, margin, y, 9, muted, true);
    y += 14;
    rows.forEach(([label, value], index) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      const left = doc.splitTextToSize(clean(label), content * .57 - 28);
      doc.setFont('helvetica', 'bold');
      const right = doc.splitTextToSize(clean(value), content * .43 - 28);
      const rowHeight = Math.max(34, Math.max(left.length, right.length) * 12 + 18);
      doc.setFillColor(...(index % 2 ? [255, 255, 255] : [244, 247, 242]));
      doc.rect(margin, y, content, rowHeight, 'F');
      text(left.join('\n'), margin + 14, y + 21, 10, muted);
      text(right.join('\n'), width - margin - 14, y + 21, 10, green, true, { align: 'right' });
      y += rowHeight;
    });
    return y;
  };

  bundle.forEach((item, index) => {
    if (index) doc.addPage();
    doc.setFillColor(255, 255, 255); doc.rect(0, 0, width, height, 'F');
    doc.setFillColor(...green); doc.rect(0, 0, width, 114, 'F');
    doc.setFillColor(...lime); doc.rect(0, 114, width, 5, 'F');
    if (logo) doc.addImage(logo, 'PNG', margin, 29, 50, 50);
    const brandX = logo ? margin + 65 : margin;
    text('SMISHA SHARE MARKET', brandX, 49, 17, [255, 255, 255], true);
    text('YOUR PERSONAL CALCULATION REPORT', brandX, 68, 8, [204, 225, 214]);
    text(`PREPARED ${generated.toLocaleDateString('en-IN')}`, brandX, 88, 8, [204, 225, 214]);

    text(`CALCULATION ${String(index + 1).padStart(2, '0')} / ${String(bundle.length).padStart(2, '0')}`, margin, 150, 9, muted, true);
    text(`Saved ${item.date}`, width - margin, 150, 9, muted, false, { align: 'right' });
    fit(item.title, margin, 187, content, 29, green, true);

    doc.setFillColor(...green); doc.roundedRect(margin, 210, content, 116, 12, 12, 'F');
    doc.setFillColor(...lime); doc.roundedRect(margin + 18, 228, 4, 78, 2, 2, 'F');
    text(item.result.label, margin + 36, 241, 11, [221, 236, 228]);
    const result = item.result;
    const value = !Number.isFinite(result.value) ? 'Not available' : result.valueType === 'percent' ? `${result.value.toFixed(2)}%` : result.valueType === 'years' ? `${result.value.toFixed(1)} years` : money(result.value);
    fit(value, margin + 36, 282, content - 65, 34, lime, true);
    text('ILLUSTRATIVE ESTIMATE', margin + 36, 308, 8, [221, 236, 228]);

    doc.setFillColor(236, 242, 228); doc.roundedRect(margin, 338, content, 51, 8, 8, 'F');
    text(result.secondary, margin + 16, 358, 9, muted);
    fit(money(result.secondaryValue), margin + 16, 378, content - 32, 15, green, true);

    const inputRows = item.inputs.map(([label, raw]) => {
      const numeric = Number(raw);
      const value = !Number.isFinite(numeric) ? 'Not available' : /%/.test(label) ? `${numeric.toLocaleString('en-IN')}%` : /year/i.test(label) ? `${numeric.toLocaleString('en-IN')} years` : money(numeric);
      return [label, value];
    });
    const y = table('01   YOUR INPUTS', inputRows, 417);
    table('02   RESULT BREAKDOWN', result.details, y + 27);

    doc.setDrawColor(218, 228, 219); doc.line(margin, height - 88, width - margin, height - 88);
    text('For educational illustration only. Estimates are not assured returns or financial advice.', margin, height - 68, 8, muted);
    text('SMISHA  /  PLAN WITH CLARITY', margin, height - 40, 8, green, true);
    text(`${index + 1} / ${bundle.length}`, width - margin, height - 40, 9, muted, false, { align: 'right' });
  });
  return doc;
}
