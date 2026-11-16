/* Screen-density grouping only: source places and filter counts remain intact. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TdfgParkClusters239=api;})(typeof window==='undefined'?globalThis:window,function(){
  function point(coordinates,zoom){
    const scale=256*Math.pow(2,zoom),latitude=Math.max(-85,Math.min(85,coordinates[1]));
    const sin=Math.sin(latitude*Math.PI/180);
    return [(coordinates[0]+180)/360*scale,(.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*scale];
  }
  function group(places,zoom,selectedKey){
    const entries=[],cells=new Map(),radius=64;
    // At street scale every park is individually available.
    for(const place of [...places].sort((a,b)=>String(a.key).localeCompare(String(b.key)))){
      if(!Array.isArray(place.coordinates)||place.coordinates.length!==2||!place.coordinates.every(Number.isFinite))continue;
      const entry={key:place.key,coordinates:place.coordinates,places:[place]};
      if(!['walk','Walk'].includes(place.category)||place.key===selectedKey||zoom>=17){entries.push(entry);continue;}
      const [x,y]=point(place.coordinates,zoom),cx=Math.floor(x/radius),cy=Math.floor(y/radius);
      let nearest=null,best=radius*radius;
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const cluster of cells.get((cx+dx)+':'+(cy+dy))||[]){
        const distance=(x-cluster.x)**2+(y-cluster.y)**2;
        if(distance<best){best=distance;nearest=cluster;}
      }
      if(nearest){nearest.entry.places.push(place);continue;}
      entries.push(entry);
      const cell=cx+':'+cy;if(!cells.has(cell))cells.set(cell,[]);
      cells.get(cell).push({x,y,entry});
    }
    for(const entry of entries)if(entry.places.length>1){
      entry.key='park-cluster239:'+entry.places.map(p=>p.key).join('|');
      entry.coordinates=[0,1].map(index=>entry.places.reduce((sum,p)=>sum+p.coordinates[index],0)/entry.places.length);
    }
    return entries;
  }
  return {group};
});
