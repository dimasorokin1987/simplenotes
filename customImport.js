let customizers=[
t=>t.replace(
  /import *{([^}]+)} *from *['"]([^'"]+)['"]/g,
  (a,b,c)=>{
   b=b.replace(/ as /g,':');
   return(
    `const{${b}}=await(`
     +`customImport('${c}')`
    +`)`
   );
  }
 ),
 t=>t.replace(
  /import *([^ ]+) *from *['"]([^'"]+)['"]/g,
  (a,b,c)=>(
   `const{default:${b}}=await(`
    +`customImport('${c}')`
   +`)`
  )
 ),
 t=>t.replace(
  /export +const +([^ =]+)/g,
  (a,c)=>`const ${c}=arExport['${c}']`
 ),
 t=>t.replace(
  /export +(function) +([^ (]+)/g,
  (a,b,c)=>(
   `const ${c}=arExport['${c}']=${b}`
  )
 ),
 t=>t.replace(
  /export *{([^}]+)}/g,
  (a,b)=>(
   b.split(',')
   .map(s=>{
    let[v,k=v]=s.split(' as ');
    v=v.trim();
    k=k.trim();
    return(
     `arExport['${k}']=${v};\n`
    );
   }).join('')
  )
 ),
 t=>t.replace(
  /^ *export +(default)([ ([{])/mg,
  (a,b,c)=>`arExport['${b}']=${c}`
 )
];
const customize=t=>{
 t=customizers.reduce((t,c)=>c(t),t);
 t=`export const arExport=(async(
  arExport={},
  customImport=
  globalThis.customImport
 )=>{
  ${t}
  return(arExport);
 })()`;
 return(t);
};

const fromScript=(nm,el,t)=>{
 el=document.querySelector(
  `script[type='import']`
  +`[name='${nm}']`
 );
 if(!el)return(null);
 t=el.innerHTML;
 return(t);
};

let importMap={};
const fromMap=async(id,url,f,t)=>{
 url=importMap[id];
 if(!url)return(null);
 f=await(fetch(url));
 t=await(f.text());
 return(t);
};

const fromFile=async(filename,f,t)=>{
 if(!filename.startsWith('./'))
 {return(null)}
 f=await(fetch(filename));
 t=await(f.text());
 return(t);
};

let resolvers=[
 fromScript,fromMap,fromFile
];
const resolve=async(id)=>(await(
 Promise.all(resolvers
  .map(async(f)=>await(f(id)))
 )
)).find(t=>!!t);

//not working properly when parallel
let cached={};
const memoize=func=>async(id)=>{
 if(!cached[id]){
  cached[id]=await(func(id));
 }
 return(cached[id]);
};

const pseudoImportText=async(t,m64,m)=>{
 m64='data:text/javascript;base64,';
 m64+=btoa(t);
 m=await(import(m64));
 return(m);
};

const appendate=f=>{
 f.appendResolvers=arr=>{
  resolvers.push(...arr);
 };
 f.appendCustomizers=arr=>{
  customizers.push(...arr);
 };
 f.assignImportMap=imp=>{
  Object.assign(importMap,imp);
 };
 return(f);
};
export const customImport=appendate(memoize(
 async(id,url,f,t,m,arrExport)=>{
  t=await(resolve(id));
  t=customize(t);
  m=await(pseudoImportText(t));
  arrExport=await(m.arExport);
  return(arrExport);
 }
));
