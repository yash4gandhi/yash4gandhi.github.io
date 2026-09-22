import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const id='G-RHNLBZDB2H', key='portfolio-analytics-choice-v1';
function setup({origin='https://yash4gandhi.github.io',choice=null,gpc=false,storageBlocked=false,at=Date.now()}={}) {
  const listeners={},winListeners={},scripts=[],cookieWrites=[],saved=new Map();
  if(choice)saved.set(key,JSON.stringify({choice,at}));
  const cookies=new Map([['_ga','old-id'],['_ga_RHNLBZDB2H','old-session'],['unrelated','keep']]);
  let doc;
  class El {
    constructor(tag='div',attrs={},parent=null){this.tagName=tag.toUpperCase();this.attrs=attrs;this.parent=parent;this.children=[];this.events={};this.hidden=false;this.textContent='';this.dataset={};for(const [k,v] of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;parent?.children.push(this)}
    getAttribute(n){return this.attrs[n]??null}
    hasAttribute(n){return n in this.attrs}
    matches(s){if(s.startsWith('.'))return(this.attrs.class||'').split(' ').includes(s.slice(1));const m=s.match(/^(\w+)?(?:\[([^\]=]+)(?:="([^"]*)")?\])?$/);return Boolean(m&&(!m[1]||this.tagName===m[1].toUpperCase())&&(!m[2]||(this.hasAttribute(m[2])&&(m[3]===undefined||this.attrs[m[2]]===m[3]))))}
    closest(selector){for(let el=this;el;el=el.parent)for(const s of selector.split(',')){if(s==='[data-carousel] button'){if(el.tagName==='BUTTON'&&el.parent?.closest('[data-carousel]'))return el}else if(el.matches(s))return el}return null}
    querySelectorAll(s){return this.children.flatMap(c=>[...(c.matches(s)?[c]:[]),...c.querySelectorAll(s)])}
    querySelector(s){return this.querySelectorAll(s)[0]||null}
    addEventListener(n,f){(this.events[n]??=[]).push(f)}
    emit(n){for(const f of this.events[n]||[])f({target:this,preventDefault(){}})}
    focus(options){doc.activeElement=this;this.focusOptions=options}
  }
  const body=new El('body',{'data-analytics-page':'/work/financial-analyst/'});
  const settings=new El('button',{'data-analytics-settings':''},body);
  const panel=new El('section',{'data-analytics-panel':''},body);
  const status=new El('p',{'data-analytics-status':''},panel);
  const reject=new El('button',{'data-analytics-choice':'denied'},panel);
  const allow=new El('button',{'data-analytics-choice':'granted'},panel);
  const close=new El('button',{'data-analytics-close':''},panel);
  doc={body,title:'Financial Report Analyst',referrer:'https://example.com/profile?email=secret@example.com#private',head:{append(el){scripts.push(el)}},querySelector:s=>body.querySelector(s),querySelectorAll:s=>body.querySelectorAll(s),createElement:t=>new El(t),addEventListener(n,f){(listeners[n]??=[]).push(f)}};
  Object.defineProperty(doc,'cookie',{get:()=>[...cookies].map(([k,v])=>k+'='+v).join('; '),set:value=>{cookieWrites.push(value);if(value.includes('Max-Age=0'))cookies.delete(value.split('=')[0])}});
  const win={addEventListener(n,f){(winListeners[n]??=[]).push(f)}};
  const location=new URL(origin+'/work/financial-analyst/?email=secret@example.com#private');
  const storage={getItem:k=>{if(storageBlocked)throw Error('blocked');return saved.get(k)||null},setItem:(k,v)=>{if(storageBlocked)throw Error('blocked');saved.set(k,v)}};
  vm.runInNewContext(fs.readFileSync('src/analytics.js','utf8'),{document:doc,window:win,location,navigator:{globalPrivacyControl:gpc},localStorage:storage,URL});
  return {allow,reject,close,settings,panel,status,doc,win,scripts,saved,cookies,cookieWrites,El,body,
    commands:()=>Array.from(win.dataLayer||[],a=>Array.from(a)),
    events:()=>Array.from(win.dataLayer||[],a=>Array.from(a)).filter(a=>a[0]==='event'),
    emit(type,target){for(const f of listeners[type]||[])f({target})},
    storageChoice(value){saved.set(key,JSON.stringify({choice:value,at:Date.now()}));for(const f of winListeners.storage||[])f({key})}
  };
}

test('Analytics loads only after permission on the exact production origin',()=>{
  const h=setup();assert.equal(h.panel.hidden,false);assert.equal(h.scripts.length,0);assert.equal(h.events().length,0);
  h.reject.emit('click');assert.equal(h.scripts.length,0);assert.equal(h.win['ga-disable-'+id],true);
  h.settings.emit('click');assert.equal(h.doc.activeElement,h.reject);
  h.allow.emit('click');assert.equal(h.scripts.length,1);assert.equal(h.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id='+id);
  assert.equal(h.doc.activeElement,h.settings);assert.equal(h.events().filter(e=>e[1]==='page_view').length,1);
  const config=h.commands().find(c=>c[0]==='config')[2];assert.equal(config.send_page_view,false);assert.equal(config.page_location,'https://yash4gandhi.github.io/work/financial-analyst/');assert.equal(config.page_referrer,'https://example.com/');assert.equal(config.allow_google_signals,false);
  assert.equal(h.commands()[0][0],'consent');assert.equal(h.commands()[0][2].analytics_storage,'denied');
  h.allow.emit('click');assert.equal(h.scripts.length,1);assert.equal(h.events().length,1);
  for(const origin of ['http://127.0.0.1:4321','http://localhost:4322','https://example.com','http://yash4gandhi.github.io']){const local=setup({origin,choice:'granted'});local.allow.emit('click');assert.equal(local.scripts.length,0);assert.equal(local.events().length,0)}
});

test('Consent withdrawal and cross-tab choices stop tracking and clear only GA cookies',()=>{
  const h=setup({choice:'granted'});assert.equal(h.events().length,1);h.reject.emit('click');assert.equal(h.win['ga-disable-'+id],true);assert.equal(h.cookies.has('_ga'),false);assert.equal(h.cookies.get('unrelated'),'keep');
  h.emit('click',new h.El('a',{href:'mailto:someone@example.com'},h.body));assert.equal(h.events().length,1);
  h.storageChoice('granted');assert.equal(h.win['ga-disable-'+id],false);assert.equal(h.events().length,1);
  h.storageChoice('denied');assert.equal(h.win['ga-disable-'+id],true);
  const expired=setup({choice:'granted',at:0});assert.equal(expired.scripts.length,0);assert.equal(expired.panel.hidden,false);
  const privacy=setup({choice:'granted',gpc:true});privacy.allow.emit('click');assert.equal(privacy.scripts.length,0);
});

test('Custom events measure intended controls without transmitting contact values or free text',()=>{
  const h=setup();const email=new h.El('a',{href:'mailto:secret@example.com?subject=private'},h.body);
  h.emit('click',email);assert.equal(h.events().length,0);h.allow.emit('click');
  h.emit('click',email);
  h.emit('click',new h.El('a',{href:'/downloads/Resume_Yash_Gandhi.pdf',download:''},h.body));
  h.emit('click',new h.El('a',{href:'/work/peptide-design/'},h.body));
  h.emit('click',new h.El('a',{href:'https://www.linkedin.com/in/example?token=private'},h.body));
  const question=new h.El('select',{'data-agent-question':''},h.body);question.selectedIndex=2;question.value='private question text';h.emit('change',question);
  const range=new h.El('input',{'data-film-seek':''},h.body);range.type='range';range.min='0';range.max='56000';range.value='28000';h.emit('input',range);h.emit('change',range);
  const unrelated=new h.El('input',{},h.body);unrelated.value='secret@example.com';h.emit('change',unrelated);
  h.emit('click',new h.El('button',{'data-project-film-play':''},h.body));
  const events=h.events();assert.equal(events.length,8);
  assert.equal(events.find(e=>e[1]==='contact_click')[2].contact_method,'email');
  assert.equal(events.find(e=>e[1]==='resume_click')[2].link_kind,'download');
  assert.equal(events.find(e=>e[1]==='project_open')[2].project_id,'peptide-design');
  assert.equal(events.find(e=>e[1]==='external_link')[2].destination_domain,'linkedin.com');
  assert.equal(events.find(e=>e[2].control==='agent_question')[2].selection,'2');
  assert.equal(events.find(e=>e[2].control==='animation_seek')[2].selection,'50');
  assert.doesNotMatch(JSON.stringify(h.commands()),/secret@example|private|token=/);
});

test('Blocked storage and a failed Google script do not break preferences or the website',()=>{
  const h=setup({storageBlocked:true});h.allow.emit('click');assert.equal(h.scripts.length,1);h.scripts[0].emit('error');assert.equal(h.win['ga-disable-'+id],true);assert.match(h.status.textContent,/could not load/);
  const count=h.events().length;h.emit('click',new h.El('a',{href:'/work/peptide-design/'},h.body));assert.equal(h.events().length,count);
  h.settings.emit('click');h.close.emit('click');assert.equal(h.panel.hidden,true);assert.equal(h.doc.activeElement,h.settings);
});

test('Every built page exposes preferences and privacy without an eager Google tag',()=>{
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);
  for(const file of walk('dist').filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');assert.ok(html.includes('src="/analytics.js"'));assert.ok(html.includes('data-analytics-page='));assert.ok(html.includes('href="/privacy/"'));assert.ok(html.includes('data-analytics-panel hidden'));assert.ok(!html.includes('src="https://www.googletagmanager.com'))}
  assert.ok(fs.existsSync('dist/privacy/index.html'));
});
