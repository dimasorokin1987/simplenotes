import{$,h,p}from'utils';
export const log=(id,obj,lg,bd,v)=>{
 lg=$('#log_'+id);
 if(!lg){
  lg=h('div');
  lg.setAttribute('id','log_'+id);
  lg.style.borderBottom
  ='1px dashed black';
  bd=$('body');
  if(!bd){
   bd=h('body');
   p(document.documentElement,bd);
  }
  bd.appendChild(lg);
 }
 v=Object.values(obj)[0];
 lg.innerHTML+=(
  (v===null
  ?'[object]'
  :typeof(v)==='object'
  ?`[object ${v.constructor.name}]`
  :`[${typeof(v)}]`)
  +JSON.stringify(obj)
  +'<br>'
 );
};
