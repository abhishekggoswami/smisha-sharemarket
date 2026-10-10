from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                Image, PageBreak, KeepTogether)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'course-materials'
OUT.mkdir(parents=True, exist_ok=True)
LOGO = ROOT / 'public' / 'assets' / 'smisha-logo.png'
MENTOR = ROOT / 'public' / 'assets' / 'sushil-kamboj-instructor.jpg'

COURSES = [
    ('smart-investing-fundamentals', 'Smart Investing Fundamentals', "Beginner's Guide to Stock Market", 'Beginner', '15 modules', 'Build a strong investing foundation - from how markets work and opening a Demat account to portfolio building, risk and live market practice.', ['How Indian stock markets work', 'Demat accounts, instruments and orders', 'Fundamental and technical basics', 'Risk management and portfolio construction'], ['Build a calm, repeatable investing process', 'Read market information with context', 'Create a practical first portfolio']),
    ('mutual-fund-wealth-builder', 'Mutual Fund Wealth Builder', 'Mutual Fund Blueprint', 'Beginner to intermediate', '10-15 hours', 'Learn how mutual funds work, compare fund categories, analyse performance, manage risk, optimise taxes, and build a long-term wealth creation strategy.', ['Fund categories and investment objectives', 'NAV, returns and performance analysis', 'SIP, STP, SWP and taxation', 'Portfolio construction and live fund analysis'], ['Choose funds against real financial goals', 'Compare risk and returns with clarity', 'Build a disciplined long-term plan']),
    ('technical-analysis-blueprint', 'Technical Analysis Blueprint', 'Smart Chart Analysis', 'Beginner to advanced', '20-25 hours', 'Master technical analysis: read market trends, identify high-probability opportunities, and make data-driven decisions using charts, indicators, price action and professional trading strategies.', ['Chart structure, price action and trends', 'Support, resistance and chart patterns', 'Indicators, volume and volatility', 'Risk, trade planning and live market analysis'], ['Read charts with a repeatable process', 'Plan entries and exits with context', 'Manage trading risk with discipline']),
    ('professional-options-trading', 'Professional Options Trading', 'Options Trading Accelerator', 'Beginner to advanced', '25-30 hours', 'Understand options contracts through advanced multi-leg strategies, Greeks, volatility analysis and risk management, so you can trade with discipline and confidence.', ['Option contracts, pricing and Greeks', 'Option chain and volatility analysis', 'Buying, selling and multi-leg strategies', 'Position sizing, hedging and adjustment'], ['Understand strategy payoff and risk', 'Read option-chain context', 'Build a measured trading framework']),
    ('value-investing-blueprint', 'Value Investing Blueprint', 'Smart Investing Through Fundamentals', 'Beginner to advanced', '20-25 hours', 'Learn how professional investors evaluate businesses, analyse financial statements, assess performance, determine intrinsic value and build a long-term portfolio using fundamental analysis.', ['Business and industry analysis', 'Financial statements and ratio analysis', 'Valuation and margin of safety', 'Portfolio construction and live company analysis'], ['Evaluate a business beyond the headline', 'Use financial data with confidence', 'Build a long-term investment thesis']),
    ('professional-equity-research-analyst-program', 'Professional Equity Research Analyst Program', 'Equity Research and Investment Analysis Certification', 'Intermediate to advanced', '40-50 hours', 'A career-focused program for aspiring equity research professionals covering research, valuation, report writing, compliance, ethics and the SEBI Research Analyst registration process.', ['Research process and industry analysis', 'Financial modelling and valuation', 'Research report writing and disclosures', 'Ethics, compliance and analyst practice'], ['Develop analyst-ready research skills', 'Build structured valuation models', 'Communicate an investment thesis professionally']),
    ('nism-xv-research-analyst-exam-prep', 'NISM XV Research Analyst Exam Prep', 'Research Analyst Certification Prep (NISM XV)', 'Intermediate', '35-45 hours', 'Prepare for the NISM-Series-XV Research Analyst Certification Examination with full-syllabus coverage, practical case studies, financial analysis, valuation, regulations and exam-focused practice.', ['Securities markets and analyst role', 'Financial statements and valuation', 'Regulations, ethics and disclosures', 'Mock tests, case studies and exam strategy'], ['Organise the full NISM XV syllabus', 'Practise applying concepts to cases', 'Prepare with a focused revision plan']),
]

NAVY = colors.HexColor('#0C2D73')
BLUE = colors.HexColor('#2874FF')
CYAN = colors.HexColor('#4BC8FF')
PALE = colors.HexColor('#EDF6FF')
INK = colors.HexColor('#10275B')
MUTED = colors.HexColor('#52719A')

def styles():
    base = getSampleStyleSheet()
    return {
        'kicker': ParagraphStyle('kicker', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=CYAN, spaceAfter=7, tracking=1.2),
        'cover_title': ParagraphStyle('cover_title', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=31, leading=34, textColor=colors.white, spaceAfter=13),
        'cover_copy': ParagraphStyle('cover_copy', parent=base['Normal'], fontName='Helvetica', fontSize=11.5, leading=17, textColor=colors.HexColor('#E6F4FF')),
        'section': ParagraphStyle('section', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=19, leading=23, textColor=INK, spaceAfter=12),
        'body': ParagraphStyle('body', parent=base['Normal'], fontName='Helvetica', fontSize=10.5, leading=15, textColor=MUTED),
        'small': ParagraphStyle('small', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=BLUE, tracking=.8),
        'insight': ParagraphStyle('insight', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=INK),
        'benefit': ParagraphStyle('benefit', parent=base['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=INK),
        'footer': ParagraphStyle('footer', parent=base['Normal'], fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#6C89AE')),
    }

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#D5E8FA'))
    canvas.line(20 * mm, 17 * mm, 190 * mm, 17 * mm)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#6C89AE'))
    canvas.drawString(20 * mm, 11 * mm, 'SMISHA SHARE MARKET  |  COURSE GUIDE')
    canvas.drawRightString(190 * mm, 11 * mm, f'{doc.page}')
    canvas.restoreState()

def cover_background(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor('#165ED0'))
    canvas.circle(width * .93, height * .82, 120 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.Color(1, 1, 1, alpha=.07))
    canvas.circle(width * .87, height * .8, 92 * mm, stroke=0, fill=1)
    canvas.restoreState()

def card(text, number, st):
    return [Paragraph(f'{number:02d}', st['small']), Paragraph(text, st['insight'])]

def build_guide(course):
    slug, title, subtitle, level, duration, description, insights, benefits = course
    st = styles()
    output = OUT / f'{slug}-course-guide.pdf'
    doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=20*mm, leftMargin=20*mm, topMargin=20*mm, bottomMargin=24*mm)
    story = []

    if LOGO.exists():
        logo = Image(str(LOGO), width=36*mm, height=36*mm)
        story.append(logo)
        story.append(Spacer(1, 8*mm))
    story.append(Paragraph('SMISHA ACADEMY  |  COURSE GUIDE', st['kicker']))
    story.append(Paragraph(title, st['cover_title']))
    story.append(Paragraph(subtitle.upper(), ParagraphStyle('cover_sub', parent=st['cover_copy'], fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=CYAN, spaceAfter=10)))
    story.append(Paragraph(description, st['cover_copy']))
    story.append(Spacer(1, 9*mm))
    facts = [[Paragraph('<b>750+</b><br/>learners in Pune', st['cover_copy']), Paragraph('<b>5 STAR</b><br/>learning experience', st['cover_copy']), Paragraph(f'<b>{duration}</b><br/>{level}', st['cover_copy'])]]
    fact_table = Table(facts, colWidths=[52*mm, 52*mm, 52*mm])
    fact_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), colors.Color(1,1,1,alpha=.10)), ('BOX', (0,0), (-1,-1), .5, colors.Color(1,1,1,alpha=.28)), ('INNERGRID', (0,0), (-1,-1), .5, colors.Color(1,1,1,alpha=.22)), ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 8), ('TOPPADDING', (0,0), (-1,-1), 11), ('BOTTOMPADDING', (0,0), (-1,-1), 11)]))
    story.append(fact_table)
    story.append(Spacer(1, 10*mm))
    if MENTOR.exists():
        mentor = Image(str(MENTOR), width=58*mm, height=58*mm)
        mentor.hAlign = 'RIGHT'
        story.append(mentor)
    story.append(PageBreak())

    story.append(Paragraph('WHAT THIS COURSE BUILDS', st['section']))
    story.append(Paragraph('The course is designed as a practical path: learn the concept, see its market context, then apply a disciplined decision process.', st['body']))
    story.append(Spacer(1, 7*mm))
    insight_rows = []
    for index, insight in enumerate(insights, 1):
        insight_rows.append(card(insight, index, st))
    insight_table = Table(insight_rows, colWidths=[17*mm, 153*mm], rowHeights=[19*mm]*len(insight_rows))
    insight_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), PALE), ('BOX', (0,0), (-1,-1), .6, colors.HexColor('#D5E8FA')), ('INNERGRID', (0,0), (-1,-1), .6, colors.HexColor('#D5E8FA')), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 9), ('RIGHTPADDING', (0,0), (-1,-1), 9), ('TOPPADDING', (0,0), (-1,-1), 8), ('BOTTOMPADDING', (0,0), (-1,-1), 8)]))
    story.append(insight_table)
    story.append(Spacer(1, 11*mm))
    story.append(Paragraph('HOW YOU LEARN', st['section']))
    learning = [['01', 'Structured concepts', 'Build the language and framework before making decisions.'], ['02', 'Guided examples', 'Connect every idea to a market situation and a clear next step.'], ['03', 'Practical application', 'Use the framework to form calmer, repeatable decisions.']]
    learn_rows = [[Paragraph(f'<b>{no}</b>', st['small']), Paragraph(f'<b>{head}</b><br/>{copy}', st['benefit'])] for no, head, copy in learning]
    learn_table = Table(learn_rows, colWidths=[16*mm, 154*mm])
    learn_table.setStyle(TableStyle([('LINEBELOW', (0,0), (-1,-1), .5, colors.HexColor('#D5E8FA')), ('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 6), ('TOPPADDING', (0,0), (-1,-1), 8), ('BOTTOMPADDING', (0,0), (-1,-1), 9)]))
    story.append(learn_table)
    story.append(Spacer(1, 10*mm))
    story.append(Paragraph('BENEFITS OF LEARNING THIS PATH', st['section']))
    benefit_rows = [[Paragraph(f'<font color="#2874FF">+</font> {benefit}', st['benefit'])] for benefit in benefits]
    benefit_table = Table(benefit_rows, colWidths=[170*mm])
    benefit_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F5FAFF')), ('BOX', (0,0), (-1,-1), .6, colors.HexColor('#D5E8FA')), ('INNERGRID', (0,0), (-1,-1), .6, colors.HexColor('#D5E8FA')), ('LEFTPADDING', (0,0), (-1,-1), 13), ('RIGHTPADDING', (0,0), (-1,-1), 13), ('TOPPADDING', (0,0), (-1,-1), 13), ('BOTTOMPADDING', (0,0), (-1,-1), 13)]))
    story.append(benefit_table)
    doc.build(story, onFirstPage=cover_background, onLaterPages=footer)

for course in COURSES:
    build_guide(course)
print(f'Generated {len(COURSES)} course guides in {OUT}')
