const navLabels={'(Collected Words)':'COLLECTED WORDS','(Interviews)':'INTERVIEWS','(Film & Book Studies)':'FILM & BOOK STUDIES','(Research)':'RESEARCH'};
const navOrder=Object.keys(navLabels);
const label=el=>(el.querySelectorAll('p').length?[...el.querySelectorAll('p')].map(p=>p.textContent).join(' '):el.textContent).replace(/\s+/g,' ').trim();
export function alignTopbars(){
 for(const root of document.querySelectorAll('.figma-screen>div')){
  const links=[];
  for(const el of [...root.children]){
   const key=label(el);if(!(key in navLabels))continue;
   el.classList.add('aligned-topbar-link');
   const title=el.querySelector('p')||el;
   title.textContent=navLabels[key];
   for(const extra of [...el.querySelectorAll('p')].slice(1))extra.remove();
   links.push({key,el});
  }
  if(links.length){
   const bar=document.createElement('nav');
   bar.className='topnav';
   bar.setAttribute('aria-label','Sections');
   for(const key of navOrder){const item=links.find(link=>link.key===key);if(item)bar.append(item.el);}
   root.append(bar);
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
