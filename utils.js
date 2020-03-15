export const create=(obj,args=[])=>Reflect.construct(obj,args);
export const $=document.querySelector.bind(document);
export const h=document.createElement.bind(document);
export const p=(a,b)=>a.appendChild(b);
export const wait=tm=>create(Promise,[
 res=>setTimeout(res,tm)
]);
export const pipe=async(v,arr)=>(
 await(arr.reduce(
  async(p,f)=>await(f(await(p)))
  ,Promise.resolve(v)
 ))
);
export const throttle=(func,tm=0,{
 beforeEach=()=>{},
 afterLast=()=>{}
},to)=>arg=>{
 beforeEach(arg);
 clearTimeout(to);
 to=setTimeout(async(arg)=>{
  await(func(arg));
  afterLast(arg);
 },tm,arg);
};
export const evalViaScript=src=>(
 create(Promise,[(
  res,rej,bd,script
 )=>{
  bd=$('body');
  script=h('script');
  script.src=src;
  script.onload=res;
  p(bd,script);
 }])
);
