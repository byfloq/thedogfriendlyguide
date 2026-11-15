/* Inline glyphs keep small map markers legible without waiting for image assets. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TdfgMapMarkers=api;})(typeof window==='undefined'?globalThis:window,function(){
  const svg=body=>`<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">${body}</svg>`;
  const icons={
    restaurant:svg('<path d="M8 4v8m-4-8v6a4 4 0 0 0 8 0V4M8 14v14M23 4v24m0-24c-5 4-6 10-4 13h4"/>'),
    walk:svg('<path d="m16 3-6 8h3l-6 8h6v10h6V19h6l-6-8h3L16 3Z"/>'),
    grooming:svg('<path d="M10 12 6 10c-3 2-4 7-3 11 2 1 4 0 5-2m14-7 4-2c3 2 4 7 3 11-2 1-4 0-5-2M9 12c-1 3-1 6-1 9 0 5 3 8 8 8s8-3 8-8c0-3 0-6-1-9M12 19h.01M20 19h.01M14 23h4l-2 2-2-2Zm2 2v2"/><path class="foam" d="M9 12a3 3 0 0 1-1-5 3 3 0 0 1 4-3 4 4 0 0 1 7-1 3 3 0 0 1 5 4 3 3 0 0 1-1 5Z"/><circle class="foam" cx="27" cy="4" r="1.5"/>'),
  };
  function kind(place){
    const category={Eat:'restaurant',Walk:'walk',Drink:'cafe',Shop:'shop',Stay:'hotel',cafes:'cafe'}[place.category]||place.category;
    if(category!=='shop')return category;
    // A shop selling shampoo is not a grooming salon. Require a service signal.
    const meta=place.meta||place.shortDescription||'';
    const description=place.description||place.editorial||'';
    const explicit=Array.isArray(place.services)&&place.services.includes('grooming');
    return explicit||/\b(?:grooming|toilettage|peluquer[ií]a canina)\b/i.test(meta)||/\b(?:grooming (?:salon|studio|spa)|with grooming|gentle grooming)\b/i.test(description)?'grooming':category;
  }
  return {icons,kind};
});
