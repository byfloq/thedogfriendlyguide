(()=>{
  const anchor=document.querySelector('.home-plan-preview');
  if(!anchor||document.querySelector('.make-plan'))return;

  const routes={
    montmartre:{
      morning:{title:'A Slow Morning in Montmartre',places:['Clove Coffee Shop','Simple Coffee','Animal Particulier','Coloré Paris']},
      afternoon:{title:'A Soft Afternoon Above Paris',places:['Noir Montmartre','Rue des Abbesses','Animal Particulier','Coloré Paris']},
      evening:{title:'Golden Light in Montmartre',places:['Simple Coffee','Quiet streets around Lamarck','Sacré-Cœur overlook','Coloré Paris']}
    },
    marais:{
      morning:{title:'A Gentle Morning in Le Marais',places:['Grave Café','Square du Temple','Le Bone Appart','Café Charlot']},
      afternoon:{title:'An Afternoon in Le Marais',places:['Partisan Café','The Broken Arm','Le Bone Appart','Jaja Paris']},
      evening:{title:'An Early Evening in Le Marais',places:['Merlo Café','Place des Vosges','Le Bone Appart','Jaja Paris']}
    },
    leftbank:{
      morning:{title:'A Left Bank Morning Together',places:['Niwa','Quiet streets around Vaneau','Petsochic','Season Paris']},
      afternoon:{title:'An Unhurried Left Bank Afternoon',places:['Nami Coffee','Saint-Germain streets','Petsochic','Tekés']},
      evening:{title:'A Golden Hour Along the Seine',places:['Nami Coffee','The riverside bookstalls','A slow Seine walk','Tekés']}
    }
  };
  const guideCards=[...anchor.querySelectorAll('.guide-preview-card')];
  const launcher=guideCards[3];
  if(!launcher)return;
  launcher.classList.add('guide-plan-maker-card');
  launcher.innerHTML=`<a class="guide-plan-maker-launch" href="make-your-plan.html"><span class="guide-plan-maker-image"><img src="assets/make-your-plan-editorial-v1.png" alt="A Paris map with movable destination cards for creating a personal day"><i>Made for you</i></span><strong>Build your own plan</strong><span class="guide-preview-tags"><span>Your time</span><span>Your area</span><span>Your mood</span></span><small>Create a thoughtful Paris plan →</small></a>`;
  return;

  const plannerDialog=document.createElement('dialog');
  plannerDialog.className='make-plan-dialog';
  const section=document.createElement('section');
  section.className='make-plan';
  section.id='make-your-plan';
  section.innerHTML=`
    <button class="make-plan__close" type="button" aria-label="Close plan maker">×</button>
    <div class="make-plan__intro">
      <p class="make-plan__eyebrow">Build your own plan</p>
      <h2>Thoughtfully yours.</h2>
      <p>Tell us what the two of you feel like doing. We’ll shape a Paris plan from places selected by Flōq—not an endless list.</p>
    </div>
    <div class="make-plan__builder">
      <div class="make-plan__progress" aria-hidden="true"><i class="active"></i><i></i><i></i></div>
      <form class="make-plan__form">
        <fieldset class="make-plan__step" data-step="0"><legend>How much time do you have?</legend><p class="make-plan__hint">Enough structure to be useful, with room to wander.</p><div class="make-plan__choices">
          <label class="make-plan__choice"><input type="radio" name="duration" value="2.5 hours"><span>A couple of hours</span></label>
          <label class="make-plan__choice"><input type="radio" name="duration" value="3.5 hours" checked><span>Half a day</span></label>
          <label class="make-plan__choice"><input type="radio" name="duration" value="5 hours"><span>Most of the day</span></label>
        </div></fieldset>
        <fieldset class="make-plan__step" data-step="1" hidden><legend>Where shall we wander?</legend><p class="make-plan__hint">Choose an area and we’ll keep the route comfortable on foot.</p><div class="make-plan__choices">
          <label class="make-plan__choice"><input type="radio" name="area" value="montmartre" checked><span>Montmartre</span></label>
          <label class="make-plan__choice"><input type="radio" name="area" value="marais"><span>Le Marais</span></label>
          <label class="make-plan__choice"><input type="radio" name="area" value="leftbank"><span>Left Bank & Seine</span></label>
        </div></fieldset>
        <fieldset class="make-plan__step" data-step="2" hidden><legend>What is the mood?</legend><p class="make-plan__hint">We’ll balance your pace with places that welcome you both.</p><div class="make-plan__choices">
          <label class="make-plan__choice"><input type="radio" name="mood" value="morning" checked><span>Slow & relaxed</span></label>
          <label class="make-plan__choice"><input type="radio" name="mood" value="afternoon"><span>Coffee & browsing</span></label>
          <label class="make-plan__choice"><input type="radio" name="mood" value="evening"><span>Walk & early dinner</span></label>
        </div></fieldset>
        <div class="make-plan__actions"><button class="make-plan__back" type="button" hidden>← Back</button><button class="make-plan__next" type="button">Continue →</button></div>
      </form>
      <div class="make-plan__result" aria-live="polite"><p class="make-plan__result-label">Your Flōq plan</p><h3></h3><div class="make-plan__tags"></div><ol class="make-plan__route"></ol><div class="make-plan__result-actions"><button class="make-plan__save" type="button">♡ Save this plan</button><button class="make-plan__edit" type="button">Make a change</button></div><p class="make-plan__note">Your plan remains available on this device. Sign in when you want it with you everywhere.</p></div>
    </div>`;
  plannerDialog.appendChild(section);
  document.body.appendChild(plannerDialog);
  launcher.querySelector('.guide-plan-maker-launch').addEventListener('click',()=>plannerDialog.showModal());
  section.querySelector('.make-plan__close').addEventListener('click',()=>plannerDialog.close());
  plannerDialog.addEventListener('click',event=>{if(event.target===plannerDialog)plannerDialog.close()});

  const dialog=document.createElement('dialog');
  dialog.className='floq-dialog';
  dialog.innerHTML=`<div class="floq-dialog__inner"><button class="floq-dialog__close" type="button" aria-label="Close">×</button><p class="floq-dialog__eyebrow">My Flōq</p><h2>Keep it close.</h2><p class="floq-dialog__copy">Create your Flōq account to keep saved places, curated guides and the days you make—on the website and in the app.</p><button class="floq-dialog__provider" type="button" data-provider="Google">Continue with Google</button><button class="floq-dialog__provider" type="button" data-provider="Apple">Continue with Apple</button><div class="floq-dialog__divider">or</div><form class="floq-dialog__form"><input name="email" type="email" autocomplete="email" placeholder="Your email address" required><button class="make-plan__auth-submit" type="submit">Continue</button></form><p class="floq-dialog__fine">Accounts are being connected for launch. For now, your selection is kept privately on this device.</p><p class="floq-dialog__status" aria-live="polite"></p></div>`;
  document.body.appendChild(dialog);
  const myFloq=document.createElement('button');
  myFloq.className='my-floq-trigger';myFloq.type='button';myFloq.textContent='♡ My Flōq';
  document.body.appendChild(myFloq);

  const builder=section.querySelector('.make-plan__builder');
  const form=section.querySelector('form');
  const steps=[...section.querySelectorAll('.make-plan__step')];
  const bars=[...section.querySelectorAll('.make-plan__progress i')];
  const back=section.querySelector('.make-plan__back');
  const next=section.querySelector('.make-plan__next');
  const result=section.querySelector('.make-plan__result');
  let step=0,currentPlan=null;
  const showStep=()=>{steps.forEach((item,index)=>item.hidden=index!==step);bars.forEach((item,index)=>item.classList.toggle('active',index<=step));back.hidden=step===0;next.textContent=step===steps.length-1?'Make my plan →':'Continue →'};
  const selection=name=>new FormData(form).get(name);
  const makePlan=()=>{const duration=selection('duration');const area=selection('area');const mood=selection('mood');const chosen=routes[area][mood];const energy=mood==='evening'?'🐾🐾 Moderate':'🐾 Relaxed';currentPlan={id:`${area}-${mood}`,title:chosen.title,duration,area,mood,energy,places:chosen.places,createdAt:new Date().toISOString()};result.querySelector('h3').textContent=chosen.title;result.querySelector('.make-plan__tags').innerHTML=`<span>${duration}</span><span>${chosen.places.length} stops</span><span>${energy}</span>`;result.querySelector('.make-plan__route').innerHTML=chosen.places.map((place,index)=>`<li><b>${index+1}</b><span>${place}</span></li>`).join('');builder.classList.add('is-complete')};
  next.addEventListener('click',()=>{if(step<steps.length-1){step++;showStep()}else makePlan()});
  back.addEventListener('click',()=>{if(step>0){step--;showStep()}});
  section.querySelector('.make-plan__edit').addEventListener('click',()=>{builder.classList.remove('is-complete');step=0;showStep()});
  const persistPlan=()=>{if(!currentPlan)return;try{const saved=JSON.parse(localStorage.getItem('floq:saved-plans')||'[]').filter(item=>item.id!==currentPlan.id);saved.unshift(currentPlan);localStorage.setItem('floq:saved-plans',JSON.stringify(saved));section.querySelector('.make-plan__save').textContent='♥ Saved to My Flōq';myFloq.textContent=`♥ My Flōq · ${saved.length}`}catch{}dialog.showModal()};
  section.querySelector('.make-plan__save').addEventListener('click',persistPlan);
  myFloq.addEventListener('click',()=>{let saved=[];try{saved=JSON.parse(localStorage.getItem('floq:saved-plans')||'[]')}catch{}const copy=dialog.querySelector('.floq-dialog__copy');copy.innerHTML=saved.length?`You have <strong>${saved.length} made plan${saved.length===1?'':'s'}</strong> saved on this device. Sign in at launch to keep plans, places and guides together.`:'Your saved places, curated guides and made plans will live here—ready whenever the two of you are.';dialog.showModal()});
  dialog.querySelector('.floq-dialog__close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.querySelectorAll('[data-provider]').forEach(button=>button.addEventListener('click',()=>{dialog.querySelector('.floq-dialog__status').textContent=`${button.dataset.provider} sign-in will be connected for launch. Your plan is safe on this device.`}));
  dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();const email=new FormData(event.currentTarget).get('email');try{localStorage.setItem('floq:account-email',email)}catch{}dialog.querySelector('.floq-dialog__status').textContent='Thank you. Your launch access has been noted and this plan is saved on this device.'});
  showStep();
})();
