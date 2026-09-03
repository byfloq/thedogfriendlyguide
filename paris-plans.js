(async()=>{
  const rail=document.getElementById('plan-capsule-rail');
  if(!rail)return;
  const data=await fetch('paris-plans.json?v=2').then(r=>r.json());
  rail.innerHTML=data.plans.map(plan=>`<a class="plan-capsule" href="paris-plan.html?plan=${encodeURIComponent(plan.slug)}"><img src="${plan.cover}" alt="${plan.title}" loading="lazy"><div class="plan-capsule-copy"><h3>${plan.title}</h3><div class="plan-meta"><span>${plan.duration}</span><span>${plan.stopKeys.length} stops</span><span>${plan.area}</span></div></div></a>`).join('');
})().catch(()=>{});
