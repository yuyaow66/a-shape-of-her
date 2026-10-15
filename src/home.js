import {bookTitles} from './book-studies.js?v=analysis-humanized-1';
import {interviewPeople} from './interview-followups.js?v=feng-qin-humanized-1';
import {mountHomeEyes,mountHomeTrail} from './home-eye.js?v=trail-resume-1';
const home=document.querySelector('.figma-home');
const landing=home.querySelector('[data-name="index"]');
const narrow=matchMedia('(max-width:1100px)');
const fineHover=matchMedia('(hover:hover) and (pointer:fine)');
const menus=[];
landing.classList.add('home-landing');
landing.firstElementChild.classList.add('home-background');

function resize(){
 home.style.setProperty('--home-scale',narrow.matches?1:Math.min(innerWidth/1440,innerHeight/766));
}
addEventListener('resize',resize);
resize();
document.querySelector('[data-node-id="1:411"]')?.remove();

function node(id){return document.querySelector(`[data-node-id="${id}"]`);}
function group(className,elements){
 const container=document.createElement('div');
 container.className=className;
 for(const element of elements)container.append(element);
 landing.append(container);
 return container;
}

const routes={'1:406':'words','1:405':'mom','1:408':'film','1:409':'research'};
const navigation=document.createElement('nav');
navigation.className='home-navigation';
navigation.setAttribute('aria-label','Main navigation');
const navigationLabel=node('1:402');
navigationLabel.classList.add('home-navigation-label');
navigation.append(navigationLabel);
for(const [id,key] of Object.entries(routes)){
 const element=node(id);
 let link=element;
 if(element.tagName!=='A'){
  link=document.createElement('a');
  link.style.cssText=element.style.cssText;
  element.removeAttribute('style');
  element.replaceWith(link);
  link.append(element);
 }
 link.href='original-layout.html#'+key;
 link.classList.add('home-nav-link');
 const entry=document.createElement('div');
 entry.className='home-nav-entry';
 entry.append(link);
 navigation.append(entry);
}
landing.append(navigation);

const about=document.querySelector('#about');
const trigger=node('146:61');
const close=document.querySelector('[data-name="Close About"]');
const aboutSheet=about.firstElementChild;
const aboutCopy=node('8:435');
trigger.classList.add('home-about-trigger');
trigger.setAttribute('aria-label','About this personal research archive');
trigger.setAttribute('aria-expanded','false');
trigger.setAttribute('aria-controls','about');
trigger.querySelector('[role=button]')?.removeAttribute('role');
trigger.querySelector('[tabindex]')?.removeAttribute('tabindex');
trigger.querySelector('p').classList.add('home-about-label');
const shortAboutLabel=document.createElement('span');
shortAboutLabel.className='home-about-short-label';
shortAboutLabel.textContent='(ABOUT)';
shortAboutLabel.setAttribute('aria-hidden','true');
trigger.append(shortAboutLabel);

const smallBrand=node('1:390');
smallBrand.classList.add('home-small-brand');
const smallOrnament=node('1:391');
smallOrnament.classList.add('home-small-ornament');
const brandmark=group('home-brandmark',[smallBrand,smallOrnament]);
const headerRule=node('1:399');
headerRule.classList.add('home-header-rule');
const header=group('home-header',[brandmark,trigger,headerRule]);
landing.insertBefore(header,navigation);

const title=node('1:417');
title.classList.add('home-title');
title.setAttribute('role','heading');
title.setAttribute('aria-level','1');
title.setAttribute('aria-label','A SHAPE OF HER');
title.replaceChildren();
for(const text of ['A SHAPE ','OF HER']){
 const line=document.createElement('span');
 line.className='home-title-line';
 line.setAttribute('aria-hidden','true');
 for(const character of text){
  if(character===' '){line.append(document.createTextNode(character));continue;}
  const letter=document.createElement('span');
  letter.className='home-title-char';
  letter.textContent=character;
  line.append(letter);
 }
 title.append(line);
}
const ornament=node('1:418');
ornament.classList.add('home-title-ornament');
const masthead=group('home-masthead',[title,ornament]);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
 masthead.classList.add('home-title-ready');
 const revealTitle=()=>{
  masthead.classList.add('home-title-revealing');
  title.querySelectorAll('.home-title-char').forEach((letter,index)=>{
   setTimeout(()=>{letter.classList.add('is-visible');if(index===0)ornament.classList.add('is-visible');},250+index*110);
  });
 };
 if('IntersectionObserver' in window){
  const titleObserver=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){revealTitle();titleObserver.disconnect();}
  },{threshold:.18});
  document.fonts.ready.then(()=>titleObserver.observe(title));
 }else revealTitle();
}
const description=node('1:422');
description.classList.add('home-description');
const update=node('178:77');
update.classList.add('home-update');
group('home-footer',[description,update]);

about.classList.add('home-about');
aboutSheet.classList.add('home-about-sheet');
aboutCopy.classList.add('home-about-copy');
about.setAttribute('role','dialog');
about.setAttribute('aria-modal','true');
about.setAttribute('aria-labelledby','home-about-heading');
about.tabIndex=-1;
const aboutHeading=document.createElement('h2');
aboutHeading.id='home-about-heading';
aboutHeading.className='home-about-heading';
aboutHeading.textContent='A Shape of Her';
aboutSheet.prepend(aboutHeading);
close.classList.add('home-about-close');
close.setAttribute('aria-label','Close About');
about.append(close);
close.hidden=about.hidden;
close.style.cssText='position:fixed;left:1378px;top:14px;width:40px;height:40px;display:block;z-index:10';
close.querySelector('div').style.cssText='position:absolute;inset:0';
const closeText=close.querySelector('p');
closeText.textContent='(×)';
closeText.style.fontSize='20px';
closeText.style.left='4px';
closeText.style.top='6px';
closeText.style.right='auto';
closeText.style.bottom='auto';

function closeMenus(){for(const menu of menus)menu.close();}
function closeAbout(){
 about.hidden=true;
 close.hidden=true;
 landing.inert=false;
 document.body.classList.remove('home-about-open');
 trigger.setAttribute('aria-expanded','false');
 trigger.focus();
}
trigger.addEventListener('click',()=>{
 closeMenus();
 about.hidden=false;
 close.hidden=false;
 landing.inert=true;
 document.body.classList.add('home-about-open');
 trigger.setAttribute('aria-expanded','true');
 close.focus();
});
close.addEventListener('click',closeAbout);
about.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const focusable=[...about.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(element=>!element.hidden);
 const first=focusable[0]||about;
 const last=focusable.at(-1)||about;
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});

function toggleMenusWithClick(){return narrow.matches||!fineHover.matches;}
function addMenu({nodeId,label,top,left,items}){
 const trigger=node(nodeId).closest('a');
 const entry=trigger.parentElement;
 const menu=document.createElement('nav');
 menu.className='home-film-menu';
 menu.setAttribute('aria-label',label);
 menu.id='home-menu-'+nodeId.replace(':','-');
 menu.hidden=true;
 menu.style.top=top+'px';
 menu.style.setProperty('--menu-top',top+'px');
 menu.style.left=left+'px';
 for(const item of items){
  const link=document.createElement('a');
  link.textContent=item.label;
  link.href='original-layout.html#'+item.route;
  menu.append(link);
 }
 entry.append(menu);
 trigger.setAttribute('aria-expanded','false');
 trigger.setAttribute('aria-controls',menu.id);
 let closeTimer;
 let restoringFocus=false;
 function closeMenu(restoreFocus=false){
  clearTimeout(closeTimer);
  menu.hidden=true;
  trigger.setAttribute('aria-expanded','false');
  if(restoreFocus){restoringFocus=true;trigger.focus();restoringFocus=false;}
 }
 function openMenu(){
  clearTimeout(closeTimer);
  for(const other of menus)if(other.menu!==menu)other.close();
  menu.hidden=false;
  trigger.setAttribute('aria-expanded','true');
 }
 function toggleMenu(){menu.hidden?openMenu():closeMenu();}
 menus.push({menu,trigger,entry,close:closeMenu});
 trigger.addEventListener('click',event=>{
  if(toggleMenusWithClick()){event.preventDefault();toggleMenu();}
 });
 trigger.addEventListener('keydown',event=>{
  if(toggleMenusWithClick()&&event.key===' '){event.preventDefault();toggleMenu();}
  if(event.key==='ArrowDown'){event.preventDefault();openMenu();menu.firstElementChild.focus();}
 });
 trigger.addEventListener('mouseenter',()=>{if(!toggleMenusWithClick())openMenu();});
 trigger.addEventListener('focus',()=>{if(!toggleMenusWithClick()&&!restoringFocus)openMenu();});
 trigger.addEventListener('mouseleave',()=>{if(!toggleMenusWithClick())closeTimer=setTimeout(closeMenu,180);});
 menu.addEventListener('mouseenter',()=>clearTimeout(closeTimer));
 menu.addEventListener('mouseleave',()=>{if(!toggleMenusWithClick())closeTimer=setTimeout(closeMenu,120);});
 menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
 entry.addEventListener('focusout',event=>{if(!entry.contains(event.relatedTarget))closeMenu();});
}
addMenu({nodeId:'1:408',label:'Film & Book Studies',top:264,left:340,items:[
 {label:'The Bold, the Corrupt, and the Beautiful',route:'film/0'},
 {label:'Raise the Red Lantern',route:'film/1'},
 {label:'In the Mood for Love',route:'film/2'},
 ...bookTitles.map((label,index)=>({label,route:'film/'+(index+3)})),
 {label:'Connecting to Reality',route:'film/8'}
]});
addMenu({nodeId:'1:405',label:'Interviews',top:214,left:255,items:Object.entries(interviewPeople).map(([route,label])=>({label,route}))});

function syncLayout(){
 resize();
 closeMenus();
 for(const {trigger} of menus){
  if(toggleMenusWithClick())trigger.setAttribute('role','button');
  else trigger.removeAttribute('role');
 }
}
narrow.addEventListener('change',syncLayout);
fineHover.addEventListener('change',syncLayout);
syncLayout();
document.addEventListener('pointerdown',event=>{
 for(const entry of menus)if(!entry.menu.hidden&&!entry.entry.contains(event.target))entry.close();
});
addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 if(!about.hidden){event.preventDefault();closeAbout();return;}
 const open=menus.find(entry=>!entry.menu.hidden);
 if(open){event.preventDefault();open.close(true);}
});

mountHomeEyes(landing);

mountHomeTrail();
