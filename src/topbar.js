const positions={'(Collected Words)':364,'(Interviews)':672,'(Film & Book Studies)':908,'(Research)':1192};
const label=el=>(el.querySelectorAll('p').length?[...el.querySelectorAll('p')].map(p=>p.textContent).join(' '):el.textContent).replace(/\s+/g,' ').trim();
export function alignTopbars(){
 for(const root of document.querySelectorAll('.figma-screen>div')){
  for(const el of [...root.children]){
   const key=label(el);if(!(key in positions))continue;
   el.classList.add('aligned-topbar-link');
   Object.assign(el.style,{position:'absolute',left:positions[key]+'px',top:'16px',right:'auto',bottom:'auto',width:'auto',height:'20px',display:'block',fontFamily:'Inter',fontSize:'16px',fontWeight:'400',lineHeight:'20px',whiteSpace:'nowrap'});
   for(const p of el.querySelectorAll('p')){p.style.lineHeight='20px';p.style.margin='0';}
  }
  const brand=[...root.children].find(el=>label(el)==='A SHAPE OF HER');
  if(brand){brand.classList.add('brand-link');Object.assign(brand.style,{left:'14px',top:'16px',right:'auto',bottom:'auto',height:'20px',lineHeight:'20px'});for(const p of brand.querySelectorAll('p'))p.style.lineHeight='20px';}
  const flourish=root.querySelector(':scope > [data-name="Group"]');
  if(flourish){
   flourish.classList.add('brand-flourish');
   Object.assign(flourish.style,{left:'14px',top:'20.4px',right:'auto',bottom:'auto',width:'11.34px',height:'11.27px'});
   const image=flourish.querySelector('img');if(image)flourish.style.setProperty('--flourish-mask',`url("${image.src}")`);
  }
 }
}
