import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
// Exercise the real browser script against event/timer interfaces, without waiting
// seven seconds or changing the user's operating-system motion preference.
function harness(reduced=false){
 class Element{constructor(){this.events={};this.attrs={};this.dataset={};this.hidden=false;this.textContent=''}addEventListener(n,f){(this.events[n]??=[]).push(f)}emit(n,event={}){for(const f of this.events[n]||[])f(event)}setAttribute(n,v){this.attrs[n]=v}getAttribute(n){return this.attrs[n]}querySelector(s){return this.one?.[s]||null}querySelectorAll(s){return this.many?.[s]||[]}}
 const root=new Element(),doc=new Element(),win=new Element(),pause=new Element(),prev=new Element(),next=new Element(),status=new Element();const slides=Array.from({length:4},(_,i)=>{const e=new Element();e.hidden=i!==0;e.attrs['aria-label']=`${i+1} of 4`;return e});const selectors=slides.map(()=>new Element());
 root.one={'[data-pause]':pause,'[data-prev]':prev,'[data-next-slide]':next,'[data-carousel-status]':status};root.many={'[data-slide]':slides,'[data-slide-to]':selectors};doc.one={'[data-carousel]':root};doc.body={classList:{toggle(){}}};doc.hidden=false;
 const motion=new Element();motion.matches=reduced;let observer;let id=0;const timers=new Map();
 const context={document:doc,window:win,localStorage:{getItem:()=>null},matchMedia:()=>motion,IntersectionObserver:class{constructor(fn){observer=fn}observe(){}},setTimeout:(fn,delay)=>{assert.equal(delay,7000);timers.set(++id,fn);return id},clearTimeout:i=>timers.delete(i)};
 vm.runInNewContext(fs.readFileSync('src/app.js','utf8'),context);
 const visible=()=>observer([{isIntersecting:true}]);const tick=()=>{const [i,fn]=timers.entries().next().value||[];assert.ok(fn,'rotation should be scheduled');timers.delete(i);fn()};
 return{root,doc,win,pause,prev,next,status,slides,selectors,motion,timers,visible,tick,offscreen:()=>observer([{isIntersecting:false}])};
}
test('Automatic carousel rotates only in view and does not announce automatic changes',()=>{const h=harness();assert.equal(h.timers.size,0);h.visible();h.tick();assert.equal(h.slides[1].hidden,false);assert.equal(h.status.textContent,'');h.offscreen();assert.equal(h.timers.size,0);h.visible();h.doc.hidden=true;h.doc.emit('visibilitychange');assert.equal(h.timers.size,0);h.doc.hidden=false;h.doc.emit('visibilitychange');assert.equal(h.timers.size,1);h.win.emit('pagehide');assert.equal(h.timers.size,0)});
test('Reduced motion starts paused; manual navigation stays available',()=>{const h=harness(true);h.visible();assert.equal(h.timers.size,0);assert.equal(h.pause.textContent,'Play');h.next.emit('click');assert.equal(h.slides[1].hidden,false);assert.equal(h.status.textContent,'2 of 4');assert.equal(h.timers.size,0)});
test('Focus stops rotation, explicit play restarts it, hover suspends it',()=>{const h=harness();h.visible();h.root.emit('focusin');assert.equal(h.timers.size,0);h.pause.emit('click');assert.equal(h.timers.size,1);h.root.emit('mouseenter');assert.equal(h.timers.size,0);h.root.emit('mouseleave');assert.equal(h.timers.size,1);h.motion.matches=true;h.motion.emit('change');assert.equal(h.timers.size,0)});
test('Pointer pause survives focus event ordering; keyboard and swipe stop autoplay',()=>{const h=harness();h.visible();h.pause.emit('pointerdown');h.root.emit('focusin');h.pause.emit('click');assert.equal(h.pause.textContent,'Play');assert.equal(h.timers.size,0);h.root.emit('keydown',{key:'ArrowLeft',preventDefault(){}});assert.equal(h.slides[3].hidden,false);h.root.emit('touchstart',{touches:[{clientX:250}]});h.root.emit('touchend',{changedTouches:[{clientX:100}]});assert.equal(h.slides[0].hidden,false);assert.equal(h.timers.size,0);assert.equal(h.slides.filter(s=>!s.hidden).length,1)});
