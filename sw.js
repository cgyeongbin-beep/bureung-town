/* 네트워크 우선, 실패하면 저장본. 수정 사항이 바로 반영되도록 함 */
const CACHE='bureung-v1';
const FILES=['./','./index.html','./icon.png','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok && new URL(e.request.url).origin===location.origin){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return r; }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
