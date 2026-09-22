import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {projectFilms} from '../src/project-films.mjs';
test('Only AI projects get workflow films, and all project introductions say Summary',()=>{
 for(const [id,f]of Object.entries(projectFilms)){const page=fs.readFileSync(`dist/work/${id}/index.html`,'utf8');assert.ok(page.includes(`data-project-film="${f.kind}"`));assert.ok(page.includes('<h2>Summary</h2>'));assert.ok(!page.includes('<h2>The project</h2>'))}
 for(const id of ['alation-cms','stock-research','ecommerce'])assert.ok(!fs.readFileSync(`dist/work/${id}/index.html`,'utf8').includes('data-project-film='));
 assert.equal(Object.keys(projectFilms).length,8);
});
function harness(f,reduced=false){
 class El{constructor(){this.events={};this.value='0';this.textContent='';this.attrs={};this.dataset={}}addEventListener(n,fn){(this.events[n]??=[]).push(fn)}emit(n){for(const fn of this.events[n]||[])fn({target:this})}setAttribute(n,v){this.attrs[n]=v}getBoundingClientRect(){return{width:320,height:370}}}
 const elements=new Map(),get=s=>{if(!elements.has(s))elements.set(s,new El());return elements.get(s)};
 const root=new El(),chapters=f.chapters.map(()=>new El()),doc=new El(),win=new El();root.dataset.projectFilm=f.kind;root.querySelector=get;root.querySelectorAll=()=>chapters;doc.querySelector=()=>root;doc.hidden=false;
 get('[data-project-film-content]').textContent=JSON.stringify(f);
 get('[data-project-film-canvas]').getContext=()=>new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]??(()=>{})});
 let observer,id=0;const frames=new Map(),motion=new El();motion.matches=reduced;
 vm.runInNewContext(fs.readFileSync('src/project-films.js','utf8'),{document:doc,window:win,Image:class{complete=true;naturalWidth=960;naturalHeight=540},matchMedia:()=>motion,ResizeObserver:class{constructor(fn){this.fn=fn}observe(){this.fn()}},IntersectionObserver:class{constructor(fn){observer=fn}observe(){}},requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:key=>frames.delete(key)});
 let now=0;return{get,chapters,doc,motion,frames,visible:v=>observer([{isIntersecting:v}]),tick(){const [i,fn]=frames.entries().next().value||[];assert.ok(fn);frames.delete(i);now+=100;fn(now)}};
}
test('All project renderers support every chapter as a reduced-motion static view',()=>{
 for(const f of Object.values(projectFilms)){const h=harness(f,true);h.visible(true);h.chapters.forEach((b,i)=>{b.emit('click');assert.equal(h.get('[data-project-film-title]').textContent,f.chapters[i].title);assert.equal(h.frames.size,0)});h.get('[data-project-film-play]').emit('click');assert.equal(h.frames.size,0)}
});
test('Shared workflow playback pauses on seek, suspends offscreen and finishes without looping',()=>{
 const h=harness(projectFilms['financial-analyst']);h.visible(true);assert.equal(h.frames.size,0);h.get('[data-project-film-play]').emit('click');h.tick();h.tick();assert.equal(h.get('[data-project-film-seek]').value,'100');h.visible(false);assert.equal(h.frames.size,0);h.visible(true);assert.equal(h.frames.size,1);
 h.get('[data-project-film-seek]').value='39900';h.get('[data-project-film-seek]').emit('input');assert.equal(h.frames.size,0);h.get('[data-project-film-play]').emit('click');h.tick();h.tick();assert.equal(h.frames.size,0);assert.equal(h.get('[data-project-film-seek]').value,'40000');
 h.get('[data-project-film-replay]').emit('click');assert.equal(h.get('[data-project-film-seek]').value,'0');h.doc.hidden=true;h.doc.emit('visibilitychange');assert.equal(h.frames.size,0);
 h.motion.matches=true;h.motion.emit('change');assert.equal(h.frames.size,0);
});
