const stage=document.querySelector('.figma-stage');
const screens=[...document.querySelectorAll('.figma-screen')];
const routes={'A SHAPE OF HER':'index.html','(Collected Words)':'#words','(Interviews)':'#mom','(Film & Book Studies)':'#film','(Research)':'#research','Mom':'#mom','Grandma':'#grandma','Aunt 1':'#aunt1','Aunt 2':'#aunt2','Summary':'#summary','Connecting to Reality':'#reflection'};
const filmTitles=['The Bold, the Corrupt, and the Beautiful','Raise the Red Lantern','In the Mood for Love'];
const normalize=s=>s.replace(/\s+/g,' ').trim();
const textOf=el=>normalize(el.querySelectorAll('p').length?[...el.querySelectorAll('p')].map(p=>p.textContent).join(' '):el.textContent);
for(const screen of screens){
 for(const tab of screen.querySelectorAll('[data-name="Interview navigation — left tabs"]>div')){
  const target=routes[textOf(tab)];if(!target)continue;
  const link=document.createElement('a');
  for(const attr of tab.attributes)link.setAttribute(attr.name,attr.value);
  link.href=target;link.setAttribute('aria-current','page');
  while(tab.firstChild)link.append(tab.firstChild);tab.replaceWith(link);
 }
 for(const el of screen.querySelectorAll('a,p')){
  const text=textOf(el);let target=routes[text];
  if(el.tagName==='P' && el.closest('a'))continue;
  if(el.tagName==='P' && !text.startsWith('('))continue;
  if(target && !el.closest('[data-name*="content"]')){
   if(el.tagName==='A')el.href=target;
   else {const a=document.createElement('a');a.href=target;a.style.cssText=el.style.cssText;el.removeAttribute('style');el.replaceWith(a);a.append(el);}
  }
 }
 for(const button of screen.querySelectorAll('button')){const i=filmTitles.indexOf(textOf(button));if(i>=0)button.addEventListener('click',()=>{location.hash='film/'+i;});}
 for(const el of screen.querySelectorAll('a')){
  const title=textOf(el);const i=filmTitles.indexOf(title);
  if(i>=0){el.href='#film/'+i;el.addEventListener('click',()=>requestAnimationFrame(()=>{
   const content=document.querySelector('#film [data-name="Films — scrollable studies"]');
   const block=document.querySelectorAll('#film [data-name^="Question"]')[i];
   if(block)content.scrollTop=block.offsetTop;
  }));}
 }
 for(const link of screen.querySelectorAll('[data-name="Interview navigation — left tabs"]>a')){
  if(!/^#(mom|grandma|aunt1|aunt2|summary)$/.test(link.getAttribute('href')||''))continue;
  link.addEventListener('click',()=>{
   const destination=document.querySelector(link.getAttribute('href'));
   for(const panel of destination.querySelectorAll('[data-name*="scrollable"]'))panel.scrollTop=0;
  });
 }
}
// Remove the Summary entry from interview navigation.
for(const link of document.querySelectorAll('[data-name="Interview navigation — left tabs"]>a[href="#summary"]'))link.remove();
for(const block of document.querySelectorAll('#film [data-name^="Question"]')){
 const label=document.createElement('p');label.className='movie-link-coming-soon';label.textContent='movie link coming soon ↗';block.append(label);
}
function resize(){const s=Math.min(innerWidth/1440,innerHeight/766);stage.style.transform=`scale(${s})`;stage.style.left=`${(innerWidth-1440*s)/2}px`;stage.style.top=`${(innerHeight-766*s)/2}px`;stage.style.setProperty('--film-height',`${766+(innerHeight-766*s)/2/s}px`);}
function show(){const [key,filmIndex]=location.hash.slice(1).split('/');for(const s of screens)s.hidden=s.id!==key;if(!screens.some(s=>s.id===key))screens[0].hidden=false;
 for(const button of document.querySelectorAll('#film [data-name="Interview navigation — left tabs"]>button')){
  const selected=filmTitles.indexOf(textOf(button))===Number(filmIndex||0);
  if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
 }
 if(key==='film'&&filmIndex){requestAnimationFrame(()=>{const content=document.querySelector('#film [data-name="Films — scrollable studies"]');const blocks=[...document.querySelectorAll('#film [data-name^="Question"]')];const block=blocks[Number(filmIndex)];if(block)content.scrollTop=block.offsetTop;});}}
addEventListener('resize',resize);addEventListener('hashchange',show);resize();show();
import {initWords} from './words.js';
initWords().catch(error=>console.error(error));
import {alignTopbars} from './topbar.js';
alignTopbars();
import {initPassageReader} from './passage-reader.js';
initPassageReader().catch(error=>console.error(error));
