import {filterGroups,emptyFilters,matchesWord,toggleFilter} from './words-filter.js';
export async function initWords(){
 const screen=document.querySelector('#words'),root=screen?.firstElementChild;if(!root)return;
 const response=await fetch('content/words.json');if(!response.ok)throw new Error('Paper assets could not be loaded');
 const cards=await response.json();
 // Replace only the six prototype strips and their labels; keep Figma's header and filter panel.
 for(const child of [...root.children]){const id=child.dataset.nodeId||'';if(id.startsWith('40:')||child.dataset.name==='Rectangle')child.remove();}
 const gallery=document.createElement('div');gallery.className='words-gallery';gallery.setAttribute('role','region');gallery.setAttribute('aria-label','Collected Words');gallery.tabIndex=0;
 const grid=document.createElement('div');grid.className='words-grid';gallery.append(grid);root.append(gallery);
 const panel=screen.querySelector('[data-node-id="92:99"]');panel.id='words-filter-panel';
 const closeFilters=document.createElement('button');closeFilters.type='button';closeFilters.className='words-filter-close';closeFilters.textContent='(×)';closeFilters.setAttribute('aria-label','Close filters');
 const openFilters=document.createElement('button');openFilters.type='button';openFilters.className='words-filter-open';openFilters.textContent='Filter';openFilters.hidden=true;openFilters.setAttribute('aria-controls',panel.id);openFilters.setAttribute('aria-expanded','true');
 root.append(closeFilters,openFilters);
 function setFiltersClosed(closed){
  const visible=[...grid.children].find(card=>!card.hidden&&card.getBoundingClientRect().bottom>gallery.getBoundingClientRect().top);
  const before=visible?.getBoundingClientRect().top;
  panel.hidden=closed;closeFilters.hidden=closed;openFilters.hidden=!closed;
  screen.classList.toggle('filters-closed',closed);openFilters.setAttribute('aria-expanded',String(!closed));
  if(visible)gallery.scrollTop+=visible.getBoundingClientRect().top-before;
  (closed?openFilters:closeFilters).focus({preventScroll:true});
 }
 closeFilters.addEventListener('click',()=>setFiltersClosed(true));
 openFilters.addEventListener('click',()=>setFiltersClosed(false));

 const viewer=document.createElement('dialog');viewer.className='word-viewer';viewer.setAttribute('aria-label','Paper');
 const enlarged=document.createElement('img');enlarged.draggable=false;
 const paperFlip=document.createElement('button');paperFlip.type='button';paperFlip.className='word-viewer-paper';paperFlip.append(enlarged);
 const actions=document.createElement('div');actions.className='word-viewer-actions';
 const flip=document.createElement('button');flip.type='button';flip.textContent='Flip to see Chinese';
 const back=document.createElement('button');back.type='button';back.textContent='Back';
 actions.append(flip,back);viewer.append(paperFlip,actions);document.body.append(viewer);
 let opened=null,language='en',returnTo=null;
 function display(){enlarged.src=opened.images[language];enlarged.alt=opened.text[language];enlarged.lang=language==='zh'?'zh-CN':'en';flip.textContent=language==='en'?'Flip to see Chinese':'Flip to see English';paperFlip.setAttribute('aria-label',flip.textContent);}
 function open(card,button){opened=card;language='en';returnTo=button;display();viewer.showModal();back.focus();}
 function flipPaper(){language=language==='en'?'zh':'en';display();}
 flip.addEventListener('click',flipPaper);paperFlip.addEventListener('click',flipPaper);
 back.addEventListener('click',()=>viewer.close());
 viewer.addEventListener('close',()=>returnTo?.focus({preventScroll:true}));
 addEventListener('hashchange',()=>{if(viewer.open)viewer.close();});
 const entries=[];
 for(const card of cards){const lang='en';
  const article=document.createElement('article');article.className='word-paper';article.dataset.wordId=card.id;article.dataset.language=lang;
  article.dataset.lifeStages=card.lifeStages.join('|');article.dataset.pressure=card.pressure.join('|');article.dataset.themes=card.themes.join('|');
  const image=document.createElement('img');image.src=card.images[lang];image.alt=card.text[lang];image.loading='lazy';image.decoding='async';image.draggable=false;
  const metadata=document.createElement('div');metadata.className='word-metadata';
  const stage=document.createElement('p');stage.className='word-stage';stage.textContent=String(card.number).padStart(2,'0')+' / '+card.lifeStages.join(' / ');
  const pressure=document.createElement('p');pressure.className='word-pressure';pressure.textContent=card.pressure.join(' / ');
  const openButton=document.createElement('button');openButton.type='button';openButton.className='word-open';openButton.setAttribute('aria-label',card.text.en);openButton.setAttribute('aria-haspopup','dialog');openButton.append(image);openButton.addEventListener('click',()=>open(card,openButton));
  metadata.append(stage,pressure);article.append(openButton,metadata);grid.append(article);entries.push({card,article});
 }
 let filters=emptyFilters();const buttons=[];
 for(const chip of screen.querySelectorAll('[data-name="Filter chip"]')){
  const label=chip.textContent.trim(),key=Object.keys(filterGroups).find(key=>filterGroups[key].includes(label));if(!key)continue;
  const button=document.createElement('button');button.type='button';button.className='word-filter';button.style.cssText=chip.style.cssText;button.dataset.filterGroup=key;button.dataset.filterValue=label;button.setAttribute('aria-pressed','false');
  button.setAttribute('aria-controls','collected-word-grid');while(chip.firstChild)button.append(chip.firstChild);chip.replaceWith(button);buttons.push(button);
  button.addEventListener('click',()=>{toggleFilter(filters,key,label);render();});
 }
 grid.id='collected-word-grid';
 function render(){
  for(const {card,article} of entries)article.hidden=!matchesWord(card,filters);
  for(const button of buttons){const selected=filters[button.dataset.filterGroup].has(button.dataset.filterValue);button.setAttribute('aria-pressed',String(selected));button.style.background=selected?'#f3a5de':'#35253f';for(const p of button.querySelectorAll('p'))p.style.color=selected?'#35253f':'#f0dbe8';}
  gallery.scrollTop=0;
 }
 const reset=screen.querySelector('[data-node-id="40:98"]');reset.addEventListener('click',()=>{filters=emptyFilters();render();});render();
}
