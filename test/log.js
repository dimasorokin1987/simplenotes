import{create}from'utils';
import{log}from'log';
export const testLog=(a,b,c,d,c1,d1,buf,dv,bytes)=>{
 log(0,{test:'log function'});
 log(0,{a:()=>1});
 log(0,{b:'tuio'});
 log(0,{c:[]});
 log(0,{d:{}});
 log(0,{c1:[111]});
 log(0,{d1:{a:77}});
 buf=create(ArrayBuffer,[2]);
 log(0,{buf});
 dv=create(DataView,[buf]);
 log(0,{dv});
 bytes=create(Uint8Array,[buf]);
 log(0,{bytes});
 log(0,{n:null});
 log(0,{u:undefined});
 log(0,{n:8});
};
