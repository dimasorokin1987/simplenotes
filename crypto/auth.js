import{create,pipe}from'utils';

export const rand=n=>(
 crypto.getRandomValues(
   create(Uint8Array,[n])
  )
);

export const join2=(buf1,buf2,bytes1,bytes2,n,bytes)=>{
 bytes1=create(Uint8Array,[buf1]);
 bytes2=create(Uint8Array,[buf2]);
 n=bytes1.length+bytes2.length;
 bytes=create(Uint8Array,[n]);
 bytes.set(bytes1,0);
 bytes.set(bytes2,bytes1.length);
 return(bytes.buffer);
}

export const join=(bufs,n,res)=>{
 n=bufs.reduce(
  (acc,buf)=>acc+buf.byteLength,0
 );
 res=bufs.reduce(
  (acc,buf,j,arr,bt)=>{
   bt=create(Uint8Array,[buf]);
   acc.bts.set(bt,acc.i);
   acc.i+=bt.length;
   return(acc);
  },{
   bts:create(Uint8Array,[n]),
   i:0
  }
 );
 return(res.bts.buffer);
};

export const buf2hex=(buf,bytes,arr,hex)=>{
 bytes=create(Uint8Array,[buf]);
 arr=Array.from(bytes);
 hex=arr.map(
  b=>b.toString(16).padStart(2,'0')
 ).join('');
 return(hex);
};

export const hex2buf=(hex,arr,bytes)=>{
 arr=hex.match(/.{1,2}/g)
 .map(b=>parseInt(b,16));
 bytes=create(Uint8Array,[arr]);
 return(bytes.buffer);
}

export const hash=async(txt,enc,d,hbuf,hhex)=>{
 enc=create(TextEncoder);
 d=enc.encode(txt);
 hbuf=await(crypto.subtle.digest('SHA-256',d));
 hhex=buf2hex(hbuf);
 return(hhex);
};

const baseUrl='https://jsonstorage.net/api/items/';

export const check=async(id,f,t)=>{
 f=await(fetch(baseUrl+id));
 t=await(f.text());
 return(t==='');
};
export const get=async(url,f,j)=>{
 f=await(fetch(url));
 j=await(f.json());
 return(j);
};
export const put=async(url,obj,p,f,j)=>{
 p={
  method:'put',
  headers:{
   'Content-Type':'application/json'
  },
  body:JSON.stringify(obj),
 };
 f=await(fetch(url,p));
 j=await(f.json());
 return(j);
};

export const register=async(id,userObj={test:111},isOk,r)=>{
 isOk=await(check(id));
 if(!isOk)return(false);
 r=await(put(baseUrl+id,userObj));
 isOk=r.uri&&(r.uri ===baseUrl+id)
 return(isOk);
};

export const login=async(id,pas,r,hpas)=>{
 r=await(get(baseUrl+id));
 hpas=await(hash(pas));
 return(r.hpas==hpas);
};

export const encrypt=async(pubKey,txt,enc,d,buf,hex)=>{
 enc=create(TextEncoder);
 d=enc.encode(txt);
 buf=await(crypto.subtle.encrypt({
  name:'RSA-OAEP'
 },pubKey,d));
 hex=buf2hex(buf);
 return(hex);
};

export const decrypt=async(prKey,cTxt,buf,d,dec,txt)=>{
 buf=hex2buf(cTxt);
 d=await(crypto.subtle.decrypt({
  name:'RSA-OAEP'
 },prKey,buf));
 dec=create(TextDecoder);
 txt=dec.decode(d);
 return(txt);
};

export const pass2key=async(pas,enc,d,key)=>{
 enc=create(TextEncoder);
 d=enc.encode(pas);
 key=await(crypto.subtle.importKey(
  'raw',d,{name:'PBKDF2'},false,
  ['deriveBits', 'deriveKey']
 ));
 return(key);
};

export const key2hmacKey=(key,salt)=>(
 crypto.subtle.deriveKey({
  name:'PBKDF2',
  salt,
  iterations:100000,
  hash:'SHA-256'
 },key,{
  name: 'HMAC',
  hash: {name: 'SHA-512'}
 },true,[
  'sign','verify'
 ])
);

export const sign=(key,d)=>(
 crypto.subtle.sign({
  name:'HMAC',
  hash: {name: 'SHA-512'}
 },key,d)
);
export const verify=(key,sg,d)=>(
 crypto.subtle.verify({
  name:'HMAC',
  hash: {name: 'SHA-512'}
 },key,sg,d)
);

export const key2aesGcmKey=(key,salt)=>(
 crypto.subtle.deriveKey({
  name:'PBKDF2',
  salt,
  iterations:100000,
  hash:'SHA-256'
 },key,{
  name:'AES-GCM',
  length:256
 },false,[
  'encrypt',
  'decrypt'
 ])
);
export const encryptAesGcm=(key,iv,d)=>(
 crypto.subtle.encrypt(
  {name:'AES-GCM',iv},key,d
 )
);
export const decryptAesGcm=(key,iv,buf)=>(
 crypto.subtle.decrypt(
  {name:'AES-GCM',iv},key,buf
 )
);

export const cryptoRegister=async(lgn,pas,userObj={test:111},id,isOk,userJson,enc,d,salt1,salt2,iv,key,key1,key2,sg,sbuf,ebuf,buf,h,r)=>{
 id=await(hash(lgn));
 isOk=await(check(id));
 if(!isOk)return(false);
 userJson=JSON.stringify(userObj);
 enc=create(TextEncoder);
 d=enc.encode(userJson);

 salt1=rand(16);
 salt2=rand(16);
 iv=rand(12);

 key=await(pass2key(pas));
 key1=await(
  key2aesGcmKey(key,salt1)
 );
 key2=await(
  key2hmacKey(key,salt2)
 );

 sg=await(sign(key2,d));
 sbuf=join([salt2,sg,d]);
 ebuf=await(
  encryptAesGcm(key1,iv,sbuf)
 );
 buf=join([salt1,iv,ebuf]);
 h=buf2hex(buf);

 r=await(put(baseUrl+id,{h}));
 isOk=r.uri&&(r.uri===baseUrl+id)
 return(isOk);
};

export const cryptoLogin=async(lgn,pas,id,r,key,buf,salt1,key1,iv,ebuf,sbuf,salt2,key2,sg,d,isOk,dec,txt,obj)=>{try{
 id=await(hash(lgn));
 r=await(get(baseUrl+id));
 key=await pass2key(pas);

 buf=hex2buf(r.h);
 salt1=buf.slice(0,16);
 key1=await(
  key2aesGcmKey(key,salt1)
 );
 iv=buf.slice(16,28);
 ebuf=buf.slice(28);
 sbuf=await(
  decryptAesGcm(key1,iv,ebuf)
 );
 salt2=sbuf.slice(0,16);
 key2=await(
  key2hmacKey(key,salt2)
 );
 sg=sbuf.slice(16,80);
 d=sbuf.slice(80);
 isOk=await verify(key2,sg,d);
 if(!isOk)return(null);
 dec=create(TextDecoder);
 txt=dec.decode(d);
 obj=JSON.parse(txt);
 return(obj);
}catch(e){
 alert(e);
 return(null);
}};


export const sign1=
async(key)=>
async(d,salt2,key2,sg,sbuf)=>{
 salt2=rand(16);
 key2=await(
  key2hmacKey(key,salt2)
 );
 sg=await(sign(key2,d));
 sbuf=join([salt2,sg,d]);
 return(sbuf);
};

export const verify1=
async(key)=>
async(sbuf,
 salt2=sbuf.slice(0,16),
 sg=sbuf.slice(16,80),
 d=sbuf.slice(80),
 key2,isOk
)=>{
 key2=await(
  key2hmacKey(key,salt2)
 );
 isOk=await(verify(key2,sg,d));
 return(isOk?d:null);
};


export const encrypt1=
async(key)=>
async(d,salt1,iv,key1,ebuf,buf)=>{
 salt1=rand(16);
 iv=rand(12);
 key1=await(
  key2aesGcmKey(key,salt1)
 );
 ebuf=await(
  encryptAesGcm(key1,iv,d)
 );
 buf=join([salt1,iv,ebuf]);
 return(buf);
};

export const decrypt1=
async(key)=>
async(buf,
 salt1=buf.slice(0,16),
 iv=buf.slice(16,28),
 ebuf=buf.slice(28),
 key1,d
)=>{
 key1=await(
  key2aesGcmKey(key,salt1)
 );
 d=await(
  decryptAesGcm(key1,iv,ebuf)
 );
 return(d);
};

export const crypt=async(pas,obj,url,key,txt,enc,d,estr)=>{
 key=await(pass2key(pas));
 txt=JSON.stringify(obj);
 enc=create(TextEncoder);
 d=enc.encode(txt);
 estr=await(pipe(d,[
  await(sign1(key)),
  await(encrypt1(key)),
  buf2hex,
  h=>({h}),
  eobj=>JSON.stringify(eobj)
 ]));
 return(estr);
};

export const uncrypt=async(
 pas,estr,key,d,dec,txt,obj
)=>{
 key=await(pass2key(pas));
 d=await(pipe(estr,[
  estr=>JSON.parse(estr),
  ({h})=>h,
  hex2buf,
  await(decrypt1(key)),
  await(verify1(key))
 ]));
 if(!d)return(null);
 dec=create(TextDecoder);
 txt=dec.decode(d);
 obj=JSON.parse(txt);
 return(obj);
};

export const cryptoLocalStore=
async(prefix,nm,pas,obj,id)=>{
 id=await(hash(nm));
 localStorage[prefix+id]=await(
  crypt(pas,obj)
 );
};

export const cryptoLocalLoad=
async(prefix,nm,pas,id,estr,obj)=>{
 id=await(hash(nm));
 estr=localStorage[prefix+id];
 if(estr===undefined)return(null);
 obj=await(uncrypt(pas,estr));
 return(obj);
};

export const put1=
url=>async(obj)=>await(put(url,obj));

export const cryptoStore=async(nm,pass,obj,id,url,key,txt,enc,d,r,isOk)=>{
 id=await(hash(nm));
 url=baseUrl+id;
 key=await(pass2key(pass));
 txt=JSON.stringify(obj);
 enc=create(TextEncoder);
 d=enc.encode(txt);
 r=await(pipe(d,[
  await(sign1(key)),
  await(encrypt1(key)),
  buf2hex,
  h=>({h}),
  put1(url)
 ]));
 isOk=r.uri&&(r.uri===url);
 return(isOk);
};
