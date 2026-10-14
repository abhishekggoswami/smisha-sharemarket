from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'course-materials'
LOGO = ROOT / 'public' / 'assets' / 'smisha-academy-logo-transparent.png'
import json
catalog = json.loads((ROOT / "lib" / "course-catalog.json").read_text(encoding="utf-8"))
COURSES = [(c["slug"], c["title"], c["subtitle"], c["level"], c["duration"], c["description"], c["highlights"], c["outcomes"]) for c in catalog]
COURSE_MODULES = {c["slug"]: [m["title"] for m in c["modules"]] for c in catalog}

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
    if LOGO.exists(): pdf.drawImage(ImageReader(str(LOGO)), 52, H-109, 142, 74, mask='auto')
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
