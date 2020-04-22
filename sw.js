const version='v2';
let logs=[];
let errors=[];

const urlsToCache=[
 'https://dimasorokin1987.github.io/simplenotes/',
 'https://dimasorokin1987.github.io/simplenotes/cache.appcache',
 'https://dimasorokin1987.github.io/simplenotes/index.html',
 'https://dimasorokin1987.github.io/simplenotes/customImport.js',
 'https://dimasorokin1987.github.io/simplenotes/utils.js',
 'https://dimasorokin1987.github.io/simplenotes/log.js',
 'https://dimasorokin1987.github.io/simplenotes/crypto/auth.js',
 'https://dimasorokin1987.github.io/simplenotes/ui/auth.js',
 'https://dimasorokin1987.github.io/simplenotes/sw.js',
 'https://dimasorokin1987.github.io/simplenotes/manifest.json'
];

const cacheResources=async()=>{
 if(navigator.onLine){
  const cache=await(caches.open(version));
  await(cache.addAll(urlsToCache));
  logs.push('cached resources version:'+version);
 }else{
  errors.push('cache resourses: offline');
 }
};

const updateCache=async()=>{try{
 const cacheNames=await(caches.keys());
 const arpr=cacheNames
 .filter(cn=>(cn!==version))
 .map(cn=>caches.delete(cn));
 const r=await(Promise.all(arpr));
 logs.push('cashes delete ok:'+r);
}catch(error){errors.push(error)}};

self.addEventListener('install',
 async(event)=>{try{
 // event.waitUntil(self.skipWaiting());
  logs.push('service worker install');
  event.waitUntil(
   cacheResources()
  );
 }catch(error){errors.push(error)}}
);

self.addEventListener('activate',
 event=>{
  logs.push('service worker activate');
  //event.waitUntil(self.skipWaiting());
  event.waitUntil(
   updateCache()
  );
 }
);

self.addEventListener('fetch',
 async(event)=>{
  logs.push(event.request.url);
  let url=new URL(event.request.url);
  logs.push(url);
  let response=await(caches.match(url));
  if(!response){
   if(navigator.onLine){
    response=await(fetch(event.request));
    let responseClone=response.clone();
    let cache=await(caches.open(version));
    await(cache.put(event.request,responseClone));
   }else{
    response='';
    errors.push('fetch: cache resourse: offline');
   }
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
