'use client';

import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import SiteHeader from './SiteHeader';
import { SiteCTA, SiteFAQ, SiteFooter } from './SharedSiteSections';

const calculators = [
  { id: 'sip', category: 'Investing', icon: 'fa-chart-line', title: 'SIP Maturity', summary: 'See what a monthly investment could grow into.', fields: [['monthly', 'Monthly investment', 5000], ['rate', 'Expected return (% p.a.)', 12], ['years', 'Investment period (years)', 10]] },
  { id: 'lumpsum', category: 'Investing', icon: 'fa-coins', title: 'Lumpsum Growth', summary: 'Project the future value of a one-time investment.', fields: [['principal', 'Investment amount', 100000], ['rate', 'Expected return (% p.a.)', 12], ['years', 'Investment period (years)', 10]] },
  { id: 'compound', category: 'Growth', icon: 'fa-arrow-trend-up', title: 'Compound Interest', summary: 'Understand the effect of compounding on your money.', fields: [['principal', 'Starting amount', 100000], ['rate', 'Annual interest rate (%)', 8], ['years', 'Growth period (years)', 5]] },
  { id: 'simple', category: 'Growth', icon: 'fa-percent', title: 'Simple Interest', summary: 'Calculate interest without compounding.', fields: [['principal', 'Principal amount', 100000], ['rate', 'Annual interest rate (%)', 8], ['years', 'Period (years)', 3]] },
  { id: 'goalSip', category: 'Goals', icon: 'fa-bullseye', title: 'Goal SIP', summary: 'Estimate the monthly amount needed to reach a goal.', fields: [['goal', 'Goal amount', 1000000], ['rate', 'Expected return (% p.a.)', 12], ['years', 'Time to goal (years)', 8]] },
  { id: 'retirement', category: 'Goals', icon: 'fa-umbrella-beach', title: 'Retirement Corpus', summary: 'Estimate a future corpus based on monthly expenses.', fields: [['expense', 'Current monthly expenses', 40000], ['inflation', 'Expected inflation (%)', 6], ['years', 'Years to retirement', 25]] },
  { id: 'emi', category: 'Loans', icon: 'fa-house', title: 'Loan EMI', summary: 'Work out a fixed monthly loan repayment.', fields: [['principal', 'Loan amount', 2500000], ['rate', 'Interest rate (% p.a.)', 8.5], ['years', 'Loan tenure (years)', 20]] },
  { id: 'eligibility', category: 'Loans', icon: 'fa-hand-holding-dollar', title: 'Loan Eligibility', summary: 'Get a directional estimate of borrowing capacity.', fields: [['income', 'Net monthly income', 75000], ['obligations', 'Existing monthly EMIs', 10000], ['rate', 'Interest rate (% p.a.)', 9], ['years', 'Preferred tenure (years)', 20]] },
  { id: 'inflation', category: 'Planning', icon: 'fa-temperature-arrow-up', title: 'Inflation Impact', summary: 'See how today’s cost can change over time.', fields: [['amount', 'Current amount', 100000], ['rate', 'Inflation rate (% p.a.)', 6], ['years', 'Years ahead', 10]] },
  { id: 'cagr', category: 'Returns', icon: 'fa-arrow-up-right-dots', title: 'CAGR', summary: 'Calculate the annualised return between two values.', fields: [['start', 'Beginning value', 100000], ['end', 'Ending value', 180000], ['years', 'Holding period (years)', 5]] },
  { id: 'fd', category: 'Savings', icon: 'fa-building-columns', title: 'Fixed Deposit', summary: 'Estimate your FD maturity value.', fields: [['principal', 'Deposit amount', 250000], ['rate', 'Interest rate (% p.a.)', 7], ['years', 'Deposit term (years)', 3]] },
  { id: 'rd', category: 'Savings', icon: 'fa-piggy-bank', title: 'Recurring Deposit', summary: 'Project deposits made each month.', fields: [['monthly', 'Monthly deposit', 5000], ['rate', 'Interest rate (% p.a.)', 6.5], ['years', 'Deposit term (years)', 5]] },
  { id: 'ppf', category: 'Savings', icon: 'fa-shield-halved', title: 'PPF Maturity', summary: 'Plan a long-term PPF contribution.', fields: [['annual', 'Annual contribution', 150000], ['rate', 'Interest rate (% p.a.)', 7.1], ['years', 'Investment period (years)', 15]] },
  { id: 'nps', category: 'Retirement', icon: 'fa-person-cane', title: 'NPS Corpus', summary: 'Project a retirement corpus from monthly contributions.', fields: [['monthly', 'Monthly contribution', 6000], ['rate', 'Expected return (% p.a.)', 10], ['years', 'Investment period (years)', 25]] },
  { id: 'swp', category: 'Retirement', icon: 'fa-wallet', title: 'SWP Sustainability', summary: 'Estimate how long a withdrawal plan may last.', fields: [['principal', 'Starting corpus', 2000000], ['withdrawal', 'Monthly withdrawal', 15000], ['rate', 'Expected return (% p.a.)', 8]] },
];

const number = (values, key) => Math.max(0, Number(values[key]) || 0);
const inr = (value) => `INR ${Math.round(value).toLocaleString('en-IN')}`;
const percent = (value) => `${Number(value || 0).toFixed(2)}%`;

function calculate(id, values) {
  const rate = number(values, 'rate') / 100;
  const years = number(values, 'years');
  const monthlyRate = rate / 12;
  const months = years * 12;
  const compound = (principal, periods = 1) => principal * Math.pow(1 + rate / periods, periods * years);
  if (id === 'sip' || id === 'nps') {
    const monthly = number(values, 'monthly');
    const final = monthlyRate ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate) : monthly * months;
    return { label: id === 'nps' ? 'Projected NPS corpus' : 'Estimated maturity value', value: final, secondary: 'Total invested', secondaryValue: monthly * months, details: [['Wealth gained', inr(final - monthly * months)], ['Monthly contribution', inr(monthly)], ['Investment period', `${years} years`]] };
  }
  if (id === 'lumpsum' || id === 'compound' || id === 'fd') {
    const principal = number(values, 'principal');
    const final = id === 'fd' ? compound(principal, 4) : compound(principal);
    return { label: 'Estimated maturity value', value: final, secondary: 'Interest / growth earned', secondaryValue: final - principal, details: [['Initial investment', inr(principal)], ['Rate used', percent(rate * 100)], ['Investment period', `${years} years`]] };
  }
  if (id === 'simple') {
    const principal = number(values, 'principal'); const interest = principal * rate * years;
    return { label: 'Maturity value', value: principal + interest, secondary: 'Simple interest', secondaryValue: interest, details: [['Principal', inr(principal)], ['Rate used', percent(rate * 100)], ['Period', `${years} years`]] };
  }
  if (id === 'goalSip') {
    const goal = number(values, 'goal'); const monthly = monthlyRate ? goal * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) : goal / Math.max(months, 1);
    return { label: 'Required monthly SIP', value: monthly, secondary: 'Target amount', secondaryValue: goal, details: [['Expected return', percent(rate * 100)], ['Time to goal', `${years} years`], ['Total projected investment', inr(monthly * months)]] };
  }
  if (id === 'retirement') {
    const expense = number(values, 'expense'); const inflation = number(values, 'inflation') / 100; const futureExpense = expense * Math.pow(1 + inflation, years); const corpus = futureExpense * 12 * 25;
    return { label: 'Illustrative retirement corpus', value: corpus, secondary: 'Monthly expense at retirement', secondaryValue: futureExpense, details: [['Current monthly expense', inr(expense)], ['Inflation used', percent(inflation * 100)], ['Years to retirement', `${years} years`]] };
  }
  if (id === 'emi') {
    const principal = number(values, 'principal'); const emi = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : principal / Math.max(months, 1);
    return { label: 'Monthly EMI', value: emi, secondary: 'Total interest payable', secondaryValue: emi * months - principal, details: [['Loan amount', inr(principal)], ['Total payment', inr(emi * months)], ['Loan tenure', `${years} years`]] };
  }
  if (id === 'eligibility') {
    const income = number(values, 'income'); const obligations = number(values, 'obligations'); const capacity = Math.max(0, income * .5 - obligations); const factor = monthlyRate ? (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months)) : months; const eligible = capacity * factor;
    return { label: 'Indicative loan eligibility', value: eligible, secondary: 'Affordable monthly EMI', secondaryValue: capacity, details: [['Net monthly income', inr(income)], ['Current EMIs', inr(obligations)], ['Assumed tenure', `${years} years`]] };
  }
  if (id === 'inflation') {
    const amount = number(values, 'amount'); const final = amount * Math.pow(1 + rate, years);
    return { label: 'Future equivalent cost', value: final, secondary: 'Increase in cost', secondaryValue: final - amount, details: [['Current cost', inr(amount)], ['Inflation used', percent(rate * 100)], ['Time horizon', `${years} years`]] };
  }
  if (id === 'cagr') {
    const start = number(values, 'start'); const end = number(values, 'end'); const cagr = start && years ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0;
    return { label: 'Compound annual growth rate', value: cagr, valueType: 'percent', secondary: 'Absolute gain', secondaryValue: end - start, details: [['Beginning value', inr(start)], ['Ending value', inr(end)], ['Holding period', `${years} years`]] };
  }
  if (id === 'rd') {
    const monthly = number(values, 'monthly'); const final = monthlyRate ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : monthly * months;
    return { label: 'Estimated RD maturity value', value: final, secondary: 'Total deposited', secondaryValue: monthly * months, details: [['Interest earned', inr(final - monthly * months)], ['Deposit period', `${years} years`], ['Interest rate', percent(rate * 100)]] };
  }
  if (id === 'ppf') {
    const annual = number(values, 'annual'); const final = annual * ((Math.pow(1 + rate, years) - 1) / Math.max(rate, .000001)) * (1 + rate);
    return { label: 'Estimated PPF maturity value', value: final, secondary: 'Total contributed', secondaryValue: annual * years, details: [['Interest earned', inr(final - annual * years)], ['Annual contribution', inr(annual)], ['Investment period', `${years} years`]] };
  }
  const principal = number(values, 'principal'); const withdrawal = number(values, 'withdrawal');
  const sustainableMonths = monthlyRate && withdrawal > principal * monthlyRate ? Math.log(withdrawal / (withdrawal - principal * monthlyRate)) / Math.log(1 + monthlyRate) : withdrawal ? principal / withdrawal : 0;
  return { label: 'Estimated withdrawal duration', value: sustainableMonths / 12, valueType: 'years', secondary: 'Monthly withdrawal', secondaryValue: withdrawal, details: [['Starting corpus', inr(principal)], ['Expected return', percent(rate * 100)], ['Illustrative duration', `${(sustainableMonths / 12).toFixed(1)} years`]] };
}

const defaultValues = (calculator) => Object.fromEntries(calculator.fields.map(([key, , initial]) => [key, initial]));

export default function CalculatorsPage() {
  const [activeId, setActiveId] = useState('sip');
  const [values, setValues] = useState(defaultValues(calculators[0]));
  const [bundle, setBundle] = useState([]);
  const active = calculators.find((calculator) => calculator.id === activeId);
  const result = useMemo(() => calculate(active.id, values), [active, values]);

  function chooseCalculator(calculator) {
    setActiveId(calculator.id);
    setValues(defaultValues(calculator));
    document.getElementById('calculator-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addToBundle() {
    setBundle((items) => [...items, { id: `${active.id}-${Date.now()}`, title: active.title, date: new Date().toLocaleDateString('en-IN'), result, inputs: active.fields.map(([key, label]) => [label, values[key]]) }]);
  }

  async function downloadReport() {
    if (!bundle.length) return;
    let logo = null;
    try {
      const response = await fetch('/assets/smisha-logo.png');
      const blob = await response.blob();
      logo = await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(blob); });
    } catch { logo = null; }
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 58;
    const addHeader = (first) => {
      if (!first) doc.addPage();
      doc.setFillColor(18, 73, 63); doc.rect(0, 0, 595, 92, 'F');
      if (logo) doc.addImage(logo, 'PNG', 40, 22, 48, 48);
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.text('SMISHA SHARE MARKET', 101, 47);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('Personal Calculation Bundle', 101, 64);
      doc.setTextColor(18, 73, 63); doc.setFontSize(10); doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 415, 112); y = 139;
    };
    addHeader(true);
    bundle.forEach((item, index) => {
      const needed = 128 + item.inputs.length * 15 + item.result.details.length * 15;
      if (y + needed > 760) addHeader(false);
      doc.setFillColor(246, 248, 239); doc.roundedRect(40, y, 515, needed - 14, 10, 10, 'F');
      doc.setTextColor(111, 157, 53); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(`${String(index + 1).padStart(2, '0')}  ${item.date.toUpperCase()}`, 58, y + 23);
      doc.setTextColor(20, 63, 55); doc.setFontSize(17); doc.text(item.title, 58, y + 47);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text(item.result.label, 58, y + 68);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text(item.result.valueType === 'percent' ? percent(item.result.value) : item.result.valueType === 'years' ? `${item.result.value.toFixed(1)} years` : inr(item.result.value), 58, y + 91);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); let detailY = y + 112;
      [...item.inputs, ...item.result.details].forEach(([label, value]) => { doc.setTextColor(77, 109, 101); doc.text(`${label}: ${value}`, 58, detailY); detailY += 15; });
      y += needed;
    });
    doc.setTextColor(77, 109, 101); doc.setFontSize(8); doc.text('For educational illustration only. These estimates do not represent assured returns or financial advice.', 40, 810);
    doc.save(`smisha-calculation-bundle-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  const displayValue = result.valueType === 'percent' ? percent(result.value) : result.valueType === 'years' ? `${result.value.toFixed(1)} years` : inr(result.value);

  return <main className="course-shell calculators-shell">
    <SiteHeader active="Calculators" demoHref="#contact" />
    <section className="course-hero calculators-hero" aria-labelledby="calculators-title"><div className="course-hero-ring ring-one" /><div className="course-hero-ring ring-two" /><div className="course-hero-grid" /><div className="course-hero-content"><p className="course-kicker"><i className="fa-solid fa-calculator" /> Plan with clarity</p><h1 id="calculators-title"><span>Every smart decision</span><br /><strong>starts with the numbers.</strong></h1><p className="course-hero-copy">Practical calculators for your savings, investments, returns, loans and long-term goals. Build a personal bundle as you go.</p><a className="course-primary-button" href="#calculator-directory">Explore calculators <i className="fa-solid fa-arrow-down" /></a></div><aside className="calculators-hero-proof"><div className="proof-top"><span>YOUR TOOLKIT</span><i className="fa-solid fa-chart-pie" /></div><strong>15</strong><p>financial tools for more considered next steps</p><div className="proof-pills"><span>Plan</span><span>Compare</span><span>Bundle</span></div></aside></section>
    <section className="calculator-directory" id="calculator-directory" aria-labelledby="calculator-directory-title"><div className="calculator-section-heading"><div><p className="section-label">FINANCIAL TOOLKIT</p><h2 id="calculator-directory-title">Choose a number<br /><strong>worth understanding.</strong></h2></div><p>Start with one calculator, then save every useful result to your personal bundle.</p></div><div className="calculator-directory-grid">{calculators.map((calculator, index) => <button className={`calculator-picker ${activeId === calculator.id ? 'is-active' : ''}`} type="button" key={calculator.id} onClick={() => chooseCalculator(calculator)}><span>0{index + 1}</span><i className={`fa-solid ${calculator.icon}`} aria-hidden="true" /><b>{calculator.title}</b><small>{calculator.category}</small></button>)}</div></section>
    <section className="calculator-workspace" id="calculator-workspace" aria-labelledby="active-calculator-title"><div className="calculator-workspace-top"><div><p className="section-label">{active.category} CALCULATOR</p><h2 id="active-calculator-title">{active.title}</h2><p>{active.summary}</p></div><span className="calculator-badge"><i className="fa-solid fa-indian-rupee-sign" /> INR</span></div><div className="calculator-workspace-grid"><form className="calculator-inputs" onSubmit={(event) => { event.preventDefault(); addToBundle(); }}><div className="calculator-input-heading"><span>YOUR DETAILS</span><small>Adjust any value to recalculate instantly.</small></div>{active.fields.map(([key, label]) => <label key={key}>{label}<span className="calculator-input-wrap"><i className={`fa-solid ${label.includes('%') ? 'fa-percent' : label.includes('year') || label.includes('period') || label.includes('tenure') ? 'fa-calendar-days' : 'fa-indian-rupee-sign'}`} aria-hidden="true" /><input type="number" inputMode="decimal" min="0" step="any" value={values[key] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></span></label>)}<button className="course-primary-button calculator-add" type="submit"><i className="fa-solid fa-folder-plus" /> Add this calculation to bundle</button></form><div className="calculator-result"><div className="calculator-result-kicker"><span>YOUR ESTIMATE</span><i className={`fa-solid ${active.icon}`} /></div><p>{result.label}</p><strong>{displayValue}</strong><div className="calculator-secondary"><span>{result.secondary}</span><b>{inr(result.secondaryValue)}</b></div><dl>{result.details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="calculator-disclaimer"><i className="fa-solid fa-circle-info" /> For educational illustration only. Market-linked returns are not assured.</p></div></div></section>
    <section className="calculator-bundle" aria-labelledby="bundle-title"><div className="calculator-bundle-heading"><div><p className="section-label">YOUR PERSONAL BUNDLE</p><h2 id="bundle-title">Keep the calculations<br /><strong>that matter to you.</strong></h2></div><button className="calculator-download" type="button" disabled={!bundle.length} onClick={downloadReport}><i className="fa-solid fa-file-arrow-down" /> Download report <span>{bundle.length}</span></button></div>{bundle.length ? <div className="bundle-list">{bundle.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.date}</small><h3>{item.title}</h3><p>{item.result.label}</p></div><strong>{item.result.valueType === 'percent' ? percent(item.result.value) : item.result.valueType === 'years' ? `${item.result.value.toFixed(1)} years` : inr(item.result.value)}</strong><button type="button" aria-label={`Remove ${item.title} from bundle`} onClick={() => setBundle((items) => items.filter((entry) => entry.id !== item.id))}><i className="fa-solid fa-xmark" /></button></article>)}</div> : <div className="bundle-empty"><i className="fa-solid fa-layer-group" /><div><h3>Your bundle starts here.</h3><p>Finish a calculation, then add it here to create a branded PDF report with your results.</p></div></div>}</section>
    <SiteCTA label="READY TO BUILD YOUR MARKET KNOWLEDGE?"><span>Pair every calculation with</span><br /><strong>clearer financial learning.</strong></SiteCTA><SiteFAQ /><SiteFooter />
  </main>;
}
