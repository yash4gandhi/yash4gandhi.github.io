import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Run the production controller with a drawing sink and controlled browser time.
function setup(reduced=false){
 class Element {
  constructor(){this.events={};this.attrs={};this.value='0';this.hidden=false;this.textContent=''}
  addEventListener(name,fn){(this.events[name]??=[]).push(fn)}
  emit(name,event={}){for(const fn of this.events[name]||[])fn({target:this,...event})}
  dispatchEvent(e){this.emit(e.type)}
  setAttribute(name,value){this.attrs[name]=value}
  getBoundingClientRect(){return{width:900,height:370}}
 }
 const elements=new Map();const get=s=>{if(!elements.has(s))elements.set(s,new Element());return elements.get(s)};
 const chapters=Array.from({length:7},()=>new Element()),root=new Element(),doc=new Element(),win=new Element();
 root.querySelector=get;root.querySelectorAll=()=>chapters;
 doc.querySelector=s=>s==='[data-peptide-film]'?root:get(s);doc.hidden=false;
 get('[data-peptide-records]').textContent=fs.readFileSync('src/peptides.json','utf8');get('[data-film-request]').value='both';
 const context=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(t,key)=>t[key]??(()=>{})});
 get('[data-film-canvas]').getContext=()=>context;
 const motion=new Element();motion.matches=reduced;let observer,id=0;const frames=new Map();
 vm.runInNewContext(fs.readFileSync('src/peptide-film.js','utf8'),{document:doc,window:win,matchMedia:()=>motion,Event:class{constructor(type){this.type=type}},ResizeObserver:class{constructor(fn){this.fn=fn}observe(){this.fn()}},IntersectionObserver:class{constructor(fn){observer=fn}observe(){}},requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:key=>frames.delete(key)});
 let now=0;const tick=()=>{const [key,fn]=frames.entries().next().value||[];assert.ok(fn,'Expected an animation frame');frames.delete(key);now+=100;fn(now)};
 return{get,chapters,doc,win,motion,frames,tick,visible:v=>observer([{isIntersecting:v}])};
}
test('Film requires play, advances, pauses for manual seek and suspends offscreen/hidden',()=>{
 const h=setup();h.visible(true);assert.equal(h.frames.size,0);
 h.get('[data-film-play]').emit('click');h.tick();h.tick();assert.equal(h.get('[data-film-seek]').value,'100');
 h.visible(false);assert.equal(h.frames.size,0);h.visible(true);assert.equal(h.frames.size,1);
 h.doc.hidden=true;h.doc.emit('visibilitychange');assert.equal(h.frames.size,0);h.doc.hidden=false;h.doc.emit('visibilitychange');assert.equal(h.frames.size,1);
 h.get('[data-film-seek]').value='30000';h.get('[data-film-seek]').emit('input');assert.equal(h.frames.size,0);assert.match(h.get('[data-film-title]').textContent,/fresh noise/);
 h.get('[data-film-play]').emit('click');h.win.emit('pagehide');assert.equal(h.frames.size,0);
});
test('Reduced-motion film presents static completed chapters and never schedules animation',()=>{
 const h=setup(true);h.visible(true);h.get('[data-film-play]').emit('click');assert.equal(h.frames.size,0);assert.match(h.get('[data-film-title]').textContent,/Add noise/);
 h.chapters[5].emit('click');assert.equal(h.frames.size,0);assert.equal(h.get('[data-film-result]').hidden,false);assert.match(h.get('[data-film-result]').textContent,/-15\.1 kcal\/mol/);
 h.get('[data-film-replay]').emit('click');assert.equal(h.frames.size,0);assert.match(h.get('[data-film-title]').textContent,/library/);
});
test('Film stops at the end, replays and shows the selected saved prediction',()=>{
 const h=setup();h.visible(true);h.get('[data-film-seek]').value='55900';h.get('[data-film-seek]').emit('input');h.get('[data-film-play]').emit('click');h.tick();h.tick();assert.equal(h.frames.size,0);assert.equal(h.get('[data-film-seek]').value,'56000');
 h.get('[data-film-replay]').emit('click');assert.equal(h.get('[data-film-seek]').value,'0');assert.equal(h.frames.size,1);
 h.get('[data-film-seek]').value='47000';h.get('[data-film-seek]').emit('input');h.get('[data-peptide-select]').value='1';h.get('[data-peptide-select]').emit('change');assert.match(h.get('[data-film-result]').textContent,/DDIM-HTSK2.*-16\.0 kcal\/mol.*-15\.4 kcal\/mol/);
 h.chapters[6].emit('click');h.get('[data-film-request]').value='predict';h.get('[data-film-request]').emit('change');assert.match(h.get('[data-film-route-note]').textContent,/generation is skipped/);
 h.motion.matches=true;h.motion.emit('change');assert.equal(h.frames.size,0);
});
