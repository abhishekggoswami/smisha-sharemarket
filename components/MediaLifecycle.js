'use client';
import { useEffect } from 'react';
// Observe autoplay media once; batch rescans so third-party widgets and animation
// DOM mutations cannot trigger repeated full-document queries in the same frame.
export default function MediaLifecycle(){
 useEffect(()=>{
  const videos=new Map();
  let scanFrame=0;
  const play=(video,visible)=>{
   if(!video.isConnected)return;
   if(visible&&!document.hidden){if(video.paused)video.play().catch(()=>{});}
   else if(!video.paused)video.pause();
  };
  const load=video=>{
   if(video.dataset.src){video.src=video.dataset.src;delete video.dataset.src;}
   video.querySelectorAll('source[data-src]').forEach(source=>{source.src=source.dataset.src;delete source.dataset.src;});
   if(video.dataset.deferredVideo==='true'){delete video.dataset.deferredVideo;video.load();}
  };
  const preload=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   if(isIntersecting){load(target);preload.unobserve(target);}
  }),{rootMargin:'350px'});
  const visibility=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   videos.set(target,isIntersecting);if(isIntersecting)load(target);play(target,isIntersecting);
  }),{rootMargin:'0px',threshold:0});
  const scan=()=>{
   scanFrame=0;
   document.querySelectorAll('video[autoplay]').forEach(video=>{
    if(videos.has(video))return;
    videos.set(video,false);preload.observe(video);visibility.observe(video);
   });
   videos.forEach((_,video)=>{
    if(video.isConnected)return;
    preload.unobserve(video);visibility.unobserve(video);videos.delete(video);
   });
  };
  const schedule=()=>{if(!scanFrame)scanFrame=requestAnimationFrame(scan)};
  const mutation=new MutationObserver(records=>{
   if(records.some(record=>[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===1&&(node.matches?.('video')||node.querySelector?.('video')))))schedule();
  });
  mutation.observe(document.body,{childList:true,subtree:true});
  const onVisibility=()=>videos.forEach((visible,video)=>play(video,visible));
  document.addEventListener('visibilitychange',onVisibility);
  scan();
  return()=>{mutation.disconnect();cancelAnimationFrame(scanFrame);preload.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',onVisibility);videos.clear();};
 },[]);
 return null;
}
