(() => {
  'use strict';
  const country = document.getElementById('park-country');
  const locality = document.getElementById('park-locality');
  const search = document.getElementById('park-search');
  const fenced = document.getElementById('park-fenced');
  const results = document.getElementById('park-results');
  const count = document.getElementById('park-count');
  const more = document.getElementById('park-more');
  const empty = document.getElementById('park-empty');
  const error = document.getElementById('park-error');
  const params = new URLSearchParams(location.search);
  const pageSize = 36;
  let parks = [];
  let limit = pageSize;
  let ready = false;
  const normalize = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

  function updateLocalities() {
    const selected = locality.value;
    locality.innerHTML = '';
    locality.add(new Option(country.value ? 'All cities and areas' : 'Choose a country first', ''));
    locality.disabled = !country.value;
    if (country.value) {
      const names = [...new Set(parks.filter(park => park.countryCode === country.value).map(park => park.locality))].sort((a, b) => a.localeCompare(b));
      for (const name of names) locality.add(new Option(name, name));
    }
    if ([...locality.options].some(option => option.value === selected)) locality.value = selected;
  }

  function parkCard(park) {
    const coordinates = park.coordinates;
    const rating = park.referenceRating === null ? 'Not listed' : `${park.referenceRating} / 5`;
    const reviews = park.referenceReviewCount === null ? 'Not listed' : park.referenceReviewCount.toLocaleString('en-GB');
    const share = `parks.html?park=${encodeURIComponent(park.id)}`;
    return `<article class="park-card" id="${escape(park.id)}"><p class="park-location">${escape(park.locality)} · ${escape(park.country)}</p><h2>${escape(park.name)}</h2><p class="park-address">${escape(park.address.toLowerCase() === 'unknown' ? 'Address not listed' : park.address)}${park.postalCode && !park.address.includes(park.postalCode) ? `<br>${escape(park.postalCode)}` : ''}</p><div class="park-actions"><span class="park-enclosure">${park.fenced ? 'Fenced' : 'Unfenced'}</span><a class="park-directions" href="${escape(park.mapsUrl)}" target="_blank" rel="noopener">Directions ↗</a></div><details class="park-details" ${params.get('park') === park.id ? 'open' : ''}><summary>Park details</summary><dl><dt>Country</dt><dd>${escape(park.country)}</dd><dt>City or area</dt><dd>${escape(park.locality)}</dd><dt>Postal code</dt><dd>${escape(park.postalCode || 'Not listed')}</dd><dt>Latitude</dt><dd>${coordinates ? coordinates.latitude.toFixed(6) : 'Not listed'}</dd><dt>Longitude</dt><dd>${coordinates ? coordinates.longitude.toFixed(6) : 'Not listed'}</dd><dt>Reference rating</dt><dd>${escape(rating)}</dd><dt>Review count</dt><dd>${escape(reviews)}</dd></dl><a class="park-share" href="${share}">Link to this park</a></details></article>`;
  }

  function render() {
    if (!ready) return;
    const query = normalize(search.value);
    const city = params.get('guideCity');
    const selectedPark = params.get('park');
    const matches = parks.filter(park => (!selectedPark || park.id === selectedPark)
      && (!country.value || park.countryCode === country.value)
      && (!locality.value || park.locality === locality.value)
      && (!fenced.value || park.fenced === (fenced.value === 'yes'))
      && (!city || park.guideCity === city)
      && (!query || normalize(`${park.name} ${park.locality} ${park.address} ${park.postalCode || ''} ${park.country}`).includes(query)));
    count.textContent = `${matches.length.toLocaleString('en-GB')} ${matches.length === 1 ? 'park' : 'parks'}${matches.length > limit ? ` · Showing ${limit}` : ''}`;
    results.innerHTML = matches.slice(0, limit).map(parkCard).join('');
    more.hidden = matches.length <= limit;
    empty.hidden = matches.length > 0;
  }

  async function load() {
    error.hidden = true;
    count.textContent = 'Loading parks…';
    try {
      const response = await fetch('parks-catalogue.v1.json', {cache:'no-cache'});
      if (!response.ok) throw new Error('Park catalogue unavailable');
      const data = await response.json();
      if (data.schemaVersion !== 1 || !Array.isArray(data.parks)) throw new Error('Unsupported park catalogue');
      parks = data.parks;
      const selected = parks.find(park => park.id === params.get('park') || park.aliases?.includes(params.get('park')));
      if (selected) {
        params.set('park', selected.id);
        country.value = selected.countryCode;
        search.value = selected.name;
      } else if (params.get('country')) country.value = params.get('country');
      updateLocalities();
      ready = true;
      render();
    } catch {
      error.hidden = false;
      count.textContent = 'Parks could not load';
      empty.hidden = true;
      more.hidden = true;
    }
  }

  document.querySelector('.parks-filters').addEventListener('submit', event => event.preventDefault());
  country.addEventListener('change', () => {locality.value = '';updateLocalities();limit = pageSize;params.delete('guideCity');params.delete('park');render();});
  for (const input of [search, locality, fenced]) input.addEventListener(input === search ? 'input' : 'change', () => {limit = pageSize;params.delete('park');render();});
  more.addEventListener('click', () => {limit += pageSize;render();});
  document.getElementById('park-reset').addEventListener('click', () => {
    country.value = '';locality.value = '';search.value = '';fenced.value = '';params.delete('guideCity');params.delete('park');limit = pageSize;updateLocalities();render();
  });
  document.getElementById('park-retry').addEventListener('click', load);
  load();
})();
