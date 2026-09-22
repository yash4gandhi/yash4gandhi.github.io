(() => {
 const root=document.querySelector('[data-peptide-film]');if(!root)return;
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const records=JSON.parse(document.querySelector('[data-peptide-records]').textContent);
 const candidate=document.querySelector('[data-peptide-select]');
 $('[data-film-example]').innerHTML=records.map((p,i)=>`<option value="${i}">${p.id}</option>`).join('');
 const canvas=$('[data-film-canvas]'),ctx=canvas.getContext('2d');if(!ctx)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),duration=56000,chapterDuration=8000;
 const chapters=[
  ['Offline training','Start with a peptide library.','Experimental mRNA-display selection and sequencing supply peptide examples. Their amino-acid identities become numerical encodings for model training.','Selection → sequencing → encoding'],
  ['Offline training','Add noise. Keep the learning target.','Mix a peptide encoding with Gaussian noise at a sampled noise level. Because the added noise is known, the model has a target to learn from.','xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε'],
  ['Offline training','Learn to recognize the noise.','The denoiser sees the noisy encoding and noise level. Compare its noise prediction with the noise that was added, then update its weights. Repeat across examples and noise levels.','Known noise → prediction error → weight update'],
  ['Generation · trained model','Turn fresh noise into an encoding.','DDIM sampling starts from noise and repeatedly uses the trained denoiser to refine a candidate encoding. This conceptual progression ends at a real saved candidate.','Fresh noise → DDIM steps → peptide encoding'],
  ['Generation · decoding','Recover the amino-acid sequence.','Read the amino-acid identity at each position. Here, the final one-hot encoding is reconstructed exactly from the selected saved candidate, with its initial M removed.','20 positions × 20 amino-acid choices'],
  ['Prediction · trained model','Read the sequence. Predict affinity.','CfC carries information across the encoded sequence and predicts binding free energy, ΔG. The displayed prediction and experimental measurement come from the saved manuscript table.','CfC · Closed-form Continuous-time neural network'],
  ['Agentic orchestration','One request. The right tools.','PydanticAI structures the request; LangGraph routes it to generation, direct CfC inference, or both. The agent layer coordinates trained tools and returns their outputs.','Understand intent → route tools → return results']
 ];
 let time=0,playing=false,visible=false,frame=null,last=null,active=-1,W=800,H=360,route='both';
 const colors={mint:'#bfe8d5',bright:'#e9f7ed',muted:'#9ebdb4',line:'#34534f',amber:'#e9bc7a',teal:'#4d9787'};
 const record=()=>records[Number(candidate.value)||0],seq=()=>record().sequence.slice(1),alphabet='ACDEFGHIKLMNPQRSTVWY';
 const clamp=n=>Math.max(0,Math.min(1,n));
 const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
 const noise=(i,seed=0)=>{const x=Math.sin(i*127.1+seed*311.7)*43758.5453;return x-Math.floor(x)};
 function text(s,x,y,size=13,color=colors.muted,align='center'){ctx.fillStyle=color;ctx.font=`${size}px "DM Sans",Arial,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y)}
 function line(x1,y1,x2,y2,color=colors.line,width=1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
 function dot(x,y,r,color,glow=false){if(glow){ctx.shadowColor=color;ctx.shadowBlur=15}ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.shadowBlur=0}
 function box(x,y,w,h,color=colors.line){ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fillStyle='#132f30';ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke()}
 function arrow(x1,y1,x2,y2,p,color=colors.mint){line(x1,y1,x2,y2,colors.line,1.5);const a=Math.atan2(y2-y1,x2-x1);line(x2,y2,x2-7*Math.cos(a-.5),y2-7*Math.sin(a-.5),color);line(x2,y2,x2-7*Math.cos(a+.5),y2-7*Math.sin(a+.5),color);dot(x1+(x2-x1)*clamp(p),y1+(y2-y1)*clamp(p),3,color,true)}
 function matrix(x,y,size,amount=0,seed=2,saved=false,highlight=-1){
  const cell=size/20;ctx.fillStyle='#0c2427';ctx.fillRect(x-4,y-4,size+8,size+8);
  for(let r=0;r<20;r++)for(let c=0;c<20;c++){
   const on=c===(saved?alphabet.indexOf(seq()[r]):(r*7+3)%20);
   const n=noise(r*20+c,seed),v=clamp((on?.98:.07)*(1-amount)+n*amount);
   const amber=amount>.6&&n>.67;
   ctx.fillStyle=amber?`rgb(${Math.round(35+v*160)},${Math.round(58+v*99)},${Math.round(57+v*40)})`:`rgb(${Math.round(15+v*177)},${Math.round(43+v*189)},${Math.round(46+v*167)})`;
   ctx.fillRect(x+c*cell,y+r*cell,Math.max(1,cell-1.2),Math.max(1,cell-1.2));
  }
  if(highlight>=0){ctx.strokeStyle=colors.amber;ctx.lineWidth=1.5;ctx.strokeRect(x-2,y+highlight*cell-1,size+3,cell+1)}
 }
 function network(cx,cy,width,p){
  const nodes=[];[3,4,3].forEach((n,col)=>{nodes[col]=Array.from({length:n},(_,i)=>[cx-width/2+col*width/2,cy+(i-(n-1)/2)*25])});
  for(let col=0;col<2;col++)for(const a of nodes[col])for(const b of nodes[col+1])line(...a,...b,colors.line);
  nodes.forEach((layer,col)=>layer.forEach(([x,y],i)=>dot(x,y,5.5,(Math.floor(p*6)+i+col)%3===0?colors.mint:colors.teal)));
  const k=p*2,col=Math.min(1,Math.floor(k));const a=nodes[col][1],b=nodes[col+1][1];dot(a[0]+(b[0]-a[0])*(k-col),a[1]+(b[1]-a[1])*(k-col),3,colors.amber,true);
 }
 function drawLibrary(p){
  const mobile=W<560,cy=mobile?100:170,left=mobile?W*.24:W*.16;
  for(let row=0;row<4;row++){const y=cy-47+row*28;for(let i=0;i<5;i++){const x=left-43+i*21;dot(x,y+Math.sin(i*.9+p*3)*5,5,i===4?colors.amber:colors.mint);if(i<4)line(x+5,y+Math.sin(i*.9+p*3)*5,x+16,y+Math.sin((i+1)*.9+p*3)*5,colors.teal)}}
  text('Selected library',left,cy+78,12);
  const rx=mobile?W*.73:W*.49;
  for(let row=0;row<5;row++){const y=cy-48+row*23;for(let i=0;i<6;i++){const x=rx-45+i*18;text(alphabet[(row*5+i*3)%20],x,y,12,i/6<p?colors.mint:colors.line)}}
  text('Sequence reads',rx,cy+78,12);arrow(left+56,cy,rx-62,cy,p);
  const size=mobile?112:164,x=mobile?(W-size)/2:W*.81-size/2,y=mobile?224:88;matrix(x,y,size,0,1);
  text('Numerical encodings',x+size/2,y+size+23,12);if(!mobile)arrow(rx+62,cy,x-22,cy,p);else arrow(W/2,198,W/2,214,p);
 }
 function drawNoising(p){
  const mobile=W<560,size=mobile?Math.min(126,W*.38):190,y=mobile?78:70,left=mobile?12:W*.13,right=mobile?W-size-12:W*.63;
  matrix(left,y,size,0);matrix(right,y,size,smooth(p),7);
  text(mobile?'Clean · x₀':'Clean encoding · x₀',left+size/2,y+size+27,12);text(mobile?'Noisy · xₜ':'Noisy encoding · xₜ',right+size/2,y+size+27,12);
  arrow(left+size+8,y+size/2,right-9,y+size/2,p,colors.amber);
  const barW=Math.min(300,W-60),by=mobile?292:312;line((W-barW)/2,by,(W+barW)/2,by,colors.line,4);line((W-barW)/2,by,(W-barW)/2+barW*smooth(p),by,colors.amber,4);dot((W-barW)/2+barW*smooth(p),by,5,colors.amber);
  text('Less noise', (W-barW)/2,by+25,11,colors.muted,'left');text('More noise',(W+barW)/2,by+25,11,colors.muted,'right');
 }
 function drawTraining(p){
  const mobile=W<560,size=mobile?88:124,y=mobile?56:111,netX=mobile?W*.72:W*.5,netY=mobile?100:172;
  const x=mobile?14:W*.1;matrix(x,y,size,.76,3);text('Noisy input + t',x+size/2,y+size+25,12);
  network(netX,netY,mobile?Math.min(85,W*.28):140,p);text('Noise predictor',netX,netY+75,12,colors.mint);text('Schematic',netX,netY+95,10);
  arrow(x+size+9,y+size/2,netX-(mobile?50:85),netY,p);
  const bx=mobile?20:W*.72,by=mobile?222:119,bw=mobile?W-40:W*.22;box(bx,by,bw,101,colors.teal);
  text('Known ε  vs  predicted ε',bx+bw/2,by+27,mobile?12:13,colors.bright);text('Compare the error',bx+bw/2,by+53,12);text('Update weights',bx+bw/2,by+78,12,colors.amber);
  if(mobile)arrow(netX,netY+111,netX,by-12,p);else arrow(netX+88,netY,bx-14,netY,p);
  ctx.beginPath();ctx.moveTo(bx+bw/2,by+108);ctx.bezierCurveTo(bx+bw/2,H-12,netX,H-12,netX,netY+112);ctx.strokeStyle=colors.amber;ctx.lineWidth=1.4;ctx.setLineDash([4,5]);ctx.stroke();ctx.setLineDash([]);
  if(!mobile)text('Repeat across examples & noise levels',W/2,H-26,12,colors.amber);
 }
 function drawDenoising(p){
  const mobile=W<560,size=mobile?Math.min(212,W-50):230,x=(W-size)/2,y=mobile?27:36;
  matrix(x,y,size,1-smooth(p),13,true);
  if(!mobile){matrix(28,107,90,1,13,true);text('Fresh noise',73,221,12);arrow(133,153,x-20,153,p);matrix(W-118,107,90,0,13,true);text('Encoding',W-73,221,12);arrow(x+size+20,153,W-133,153,p)}
  const ticks=9,span=Math.min(W-60,360),ty=mobile?size+81:312;
  for(let i=0;i<ticks;i++){const xx=(W-span)/2+i*span/(ticks-1);if(i<ticks-1)line(xx,ty,xx+span/(ticks-1),ty,colors.line,2);dot(xx,ty,i===Math.min(8,Math.floor(p*9))?5:3,i/8<=p?colors.mint:colors.line,i===Math.floor(p*9))}
  text('Noise', (W-span)/2,ty+25,12,colors.muted,'left');text('Peptide encoding',(W+span)/2,ty+25,12,colors.mint,'right');
 }
 function drawDecoding(p){
  const mobile=W<560,size=mobile?146:235,x=mobile?(W-size)/2:W*.12,y=mobile?16:37,n=Math.min(20,Math.floor(p*21));matrix(x,y,size,0,13,true,Math.min(n,19));
  const cols=mobile?10:5,cell=mobile?Math.min(29,(W-16)/10):48,sx=mobile?(W-cell*cols)/2:W*.59,sy=mobile?206:66;
  for(let i=0;i<20;i++){const xx=sx+i%cols*cell,yy=sy+Math.floor(i/cols)*(mobile?43:50);box(xx,yy,cell-4,mobile?34:40,i<n?colors.teal:colors.line);text(i<n?seq()[i]:'·',xx+(cell-4)/2,yy+(mobile?17:20),mobile?15:19,i<n?colors.mint:colors.muted)}
  if(!mobile)arrow(x+size+16,155,sx-24,155,p);
  text(`${n} / 20 positions decoded`,W/2,mobile?321:315,13,colors.mint);text(`${record().id} · initial M omitted`,W/2,mobile?345:340,11);
 }
 function drawCfc(p){
  const mobile=W<560,cy=157,n=Math.min(19,Math.floor(clamp(p/.65)*20)),cx=W/2;
  const spacing=Math.min(33,(W-24)/9);for(let i=-4;i<=4;i++){const pos=n+i;const xx=cx+i*spacing;if(pos<0||pos>=20)continue;const yy=mobile?43:44;box(xx-spacing/2+2,yy,spacing-4,33,i===0?colors.amber:colors.line);text(seq()[pos],xx,yy+17,15,i===0?colors.amber:colors.muted)}
  arrow(cx,84,cx,cy-33,p);box(cx-62,cy-30,124,60,colors.teal);text('CfC',cx,cy,27,colors.mint);
  ctx.beginPath();ctx.arc(cx,cy,81,-.75,Math.PI*1.75);ctx.strokeStyle=colors.line;ctx.lineWidth=1.5;ctx.stroke();const angle=p*Math.PI*2;dot(cx+81*Math.cos(angle),cy+81*Math.sin(angle),4,colors.amber,true);
  text('Sequence context',cx,cy+102,12);if(!mobile){text(`Position ${n+1} / 20`,cx-175,cy,13);text('Regression readout',cx+195,cy-22,12);text(p>=.68?`${record().predictedDeltaG.toFixed(1)} kcal/mol`:'Reading sequence…',cx+195,cy+14,p>=.68?26:16,colors.mint);arrow(cx+94,cy,cx+115,cy,clamp((p-.6)/.4))}
  else{text(`Position ${n+1} / 20 → ΔG`,cx,cy+133,12);text(p>=.68?`${record().predictedDeltaG.toFixed(1)} kcal/mol`:'Reading sequence…',cx,cy+166,p>=.68?24:15,colors.mint)}
  if(!mobile&&p>=.68)text(`Saved CfC prediction · ${record().id}   /   Experimental ΔG: ${record().experimentalDeltaG.toFixed(1)} kcal/mol`,cx,326,13);
 }
 function drawAgents(p){
  const mobile=W<560,labels=route==='generate'?['Request','PydanticAI','LangGraph','DDIM','Sequences']:route==='predict'?['Request + sequence','PydanticAI','LangGraph','CfC','Affinity']:['Request','PydanticAI','LangGraph','DDIM → CfC','Sequences + ΔG'];
  const slots=labels.length,stage=Math.min(slots-1,Math.floor(p*slots));
  if(mobile){const bw=Math.min(230,W-38),x=(W-bw)/2;labels.forEach((label,i)=>{const y=9+i*68;box(x,y,bw,44,i===stage?colors.mint:colors.line);text(label,W/2,y+22,14,i<=stage?colors.mint:colors.muted);if(i<slots-1)arrow(W/2,y+47,W/2,y+65,clamp(p*slots-i),colors.amber)})}
  else{const bw=Math.min(142,(W-110)/5),gap=(W-slots*bw-24)/(slots-1),y=129;labels.forEach((label,i)=>{const x=12+i*(bw+gap);box(x,y,bw,62,i===stage?colors.mint:colors.line);text(label,x+bw/2,y+31,13,i<=stage?colors.mint:colors.muted);if(i<slots-1)arrow(x+bw+5,y+31,x+bw+gap-7,y+31,clamp(p*slots-i),colors.amber)});text('Structured intent',12+(bw+gap)+bw/2,224,12);text('Workflow control',12+2*(bw+gap)+bw/2,251,12);text('Trained tools',12+3*(bw+gap)+bw/2,224,12);text('Training happens beforehand. Requests use the trained models.',W/2,318,13,colors.mint)}
 }
 const drawers=[drawLibrary,drawNoising,drawTraining,drawDenoising,drawDecoding,drawCfc,drawAgents];
 function draw(){const chapter=Math.min(6,Math.floor(time/chapterDuration)),p=clamp((time-chapter*chapterDuration)/chapterDuration);ctx.clearRect(0,0,W,H);const g=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,W*.65);g.addColorStop(0,'#193b39');g.addColorStop(1,'#0c2528');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);drawers[chapter](p)}
 function stamp(ms){const n=Math.floor(ms/1000);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
 function sync(manual=false){const chapter=Math.min(6,Math.floor(time/chapterDuration));
  if(active!==chapter){active=chapter;const [phase,title,caption,equation]=chapters[chapter];$('[data-film-phase]').textContent=phase;$('[data-film-index]').textContent=`0${chapter+1} / 07`;$('[data-film-title]').textContent=title;$('[data-film-caption]').textContent=caption;$('[data-film-equation]').textContent=equation;$('[data-film-route]').hidden=chapter!==6;$$('[data-film-chapter]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===chapter)));}
  $('[data-film-result]').hidden=chapter!==5||(time-5*chapterDuration)/chapterDuration<.68;
  const savedText=`${record().id} · Saved CfC ΔG: ${record().predictedDeltaG.toFixed(1)} kcal/mol · Experimental ΔG: ${record().experimentalDeltaG.toFixed(1)} kcal/mol`;
  if($('[data-film-result]').textContent!==savedText)$('[data-film-result]').textContent=savedText;
  $('[data-film-seek]').value=String(time);$('[data-film-seek]').setAttribute('aria-valuetext',`${stamp(time)}, ${chapters[chapter][1]}`);$('[data-film-clock]').textContent=`${stamp(time)} / 0:56`;
  const play=$('[data-film-play]');play.textContent=motion.matches?'Next chapter →':playing?'Pause Ⅱ':time>=duration?'Play again ↺':'Play animation ▶';play.setAttribute('aria-label',motion.matches?'Next animation chapter':playing?'Pause pipeline animation':time>=duration?'Play pipeline animation again':'Play pipeline animation');
  if(manual)$('[data-film-status]').textContent=`Chapter ${chapter+1}: ${chapters[chapter][1]}`;draw();
 }
 function cancel(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=null}
 function schedule(){cancel();if(playing&&visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick)}
 function tick(now){frame=null;if(last!==null)time=Math.min(duration,time+Math.min(100,now-last));last=now;if(time>=duration){playing=false;last=null}sync();if(playing&&visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick)}
 function jump(chapter){playing=false;cancel();time=chapter*chapterDuration+(motion.matches?chapterDuration-1:0);sync(true)}
 $('[data-film-play]').addEventListener('click',()=>{if(motion.matches){jump((active+1)%7);return}playing=!playing;if(playing&&time>=duration)time=0;sync();schedule()});
 $('[data-film-replay]').addEventListener('click',()=>{time=motion.matches?chapterDuration-1:0;playing=!motion.matches;sync(true);schedule()});
 $('[data-film-seek]').addEventListener('input',e=>{playing=false;cancel();time=Number(e.target.value);sync(true)});
 $$('[data-film-chapter]').forEach((b,i)=>b.addEventListener('click',()=>jump(i)));
 function routeNote(){route=$('[data-film-request]').value;$('[data-film-route-note]').textContent={both:'Intent: generate + predict. LangGraph calls DDIM generation, then direct CfC inference, and returns sequences with affinity predictions.',generate:'Intent: generate. LangGraph calls DDIM and returns candidate sequences; affinity prediction is skipped.',predict:'Intent: predict. The supplied sequence goes directly to CfC inference; generation is skipped.'}[route];draw()}
 $('[data-film-request]').addEventListener('change',()=>{routeNote();time=6*chapterDuration+(motion.matches?chapterDuration-1:0);playing=!motion.matches;sync(true);schedule()});
 $('[data-film-example]').addEventListener('change',e=>{candidate.value=e.target.value;candidate.dispatchEvent(new Event('change'))});
 candidate.addEventListener('change',()=>{$('[data-film-example]').value=candidate.value;sync(true)});
 document.addEventListener('visibilitychange',schedule);window.addEventListener('pagehide',()=>{playing=false;cancel()});
 motion.addEventListener('change',()=>{playing=false;cancel();if(motion.matches)time=active*chapterDuration+chapterDuration-1;sync(true)});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule()},{threshold:.12}).observe(root);
 function resize(){const rect=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);W=rect.width;H=rect.height;canvas.width=Math.round(W*ratio);canvas.height=Math.round(H*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);draw()}
 new ResizeObserver(resize).observe(canvas);if(motion.matches)time=chapterDuration-1;routeNote();sync();resize();
})();
