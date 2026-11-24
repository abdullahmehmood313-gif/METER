const C='green-meter-v3',L=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(L.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
if(r.mode==='navigate'){e.respondWith(new Promise(res=>{let done=false;
const fb=()=>caches.match('./index.html').then(m=>m||caches.match('./')).then(m=>{if(!done&&m){done=true;res(m)}});
const t=setTimeout(fb,2500);
fetch(r).then(x=>{clearTimeout(t);if(x&&x.ok){const cl=x.clone();caches.open(C).then(c=>c.put('./index.html',cl))}if(!done){done=true;res(x)}})
.catch(()=>{clearTimeout(t);fb().then(()=>{if(!done){done=true;res(new Response('Offline and not saved yet. Open the app once with internet.',{status:503}))}})})}));return}
e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r)))});
