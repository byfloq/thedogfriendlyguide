(() => {
  const mapElement = document.getElementById('paris-map');
  const rail = document.getElementById('place-rail');
  const count = document.getElementById('visible-count');
  const status = document.getElementById('map-status');
  const setup = document.getElementById('google-map-setup');
  const categoryNames = { cafe: 'Café', restaurant: 'Restaurant', shop: 'Dog shop', hotel: 'Hotel' };
  const categoryIcons = {
    cafe: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h11v5.5A4.5 4.5 0 0 1 11.5 18h-2A4.5 4.5 0 0 1 5 13.5V8Zm11 2h1.5a2.5 2.5 0 0 1 0 5H16M7 5.5c0-1 1-1 1-2M11 5.5c0-1 1-1 1-2M4 20h14"/></svg>',
    restaurant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10a2.5 2.5 0 0 0 2.5-2.5V3M7 10v11M15 3v18M15 3c3 2 4.5 5.5 2.5 9H15"/></svg>',
    shop: '<svg class="paw-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.5" cy="8.4" r="2"/><circle cx="10.2" cy="5.7" r="2"/><circle cx="14.2" cy="5.7" r="2"/><circle cx="17.7" cy="8.6" r="2"/><path d="M12.1 10.4c-3.2 0-6.1 3.1-6.1 5.9 0 2 1.5 3.2 3.4 3.2 1 0 1.8-.5 2.7-.5.9 0 1.7.5 2.7.5 1.9 0 3.4-1.2 3.4-3.2 0-2.8-2.9-5.9-6.1-5.9Z"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V5h14v16M3 21h18M8 9h2m4 0h2m-8 4h2m4 0h2M10 21v-4h4v4"/></svg>'
  };
  const landmarks = [
    { name: 'Eiffel Tower', coordinates: [2.2945, 48.8584], icon: '<svg class="landmark-solid" viewBox="0 0 32 32"><path d="M14.7 2h2.6l.5 3h-1l1.5 7.1h2.1v2.4h-1.6l1.2 5.2h2.5v2.4h-2l3.8 7.9h-5.1l-1.1-3.2h-4.2L12.8 30H7.7l3.8-7.9h-2v-2.4H12l1.2-5.2h-1.6v-2.4h2.1L15.2 5h-1l.5-3Zm.1 20.1-.4 2h3.2l-.4-2h-2.4Zm.6-7.6-.5 5.2h2.2l-.5-5.2h-1.2Z"/></svg>' },
    { name: 'Arc de Triomphe', coordinates: [2.2950, 48.8738], icon: '<svg class="landmark-solid" viewBox="0 0 32 32"><path fill-rule="evenodd" d="M5 5h22v25h-7.2V19.2a3.8 3.8 0 0 0-7.6 0V30H5V5Zm2.2-3h17.6v2H7.2V2ZM3 30h26v2H3v-2Zm5-21h16v2H8V9Zm1.2 4.5h3v2h-3v-2Zm10.6 0h3v2h-3v-2Z"/></svg>' },
    { name: 'Musée du Louvre', coordinates: [2.3376, 48.8606], icon: '<svg class="landmark-solid" viewBox="0 0 32 32"><path d="M16 2 30 9v2H2V9L16 2ZM4 13h3v12H4V13Zm7 0h3v12h-3V13Zm7 0h3v12h-3V13Zm7 0h3v12h-3V13ZM2 27h28v2H2v-2Zm-2 3h32v2H0v-2Z"/></svg>' },
    { name: 'Notre-Dame', coordinates: [2.3499, 48.8530], icon: '<svg class="landmark-solid" viewBox="0 0 32 32"><path fill-rule="evenodd" d="M5 6h8v5h6V6h8v24h-7v-7a4 4 0 0 0-8 0v7H5V6Zm3-4h2v3H8V2Zm14 0h2v3h-2V2ZM9 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm14 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM16 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>' },
    { name: 'Sacré-Cœur', coordinates: [2.3431, 48.8867], icon: '<svg class="landmark-solid" viewBox="0 0 32 32"><path d="M15 2h2v3h-2V2Zm1 3c3.1 0 5.6 2.5 5.6 5.6V13h2.6c2.6 0 4.8 2.2 4.8 4.8V30h-8v-7.5a5 5 0 0 0-10 0V30H3V17.8C3 15.2 5.2 13 7.8 13h2.6v-2.4C10.4 7.5 12.9 5 16 5Zm-9 9.5V11H5v4.2l2-.7Zm20 0V11h-2v4.2l2-.7Z"/><path d="M1 30h30v2H1z"/></svg>' },
    { name: 'Palais Garnier', coordinates: [2.3316, 48.8719], icon: '<svg class="landmark-solid" viewBox="0 0 32 32"><path d="M15 1h2v3h-2V1Zm1 3 4 3H12l4-3Zm-8 7 8-4 8 4v3H8v-3Zm-3 4h22v3H5v-3Zm2 4h3v8H7v-8Zm5 0h3v8h-3v-8Zm5 0h3v8h-3v-8Zm5 0h3v8h-3v-8ZM4 28h24v2H4v-2Zm-2 2h28v2H2v-2Z"/></svg>' }
  ];
  const neutralStyle = [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape', stylers: [{ color: '#f7f4ef' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#d4d0ca' }] },
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#69645e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e7e3dd' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a847d' }] },
    { featureType: 'road.highway', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e7ec' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6a9da6' }] },
    { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d5edc6' }] },
    { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'on' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#67914f' }] },
    { featureType: 'poi.park', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
  ];
  let map;
  let places = [];
  let visiblePlaces = [];
  let markers = new Map();
  let selectedKey = null;
  let activeCategory = 'all';
  let activeDistrict = 'all';
  let userLocation = null;
  let cityShapes = [];
  let districtShapes = [];
  let parisBounds = null;
  let scrollTimer;

  const normaliseCategory = category => category === 'cafes' ? 'cafe' : category;
  const escapeHTML = value => String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const ordinal = number => `${number}${number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th'}`;
  const showStatus = message => { status.textContent = message; status.classList.add('show'); window.setTimeout(() => status.classList.remove('show'), 3000); };
  const mapShareUrl = () => `${window.location.origin}/paris-map-google-v2.html`;
  const copyMapLink = async () => { try { await navigator.clipboard.writeText(mapShareUrl()); showStatus('Map link copied.'); } catch (error) { showStatus('Copy this page address to share the map.'); } };
  const inviteFriend = async () => { const shareData = { title: 'The Dog Friendly Guide - Paris', text: 'Explore our favourite dog-friendly places in Paris with me.', url: mapShareUrl() }; if (navigator.share) { try { await navigator.share(shareData); } catch (error) { if (error.name !== 'AbortError') await copyMapLink(); } } else { await copyMapLink(); } };
  const distanceBetween = (a, b) => { const r = degrees => degrees * Math.PI / 180; const dLat = r(b[1] - a[1]); const dLng = r(b[0] - a[0]); const x = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(dLng / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); };
  const formatDistance = km => km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
  const cardFor = place => { const category = normaliseCategory(place.category); const distance = userLocation ? `<span class="card-distance">${formatDistance(distanceBetween(userLocation, place.coordinates))}</span>` : ''; const image = place.images?.[0] || 'assets/places/photo-coming-soon-cafe.svg'; return `<article class="map-card" data-key="${escapeHTML(place.key)}" data-category="${category}" tabindex="0" aria-label="Show ${escapeHTML(place.name)} on the map"><img class="map-card-image" src="${escapeHTML(image)}" onerror="this.onerror=null;this.src='assets/places/photo-coming-soon-cafe.svg'" alt="${escapeHTML(place.name)} in Paris"><div class="map-card-copy"><p class="map-card-kicker"><i class="dot ${category}"></i>${categoryNames[category]} ${distance}</p><h2>${escapeHTML(place.name)}</h2><p class="map-card-meta">${escapeHTML(place.meta)}</p><p class="map-card-hours">${escapeHTML(place.openingHours || '')}</p><div class="map-card-actions"><a class="primary" href="${escapeHTML(place.mapsUrl)}" target="_blank" rel="noopener">Directions</a><a href="${escapeHTML(place.instagram)}" target="_blank" rel="noopener">Instagram</a></div></div></article>`; };

  let HTMLMarker;
  let LandmarkMarker;
  const defineHTMLMarker = () => {
    HTMLMarker = class extends google.maps.OverlayView {
      constructor(place) { super(); this.place = place; this.position = new google.maps.LatLng(place.coordinates[1], place.coordinates[0]); this.element = document.createElement('button'); this.element.className = 'google-marker'; this.element.dataset.category = normaliseCategory(place.category); this.element.type = 'button'; this.element.setAttribute('aria-label', `Show ${place.name}`); this.element.innerHTML = `<span class="marker-shape"><span>${categoryIcons[normaliseCategory(place.category)]}</span></span><span class="google-marker-label">${escapeHTML(place.name)}</span>`; this.element.addEventListener('click', event => { event.stopPropagation(); selectPlace(place.key); }); }
      onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.element); }
      draw() { const point = this.getProjection().fromLatLngToDivPixel(this.position); if (point) { this.element.style.left = `${point.x}px`; this.element.style.top = `${point.y}px`; } }
      onRemove() { this.element.remove(); }
    };
    LandmarkMarker = class extends google.maps.OverlayView {
      constructor(landmark) { super(); this.position = new google.maps.LatLng(landmark.coordinates[1], landmark.coordinates[0]); this.element = document.createElement('div'); this.element.className = 'landmark-marker'; this.element.innerHTML = `<span>${landmark.icon}</span><strong>${escapeHTML(landmark.name)}</strong>`; }
      onAdd() { this.getPanes().overlayLayer.appendChild(this.element); }
      draw() { const point = this.getProjection().fromLatLngToDivPixel(this.position); if (point) { this.element.style.left = `${point.x}px`; this.element.style.top = `${point.y}px`; } }
      onRemove() { this.element.remove(); }
    };
  };

  const polygonPaths = feature => feature.geometry.type === 'Polygon' ? feature.geometry.coordinates : feature.geometry.coordinates.flat();
  const drawBoundary = async (url, selected = false) => {
    const feature = await fetch(url).then(response => response.json());
    const collection = selected ? districtShapes : cityShapes;
    const bounds = new google.maps.LatLngBounds();
    collection.forEach(shape => shape.setMap(null)); collection.length = 0;
    polygonPaths(feature).forEach(ring => {
      const path = ring.map(([lng, lat]) => ({ lat, lng }));
      path.forEach(point => bounds.extend(point));
      const polygon = new google.maps.Polygon({ map, paths: path, strokeOpacity: 0, fillColor: selected ? '#a76344' : '#f7f2e9', fillOpacity: selected ? .14 : .08, clickable: false });
      const dots = new google.maps.Polyline({ map, path, strokeOpacity: 0, icons: [{ icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: selected ? '#7b3f2d' : '#332f2b', fillOpacity: 1, strokeOpacity: 0, scale: selected ? 2.2 : 1.7 }, offset: '0', repeat: selected ? '10px' : '12px' }], clickable: false });
      collection.push(polygon, dots);
    });
    return bounds;
  };
  const fitVisiblePlaces = () => { if (!visiblePlaces.length) return; const bounds = new google.maps.LatLngBounds(); visiblePlaces.forEach(place => bounds.extend({ lat: place.coordinates[1], lng: place.coordinates[0] })); map.fitBounds(bounds, window.innerWidth <= 700 ? 55 : 85); };
  const fitParisBoundary = () => { if (!parisBounds) return fitVisiblePlaces(); map.fitBounds(parisBounds, window.innerWidth <= 700 ? { top: 150, right: 34, bottom: 52, left: 34 } : { top: 122, right: 72, bottom: 68, left: 72 }); };
  const clearSelection = () => { selectedKey = null; rail.classList.remove('has-selection'); document.querySelector('.map-results').classList.remove('has-selection'); markers.forEach(marker => marker.element.classList.remove('active', 'is-muted')); rail.querySelectorAll('.map-card').forEach(card => card.classList.remove('active')); if (activeDistrict === 'all') { districtShapes.forEach(shape => shape.setMap(null)); districtShapes = []; } };
  const selectPlace = async (key, options = {}) => { const place = visiblePlaces.find(item => item.key === key); if (!place) return; selectedKey = key; rail.classList.add('has-selection'); document.querySelector('.map-results').classList.add('has-selection'); markers.forEach((marker, markerKey) => { marker.element.classList.toggle('active', markerKey === key); marker.element.classList.toggle('is-muted', markerKey !== key); }); rail.querySelectorAll('.map-card').forEach(card => card.classList.toggle('active', card.dataset.key === key)); if (activeDistrict === 'all') { const districtBounds = await drawBoundary(`paris-arrondissements/arr-${String(place.arrondissement).padStart(2, '0')}.geojson`, true); if (options.pan !== false && selectedKey === key) map.fitBounds(districtBounds, { top: 145, right: 95, bottom: 245, left: 95 }); } else if (options.pan !== false) { map.panTo({ lat: place.coordinates[1], lng: place.coordinates[0] }); } };
  const updateDistrict = async () => { districtShapes.forEach(shape => shape.setMap(null)); districtShapes = []; if (activeDistrict === 'all') return null; return drawBoundary(`paris-arrondissements/arr-${String(activeDistrict).padStart(2, '0')}.geojson`, true); };
  const render = async (options = {}) => { visiblePlaces = places.filter(place => (activeCategory === 'all' || normaliseCategory(place.category) === activeCategory) && (activeDistrict === 'all' || String(place.arrondissement) === activeDistrict)); markers.forEach(marker => marker.setMap(null)); markers.clear(); rail.innerHTML = visiblePlaces.map(cardFor).join(''); count.textContent = visiblePlaces.length; visiblePlaces.forEach(place => { const marker = new HTMLMarker(place); marker.setMap(map); markers.set(place.key, marker); }); clearSelection(); const districtBounds = await updateDistrict(); if (options.fitDistrict && districtBounds) map.fitBounds(districtBounds, { top: 150, right: 90, bottom: 100, left: 90 }); else if (options.fitAll) fitParisBoundary(); };
  const buildDistrictFilters = () => { const container = document.getElementById('district-filters'); const districts = [...new Set(places.map(place => place.arrondissement))].sort((a, b) => a - b); container.innerHTML = `<button class="active" data-district="all" aria-pressed="true">All districts</button>${districts.map(number => `<button data-district="${number}" aria-pressed="false">${ordinal(number)} arr.</button>`).join('')}`; container.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { activeDistrict = button.dataset.district; container.querySelectorAll('button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); }); render({ fitDistrict: activeDistrict !== 'all', fitAll: activeDistrict === 'all' }); })); };
  const loadGoogle = key => new Promise((resolve, reject) => { window.initTdfgGoogleMap = resolve; const script = document.createElement('script'); script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initTdfgGoogleMap&v=weekly`; script.async = true; script.onerror = reject; document.head.append(script); });
  const initialise = async () => {
    const key = window.TDFG_GOOGLE_MAPS_API_KEY;
    if (!key) { setup.hidden = false; mapElement.classList.add('google-map-disabled'); return; }
    try {
      const [catalogue] = await Promise.all([fetch('paris-places.json?v=8').then(response => response.json()), loadGoogle(key)]);
      defineHTMLMarker();
      places = catalogue.places.filter(place => Array.isArray(place.coordinates)).map(place => ({ ...place, openingHours: catalogue.openingHours[place.key] }));
      buildDistrictFilters();
      map = new google.maps.Map(mapElement, { center: { lat: 48.8668, lng: 2.3505 }, zoom: 12, styles: neutralStyle, mapTypeControl: false, streetViewControl: false, fullscreenControl: true, gestureHandling: 'greedy' });
      parisBounds = await drawBoundary('paris-boundary.geojson');
      landmarks.forEach(landmark => new LandmarkMarker(landmark).setMap(map));
      map.addListener('click', clearSelection);
      render({ fitAll: true });
      document.querySelectorAll('.category-filters button').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.category; document.querySelectorAll('.category-filters button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); }); render(); }));
      document.querySelector('.locate-button').addEventListener('click', () => navigator.geolocation.getCurrentPosition(position => { userLocation = [position.coords.longitude, position.coords.latitude]; map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude }); map.setZoom(15); render(); showStatus('Your location is now shown on the map.'); }, () => showStatus('We could not access your location. Please check your browser permission.')));
      document.getElementById('invite-map').addEventListener('click', inviteFriend);
      document.getElementById('share-map').addEventListener('click', copyMapLink);
    } catch (error) { console.error('Google comparison map failed', error); setup.hidden = false; setup.querySelector('span').textContent = 'The Google Maps preview could not load. Check the API key and its domain restrictions.'; }
  };
  initialise();
})();
