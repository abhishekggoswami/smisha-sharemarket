const path=require('path'),os=require('os'),fs=require('fs'),assert=require('assert');
const {chromium}=require(path.join(os.tmpdir(),'codex-browser-validation','node_modules','playwright'));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const out=path.join(os.tmpdir(),'codex-about-gallery-review');fs.mkdirSync(out,{recursive:true});
 try{
  for(const width of [320,375,430,640]){
   const page=await browser.newPage({viewport:{width,height:850},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
   await page.goto('http://localhost:3011/about',{waitUntil:'domcontentloaded'});
   const gallery=page.locator('.about-workshop-mobile-gallery');await gallery.scrollIntoViewIfNeeded();
   assert(await gallery.isVisible());assert(!(await page.locator('.about-workshop-slideshow').isVisible()));
   const photo=gallery.locator('.about-workshop-mobile-feature img'), buttons=gallery.locator('.about-workshop-mobile-preview');
   assert.strictEqual(await buttons.count(),7);
   const bounds=await photo.boundingBox();assert(bounds.width>=width-60 && bounds.height>140,`photo too small at ${width}px`);
   assert.strictEqual(await photo.evaluate(el=>getComputedStyle(el).objectFit),'contain');
   for(let i=0;i<7;i++){
    const button=buttons.nth(i), expected=await button.locator('img').getAttribute('src');
    await button.click();assert.strictEqual(await photo.getAttribute('src'),expected);
    assert.strictEqual(await button.getAttribute('aria-pressed'),'true');
    await photo.evaluate(el=>el.decode());assert(await photo.evaluate(el=>el.naturalWidth>0));
   }
   await buttons.nth(0).click();
   await gallery.screenshot({path:path.join(out,`${width}.png`)});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow);
   console.log(`${width}px: full-size photo and seven working previews`);await page.close();
  }
  const page=await browser.newPage({viewport:{width:375,height:850},isMobile:true,hasTouch:true});
  await page.goto('http://localhost:3011/about',{waitUntil:'domcontentloaded'});
  const gallery=page.locator('.about-workshop-mobile-gallery');await gallery.scrollIntoViewIfNeeded();
  const buttons=gallery.locator('button'),photo=gallery.locator('.about-workshop-mobile-feature img');await buttons.nth(6).click();
  const selected=await photo.getAttribute('src');await page.waitForTimeout(3500);assert.strictEqual(await photo.getAttribute('src'),selected);
  await page.waitForTimeout(2000);assert.notStrictEqual(await photo.getAttribute('src'),selected);
  await page.waitForTimeout(700);assert((await gallery.locator('.about-workshop-mobile-previews').evaluate(el=>el.scrollLeft)) < 5);
  console.log('Phone autoplay allows time to view a selection and keeps the active preview visible');await page.close();
  for(const width of [768,1440]){
   const desktop=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await desktop.goto('http://localhost:3011/about',{waitUntil:'domcontentloaded'});
   const slideshow=desktop.locator('.about-workshop-slideshow');await slideshow.scrollIntoViewIfNeeded();assert(await slideshow.isVisible());assert(!(await desktop.locator('.about-workshop-mobile-gallery').isVisible()));
   await slideshow.locator('button').nth(4).click();assert.strictEqual(await slideshow.locator('button').nth(4).getAttribute('aria-pressed'),'true');
   console.log(`${width}px: existing accordion visible and selectable`);await desktop.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
