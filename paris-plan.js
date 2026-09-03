(async()=>{
  const params=new URLSearchParams(location.search);
  const slug=params.get('plan')||'slow-morning-montmartre';
  const [planData,placeData]=await Promise.all([
    fetch('paris-plans.json?v=1').then(r=>r.json()),
    fetch('paris-places.json?v=7').then(r=>r.json())
  ]);
  const plan=planData.plans.find(item=>item.slug===slug)||planData.plans[0];
  const placeByKey=new Map(placeData.places.map(place=>[place.key,place]));
  const stops=plan.stopKeys.map((key,index)=>({...placeByKey.get(key),note:plan.stopNotes[index]})).filter(stop=>stop.key);
  const categoryName={cafe:'Café',cafes:'Café',restaurant:'Restaurant',shop:'Dog shop',hotel:'Hotel'};
  const escapeHTML=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const distance=(a,b)=>{const rad=n=>n*Math.PI/180,R=6371,dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]),lat1=rad(a[1]),lat2=rad(b[1]);const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(h))*1.22};
  const legLabel=(a,b)=>{const km=distance(a.coordinates,b.coordinates),minutes=Math.max(3,Math.round(km/4.5*60));return `Approx. ${minutes} min walk · ${km<1?Math.round(km*1000)+' m':km.toFixed(1)+' km'}`};
  document.title=`${plan.title} - The Dog Friendly Guide`;
  document.getElementById('plan-title').textContent=plan.title;
  document.getElementById('plan-lead').textContent=plan.intro;
  document.getElementById('plan-character').textContent=plan.character;
  document.getElementById('plan-facts').innerHTML=`<span>${escapeHTML(plan.duration)}</span><span>${stops.length} stops</span><span>${escapeHTML(plan.area)}</span><span>${escapeHTML(plan.bestTime)}</span>`;
  document.getElementById('plan-map-title').textContent=plan.shortTitle;
  document.getElementById('plan-map-meta').textContent=`${plan.duration} · ${stops.length} stops · ${plan.area}`;
  const list=document.getElementById('plan-timeline');
  list.innerHTML=stops.map((stop,index)=>{
    const image=stop.images?.[0]||'assets/places/photo-coming-soon-cafe.svg';
    const hours=placeData.openingHours?.[stop.key]||'Check current opening hours';
    const leg=index<stops.length-1?`<li class="journey-leg"><span>↓</span><span>${legLabel(stop,stops[index+1])}</span></li>`:'';
    return `<li class="plan-stop"><span class="stop-number">${index+1}</span><img class="stop-image" src="${escapeHTML(image)}" alt="${escapeHTML(stop.name)}" loading="lazy"><div class="stop-copy"><span class="category">${categoryName[stop.category]||escapeHTML(stop.category)}</span><h3>${escapeHTML(stop.name)}</h3><p class="meta">${escapeHTML(stop.meta)}<br>${escapeHTML(hours)}</p><p class="note">${escapeHTML(stop.note)}</p><div class="stop-links"><a href="${escapeHTML(stop.mapsUrl)}" target="_blank" rel="noopener">Directions</a><a href="${escapeHTML(stop.instagram)}" target="_blank" rel="noopener">Instagram</a></div></div></li>${leg}`;
  }).join('');
  const share=async()=>{const payload={title:plan.title,text:`${plan.title} - a dog-friendly Paris plan`,url:location.href};if(navigator.share)await navigator.share(payload);else{await navigator.clipboard.writeText(location.href);document.getElementById('share-plan').textContent='Link copied';}};
  document.getElementById('share-plan').addEventListener('click',()=>share().catch(()=>{}));
  document.getElementById('view-google-route').href=`https://www.google.com/maps/dir/${stops.map(stop=>encodeURIComponent(`${stop.name}, Paris`)).join('/')}`;
  const key=window.TDFG_GOOGLE_MAPS_API_KEY||'';
  const message=document.getElementById('plan-map-message');
  if(!key){message.hidden=false;return;}
  await new Promise((resolve,reject)=>{window.initParisPlanMap=resolve;const script=document.createElement('script');script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initParisPlanMap&v=weekly`;script.async=true;script.onerror=reject;document.head.append(script)});
  const styles=[{featureType:'poi.business',stylers:[{visibility:'off'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#cfe4e7'}]},{featureType:'landscape',elementType:'geometry',stylers:[{color:'#f2ece4'}]},{featureType:'poi.park',elementType:'geometry',stylers:[{color:'#dce8d2'}]},{elementType:'labels.text.fill',stylers:[{color:'#756d64'}]}];
  const map=new google.maps.Map(document.getElementById('plan-map'),{center:{lat:stops[0].coordinates[1],lng:stops[0].coordinates[0]},zoom:14,styles,mapTypeControl:false,streetViewControl:false,fullscreenControl:true,gestureHandling:'cooperative'});
  const bounds=new google.maps.LatLngBounds();
  const path=stops.map(stop=>({lat:stop.coordinates[1],lng:stop.coordinates[0]}));
  new google.maps.Polyline({map,path,strokeColor:'#a76344',strokeOpacity:.82,strokeWeight:4});
  class NumberMarker extends google.maps.OverlayView{constructor(stop,index){super();this.position=new google.maps.LatLng(stop.coordinates[1],stop.coordinates[0]);this.el=document.createElement('div');this.el.className='route-marker';this.el.innerHTML=`${index+1}<span class="plan-route-label">${escapeHTML(stop.name)}</span>`}onAdd(){this.getPanes().overlayMouseTarget.appendChild(this.el)}draw(){const p=this.getProjection().fromLatLngToDivPixel(this.position);this.el.style.position='absolute';this.el.style.left=`${p.x-18}px`;this.el.style.top=`${p.y-18}px`}onRemove(){this.el.remove()}}
  stops.forEach((stop,index)=>{bounds.extend(path[index]);new NumberMarker(stop,index).setMap(map)});
  map.fitBounds(bounds,{top:80,right:70,bottom:125,left:70});
})().catch(()=>{const message=document.getElementById('plan-map-message');if(message){message.hidden=false;message.textContent='The route map could not be loaded. The full itinerary is still available.'}});
