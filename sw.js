const urlsToCache=[
// '/',
 '/index.html',
 '/utils.js',/*
 '/log.js',
 '/crypto/auth.js',
 '/ui/auth.js',
 '/customImport.js',
 '/test/index.js',
 '/test/ui/auth.js',
 '/test/crypto/auth.js',
 '/test/log.js',
 '/test/customImport.js'*/
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
  let url=new URL(event.request.url);
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
