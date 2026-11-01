/* Shared app/web map catalogue rules. Public venue data only; never user location. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TdfgCityMap=api;})(typeof window==='undefined'?globalThis:window,function(){
 const cities={
  paris:{label:'Paris',center:[2.3505,48.8655],radiusKm:16,zoom:13},
  london:{label:'London',center:[-0.1276,51.5072],radiusKm:40,zoom:12},
  barcelona:{label:'Barcelona',center:[2.1734,41.3851],radiusKm:20,zoom:13},
  madrid:{label:'Madrid',center:[-3.7038,40.4168],radiusKm:25,zoom:13},
  berlin:{label:'Berlin',center:[13.405,52.52],radiusKm:30,zoom:12},
  hamburg:{label:'Hamburg',center:[9.9937,53.5511],radiusKm:30,zoom:12},
  copenhagen:{label:'Copenhagen',center:[12.5683,55.6761],radiusKm:20,zoom:13}
 };
 const https=url=>{try{return typeof url==='string'&&new URL(url).protocol==='https:';}catch{return false;}};
 const valid=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90&&(p[0]!==0||p[1]!==0);
 const distance=(a,b)=>{const r=x=>x*Math.PI/180,dLat=r(b[1]-a[1]),dLng=r(b[0]-a[0]),n=Math.sin(dLat/2)**2+Math.cos(r(a[1]))*Math.cos(r(b[1]))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n));};
 function withinCity(point,city){const c=cities[city];return !!c&&valid(point)&&distance(point,c.center)<=c.radiusKm;}
 function coordinatesFor(place,overrides){
  const raw=[place.coordinates?.longitude,place.coordinates?.latitude];
  if(place.coordinatesVerified===true&&withinCity(raw,place.city))return {latitude:raw[1],longitude:raw[0]};
  const entry=overrides?.[place.id];
  // An older cache can use the verified address. A moved/renamed venue cannot
  // inherit an old pin simply because it retained its identifier.
  if(!entry||entry.city!==place.city||entry.name!==place.name||entry.mapsUrl!==place.mapsUrl)return null;
  const point=[entry.longitude,entry.latitude];
  return withinCity(point,place.city)?{latitude:point[1],longitude:point[0]}:null;
 }
 function placesFor(city,catalogue,overrides){
  if(!cities[city]||!Array.isArray(catalogue?.places))return [];
  const category={Drink:'cafe',Eat:'restaurant',Stay:'hotel',Shop:'shop',Walk:'walk'};
  return catalogue.places.filter(p=>p.city===city).flatMap(p=>{
   const point=coordinatesFor(p,overrides);if(!point||typeof p.id!=='string'||typeof p.name!=='string'||typeof p.area!=='string'||!https(p.mapsUrl)||!https(p.image)||!Array.isArray(p.images)||!p.images.length||!p.images.every(https))return [];
   return [{key:p.id,name:p.name,area:p.area,category:category[p.category]||'cafe',coordinates:[point.longitude,point.latitude],images:p.images,preview:p.image,meta:p.area,description:p.editorial||p.shortDescription||'',mapsUrl:p.mapsUrl,instagram:https(p.websiteUrl)?p.websiteUrl:p.mapsUrl,openingHours:p.openingHours||''}];
  });
 }
 return {cities,valid,withinCity,coordinatesFor,placesFor};
});
