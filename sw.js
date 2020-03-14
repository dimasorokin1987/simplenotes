const urlsToCache=[
// '/',
 '/simplenotes/index.html',
 '/simplenotes/customImport.js',
 '/simplenotes/utils.js',
 '/simplenotes/log.js',
 '/simplenotes/crypto/auth.js',
 '/simplenotes/ui/auth.js'
];

let logs=[];
let errors=[];

const cacheResources=async()=>{
  const cache = await caches.open('v1')
  return cache.addAll(urlsToCache)
}

self.addEventListener(
 'install',async(event)=>{try{
 // event.waitUntil(self.skipWaiting());
  logs.push(333);
  event.waitUntil(
   cacheResources()
  );
  logs.push(222);
 }catch(error){errors.push(error)}}
);

self.addEventListener('activate',event=>{
 logs.push(444);
 //event.waitUntil(self.skipWaiting());
 const cacheWhitelist=['v1'];
 event.waitUntil(
  caches.forEach((cache,cacheName)=>{
   if(!cacheWhitelist.includes(cacheName)) {
    return(caches.delete(cacheName));
   }
  })
 );
});

self.addEventListener(
 'fetch',async(event)=>{
  logs.push(event.request.url);
  let url=new URL(event.request.url);
  logs.push(url);
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
  event.respondWith(response);
 }
);

self.addEventListener('message',event=>{
 let sender=null
 ||event.ports&&event.ports[0]
 ||event.source;
  //switch (event.data
 sender.postMessage(
  JSON.stringify({logs,errors})
 );
});
