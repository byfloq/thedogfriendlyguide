(() => {
  const mapElement = document.getElementById('paris-map');
  const rail = document.getElementById('place-rail');
  const count = document.getElementById('visible-count');
  const status = document.getElementById('map-status');
  const categoryNames = { cafe: 'Café', restaurant: 'Restaurant', shop: 'Dog shop', hotel: 'Hotel' };
  const categoryIcons = {
    cafe: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h11v5.5A4.5 4.5 0 0 1 11.5 18h-2A4.5 4.5 0 0 1 5 13.5V8Zm11 2h1.5a2.5 2.5 0 0 1 0 5H16M7 5.5c0-1 1-1 1-2M11 5.5c0-1 1-1 1-2M4 20h14"/></svg>',
    restaurant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10a2.5 2.5 0 0 0 2.5-2.5V3M7 10v11M15 3v18M15 3c3 2 4.5 5.5 2.5 9H15"/></svg>',
    shop: '<svg class="paw-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.5" cy="8.4" r="2"/><circle cx="10.2" cy="5.7" r="2"/><circle cx="14.2" cy="5.7" r="2"/><circle cx="17.7" cy="8.6" r="2"/><path d="M12.1 10.4c-3.2 0-6.1 3.1-6.1 5.9 0 2 1.5 3.2 3.4 3.2 1 0 1.8-.5 2.7-.5.9 0 1.7.5 2.7.5 1.9 0 3.4-1.2 3.4-3.2 0-2.8-2.9-5.9-6.1-5.9Z"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V5h14v16M3 21h18M8 9h2m4 0h2m-8 4h2m4 0h2M10 21v-4h4v4"/></svg>'
  };
  let map;
  let geolocate;
  let places = [];
  let visiblePlaces = [];
  let markers = new Map();
  let selectedKey = null;
  let userLocation = null;
  let scrollTimer;
  let activeCategory = 'all';
  let activeDistrict = 'all';
  let districtBadgeMarker = null;

  const normaliseCategory = category => category === 'cafes' ? 'cafe' : category;
  const escapeHTML = value => String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const showStatus = message => {
    status.textContent = message;
    status.classList.add('show');
    window.setTimeout(() => status.classList.remove('show'), 3200);
  };
  const distanceBetween = (a, b) => {
    const radians = degrees => degrees * Math.PI / 180;
    const dLat = radians(b[1] - a[1]);
    const dLng = radians(b[0] - a[0]);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a[1])) * Math.cos(radians(b[1])) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };
  const formatDistance = kilometres => kilometres < 1 ? `${Math.round(kilometres * 1000)} m away` : `${kilometres.toFixed(1)} km away`;
  const ordinal = number => {
    const suffix = number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th';
    return `${number}${suffix}`;
  };
  const cardFor = place => {
    const category = normaliseCategory(place.category);
    const distance = userLocation ? `<span class="card-distance">${formatDistance(distanceBetween(userLocation, place.coordinates))}</span>` : '';
    return `<article class="map-card" data-key="${escapeHTML(place.key)}" data-category="${category}" tabindex="0" aria-label="Show ${escapeHTML(place.name)} on the map">
      <img class="map-card-image" src="${escapeHTML(place.images[0])}" alt="${escapeHTML(place.name)} in Paris">
      <div class="map-card-copy">
        <p class="map-card-kicker"><i class="dot ${category}"></i>${categoryNames[category]} ${distance}</p>
        <h2>${escapeHTML(place.name)}</h2>
        <p class="map-card-meta">${escapeHTML(place.meta)}</p>
        <p class="map-card-hours">${escapeHTML(place.openingHours || '')}</p>
        <div class="map-card-actions">
          <a class="primary" href="${escapeHTML(place.mapsUrl)}" target="_blank" rel="noopener">Directions</a>
          <a href="${escapeHTML(place.instagram)}" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </article>`;
  };

  const fitVisiblePlaces = () => {
    if (!visiblePlaces.length) return;
    const bounds = new maplibregl.LngLatBounds();
    visiblePlaces.forEach(place => bounds.extend(place.coordinates));
    const mobile = window.innerWidth <= 700;
    map.fitBounds(bounds, { padding: { top: mobile ? 190 : 155, right: mobile ? 42 : 65, bottom: mobile ? 220 : 245, left: mobile ? 42 : 65 }, maxZoom: activeDistrict === 'all' ? 13.2 : 14.5, duration: 650 });
  };

  const updateDistrictHighlight = () => {
    if (!map.getSource('district-highlight')) return;
    districtBadgeMarker?.remove();
    districtBadgeMarker = null;
    if (activeDistrict === 'all' || !visiblePlaces.length) {
      map.getSource('district-highlight').setData({ type: 'FeatureCollection', features: [] });
      return;
    }
    const districtPlaces = places.filter(place => String(place.arrondissement) === activeDistrict);
    const center = districtPlaces.reduce((total, place) => [total[0] + place.coordinates[0], total[1] + place.coordinates[1]], [0, 0]).map(value => value / districtPlaces.length);
    map.getSource('district-highlight').setData({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: center }, properties: { label: `${ordinal(Number(activeDistrict))} ARRONDISSEMENT` } }]
    });
    const badge = document.createElement('div');
    badge.className = 'district-map-badge';
    badge.innerHTML = `<strong>${ordinal(Number(activeDistrict))}</strong><span>arrondissement</span>`;
    districtBadgeMarker = new maplibregl.Marker({ element: badge, anchor: 'center', offset: [0, -72] }).setLngLat(center).addTo(map);
  };

  const selectPlace = (key, options = {}) => {
    const place = visiblePlaces.find(item => item.key === key);
    if (!place) return;
    selectedKey = key;
    rail.classList.add('has-selection');
    markers.forEach((entry, markerKey) => {
      const active = markerKey === key;
      entry.element.classList.toggle('active', active);
      entry.element.classList.toggle('is-muted', !active);
      entry.element.setAttribute('aria-pressed', active ? 'true' : 'false');
      entry.element.style.zIndex = active ? '10' : '1';
    });
    rail.querySelectorAll('.map-card').forEach(card => {
      const active = card.dataset.key === key;
      card.classList.toggle('active', active);
      card.setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (options.scroll !== false) rail.querySelector(`[data-key="${CSS.escape(key)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (options.pan !== false) map.easeTo({ center: place.coordinates, zoom: Math.max(map.getZoom(), 14.4), padding: { bottom: 180 }, duration: 650 });
  };

  const render = () => {
    visiblePlaces = places.filter(place =>
      (activeCategory === 'all' || normaliseCategory(place.category) === activeCategory) &&
      (activeDistrict === 'all' || String(place.arrondissement) === activeDistrict)
    );
    markers.forEach(entry => entry.marker.remove());
    markers.clear();
    rail.innerHTML = visiblePlaces.length ? visiblePlaces.map(cardFor).join('') : '<div class="map-empty">No places match both filters. Try another category or arrondissement.</div>';
    count.textContent = visiblePlaces.length;
    visiblePlaces.forEach(place => {
      const markerElement = document.createElement('button');
      const category = normaliseCategory(place.category);
      markerElement.className = 'map-marker';
      markerElement.dataset.category = category;
      markerElement.dataset.name = place.name;
      markerElement.type = 'button';
      markerElement.setAttribute('aria-label', `Show ${place.name}`);
      markerElement.setAttribute('aria-pressed', 'false');
      markerElement.innerHTML = `<span class="marker-shape"><span>${categoryIcons[category]}</span></span>`;
      markerElement.addEventListener('click', () => selectPlace(place.key));
      const marker = new maplibregl.Marker({ element: markerElement, anchor: 'bottom' }).setLngLat(place.coordinates).addTo(map);
      markers.set(place.key, { marker, element: markerElement });
    });
    rail.querySelectorAll('.map-card').forEach(card => {
      card.addEventListener('click', event => { if (!event.target.closest('a')) selectPlace(card.dataset.key, { scroll: false }); });
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') selectPlace(card.dataset.key, { scroll: false }); });
    });
    selectedKey = null;
    rail.classList.remove('has-selection');
    window.setTimeout(() => {
      updateDistrictHighlight();
      fitVisiblePlaces();
      if (visiblePlaces[0]) selectPlace(visiblePlaces[0].key, { pan: false, scroll: false });
    }, 50);
  };

  const buildDistrictFilters = () => {
    const districtFilters = document.getElementById('district-filters');
    const districts = [...new Set(places.map(place => place.arrondissement))].sort((a, b) => a - b);
    districtFilters.innerHTML = `<button class="active" data-district="all" aria-pressed="true">All districts</button>${districts.map(district => `<button data-district="${district}" aria-pressed="false">${ordinal(district)} arr.</button>`).join('')}`;
    districtFilters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      activeDistrict = button.dataset.district;
      districtFilters.querySelectorAll('button').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      render();
    }));
  };

  const updateDistances = coordinates => {
    userLocation = coordinates;
    rail.querySelectorAll('.map-card').forEach(card => {
      const place = visiblePlaces.find(item => item.key === card.dataset.key);
      const kicker = card.querySelector('.map-card-kicker');
      kicker.querySelector('.card-distance')?.remove();
      const label = document.createElement('span');
      label.className = 'card-distance';
      label.textContent = formatDistance(distanceBetween(userLocation, place.coordinates));
      kicker.append(label);
    });
  };

  const initialise = async () => {
    try {
      const response = await fetch('paris-places.json?v=5');
      if (!response.ok) throw new Error('Catalogue unavailable');
      const catalogue = await response.json();
      places = catalogue.places.filter(place => Array.isArray(place.coordinates)).map(place => ({ ...place, openingHours: catalogue.openingHours[place.key] }));
      buildDistrictFilters();
      map = new maplibregl.Map({
        container: mapElement,
        style: 'https://tiles.openfreemap.org/styles/positron',
        center: [2.3505, 48.8668],
        zoom: 12.2,
        attributionControl: false,
        maxZoom: 18
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
      geolocate = new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true });
      map.addControl(geolocate, 'top-right');
      geolocate.on('geolocate', event => { updateDistances([event.coords.longitude, event.coords.latitude]); showStatus('Your location is now shown on the map.'); });
      geolocate.on('error', () => showStatus('We could not access your location. Please check your browser permission.'));
      map.on('load', () => {
        map.addSource('district-highlight', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({ id: 'district-glow', type: 'circle', source: 'district-highlight', paint: { 'circle-radius': 72, 'circle-color': '#a76344', 'circle-opacity': .12, 'circle-stroke-color': '#a76344', 'circle-stroke-width': 2, 'circle-stroke-opacity': .48 } });
        map.addLayer({ id: 'district-label', type: 'symbol', source: 'district-highlight', layout: { 'text-field': ['get', 'label'], 'text-size': 14, 'text-letter-spacing': .13, 'text-allow-overlap': true }, paint: { 'text-color': '#7b3f2d', 'text-halo-color': '#f7f2e9', 'text-halo-width': 4 } });
        render();
      });
      document.querySelector('.locate-button').addEventListener('click', () => geolocate.trigger());
      document.querySelectorAll('.category-filters button').forEach(button => button.addEventListener('click', () => {
        activeCategory = button.dataset.category;
        document.querySelectorAll('.category-filters button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
        render();
      }));
      rail.addEventListener('scroll', () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          const railCenter = rail.scrollLeft + rail.clientWidth / 2;
          const cards = [...rail.querySelectorAll('.map-card')];
          const nearest = cards.reduce((best, card) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - railCenter) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - railCenter) ? card : best, cards[0]);
          if (nearest && nearest.dataset.key !== selectedKey) selectPlace(nearest.dataset.key, { scroll: false });
        }, 120);
      }, { passive: true });
    } catch (error) {
      console.error('Paris map initialization failed', error);
      mapElement.innerHTML = '<div style="padding:40px;font-family:DM Sans,sans-serif">The Paris map could not be loaded. Please try again shortly.</div>';
    }
  };
  initialise();
})();
