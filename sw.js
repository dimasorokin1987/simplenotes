const version='v2';
let logs=[];
let errors=[];

const urlsToCache=[
 //'https://dimasorokin1987.github.io/simplenotes/',
 //'https://dimasorokin1987.github.io/simplenotes/cache.appcache',
 'simplenotes/index.html',
 'simplenotes/customImport.js',
 'simplenotes/utils.js',
 'simplenotes/log.js',
 'simplenotes/crypto/auth.js',
 'simplenotes/ui/auth.js',
 'simplenotes/sw.js',
 'simplenotes/manifest.json'
];

// const cacheResources=async()=>{
//  if(navigator.onLine){
//   const cache=await(caches.open(version));
//   await(cache.addAll(urlsToCache));
//   logs.push('cached resources version:'+version);
//  }else{
//   errors.push('cache resourses: offline');
//  }
// };

// const updateCache=async()=>{try{
//  const cacheNames=await(caches.keys());
//  const arpr=cacheNames
//  .filter(cn=>(cn!==version))
//  .map(cn=>caches.delete(cn));
//  const r=await(Promise.all(arpr));
//  logs.push('cashes delete ok:'+r);
// }catch(error){errors.push(error)}};

// self.addEventListener('install',
//  async(event)=>{try{
//  // event.waitUntil(self.skipWaiting());
//   logs.push('service worker install');
//   event.waitUntil(
//    cacheResources()
//   );
//  }catch(error){errors.push(error)}}
// );

self.addEventListener('install', (event)=>{
    event.waitUntil(
        caches.open(version)
        .then((cache)=>{
            console.log('Open cache:', cache);
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', (event)=>{
    const cacheWhiteList = [];
    cacheWhiteList.push(version);
    event.waitUntil(
        caches.keys()
        .then((cacheNames)=>Promise.all(
            cacheNames.map((cacheName)=>{
                if(!cacheWhiteList.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});

/*
self.addEventListener('activate',
 event=>{
  logs.push('service worker activate');
  //event.waitUntil(self.skipWaiting());
  event.waitUntil(
   updateCache()
  );
 }
);
*/

// self.addEventListener('fetch',
//  async(event)=>{
//   logs.push(event.request.url);
//   let url=new URL(event.request.url);
//   logs.push(url);
//   let response=await(caches.match(url));
//   /*
//   if(!response){
//    if(navigator.onLine){
//     response=await(fetch(event.request));
//     let responseClone=response.clone();
//     let cache=await(caches.open(version));
//     await(cache.put(event.request,responseClone));
//    }else{
//     response='';
//     errors.push('fetch: cache resourse: offline');
//    }
//   }
//   */
//   event.respondWith(response);
//  }
// );

self.addEventListener('fetch', (event)=>{
    event.respondWith(
        caches.match(event.request)
//         .then(()=>{
//             return fetch(event.request)
//             .catch(()=>caches.match('offline.html'))
//         })
    );
});

self.addEventListener('message',event=>{
 let sender=null
 ||event.ports&&event.ports[0]
 ||event.source;
  //switch (event.data
 sender.postMessage(
  JSON.stringify({logs,errors})
 );
});
