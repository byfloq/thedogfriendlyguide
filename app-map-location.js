/* Shared by the app map page and Node checks. Coordinates never leave this map. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TdfgMapLocation=api;})(typeof window==='undefined'?globalThis:window,function(){
  function valid(point){return Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)&&Math.abs(point[0])<=180&&Math.abs(point[1])<=90;}
  function ringContains(point,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [x,y]=ring[i],[px,py]=ring[j];if((y>point[1])!==(py>point[1])&&point[0]<(px-x)*(point[1]-y)/(py-y)+x)inside=!inside;}return inside;}
  function withinCity(point,feature){if(!valid(point)||!feature)return false;const g=feature.type==='Feature'?feature.geometry:feature;if(g.type==='FeatureCollection')return g.features.some(f=>withinCity(point,f));const polygons=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];return polygons.some(rings=>rings.length&&ringContains(point,rings[0])&&!rings.slice(1).some(ring=>ringContains(point,ring)));}
  return {valid,withinCity};
});
