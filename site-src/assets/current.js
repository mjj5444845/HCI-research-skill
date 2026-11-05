document.querySelectorAll('[data-flow-demo]').forEach(root=>{
 const tabs=[...root.querySelectorAll('[data-flow-tab]')];
 const panels=[...root.querySelectorAll('[data-flow-panel]')];
 const select=(tab,focus=false)=>{
  tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
  panels.forEach(p=>p.hidden=p.dataset.flowPanel!==tab.dataset.flowTab);
  if(focus)tab.focus();
 };
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>select(tab));
  tab.addEventListener('keydown',event=>{
   let next;
   if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;
   else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+tabs.length-1)%tabs.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=tabs.length-1;
   if(next===undefined)return;event.preventDefault();select(tabs[next],true);
  });
 });
});
