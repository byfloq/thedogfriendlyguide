const toggle=document.querySelector('.menu-toggle');const menu=document.querySelector('.mobile-menu');
if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');menu.classList.remove('open');document.body.classList.remove('menu-open')}));}
const signup=document.querySelector('.signup-form');if(signup){signup.addEventListener('submit',event=>{event.preventDefault();const email=event.currentTarget.email;const note=event.currentTarget.querySelector('.form-note');if(!email.checkValidity()){note.textContent='Please enter a valid email address.';email.focus();return}note.textContent='Thank you - you’re on the list.';event.currentTarget.reset()});}
const journal=document.querySelector('#journal');if(journal){const viewAll=journal.querySelector('.section-title>a');if(viewAll)viewAll.href='journal.html';const lead=journal.querySelector('.journal-lead');if(lead)lead.href='journal-slow-sunday-paris.html';const stories=journal.querySelectorAll('.journal-list>a');const storyLinks=['journal-paris-cafe-etiquette.html','journal-copenhagen-weekend.html','journal-barcelona-with-dog.html'];stories.forEach((story,i)=>{if(storyLinks[i])story.href=storyLinks[i]});}
const eventTicket=document.querySelector('.event-ticket');
if(eventTicket){eventTicket.textContent='COMING SOON';eventTicket.removeAttribute('href');eventTicket.removeAttribute('target');eventTicket.removeAttribute('rel');eventTicket.classList.add('disabled');eventTicket.setAttribute('aria-disabled','true');}
const eventNote=document.querySelector('.event-note');if(eventNote)eventNote.textContent='New Better Together gatherings will be announced here soon.';
const eventPoster=document.querySelector('.event-poster');if(eventPoster){eventPoster.removeAttribute('href');eventPoster.removeAttribute('target');eventPoster.removeAttribute('rel');eventPoster.setAttribute('aria-label','Better Together launch preview');eventPoster.setAttribute('aria-disabled','true');const posterImage=eventPoster.querySelector('img');if(posterImage){posterImage.src='/assets/events/better-together-launch-v3.png';posterImage.alt='Latte Morning and Flōq Walking Dog Club event preview in Barcelona';}}
const circle=document.querySelector('.newsletter');if(circle){circle.classList.add('circle-newsletter');const copy=circle.querySelector('div:nth-child(2)');const oldStatus=circle.querySelector('.newsletter-status');if(oldStatus)oldStatus.remove();if(copy){copy.innerHTML='<p class="eyebrow">The Circle</p><h2>Stay in the loop.</h2><p>New city guides, thoughtful places and Better Together gatherings—sent occasionally, and always worth opening.</p><form class="circle-signup"><label class="sr-only" for="circle-email">Email address</label><input id="circle-email" name="email" type="email" autocomplete="email" placeholder="Your email address" required><button type="submit">Join the newsletter</button></form><p class="circle-signup-status" aria-live="polite"></p>';const circleForm=copy.querySelector('.circle-signup');circleForm.addEventListener('submit',event=>{event.preventDefault();const email=circleForm.email;if(!email.checkValidity()){copy.querySelector('.circle-signup-status').textContent='Please enter a valid email address.';email.focus();return}copy.querySelector('.circle-signup-status').textContent='Thank you — welcome to The Circle.';circleForm.reset()})}}
document.querySelectorAll('.desktop-nav a,.mobile-menu a').forEach(link=>{const label=link.textContent.trim().toLowerCase();if(label.includes('guide')||label.includes('guía'))link.href='/all-cities.html';});

// Load the homepage plan-maker progressively, keeping the editorial page useful
// even when JavaScript or the planner data is unavailable.
if(document.querySelector('.home-plan-preview')){
  const plannerStyles=document.createElement('link');
  plannerStyles.rel='stylesheet';
  plannerStyles.href='/make-your-plan.css?v=2';
  document.head.appendChild(plannerStyles);
  const plannerScript=document.createElement('script');
  plannerScript.src='/make-your-plan.js?v=4';
  plannerScript.defer=true;
  document.head.appendChild(plannerScript);
}
