/* Photographic objects are used on the app map; glyphs remain a loading/error fallback. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TdfgMapMarkers=api;})(typeof window==='undefined'?globalThis:window,function(){
  const svg=body=>`<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">${body}</svg>`;
  const icons={
    restaurant:svg('<path d="M8 4v8m-4-8v6a4 4 0 0 0 8 0V4M8 14v14M23 4v24m0-24c-5 4-6 10-4 13h4"/>'),
    walk:svg('<path d="m16 3-6 8h3l-6 8h6v10h6V19h6l-6-8h3L16 3Z"/>'),
    grooming:svg('<circle cx="8" cy="25" r="4"/><circle cx="24" cy="25" r="4"/><path d="m10 22 13-18m-1 18L9 4M20 5l9 8m-7-7-2 2m5 0-2 2m5 0-2 2"/>'),
  };
  const objectFiles={restaurant:'cutlery225.png',walk:'park225.png',grooming:'grooming231.png'};
  function kind(place){
    const category={Eat:'restaurant',Walk:'walk',Drink:'cafe',Shop:'shop',Stay:'hotel',cafes:'cafe'}[place.category]||place.category;
    if(category!=='shop')return category;
    // A shop selling shampoo is not a grooming salon. Require a service signal.
    const meta=place.meta||place.shortDescription||'';
    const description=place.description||place.editorial||'';
    const explicit=Array.isArray(place.services)&&place.services.includes('grooming');
    return explicit||/\b(?:grooming|toilettage|peluquer[ií]a canina)\b/i.test(meta)||/\b(?:grooming (?:salon|studio|spa)|with grooming|gentle grooming)\b/i.test(description)?'grooming':category;
  }
  return {icons,kind,objectFiles};
});
