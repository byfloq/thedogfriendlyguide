(()=>{
  const decks={
    paris:{title:'Paris, Hidden in Plain Sight',kicker:'City stories',image:'assets/guides/paris-day-dog-v2.jpg',cards:[
      ['Why are Paris street signs blue?','The navy-and-white enamel signs became standard in the 19th century. Many also reveal the arrondissement beneath the street name.'],
      ['What is a Wallace fountain?','A public drinking fountain funded by Sir Richard Wallace after 1870. More than one hundred still offer free water across Paris.'],
      ['Why are the bouquiniste boxes green?','The Seine’s booksellers use regulated green boxes that close into compact containers and open into tiny riverside shops.'],
      ['What does the “bis” in an address mean?','It means a second building shares the same street number—the French equivalent of adding an A or B.'],
      ['Why do some Paris façades look so similar?','Haussmann-era rules created their familiar rhythm: aligned balconies, pale stone and consistent building heights.'],
      ['Where can you still find Paris vineyards?','Montmartre has its own tiny working vineyard, Clos Montmartre, tucked behind the Musée de Montmartre.']
    ]},
    dog:{title:'Read Your Dog',kicker:'Dog knowledge',image:'assets/places/grave-regular-dogs.jpg',cards:[
      ['What does a relaxed dog look like?','Look for a soft face, loose body, natural ears and easy breathing. A wagging tail alone does not always mean relaxed.'],
      ['Why does your dog stop at every corner?','Scent marks carry information about other dogs and recent activity. A corner can be a canine neighbourhood noticeboard.'],
      ['Is yawning always about being tired?','Not always. In context, yawning can help a dog release tension or signal that a situation feels uncomfortable.'],
      ['What can a nose lick tell you?','A quick nose lick can be ordinary grooming, but repeated lip licking may be a subtle sign that your dog needs more space.'],
      ['Why is sniffing so tiring?','Processing scent is concentrated mental work. A slow sniffing walk can be as satisfying as a much longer brisk walk.'],
      ['Is panting always about heat?','Dogs pant to cool down, but also when excited, stressed or uncomfortable. Read it together with their posture and context.']
    ]},
    cafe:{title:'The Café Companion',kicker:'Together in the city',image:'assets/places/clove-friends-hq.jpg',cards:[
      ['Which café table is easiest for your dog?','An edge table with room underneath, away from the entrance and the busiest service route, usually makes settling easier.'],
      ['What should happen before you sit down?','A short sniffing walk and a toilet break can make a calm café visit much more likely.'],
      ['Where should the lead be?','Keep it short enough to avoid the service path, attached to you rather than furniture, with your dog comfortably beside you.'],
      ['How do you build a settling ritual?','Use the same mat or cue, offer water and quietly reward the first moments of calm. Repetition makes the place predictable.'],
      ['When is it better to leave?','If your dog cannot settle, repeatedly scans the room or stops taking food, a peaceful exit is thoughtful—not a failure.'],
      ['What makes a place genuinely dog-friendly?','Space, water and a warm welcome matter, but so does staff who understand dogs without expecting every dog to socialise.']
    ]},
    together:{title:'Little Paris Challenges',kicker:'Play together',image:'assets/journal-slow-sunday-persona-v1.jpg',cards:[
      ['Take a five-minute sniffari.','For five unhurried minutes, let your dog choose what to investigate. Follow their curiosity instead of a destination.'],
      ['Find the quietest street.','At the next junction, choose the calmer direction. Notice together how sound and body language change.'],
      ['Spot three shades of Paris green.','Look for fountains, park chairs and shopfronts. Let the search slow your walk rather than speed it up.'],
      ['Share a bench for ten minutes.','Pause without asking your dog to perform. Watch the city pass and notice what captures each of your attention.'],
      ['Let your dog choose the next turn.','At two safe crossings, follow the direction your dog investigates first and see where their route takes you.'],
      ['Make one beautiful memory.','Choose a quiet background, get down to your dog’s eye level and photograph the moment—not a perfect pose.']
    ]}
  };
  const library=document.querySelector('.deck-library'),deckGrid=document.querySelector('.library-decks'),game=document.querySelector('.game'),card=document.querySelector('.swipe-card:not(.card-shadow)');
  let active=null,index=0,flipped=false,startX=0,dragX=0,dragging=false;
  deckGrid.innerHTML=Object.entries(decks).map(([id,d],i)=>`<a class="library-deck" href="?deck=${id}" data-deck="${id}"><div class="library-deck-image"><img src="${d.image}" alt="" loading="lazy"><span class="deck-index">0${i+1}</span></div><h2>${d.title}</h2><div class="deck-meta"><span>${d.cards.length} cards</span><span>4–6 min</span><span>Swipe & reveal</span></div></a>`).join('');

  const savedIndex=id=>{try{return Math.min(Number(localStorage.getItem(`floq:learn:${id}`))||0,decks[id].cards.length-1)}catch{return 0}};
  const save=()=>{try{localStorage.setItem(`floq:learn:${active}`,String(index))}catch{}};
  const render=()=>{const d=decks[active],[question,answer]=d.cards[index];flipped=false;card.className='swipe-card';card.style.transform='';card.querySelector('.card-label').textContent=d.kicker;card.querySelector('.card-question').textContent=question;card.querySelector('.card-answer').textContent=answer;document.querySelector('.game-kicker').textContent=d.kicker;document.querySelector('.game-title').textContent=d.title;document.querySelector('.game-current').textContent=String(index+1).padStart(2,'0');document.querySelector('.game-total').textContent=String(d.cards.length).padStart(2,'0');document.querySelector('.progress-track span').style.width=`${((index+1)/d.cards.length)*100}%`;save()};
  const openDeck=(id,push=true)=>{if(!decks[id])return;active=id;index=savedIndex(id);library.hidden=true;game.hidden=false;if(push)history.pushState({deck:id},'',`?deck=${id}`);render();window.scrollTo({top:0,behavior:'smooth'})};
  const closeDeck=(push=true)=>{active=null;game.hidden=true;library.hidden=false;if(push)history.pushState({},'',location.pathname);window.scrollTo({top:0,behavior:'smooth'})};
  const move=direction=>{if(!active)return;card.classList.add(direction<0?'exit-left':'exit-right');setTimeout(()=>{const length=decks[active].cards.length;index=(index+direction+length)%length;render()},330)};
  const toggle=()=>{flipped=!flipped;card.classList.toggle('flipped',flipped);card.setAttribute('aria-label',flipped?'Continue to next question':'Reveal answer')};

  deckGrid.addEventListener('click',e=>{const link=e.target.closest('[data-deck]');if(!link)return;e.preventDefault();openDeck(link.dataset.deck)});
  card.addEventListener('click',()=>{if(Math.abs(dragX)>8)return;if(flipped)move(1);else toggle()});
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flipped?move(1):toggle()}if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)});
  card.addEventListener('pointerdown',e=>{if(flipped)return;dragging=true;startX=e.clientX;dragX=0;card.setPointerCapture(e.pointerId);card.classList.add('dragging')});
  card.addEventListener('pointermove',e=>{if(!dragging)return;dragX=e.clientX-startX;card.style.transform=`translateX(${dragX}px) rotate(${dragX/28}deg)`});
  const endDrag=()=>{if(!dragging)return;dragging=false;card.classList.remove('dragging');if(Math.abs(dragX)>90)move(dragX>0?1:-1);else{card.style.transform='';dragX=0}};
  card.addEventListener('pointerup',endDrag);card.addEventListener('pointercancel',endDrag);
  document.querySelector('.previous').addEventListener('click',()=>move(-1));document.querySelector('.next').addEventListener('click',()=>move(1));document.querySelector('.back-to-sets').addEventListener('click',()=>closeDeck());document.querySelector('.restart').addEventListener('click',()=>{index=0;render()});
  addEventListener('popstate',()=>{const id=new URLSearchParams(location.search).get('deck');id&&decks[id]?openDeck(id,false):closeDeck(false)});
  const requested=new URLSearchParams(location.search).get('deck');if(requested&&decks[requested])openDeck(requested,false);
})();
