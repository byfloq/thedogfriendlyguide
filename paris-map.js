(() => {
  const mapElement = document.getElementById('paris-map');
  const rail = document.getElementById('place-rail');
  const count = document.getElementById('visible-count');
  const status = document.getElementById('map-status');
  const categoryNames = { cafe: 'Café', restaurant: 'Restaurant', shop: 'Dog shop', hotel: 'Hotel' };
  const categoryIcons = { cafe: 'C', restaurant: 'R', shop: 'S', hotel: 'H' };
  let map;
  let geolocate;
  let places = [];
  let visiblePlaces = [];
  let markers = new Map();
  let selectedKey = null;
  let userLocation = null;
  let scrollTimer;

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
  const cardFor = place => {
    const category = normaliseCategory(place.category);
    const distance = userLocation ? `<span class="card-distance">${formatDistance(distanceBetween(userLocation, place.coordinates))}</span>` : '';
    return `<article class="map-card" data-key="${escapeHTML(place.key)}" tabindex="0" aria-label="Show ${escapeHTML(place.name)} on the map">
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
    map.fitBounds(bounds, { padding: { top: 120, right: 65, bottom: 235, left: 65 }, maxZoom: 13.2, duration: 650 });
  };

  const selectPlace = (key, options = {}) => {
    const place = visiblePlaces.find(item => item.key === key);
    if (!place) return;
    selectedKey = key;
    markers.forEach((entry, markerKey) => entry.element.classList.toggle('active', markerKey === key));
    rail.querySelectorAll('.map-card').forEach(card => card.classList.toggle('active', card.dataset.key === key));
    if (options.scroll !== false) rail.querySelector(`[data-key="${CSS.escape(key)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (options.pan !== false) map.easeTo({ center: place.coordinates, zoom: Math.max(map.getZoom(), 14.4), padding: { bottom: 180 }, duration: 650 });
  };

  const render = category => {
    visiblePlaces = category === 'all' ? places : places.filter(place => normaliseCategory(place.category) === category);
    markers.forEach(entry => entry.marker.remove());
    markers.clear();
    rail.innerHTML = visiblePlaces.map(cardFor).join('');
    count.textContent = visiblePlaces.length;
    visiblePlaces.forEach(place => {
      const markerElement = document.createElement('button');
      const category = normaliseCategory(place.category);
      markerElement.className = 'map-marker';
      markerElement.dataset.category = category;
      markerElement.type = 'button';
      markerElement.setAttribute('aria-label', `Show ${place.name}`);
      markerElement.innerHTML = `<span>${categoryIcons[category]}</span>`;
      markerElement.addEventListener('click', () => selectPlace(place.key));
      const marker = new maplibregl.Marker({ element: markerElement, anchor: 'bottom' }).setLngLat(place.coordinates).addTo(map);
      markers.set(place.key, { marker, element: markerElement });
    });
    rail.querySelectorAll('.map-card').forEach(card => {
      card.addEventListener('click', event => { if (!event.target.closest('a')) selectPlace(card.dataset.key, { scroll: false }); });
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') selectPlace(card.dataset.key, { scroll: false }); });
    });
    selectedKey = null;
    window.setTimeout(fitVisiblePlaces, 50);
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
      const response = await fetch('paris-places.json');
      if (!response.ok) throw new Error('Catalogue unavailable');
      const catalogue = await response.json();
      places = catalogue.places.filter(place => Array.isArray(place.coordinates)).map(place => ({ ...place, openingHours: catalogue.openingHours[place.key] }));
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
      map.on('load', () => render('all'));
      document.querySelector('.locate-button').addEventListener('click', () => geolocate.trigger());
      document.querySelectorAll('.map-filters button').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('.map-filters button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
        render(button.dataset.category);
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
      mapElement.innerHTML = '<div style="padding:40px;font-family:DM Sans,sans-serif">The Paris map could not be loaded. Please try again shortly.</div>';
    }
  };
  initialise();
})();
