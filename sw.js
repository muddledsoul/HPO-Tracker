const C='hpo-v18';const FILES=['./','./index.html','./manifest.json','./icon.png','./horsemen.js','./leopard.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
// Network-first so updates show on the next open; cache only used when offline.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl));}return res;})
  .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});
