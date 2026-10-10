from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'course-materials'
LOGO = ROOT / 'public' / 'assets' / 'smisha-logo.png'
COURSES = [
 ('smart-investing-fundamentals','Smart Investing Fundamentals',"Beginner's Guide to Stock Market",'Beginner','15 modules','Build a strong investing foundation - from how markets work and opening a Demat account to portfolio building, risk and live market practice.',['How Indian stock markets work','Demat accounts, instruments and orders','Fundamental and technical basics','Risk management and portfolio construction'],['Build a calm, repeatable investing process','Read market information with context','Create a practical first portfolio']),
 ('mutual-fund-wealth-builder','Mutual Fund Wealth Builder','Mutual Fund Blueprint','Beginner to intermediate','10-15 hours','Learn how mutual funds work, compare fund categories, analyse performance, manage risk, optimise taxes, and build a long-term wealth creation strategy.',['Fund categories and investment objectives','NAV, returns and performance analysis','SIP, STP, SWP and taxation','Portfolio construction and live fund analysis'],['Choose funds against real financial goals','Compare risk and returns with clarity','Build a disciplined long-term plan']),
 ('technical-analysis-blueprint','Technical Analysis Blueprint','Smart Chart Analysis','Beginner to advanced','20-25 hours','Master technical analysis: read market trends, identify high-probability opportunities, and make data-driven decisions using charts, indicators, price action and professional trading strategies.',['Chart structure, price action and trends','Support, resistance and chart patterns','Indicators, volume and volatility','Risk, trade planning and live market analysis'],['Read charts with a repeatable process','Plan entries and exits with context','Manage trading risk with discipline']),
 ('professional-options-trading','Professional Options Trading','Options Trading Accelerator','Beginner to advanced','25-30 hours','Understand options contracts through advanced multi-leg strategies, Greeks, volatility analysis and risk management, so you can trade with discipline and confidence.',['Option contracts, pricing and Greeks','Option chain and volatility analysis','Buying, selling and multi-leg strategies','Position sizing, hedging and adjustment'],['Understand strategy payoff and risk','Read option-chain context','Build a measured trading framework']),
 ('value-investing-blueprint','Value Investing Blueprint','Smart Investing Through Fundamentals','Beginner to advanced','20-25 hours','Learn how professional investors evaluate businesses, analyse financial statements, assess performance, determine intrinsic value and build a long-term portfolio using fundamental analysis.',['Business and industry analysis','Financial statements and ratio analysis','Valuation and margin of safety','Portfolio construction and live company analysis'],['Evaluate a business beyond the headline','Use financial data with confidence','Build a long-term investment thesis']),
 ('professional-equity-research-analyst-program','Professional Equity Research Analyst Program','Equity Research and Investment Analysis Certification','Intermediate to advanced','40-50 hours','A career-focused program for aspiring equity research professionals covering research, valuation, report writing, compliance, ethics and the SEBI Research Analyst registration process.',['Research process and industry analysis','Financial modelling and valuation','Research report writing and disclosures','Ethics, compliance and analyst practice'],['Develop analyst-ready research skills','Build structured valuation models','Communicate an investment thesis professionally']),
 ('nism-xv-research-analyst-exam-prep','NISM XV Research Analyst Exam Prep','Research Analyst Certification Prep (NISM XV)','Intermediate','35-45 hours','Prepare for the NISM-Series-XV Research Analyst Certification Examination with full-syllabus coverage, practical case studies, financial analysis, valuation, regulations and exam-focused practice.',['Securities markets and analyst role','Financial statements and valuation','Regulations, ethics and disclosures','Mock tests, case studies and exam strategy'],['Organise the full NISM XV syllabus','Practise applying concepts to cases','Prepare with a focused revision plan']),
]

# Module names mirror the curriculum published on the individual course pages.
COURSE_MODULES = {
 'smart-investing-fundamentals': ['Introduction to the Stock Market', 'How the Stock Market Works', 'Stock Market Participants', 'Demat & Trading Account', 'Financial Instruments', 'Understanding Stocks & Prices', 'Fundamental & Technical Basics', 'Order Types', 'Risk Management', 'Long-Term Investing', 'Beginner Mistakes', 'Live Market Demonstration', 'Build Your First Portfolio'],
 'mutual-fund-wealth-builder': ['Introduction to Mutual Funds', 'Industry Participants', 'Types of Mutual Funds', 'Fund Documents', 'NAV & Returns', 'Risk & Performance Analysis', 'Choosing the Right Fund', 'SIP, STP & SWP', 'Taxation', 'Investment Process', 'Portfolio Construction', 'Mistakes to Avoid', 'Live Fund Analysis', 'Advanced Strategies'],
 'technical-analysis-blueprint': ['Introduction to Technical Analysis', 'Understanding Price Charts', 'Candlestick Analysis', 'Trend Analysis', 'Support & Resistance', 'Trendlines & Chart Patterns', 'Volume Analysis', 'Moving Averages', 'Momentum Indicators', 'Volatility Indicators', 'Fibonacci Analysis', 'Price Action Trading', 'Trading Strategies', 'Risk & Trade Management', 'Multi-Timeframe Analysis', 'Live Market Analysis'],
 'professional-options-trading': ['Options Market Basics', 'Option Chain & Pricing', 'Option Greeks', 'Buying Options', 'Option Selling', 'Single-Leg Strategies', 'Multi-Leg Strategies', 'Volatility-Based Trading', 'Options Risk Management', 'Trading Psychology', 'Technical Analysis for Options', 'Live Options Workflow', 'Advanced Options Strategies'],
 'value-investing-blueprint': ['Introduction to Fundamental Analysis', 'Businesses & Industries', 'Financial Statements', 'Income Statement Analysis', 'Balance Sheet Analysis', 'Cash Flow Analysis', 'Financial Ratios', 'Valuation Techniques', 'Qualitative Analysis', 'Annual Report Analysis', 'Economic & Industry Analysis', 'Stock Screening', 'Portfolio Construction', 'Live Company Analysis'],
 'professional-equity-research-analyst-program': ['Introduction to Equity Research', 'Financial Markets', 'Business & Industry Analysis', 'Financial Statement Analysis', 'Ratio Analysis', 'Company Valuation', 'Financial Modeling', 'Research Report Writing', 'Technical Analysis', 'Economic & Macro Analysis', 'SEBI RA Regulations', 'Registration Process', 'Ethics & Standards', 'Research Tools', 'Practical Equity Research'],
 'nism-xv-research-analyst-exam-prep': ['Research Analyst Profession', 'Securities Market', 'Financial Statement Analysis', 'Ratio Analysis', 'Company & Industry Analysis', 'Equity Valuation', 'Investment Decision Making', 'Economics & Macro Analysis', 'Technical Analysis', 'Research Report Writing', 'Legal & Regulatory Framework', 'Excel for Analysts', 'Mock Tests & Case Studies'],
}

NAVY, BLUE, BLUE_LINE, CYAN, SKY, WHITE = HexColor('#0C2D73'), HexColor('#16499F'), HexColor('#2D6DCC'), HexColor('#4BC8FF'), HexColor('#BDEBFF'), white
W, H = A4

def rounded(pdf, x, y, width, height, fill, radius=12, stroke=None):
    pdf.setFillColor(fill); pdf.setStrokeColor(stroke or fill)
    pdf.roundRect(x, y, width, height, radius, fill=1, stroke=bool(stroke))

def wrap(pdf, x, y, copy, size, color, font, max_width, leading):
    pdf.setFillColor(color); pdf.setFont(font, size); line = ''
    for word in copy.split():
        candidate = f'{line} {word}'.strip()
        if stringWidth(candidate, font, size) <= max_width: line = candidate
        else: pdf.drawString(x, y, line); y -= leading; line = word
    if line: pdf.drawString(x, y, line); y -= leading
    return y

def chrome(pdf, page):
    pdf.setFillColor(NAVY); pdf.rect(0, 0, W, H, fill=1, stroke=0)
    pdf.setFillColor(HexColor('#103A93')); pdf.circle(W + 30, H - 45, 205, fill=1, stroke=0)
    pdf.setFillColor(HexColor('#1553B7')); pdf.circle(W + 44, H - 45, 145, fill=1, stroke=0)
    pdf.setStrokeColor(HexColor('#2B70D9')); pdf.setLineWidth(.7)
    for offset in range(8): pdf.line(355, 82 + offset * 42, W - 45, 82 + offset * 42)
    for offset in range(7): pdf.line(355 + offset * 30, 82, 355 + offset * 30, 376)
    pdf.setStrokeColor(HexColor('#78D9FF')); pdf.setLineWidth(2.5)
    pdf.line(370, 113, 408, 154); pdf.line(408,154,447,139); pdf.line(447,139,483,207); pdf.line(483,207,530,264)
    pdf.setFillColor(CYAN); pdf.circle(408,154,3,fill=1,stroke=0); pdf.circle(483,207,3,fill=1,stroke=0)
    pdf.setStrokeColor(HexColor('#275CAE')); pdf.setLineWidth(.8); pdf.line(52,45,W-52,45)
    pdf.setFillColor(SKY); pdf.setFont('Helvetica-Bold',8); pdf.drawString(52,27,'SMISHA SHARE MARKET  |  COURSE GUIDE'); pdf.drawRightString(W-52,27,str(page))

def guide(course):
    slug, title, subtitle, level, duration, description, pillars, benefits = course
    modules = COURSE_MODULES[slug]
    target = OUT / f'{slug}-course-guide.pdf'; pdf = canvas.Canvas(str(target), pagesize=A4)
    pdf.setTitle(f'{title} - Course Guide'); pdf.setAuthor('Smisha Share Market')
    chrome(pdf, 1)
    if LOGO.exists(): pdf.drawImage(ImageReader(str(LOGO)), 52, H-100, 52, 52, mask='auto')
    pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',9); pdf.drawString(116,H-68,'SMISHA ACADEMY')
    pdf.setFillColor(SKY); pdf.setFont('Helvetica',9); pdf.drawString(116,H-83,'PRACTICAL MARKET EDUCATION')
    rounded(pdf,52,H-188,184,25,BLUE,12); pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',8); pdf.drawCentredString(144,H-178,'COURSE GUIDE  |  FOUNDATIONS')
    wrap(pdf,52,H-250,title,31,WHITE,'Helvetica-Bold',440,37)
    pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',10); pdf.drawString(54,H-325,subtitle.upper())
    wrap(pdf,54,H-365,description,12,HexColor('#EAF6FF'),'Helvetica',450,18)
    for index,(top,bottom) in enumerate([(duration,'course duration'),(level.title(),'learning level'),(str(len(pillars)),'core learning pillars')]):
        x=52+index*164; rounded(pdf,x,225,154,76,BLUE,12)
        if len(top) > 14:
            wrap(pdf,x+16,270,top,12,CYAN,'Helvetica-Bold',120,14)
            label_y = 239
        else:
            pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',18); pdf.drawString(x+16,268,top)
            label_y = 249
        pdf.setFillColor(SKY); pdf.setFont('Helvetica',9); pdf.drawString(x+16,label_y,bottom)
    rounded(pdf,52,94,W-104,84,BLUE,16,BLUE_LINE); pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',13); pdf.drawString(74,145,'A practical guide to learning market concepts with clarity.'); pdf.setFillColor(SKY); pdf.setFont('Helvetica',10); pdf.drawString(74,123,'Learn the framework. Build context. Make more disciplined decisions.'); pdf.setFillColor(CYAN); pdf.circle(W-88,136,22,fill=1,stroke=0); pdf.setFillColor(NAVY); pdf.setFont('Helvetica-Bold',19); pdf.drawCentredString(W-88,129,'+')
    pdf.showPage(); chrome(pdf,2)
    pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',8); pdf.drawString(52,H-78,'THE LEARNING BLUEPRINT')
    pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',24); pdf.drawString(52,H-112,'What this course builds')
    wrap(pdf,52,H-140,'The course is designed as a practical path: learn the concept, see its market context, then apply a disciplined decision process.',10.5,SKY,'Helvetica',470,15)
    for index,pillar in enumerate(pillars):
        x=52+(index%2)*250; y=H-238-(index//2)*112; rounded(pdf,x,y,232,92,BLUE,12,BLUE_LINE); pdf.setFillColor(CYAN); pdf.circle(x+25,y+64,13,fill=1,stroke=0); pdf.setFillColor(NAVY); pdf.setFont('Helvetica-Bold',8); pdf.drawCentredString(x+25,y+61,f'{index+1:02d}'); ending=wrap(pdf,x+47,y+66,pillar,9.4,WHITE,'Helvetica-Bold',167,11); wrap(pdf,x+47,ending-1,'Build practical understanding through structured explanations and market context.',8.15,SKY,'Helvetica',167,10)
    pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',22); pdf.drawString(52,398,'How you learn')
    for index,(number,heading,copy) in enumerate([('01','Structured concepts','Build the language and framework before making decisions.'),('02','Guided examples','Connect every idea to a market situation and a clear next step.'),('03','Practical application','Use the framework to form calmer, repeatable decisions.')]):
        y=354-index*59; pdf.setStrokeColor(HexColor('#2B66C4')); pdf.line(52,y-16,W-52,y-16); pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',9); pdf.drawString(54,y,number); pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',11); pdf.drawString(105,y,heading); pdf.setFillColor(SKY); pdf.setFont('Helvetica',9.5); pdf.drawString(105,y-17,copy)
    pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',22); pdf.drawString(52,190,'Benefits of learning this path')
    for index,benefit in enumerate(benefits):
        y=151-index*31; rounded(pdf,52,y,491,24,BLUE,8,BLUE_LINE); pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',12); pdf.drawString(65,y+7,'+'); pdf.setFillColor(WHITE); pdf.setFont('Helvetica',9.5); pdf.drawString(82,y+7,benefit)
    pdf.showPage(); chrome(pdf,3)
    pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',8); pdf.drawString(52,H-78,'CURRICULUM AT A GLANCE')
    pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',24); pdf.drawString(52,H-112,'Your complete learning map')
    wrap(pdf,52,H-140,f'{len(modules)} focused modules take you from the first concept to practical application. Use this map to see the sequence before you begin.',10.5,SKY,'Helvetica',470,15)
    for index,module in enumerate(modules):
        column = index // 8; row = index % 8; x = 52 + column * 250; y = 615 - row * 60
        rounded(pdf,x,y,232,51,BLUE,10,BLUE_LINE)
        pdf.setFillColor(CYAN); pdf.circle(x+23,y+26,12,fill=1,stroke=0)
        pdf.setFillColor(NAVY); pdf.setFont('Helvetica-Bold',7.5); pdf.drawCentredString(x+23,y+23,f'{index + 1:02d}')
        wrap(pdf,x+43,y+31,module,8.6,WHITE,'Helvetica-Bold',172,10)
    pdf.setFillColor(SKY); pdf.setFont('Helvetica',8.3); pdf.drawString(52,79,'Each module is designed to build on the previous one, so the learning path stays clear and practical.')
    pdf.showPage(); chrome(pdf,4)
    pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',8); pdf.drawString(52,H-78,'PUT THE CURRICULUM INTO PRACTICE')
    pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',24); pdf.drawString(52,H-112,'How the course comes together')
    wrap(pdf,52,H-140,'Move through the modules in sequence, connect ideas to market examples, and return to this guide whenever you need a clear next step.',10.5,SKY,'Helvetica',470,15)
    phase_titles = ['Build the base', 'Read the context', 'Develop the process', 'Apply with clarity']
    chunk_size = (len(modules) + 3) // 4
    for index in range(4):
        group = modules[index * chunk_size:(index + 1) * chunk_size]
        x = 52 + (index % 2) * 250; y = 563 - (index // 2) * 122
        rounded(pdf,x,y,232,103,BLUE,12,BLUE_LINE)
        pdf.setFillColor(CYAN); pdf.setFont('Helvetica-Bold',8); pdf.drawString(x+16,y+80,f'PHASE {index + 1:02d}')
        pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',11); pdf.drawString(x+16,y+61,phase_titles[index])
        wrap(pdf,x+16,y+42,' / '.join(group),8.1,SKY,'Helvetica',198,10)
    pdf.setFillColor(WHITE); pdf.setFont('Helvetica-Bold',19); pdf.drawString(52,303,'A practical way to use this guide')
    rounded(pdf,52,132,W-104,140,BLUE,14,BLUE_LINE)
    learning_steps = [
        f'Start with {modules[0]} to establish your first reference point.',
        f'Use {modules[len(modules)//2]} to connect concepts with a market decision.',
        f'Finish with {modules[-1]} and review how the full framework works together.',
    ]
    for index,step in enumerate(learning_steps):
        y = 236 - index * 35
        pdf.setFillColor(CYAN); pdf.circle(76,y-2,10,fill=1,stroke=0)
        pdf.setFillColor(NAVY); pdf.setFont('Helvetica-Bold',7.5); pdf.drawCentredString(76,y-5,str(index + 1))
        wrap(pdf,96,y,step,9.2,WHITE,'Helvetica',415,11)
    pdf.save()

OUT.mkdir(parents=True, exist_ok=True)
for course in COURSES: guide(course)
print(f'Generated {len(COURSES)} course guides in {OUT}')
