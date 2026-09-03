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
    { name: 'Eiffel Tower', coordinates: [2.2945, 48.8584], icon: '<svg viewBox="0 0 24 24"><path d="M10 3h4M11 3 9 13h6L13 3M8 13h8M7 17h10M9 13 6 21m9-8 3 8M4 21h16"/></svg>' },
    { name: 'Arc de Triomphe', coordinates: [2.2950, 48.8738], icon: '<svg viewBox="0 0 24 24"><path d="M4 21V9h16v12M7 9V6h10v3M9 21v-7a3 3 0 0 1 6 0v7M3 21h18"/></svg>' },
    { name: 'Musée du Louvre', coordinates: [2.3376, 48.8606], icon: '<svg viewBox="0 0 24 24"><path d="m12 5 9 5H3l9-5ZM5 10v8m4-8v8m6-8v8m4-8v8M3 21h18M4 18h16"/></svg>' },
    { name: 'Notre-Dame', coordinates: [2.3499, 48.8530], icon: '<svg viewBox="0 0 24 24"><path d="M5 21V8h4V5h6v3h4v13M9 21v-5a3 3 0 0 1 6 0v5M8 11h1m6 0h1M3 21h18"/></svg>' },
    { name: 'Sacré-Cœur', coordinates: [2.3431, 48.8867], icon: '<svg viewBox="0 0 24 24"><path d="M4 21V12h4V9h2V6l2-3 2 3v3h2v3h4v9M9 21v-5a3 3 0 0 1 6 0v5M3 21h18"/></svg>' },
    { name: 'Palais Garnier', coordinates: [2.3316, 48.8719], icon: '<svg viewBox="0 0 24 24"><path d="m12 4 9 5H3l9-5ZM5 9v9m4-9v9m6-9v9m4-9v9M3 21h18M4 18h16"/></svg>' }
  ];
  const neutralStyle = [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape', stylers: [{ color: '#f5f3ef' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#d4d0ca' }] },
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#69645e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e7e3dd' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a847d' }] },
    { featureType: 'road.highway', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', stylers: [{ color: '#dfe9e9' }] },
    { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e3ebdc' }] },
    { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] }
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
  let scrollTimer;

  const normaliseCategory = category => category === 'cafes' ? 'cafe' : category;
  const escapeHTML = value => String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const ordinal = number => `${number}${number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th'}`;
  const showStatus = message => { status.textContent = message; status.classList.add('show'); window.setTimeout(() => status.classList.remove('show'), 3000); };
  const distanceBetween = (a, b) => { const r = degrees => degrees * Math.PI / 180; const dLat = r(b[1] - a[1]); const dLng = r(b[0] - a[0]); const x = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(dLng / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); };
  const formatDistance = km => km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
  const cardFor = place => { const category = normaliseCategory(place.category); const distance = userLocation ? `<span class="card-distance">${formatDistance(distanceBetween(userLocation, place.coordinates))}</span>` : ''; return `<article class="map-card" data-key="${escapeHTML(place.key)}" data-category="${category}" tabindex="0" aria-label="Show ${escapeHTML(place.name)} on the map"><img class="map-card-image" src="${escapeHTML(place.images[0])}" alt="${escapeHTML(place.name)} in Paris"><div class="map-card-copy"><p class="map-card-kicker"><i class="dot ${category}"></i>${categoryNames[category]} ${distance}</p><h2>${escapeHTML(place.name)}</h2><p class="map-card-meta">${escapeHTML(place.meta)}</p><p class="map-card-hours">${escapeHTML(place.openingHours || '')}</p><div class="map-card-actions"><a class="primary" href="${escapeHTML(place.mapsUrl)}" target="_blank" rel="noopener">Directions</a><a href="${escapeHTML(place.instagram)}" target="_blank" rel="noopener">Instagram</a></div></div></article>`; };

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
  const clearSelection = () => { selectedKey = null; rail.classList.remove('has-selection'); document.querySelector('.map-results').classList.remove('has-selection'); markers.forEach(marker => marker.element.classList.remove('active', 'is-muted')); rail.querySelectorAll('.map-card').forEach(card => card.classList.remove('active')); };
  const selectPlace = (key, options = {}) => { const place = visiblePlaces.find(item => item.key === key); if (!place) return; selectedKey = key; rail.classList.add('has-selection'); document.querySelector('.map-results').classList.add('has-selection'); markers.forEach((marker, markerKey) => { marker.element.classList.toggle('active', markerKey === key); marker.element.classList.toggle('is-muted', markerKey !== key); }); rail.querySelectorAll('.map-card').forEach(card => card.classList.toggle('active', card.dataset.key === key)); if (options.pan !== false) { map.panTo({ lat: place.coordinates[1], lng: place.coordinates[0] }); map.setZoom(Math.max(map.getZoom() || 13, 15)); } };
  const updateDistrict = async () => { districtShapes.forEach(shape => shape.setMap(null)); districtShapes = []; if (activeDistrict === 'all') return null; return drawBoundary(`paris-arrondissements/arr-${String(activeDistrict).padStart(2, '0')}.geojson`, true); };
  const render = async () => { visiblePlaces = places.filter(place => (activeCategory === 'all' || normaliseCategory(place.category) === activeCategory) && (activeDistrict === 'all' || String(place.arrondissement) === activeDistrict)); markers.forEach(marker => marker.setMap(null)); markers.clear(); rail.innerHTML = visiblePlaces.map(cardFor).join(''); count.textContent = visiblePlaces.length; visiblePlaces.forEach(place => { const marker = new HTMLMarker(place); marker.setMap(map); markers.set(place.key, marker); }); clearSelection(); const districtBounds = await updateDistrict(); if (districtBounds) { map.fitBounds(districtBounds, { top: 150, right: 90, bottom: 100, left: 90 }); google.maps.event.addListenerOnce(map, 'idle', () => { if (map.getZoom() > 14) map.setZoom(14); }); } else { fitVisiblePlaces(); } };
  const buildDistrictFilters = () => { const container = document.getElementById('district-filters'); const districts = [...new Set(places.map(place => place.arrondissement))].sort((a, b) => a - b); container.innerHTML = `<button class="active" data-district="all" aria-pressed="true">All districts</button>${districts.map(number => `<button data-district="${number}" aria-pressed="false">${ordinal(number)} arr.</button>`).join('')}`; container.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { activeDistrict = button.dataset.district; container.querySelectorAll('button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); }); render(); })); };
  const loadGoogle = key => new Promise((resolve, reject) => { window.initTdfgGoogleMap = resolve; const script = document.createElement('script'); script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initTdfgGoogleMap&v=weekly`; script.async = true; script.onerror = reject; document.head.append(script); });
  const initialise = async () => {
    const key = window.TDFG_GOOGLE_MAPS_API_KEY;
    if (!key) { setup.hidden = false; mapElement.classList.add('google-map-disabled'); return; }
    try {
      const [catalogue] = await Promise.all([fetch('paris-places.json?v=5').then(response => response.json()), loadGoogle(key)]);
      defineHTMLMarker();
      places = catalogue.places.filter(place => Array.isArray(place.coordinates)).map(place => ({ ...place, openingHours: catalogue.openingHours[place.key] }));
      buildDistrictFilters();
      map = new google.maps.Map(mapElement, { center: { lat: 48.8668, lng: 2.3505 }, zoom: 12, styles: neutralStyle, mapTypeControl: false, streetViewControl: false, fullscreenControl: true, gestureHandling: 'greedy' });
      await drawBoundary('paris-boundary.geojson');
      landmarks.forEach(landmark => new LandmarkMarker(landmark).setMap(map));
      map.addListener('click', clearSelection);
      render();
      document.querySelectorAll('.category-filters button').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.category; document.querySelectorAll('.category-filters button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); }); render(); }));
      document.querySelector('.locate-button').addEventListener('click', () => navigator.geolocation.getCurrentPosition(position => { userLocation = [position.coords.longitude, position.coords.latitude]; map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude }); map.setZoom(15); render(); showStatus('Your location is now shown on the map.'); }, () => showStatus('We could not access your location. Please check your browser permission.')));
    } catch (error) { console.error('Google comparison map failed', error); setup.hidden = false; setup.querySelector('span').textContent = 'The Google Maps preview could not load. Check the API key and its domain restrictions.'; }
  };
  initialise();
})();
