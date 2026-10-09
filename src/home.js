const home=document.querySelector('.figma-home');
function resize(){home.style.setProperty('--home-scale',Math.min(innerWidth/1440,innerHeight/766));}
addEventListener('resize',resize);resize();
const routes={'1:405':'mom','1:406':'words','1:408':'film','1:409':'research'};
for(const [id,key] of Object.entries(routes)){
 const el=document.querySelector(`[data-node-id="${id}"]`);
 if(el.tagName==='A')el.href='original-layout.html#'+key;
 else{const a=document.createElement('a');a.href='original-layout.html#'+key;a.style.cssText=el.style.cssText;el.removeAttribute('style');el.replaceWith(a);a.append(el);}
}
const about=document.querySelector('#about'),trigger=document.querySelector('[data-node-id="146:61"]'),close=document.querySelector('[data-name="Close About"]');
close.setAttribute('aria-label','Close About');
// Give Figma's display:contents close control a real hit area at the same coordinates.
home.append(close);close.hidden=about.hidden;
close.style.cssText='position:absolute;left:1378px;top:14px;width:40px;height:40px;display:block;z-index:10';
close.querySelector('div').style.cssText='position:absolute;inset:0';
const closeText=close.querySelector('p');closeText.textContent='(×)';closeText.style.fontSize='20px';closeText.style.left='4px';closeText.style.top='6px';closeText.style.right='auto';closeText.style.bottom='auto';
trigger.querySelector('[role=button]')?.removeAttribute('role');
trigger.querySelector('[tabindex]')?.removeAttribute('tabindex');
trigger.addEventListener('click',()=>{about.hidden=false;close.hidden=false;close.focus();});
close.addEventListener('click',()=>{about.hidden=true;close.hidden=true;trigger.focus();});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!about.hidden)close.click();});

// Figma film overlay geometry; Interviews uses the same interaction by request.
const menus=[];
function addMenu({nodeId,label,top,items}){
 const trigger=document.querySelector(`a:has([data-node-id="${nodeId}"]),a[data-node-id="${nodeId}"]`);
 const menu=document.createElement('nav');menu.className='home-film-menu';menu.setAttribute('aria-label',label);
 menu.id='home-menu-'+nodeId.replace(':','-');menu.hidden=true;
 menu.style.top=top+'px';menu.style.height=(items.length*64)+'px';
 const height=items.length*64;
 // One continuous outline keeps the rounded bridge and menu free of seams.
 menu.style.setProperty('--menu-outline',`path("M 348 0 H 812 Q 820 0 820 8 V ${height-8} Q 820 ${height} 812 ${height} H 348 Q 340 ${height} 340 ${height-8} V 103 Q 340 95 332 95 H 8 Q 0 95 0 87 V 57 Q 0 49 8 49 H 332 Q 340 49 340 41 V 8 Q 340 0 348 0 Z")`);
 const menuLabel=document.createElement('span');menuLabel.className='home-film-menu-label';menuLabel.textContent=label;menu.append(menuLabel);
 for(const [i,item] of items.entries()){
  const link=document.createElement('a');link.textContent=item.label;link.href='original-layout.html#'+item.route;link.style.top=(i*64)+'px';menu.append(link);
 }
 home.append(menu);trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
 function closeMenu(){menu.hidden=true;trigger.setAttribute('aria-expanded','false');}
 function openMenu(){for(const other of menus)other.close();menu.hidden=false;trigger.setAttribute('aria-expanded','true');}
 menus.push({menu,trigger,close:closeMenu});
 trigger.addEventListener('mouseenter',openMenu);trigger.addEventListener('focus',openMenu);
 trigger.addEventListener('mouseleave',e=>{if(!menu.contains(e.relatedTarget))closeMenu();});
 menu.addEventListener('mouseleave',closeMenu);
 home.addEventListener('focusout',e=>{if(e.relatedTarget&&!menu.contains(e.relatedTarget)&&e.relatedTarget!==trigger)closeMenu();});
}
addMenu({nodeId:'1:408',label:'Film Studies',top:229,items:[
 {label:'The Bold, the Corrupt, and the Beautiful',route:'film/0'},
 {label:'Raise the Red Lantern',route:'film/1'},
 {label:'In the Mood for Love',route:'film/2'},
 {label:'Connecting to Reality',route:'reflection'}
]});
addMenu({nodeId:'1:405',label:'Interviews',top:179,items:[
 {label:'Mom',route:'mom'},{label:'Grandma',route:'grandma'},
 {label:'Aunt 1',route:'aunt1'},{label:'Aunt 2',route:'aunt2'},
]});
addEventListener('keydown',e=>{if(e.key==='Escape'){const open=menus.find(m=>!m.menu.hidden);if(open){open.close();open.trigger.focus();open.close();}}});
