import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';
const root=process.cwd();
const font=opentype.parse(await readFile(process.env.SMISHA_SEGOE_PRINT_FONT_PATH ?? 'C:/Windows/Fonts/segoeprb.ttf'));
const titles={"smisha-complete-market-mastery":"Market\nMastery","wd-gann-advance-masterclass":"W.D. Gann\nMasterclass","global-forex-program":"Global Forex\nProgram"};
// Normalized center-line strokes, with separate pen lifts for crossbars and dots.
const strokes={
C:['M .9 .12 C .2 -.1 .02 .3 .13 .7 C .24 1.12 .68 1.06 .94 .85'],
D:['M .16 .97 L .21 .03','M .21 .03 C 1.05 -.07 1.1 .94 .16 .97'],
G:['M .9 .14 C .2 -.1 .01 .36 .15 .75 C .28 1.1 .9 1.05 .92 .52 L .57 .53'],
'.':['M .5 .5 L .5 .55'],
k:['M .19 0 L .13 .98','M .87 .28 L .17 .66 L .86 .99'],
w:['M .08 .07 L .24 .97 L .51 .43 L .72 .97 L .95 .06'],
a:['M .86 .3 C .55 -.1 .04 .18 .12 .66 C .2 1.08 .72 1.02 .85 .55 L .88 .2 L .88 .95'],
b:['M .22 0 L .16 .95','M .18 .52 C .6 .15 1.06 .42 .82 .8 C .66 1.05 .28 1.04 .17 .9'],
c:['M .88 .18 C .45 -.1 .02 .26 .12 .67 C .2 1.04 .64 1.08 .9 .86'],
d:['M .77 .4 C .48 .2 .02 .47 .13 .79 C .25 1.05 .7 1.05 .81 .65','M .91 0 L .78 .95'],
e:['M .12 .53 C .5 .54 .98 .3 .76 .1 C .45 -.13 .02 .24 .13 .68 C .25 1.05 .66 1.02 .94 .85'],
f:['M .78 .08 C .39 -.15 .29 .24 .3 .55 L .21 1','M .03 .49 L .8 .4'],
g:['M .78 .22 C .5 -.08 .02 .13 .12 .46 C .2 .75 .63 .72 .79 .41','M .81 .1 L .74 .83 C .7 1.1 .3 1.05 .14 .87'],
h:['M .22 0 L .12 .99','M .17 .67 C .45 .25 .82 .3 .81 .67 L .78 1'],
i:['M .45 .35 L .4 1','M .52 .03 L .52 .06'],
l:['M .58 .02 L .32 .86 C .3 1 .55 1 .74 .91'],
m:['M .08 .98 L .12 .1','M .1 .47 C .24 -.05 .49 .02 .47 .45 L .46 .96','M .48 .46 C .65 -.04 .88 .07 .88 .48 L .88 .98'],
n:['M .14 .98 L .18 .13','M .18 .43 C .48 -.05 .86 .06 .83 .51 L .82 .98'],
o:['M .68 .08 C .24 -.07 .02 .35 .15 .75 C .3 1.12 .79 1.02 .87 .63 C .96 .28 .79 .02 .55 .06'],
p:['M .19 .05 L .13 1','M .19 .22 C .54 -.13 1.03 .15 .79 .46 C .65 .66 .32 .63 .17 .51'],
q:['M .78 .16 C .47 -.08 .02 .17 .13 .48 C .25 .74 .62 .71 .78 .44','M .85 .04 L .7 1'],
r:['M .16 1 L .19 .13','M .19 .42 C .4 .02 .69 .03 .9 .29'],
s:['M .86 .16 C .6 -.1 .08 .05 .17 .34 C .28 .61 .92 .44 .83 .78 C .75 1.05 .29 1.07 .1 .88'],
t:['M .54 .03 L .46 .87 C .46 1.06 .7 .99 .86 .87','M .07 .39 L .92 .32'],
u:['M .2 .07 L .14 .64 C .1 1.09 .66 1.06 .81 .66','M .88 .03 L .82 .96'],
v:['M .08 .04 L .4 .97 L .92 .02'],
x:['M .13 .06 L .84 .98','M .89 .02 L .1 .97'],
y:['M .08 .04 C .1 .68 .4 .77 .76 .36','M .88 .02 L .64 .82 C .5 1.11 .19 1.02 .13 .85'],
A:['M .04 .98 L .61 .02 L .94 .99','M .24 .62 L .8 .6'],
B:['M .17 .98 L .24 .03','M .23 .05 C .98 -.09 .94 .43 .24 .47 C 1.12 .36 1.03 1.08 .17 .98'],
E:['M .93 .04 L .24 .06 L .16 .98 L .91 .93','M .2 .51 L .81 .48'],
F:['M .2 1 L .25 .06 L .94 .03','M .22 .49 L .81 .44'],
I:['M .53 .02 L .43 .98'],
M:['M .06 .98 L .18 .02 L .52 .65 L .87 .02 L .93 .98'],
N:['M .1 .99 L .22 .02 L .82 .98 L .93 .02'],
O:['M .65 .04 C .2 -.12 .02 .35 .15 .75 C .3 1.13 .86 1.03 .92 .58 C .98 .22 .77 -.03 .56 .04'],
P:['M .18 .99 L .24 .03','M .24 .05 C 1.07 -.12 1.03 .57 .22 .48'],
R:['M .18 .99 L .24 .03','M .24 .05 C 1.07 -.12 1.03 .55 .24 .48 L .9 .98'],
S:['M .87 .13 C .51 -.12 .04 .1 .17 .37 C .3 .59 .93 .49 .85 .78 C .78 1.1 .27 1.06 .1 .86'],
T:['M .03 .09 L .97 .02','M .56 .06 L .42 .99'],
V:['M .07 .03 L .38 .98 L .95 .02'],
W:['M .06 .03 L .21 .98 L .54 .35 L .72 .98 L .97 .02'],
X:['M .12 .04 L .86 .97','M .93 .03 L .08 .97']
};
function mapped(template,b){
 const nums=template.match(/-?\d*\.?\d+/g).map(Number);let k=0;
 return template.replace(/-?\d*\.?\d+/g,()=>{const n=nums[k]; const v=k++%2===0?b.x1+n*(b.x2-b.x1):b.y1+n*(b.y2-b.y1);return v.toFixed(2)});
}
async function create(text){
 const lines=text.split('\n');const lineHeight=1200;const all=new opentype.Path();const guides=[];
 let maxWidth=0;
 const layouts=lines.map((line,i)=>{const p=font.getPath(line,0,1100+i*lineHeight,1000,{kerning:true,letterSpacing:-.055});return {line,p,b:p.getBoundingBox()};});
 maxWidth=Math.max(...layouts.map(l=>l.b.x2-l.b.x1));
 for(const {line,p,b} of layouts){
 const offset=(maxWidth-(b.x2-b.x1))/2-b.x1;
 // Generate glyphs through the same kerning and tracking layout as the full title.
 font.forEachGlyph(line,offset,1100+layouts.findIndex(l=>l.p===p)*lineHeight,1000,{kerning:true,letterSpacing:-.055},(glyph,x,y,size)=>{
 if(!glyph.unicode || String.fromCodePoint(glyph.unicode)===' ')return;
 const letter=String.fromCodePoint(glyph.unicode);const gp=glyph.getPath(x,y,size);const box=gp.getBoundingBox(); all.commands.push(...gp.commands);
 if(!strokes[letter])throw Error('Missing guide: '+letter);
 for(const template of strokes[letter])guides.push({d:mapped(template,box),width:190,glyphPath:gp.toPathData(2),letter});
 });
 }
 const bounds=all.getBoundingBox(); const viewBox={x:Math.floor(bounds.x1-70),y:Math.floor(bounds.y1-70),width:Math.ceil(bounds.x2-bounds.x1+140),height:Math.ceil(bounds.y2-bounds.y1+140)};
 // Verify full stroke coverage per glyph, avoiding any end-of-animation jump.
 const svg=(body)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+[viewBox.x,viewBox.y,viewBox.width,viewBox.height].join(' ')+'" width="1200" height="'+Math.ceil(1200*viewBox.height/viewBox.width)+'">'+body+'</svg>';
 const outlinePath=all.toPathData(2);const original=await sharp(Buffer.from(svg('<path fill="white" d="'+outlinePath+'"/>'))).ensureAlpha().raw().toBuffer();
 let coverage=0;
 for(let attempt=0;attempt<8;attempt++){
 const defs=guides.map((g,i)=>'<clipPath id="g'+i+'"><path d="'+g.glyphPath+'"/></clipPath>').join('');
 const mask=guides.map((g,i)=>'<path clip-path="url(#g'+i+')" d="'+g.d+'" fill="none" stroke="white" stroke-width="'+g.width+'" stroke-linecap="round" stroke-linejoin="round"/>').join('');
 const pixels=await sharp(Buffer.from(svg('<defs>'+defs+'</defs>'+mask))).ensureAlpha().raw().toBuffer();
 let total=0,covered=0;for(let i=3;i<original.length;i+=4)if(original[i]>32){total++;if(pixels[i]>32)covered++;}
 coverage=covered/total;if(coverage>.998)break;guides.forEach(g=>g.width+=35);
 }
 if(coverage<.998)throw Error('Incomplete ink '+text+' '+coverage);
 console.log(text.replaceAll('\n',' / '),guides.length,'strokes; coverage',coverage.toFixed(5));
 return {text,viewBox,outlinePath,trajectories:guides,coverage};
}
const definitions={};for(const [slug,title] of Object.entries(titles))definitions[slug]=await create(title);
await writeFile(path.join(root,'lib/generated/courseBoardTitleOutlines.js'),'// Generated glyph-clipped handwriting guides.\nexport const courseBoardTitleOutlines = '+JSON.stringify(definitions,null,2)+';\n');
