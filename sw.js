let logs=[];
let errors=[];

const versionUrl='/simplenotes/version';
const urlsToCache=[
 '/simplenotes/cache.appcache',
 '/simplenotes/index.html',
 '/simplenotes/customImport.js',
 '/simplenotes/utils.js',
 '/simplenotes/log.js',
 '/simplenotes/crypto/auth.js',
 '/simplenotes/ui/auth.js'
];

const fetchVersion=async(r,v)=>{
 r=await(fetch(versionUrl));
 v=await(r.text());
 return(v);
};

const cacheResources=async(
 version,cache
)=>{
 if(navigator.onLine){
  if(version===undefined){
   version=await(fetchVersion());
  }
  cache=await(caches.open(version));
  await(cache.addAll(urlsToCache));
  logs.push('cached resources version:'+version);
 }else{
  logs.push('cache resourses: offline');
 }
};

const updateCache=async(
 currentVersion,
 cacheNames,
 arpr,r
)=>{
 try{
  if(navigator.onLine){
   currentVersion=await(fetchVersion());
   cacheNames=await(caches.keys());
   arpr=cacheNames
   .filter(cn=>(cn!==currentVersion))
   .map(cn=>{caches.delete(cacheName)});
   r=await(Promise.all(arpr));
   logs.push('cashes delete ok:'+r);
   if(!caches.has(currentVersion)){
    await(cacheResources(currentVersion));
    logs.push('cache new version ok');
   }
  }else{
   logs.push('update cache: offline');
  }
 }catch(error){errors.push(error)}
};

self.addEventListener(
 'install',async(event)=>{try{
 // event.waitUntil(self.skipWaiting());
  logs.push('service worker install');
  event.waitUntil(
   cacheResources()
  );
 }catch(error){errors.push(error)}}
);

self.addEventListener('activate',event=>{
 logs.push('service worker activate');
 //event.waitUntil(self.skipWaiting());
 event.waitUntil(
  updateCache()
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
