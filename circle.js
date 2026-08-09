(function(){
  const list=document.querySelector('.circle-idea-list');
  if(!list)return;
  const ideas=[...list.querySelectorAll('.circle-idea')];
  const empty=document.querySelector('.circle-empty');
  function rankVisible(){let rank=1;ideas.filter(i=>!i.hidden).sort((a,b)=>Number(b.dataset.votes)-Number(a.dataset.votes)).forEach(item=>{item.querySelector('.circle-rank').textContent=String(rank++).padStart(2,'0');list.appendChild(item)})}
  document.querySelectorAll('.circle-filter').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.circle-filter').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button))});
    const filter=button.dataset.filter;let shown=0;
    ideas.forEach(item=>{item.hidden=filter!=='all'&&item.dataset.category!==filter;if(!item.hidden)shown++});
    empty.style.display=shown?'none':'block';rankVisible();
  }));
  document.querySelectorAll('.circle-vote').forEach(button=>button.addEventListener('click',()=>{
    const item=button.closest('.circle-idea');const voted=button.getAttribute('aria-pressed')==='true';
    item.dataset.votes=String(Number(item.dataset.votes)+(voted?-1:1));button.setAttribute('aria-pressed',String(!voted));button.classList.toggle('voted',!voted);button.firstChild.textContent=voted?'♡ ':'♥ ';button.querySelector('span').textContent=item.dataset.votes;rankVisible();
  }));
  document.querySelectorAll('.circle-poll-option').forEach(button=>button.addEventListener('click',()=>document.querySelectorAll('.circle-poll-option').forEach(item=>item.classList.toggle('chosen',item===button))));
  const modal=document.querySelector('.circle-modal');const openButton=document.querySelector('.circle-new-idea');const closeButton=document.querySelector('.circle-modal-close');const form=document.querySelector('.circle-idea-form');
  function closeModal(){modal.hidden=true;openButton.focus()}
  openButton.addEventListener('click',()=>{modal.hidden=false;modal.querySelector('input').focus()});closeButton.addEventListener('click',closeModal);modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)closeModal()});
  form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const subject=encodeURIComponent('The Circle — New community idea');const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCategory: ${data.get('category')}\n\nIdea:\n${data.get('idea')}`);window.location.href=`mailto:byfloq@gmail.com?subject=${subject}&body=${body}`});
})();
