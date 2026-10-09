// Read from the existing Figma paragraphs; no rewritten or generated content.
const people={mom:'Mom',grandma:'Grandma',aunt1:'Aunt 1',aunt2:'Aunt 2'};
const clean=text=>text.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
const readText=node=>node.nodeName==='BR'?' ':node.nodeType===3?node.textContent:[...node.childNodes].map(readText).join('')+(['P','DIV'].includes(node.nodeName)?' ':'');
const button=(text,label,action)=>{
 const element=document.createElement('button');element.type='button';element.textContent=text;
 element.setAttribute('aria-label',label);element.addEventListener('click',action);return element;
};
export async function initPassageReader(){
 const response=await fetch('content/my-pov.json');if(!response.ok)throw new Error('My POV could not be loaded');
 const insights=await response.json();
 const entries=[];
 for(const key of Object.keys(people)){
  const screen=document.getElementById(key);
  for(const block of screen.querySelectorAll('[data-name^="Question"]')){
   const heading=clean(readText(block.firstElementChild));
   const paragraphs=[...block.children].slice(1).flatMap(child=>child.tagName==='P'?[child]:[...child.querySelectorAll('p')]).map(p=>clean(p.textContent)).filter(Boolean);
   const photo=screen.querySelector('[style*="background-image"]');
   const image=screen.querySelector('img[src$=".png"],img[src$=".jpg"],img[src$=".webp"]');
   const entry={key,heading,paragraphs,photo:key==='film'?'':photo?.style.backgroundImage||(image?`url("${image.src}")`:''),label:people[key]||heading};
   entries.push(entry);
   const open=button('↗','Read '+heading,()=>openReader(entry));
   open.className='passage-open';block.classList.add('passage-source');block.append(open);
  }
 }
 const reader=document.createElement('dialog');reader.className='passage-reader';reader.setAttribute('aria-label','Read passage');
 const photo=document.createElement('div');photo.className='passage-photo';photo.setAttribute('aria-hidden','true');
 const toolbar=document.createElement('div');toolbar.className='passage-toolbar';
 const peopleNav=document.createElement('nav');peopleNav.setAttribute('aria-label','Interviews');
 const back=button('Back','Back',()=>reader.close());toolbar.append(peopleNav,back);
 const text=document.createElement('div');text.className='passage-text';reader.append(photo,toolbar,text);document.body.append(reader);
 let current,origin,showPov=false;
 function openReader(entry){
  origin=document.activeElement;current=entry;showPov=false;renderReader();reader.showModal();back.focus();
 }
 function renderReader(){
  photo.style.backgroundImage=showPov?'':current.photo;peopleNav.replaceChildren();
  if(current.key!=='film'){
   for(const [key,name] of Object.entries(people)){
    const match=entries.find(entry=>entry.key===key&&entry.heading===current.heading);if(!match)continue;
    const tab=button(name,name,()=>{current=match;showPov=false;renderReader();reader.scrollTop=0;});
    tab.setAttribute('aria-pressed',String(!showPov&&key===current.key));peopleNav.append(tab);
   }
  }
  const povTab=button('My POV','My POV',()=>{showPov=true;renderReader();reader.scrollTop=0;});
  povTab.setAttribute('aria-pressed',String(showPov));peopleNav.append(povTab);
  text.replaceChildren();const heading=document.createElement('h2');heading.textContent=current.heading;text.append(heading);
  const questionIndex=entries.filter(entry=>entry.key==='mom').findIndex(entry=>entry.heading===current.heading);
  const insight=insights[questionIndex];
  for(const passage of showPov?insight.paragraphs:current.paragraphs){
   const row=document.createElement('div');row.className='passage-row';
   const paragraph=document.createElement('p');paragraph.textContent=passage;row.append(paragraph);
   text.append(row);
  }
 }
 reader.addEventListener('close',()=>origin?.focus({preventScroll:true}));
 reader.addEventListener('keydown',event=>{
  if(event.target.tagName==='BUTTON'||showPov)return;
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  const matches=entries.filter(entry=>entry.key!=='film'&&entry.heading===current.heading);
  const index=matches.indexOf(current),step=event.key==='ArrowRight'?1:-1;
  current=matches[(index+step+matches.length)%matches.length];renderReader();event.preventDefault();
 });

 addEventListener('hashchange',()=>{if(reader.open)reader.close();});
}
