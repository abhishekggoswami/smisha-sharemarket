import json, os, re, html
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
notes=json.load(open(os.path.join(root,'lib','library-notes.json'),encoding='utf-8'))
output=os.path.join(root,'public','resources','guides')
os.makedirs(output,exist_ok=True)
font_dir='/usr/share/fonts/truetype/dejavu'
regular=os.path.join(font_dir,'DejaVuSans.ttf')
bold=os.path.join(font_dir,'DejaVuSans-Bold.ttf')
if not os.path.exists(regular):
    regular='C:/Windows/Fonts/segoeui.ttf'
    bold='C:/Windows/Fonts/segoeuib.ttf'
pdfmetrics.registerFont(TTFont('LibrarySans',regular))
pdfmetrics.registerFont(TTFont('LibraryBold',bold))
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='GuideTitle',fontName='LibraryBold',fontSize=27,leading=33,textColor=HexColor('#0c2d73'),spaceAfter=18))
styles.add(ParagraphStyle(name='GuideHeading',fontName='LibraryBold',fontSize=14,leading=19,textColor=HexColor('#0c2d73'),spaceBefore=14,spaceAfter=10,keepWithNext=True))
styles.add(ParagraphStyle(name='GuideBody',fontName='LibrarySans',fontSize=9.5,leading=15,textColor=HexColor('#344a62'),spaceAfter=9))
styles.add(ParagraphStyle(name='GuideMeta',fontName='LibraryBold',fontSize=8,leading=13,textColor=HexColor('#408da1'),spaceAfter=12))
styles.add(ParagraphStyle(name='GuideExercise',fontName='LibrarySans',fontSize=9.5,leading=15,textColor=HexColor('#215575'),backColor=HexColor('#edf7fc'),borderPadding=10,spaceBefore=9,spaceAfter=12))
def safe(s):return html.escape(s.replace('—',' - ').replace('–','-'))
def footer(c,d):
    w,h=A4;c.setStrokeColor(HexColor('#dce7f3'));c.line(46,45,w-46,45)
    c.setFont('LibrarySans',7);c.setFillColor(HexColor('#75879a'));c.drawString(46,30,'SMISHA KNOWLEDGE LIBRARY  |  Educational material');c.drawRightString(w-46,30,str(d.page))
for n in notes:
    out=os.path.join(output,n['slug']+'.pdf')
    doc=SimpleDocTemplate(out,pagesize=A4,rightMargin=48,leftMargin=48,topMargin=46,bottomMargin=62,title=n['title'],author='Smisha Learning Library')
    story=[Paragraph('SMISHA / DIGITAL KNOWLEDGE LIBRARY',styles['GuideMeta']),Paragraph(safe(n['title']),styles['GuideTitle']),Paragraph(safe(n['description']),styles['GuideBody']),Paragraph(safe(n['type'].upper()+'  |  '+n['level'].upper()),styles['GuideMeta']),HRFlowable(width='100%',color=HexColor('#dce7f3')),Spacer(1,12)]
    for i,s in enumerate(n['sections']):
        story.append(Paragraph(str(i+1).zfill(2)+' / '+safe(s['title']),styles['GuideHeading']))
        story.extend(Paragraph(safe(p),styles['GuideBody']) for p in s.get('paragraphs',[]))
        story.extend(Paragraph('&#8226; '+safe(b),styles['GuideBody']) for b in s.get('bullets',[]))
        if s.get('exercise'):story.append(Paragraph('<b>MAKE IT PRACTICAL</b><br/>'+safe(s['exercise']),styles['GuideExercise']))
    story += [KeepTogether([Paragraph('Sources and further reading',styles['GuideHeading']),Paragraph('Original educational guide. Examples are hypothetical; this is not personalised investment advice or a promise of returns. Free download for personal study.',styles['GuideBody']),Paragraph('SEBI Investor: https://investor.sebi.gov.in/<br/>SEBI due diligence: https://investor.sebi.gov.in/due_diligence.html<br/>Zerodha Varsity modules: https://zerodha.com/varsity/modules/<br/>External references for further learning; their material is not reproduced here.',styles['GuideBody'])])]
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(n['slug'],os.path.getsize(out),'bytes')
