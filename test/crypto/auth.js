import{create}from'utils';
import{log}from'log';
import{
 rand,
 buf2hex,hex2buf,
 pass2key,
 key2hmacKey,
 sign,verify,
 key2aesGcmKey,
 encryptAesGcm,decryptAesGcm,
 hash,register,login,
 cryptoRegister,cryptoLogin,
 join2,join,
 cryptoStore
}from'crypto/auth';

export const testCryptoAuth=()=>{
log(1,{test:'sign verify'});
(async(login,pas,enc,salt,d,key,key2,sg,hsg)=>{
 login='testlogin';
 pas='pass';

 enc=create(TextEncoder);
 salt=rand(16);

 key=await pass2key(pas);
 log(1,{key});
 key2=await(
  key2hmacKey(key,salt)
 );
 log(1,{key2});
 d=enc.encode(login);
 sg=await sign(key2,d);
 hsg=buf2hex(sg);
 log(1,{hsg});

 sg=hex2buf(hsg);
 b=await verify(key2,sg,d);
 log(1,{b});
})();

log(2,{test:'encrypt decrypt'});
(async(login,pas,enc,salt,iv,d,key,key1,buf,h,dec,txt)=>{
 login='testlogin';
 pas='pass';

 enc=create(TextEncoder);
 salt=rand(16);
 iv=rand(12);

 key=await pass2key(pas);
 log(2,{key});
 key1=await(
  key2aesGcmKey(key,salt)
 );
 log(2,{key1});
 d=enc.encode(login);
 buf=await(
  encryptAesGcm(key1,iv,d)
 );
 h=buf2hex(buf);
 log(2,{h});

 buf=hex2buf(h);
 d=await(
  decryptAesGcm(key1,iv,buf)
 );
 dec=create(TextDecoder);
 txt=dec.decode(d);
 log(2,{txt});
})();

log(3,{test:'register login'});
(async(lgn,pas,hlgn,hpas,r)=>{
 lgn='testlogin';
 pas='pass';

 hlgn=await(hash(lgn));
 hpas=await(hash(pas));
 r=await(register(hlgn,{hpas}));
 log(3,{r});
 r=await(login(hlgn,pas));
 log(3,{r});
})();

log(4,{test:'crypto: register login'});
(async(lgn,pas,r)=>{
 lgn='testlogin444';
 pas='pass';

 r=await(cryptoRegister(lgn,pas,{
  qqq:24567
 }));
 log(4,{r});
 r=await(cryptoLogin(lgn,pas));
 log(4,{r});
})();

log(5,{test:'join function'});
(async(a,abuf,bbuf,cbuf, dbuf)=>{
 a=rand(5);
 log(5,{a});
 abuf=a.buffer;
 log(5,{abuf});
 bbuf=rand(7).buffer;
 log(5,{bbuf});
 cbuf=join2(abuf,bbuf);
 log(5,{cbuf});
 c=create(Uint8Array,[cbuf]);
 log(5,{c});
 cbuf=join([abuf,bbuf]);
 log(5,{cbuf});
 log(5,{cbufLen:cbuf.byteLength});
 c=create(Uint8Array,[cbuf]);
 log(5,{c});
 dbuf=join([abuf,bbuf,cbuf]);
 log(5,{dbuf});
 log(5,{dbufLenOk:(
  dbuf.byteLength===0
  +abuf.byteLength
  +bbuf.byteLength
  +cbuf.byteLength
 )});
})();

log(6,{test:'cryptoStore function'});
(async(r)=>{
 r=await(cryptoStore(
  'test@testnotes',
  'password',
  {aaa:1245}
 ));
 log(6,{r});
})();


log(7,{test: 'crypt and uncrypt funcs'});
(async(estr,obj)=>{try{
const{
 crypt,uncrypt
}=await(customImport('crypto/auth'));

estr=await(crypt(
 'test@simplenotes','pass',{a:111}
));
log(7,{estr});

obj=await(uncrypt(
 'test@simplenotes','pass',estr
));
log(7,{obj});

}catch(e){alert(e)}})();

log(8,{test:'crypto local store and load func'});
(async()=>{try{
const{
 cryptoLocalStore,cryptoLocalLoad
}=await(customImport('crypto/auth'));

await(cryptoLocalStore(
 'test_','test@simplenotes','pass',{a:111}
));

const obj=await(cryptoLocalLoad(
 'test_','test@simplenotes','pass'
));
log(8,{obj});

}catch(e){alert(e)}})();

};
