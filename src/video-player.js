(() => {
 const root=document.querySelector('[data-demo="video"]');if(!root)return;
 const select=root.querySelector('[data-choice]'),host=root.querySelector('.video-host'),direct=root.querySelector('[data-video-link]');
 const ids=['oQRW5Dpfwks','y-gy7XYQpDQ','24KB_DL01Nw'],names=['Flask / AJAX','Angular','Android'];
 let player=null,timer=null,version=0,apiPromise=null;
 const watch=()=>`https://www.youtube.com/watch?v=${ids[Number(select.value)]}`;
 function cancel(){clearTimeout(timer);timer=null;if(player){try{player.destroy()}catch{}player=null}}
 function poster(message='Stock research, watchlists and virtual trading.'){
  const name=names[Number(select.value)];host.innerHTML=`<div class="video-poster"><span class="eyebrow">Project recording / paper trading</span><h3>${name}</h3><p role="status">${message}</p><div class="recording-actions"><button class="primary" data-play>Play embedded recording ▶</button><a class="button" data-watch href="${watch()}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div></div>`;
  host.querySelector('[data-play]').addEventListener('click',load);direct.href=watch();direct.textContent=`Open ${name} recording on YouTube ↗`;
 }
 function api(){if(window.YT?.Player)return Promise.resolve(window.YT);if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{
   const prior=window.onYouTubeIframeAPIReady;
   window.onYouTubeIframeAPIReady=()=>{if(typeof prior==='function')prior();resolve(window.YT)};
   let script=document.querySelector('script[data-youtube-api]');
   if(!script){script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.dataset.youtubeApi='';script.referrerPolicy='strict-origin-when-cross-origin';script.addEventListener('error',()=>{script.remove();apiPromise=null;reject(new Error('API unavailable'))});document.head.append(script)}
  });return apiPromise;
 }
 function load(){
  cancel();const attempt=++version,n=Number(select.value);host.dataset.playerPhase='api-loading';
  host.innerHTML=`<div class="video-frame-slot is-loading"><div class="video-loading"><span class="eyebrow">${names[n]} recording</span><p role="status">Connecting to the YouTube player…</p><a href="${watch()}" target="_blank" rel="noopener noreferrer">Open recording on YouTube ↗</a></div></div>`;
  function fail(message){if(attempt!==version)return;version++;cancel();poster(message)}
  timer=setTimeout(()=>fail(host.dataset.playerPhase==='api-loading'?'YouTube did not finish loading its player in this browser. You can retry or open the recording on YouTube.':'The embedded player did not respond in this browser. You can retry or watch the recording on YouTube.'),12000);
  api().then(YT=>{
   if(attempt!==version)return;
   host.dataset.playerPhase='iframe-loading';const slot=host.querySelector('.video-frame-slot'),frame=document.createElement('iframe');
   // Set identification and permissions before navigation, not in an onload handler.
   frame.id='stock-youtube-player';frame.title=`${names[n]} stock research recording`;frame.referrerPolicy='strict-origin-when-cross-origin';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';frame.allowFullscreen=true;
   const params=new URLSearchParams({enablejsapi:'1',playsinline:'1',origin:location.origin,widget_referrer:location.href,rel:'0'});
   frame.src=`https://www.youtube.com/embed/${ids[n]}?${params}`;
   slot.append(frame);
   player=new YT.Player(frame,{events:{
    onReady:()=>{if(attempt!==version)return;clearTimeout(timer);timer=null;host.dataset.playerPhase='ready';host.querySelector('.video-loading')?.remove();slot.classList.remove('is-loading');},
    onError:e=>{const errors={100:'YouTube reports that this recording is unavailable.',101:'The recording owner has disabled embedded playback.',150:'The recording owner has disabled embedded playback.',153:'YouTube could not verify this browser’s embedded-player identification.'};fail((errors[e.data]||'YouTube could not play this recording here.')+' Open the selected recording on YouTube.');}
   }});
  }).catch(()=>fail('This browser could not load the YouTube player. Open the recording directly on YouTube.'));
 }
 select.addEventListener('change',()=>{version++;cancel();poster()});window.addEventListener('pagehide',()=>{version++;cancel()});poster();
})();
