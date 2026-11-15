/* Photographic objects are used on the app map; glyphs remain a loading/error fallback. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TdfgMapMarkers=api;})(typeof window==='undefined'?globalThis:window,function(){
  const svg=body=>`<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">${body}</svg>`;
  const icons={
    restaurant:svg('<path d="M8 4v8m-4-8v6a4 4 0 0 0 8 0V4M8 14v14M23 4v24m0-24c-5 4-6 10-4 13h4"/>'),
    walk:svg('<path d="m16 3-6 8h3l-6 8h6v10h6V19h6l-6-8h3L16 3Z"/>'),
    grooming:svg('<path d="M7 10 4 9c-2 3-2 7-1 10 2 1 3 0 4-2M17 10l3-1c2 3 2 6 1 9M7 10c0-4 3-6 6-5 3-1 5 2 5 5v10c0 5-3 7-6 7s-6-2-6-7V10M9 17h.01M15 17h.01M10 21h4l-2 2-2-2Z"/><circle cx="23" cy="21" r="2"/><circle cx="28" cy="25" r="2"/><path d="m24 19 5-13m-3 17-5-15m3 12 3 4"/>'),
  };
  const objectFiles={restaurant:'cutlery225.png',walk:'park225.png',grooming:'grooming229.png'};
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
