self.addEventListener('install',event=>{
/* event.waitUntil(
  caches.open('v2')
  .then(cache=>cache.addAll([
   '/simplenotes/',
   '/simplenotes/index.html',
   '/simplenotes/utils.js',
   '/simplenotes/log.js',
   '/simplenotes/crypto/auth.js',
   '/simplenotes/ui/auth.js',
   '/simplenotes/customImport.js',
   '/simplenotes/test/index.js',
   '/simplenotes/test/ui/auth.js',
   '/simplenotes/test/crypto/auth.js',
   '/simplenotes/test/log.js',
   '/simplenotes/test/customImport.js'
  ]))
 );*/
});

self.addEventListener('activate',event=>{
 /*const cacheWhitelist=['v1'];
 //alert('service worker: activation')
 event.waitUntil(
  caches.forEach((cache,cacheName)=>{
   if(!cacheWhitelist.includes(cacheName)) {
    return(caches.delete(cacheName));
   }
  })
 );*/
});

self.addEventListener('fetch',async(event)=>{
/* let url=new URL(event.request.url);
 let responseP=caches.match(url);
 let response=null;
 if(responseP){
  response=await(responseP);
 }else{
  response=await(fetch(event.request));
  let responseClone=response.clone();
  let cache=await(caches.open('v1'));
  cache.put(event.request,responseClone);
 }
 event.respondWith(response);*/
});
