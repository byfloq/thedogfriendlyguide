(() => {
  const cards = [...document.querySelectorAll('.place-card')];
  const areaFilters = document.querySelector('.area-filters');
  if (!cards.length || !areaFilters) return;

  const categoryAliases = {
    cafe: 'cafe', cafes: 'cafe', restaurant: 'restaurant', restaurants: 'restaurant',
    hotel: 'hotel', hotels: 'hotel', grooming: 'grooming', 'dog-grooming': 'grooming',
    shop: 'shop', shops: 'shop', 'dog-shop': 'shop'
  };
  const categoryLabels = [
    ['cafe', 'Cafés'], ['restaurant', 'Restaurants'], ['hotel', 'Hotels'],
    ['grooming', 'Dog Grooming'], ['shop', 'Dog Shops']
  ];

  cards.forEach(card => {
    card.dataset.category = categoryAliases[card.dataset.category] || card.dataset.category;
  });
  const available = new Set(cards.map(card => card.dataset.category));
  const typeFilters = document.createElement('nav');
  typeFilters.className = 'cg-filters type-filters';
  typeFilters.setAttribute('aria-label', 'Filter places by type');
  typeFilters.innerHTML = `<span class="filter-label">Type of place</span>
    <button class="active" data-filter="all" aria-pressed="true">All</button>
    ${categoryLabels.filter(([value]) => available.has(value)).map(([value, label]) =>
      `<button data-filter="${value}" aria-pressed="false">${label}</button>`
    ).join('')}`;
  areaFilters.before(typeFilters);

  const selected = { type: 'all', area: 'all' };
  const applyFilters = () => {
    let shown = 0;
    cards.forEach(card => {
      const visible = (selected.type === 'all' || card.dataset.category === selected.type)
        && (selected.area === 'all' || card.dataset.area === selected.area);
      card.classList.toggle('hidden', !visible);
      if (visible) shown++;
    });
    const empty = document.querySelector('.empty-state');
    if (empty) empty.style.display = shown ? 'none' : 'block';
  };

  const bindGroup = (group, key) => {
    group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      selected[key] = button.dataset.filter;
      applyFilters();
    }));
  };
  bindGroup(typeFilters, 'type');
  bindGroup(areaFilters, 'area');
})();

(() => {
  const main = document.querySelector('.cg-main');
  const grid = document.querySelector('.place-grid');
  const cards = [...document.querySelectorAll('.place-card')];
  if (!main || !grid || !cards.length) return;

  const editor = cards[0];
  const title = editor.querySelector('h3')?.textContent?.trim() || 'A local favourite';
  if (title === 'Simple Coffee') {
    editor.dataset.gallery = [
      'assets/places/simple-coffee-instagram-hq.jpg',
      'assets/places/simple-coffee-2-hq.jpg',
      'assets/places/simple-coffee-3-hq.jpg'
    ].join('|');
    editor.querySelector('.place-thumb')?.style.setProperty('--thumb', "url('assets/places/simple-coffee-instagram-hq.jpg')");
  }
  const meta = editor.querySelector('.place-category')?.textContent?.trim() || 'Editor selected';
  const desc = editor.querySelector('.desc')?.textContent?.trim() || 'A thoughtful, dog-friendly place selected by our editors.';
  const editorStyle = editor.querySelector('.place-thumb')?.getAttribute('style') || '';
  const link = editor.querySelector('.place-actions a')?.getAttribute('href') || '#';

  const gallery = (editor.dataset.gallery || '').split('|').map(value => value.trim()).filter(Boolean);
  const slideStyles = gallery.length
    ? gallery.map(url => `--thumb:url('${url.replace(/['"]/g, '')}')`)
    : [editorStyle];

  const section = document.createElement('section');
  section.className = 'guide-discovery';
  section.innerHTML = `
    <div class="editors-pick">
      <p class="discovery-eyebrow">Editor's Pick</p>
      <article class="editors-card">
        <div class="editors-gallery">
          <div class="editors-slides">${slideStyles.map((style, index) =>
            `<div class="editors-image${index === 0 ? ' active' : ''}" style="${style}" role="img" aria-label="${title.replace(/"/g, '&quot;')} — photo ${index + 1}"></div>`
          ).join('')}</div>
          ${slideStyles.length > 1 ? `
            <button class="gallery-arrow gallery-prev" type="button" aria-label="Previous photo">←</button>
            <button class="gallery-arrow gallery-next" type="button" aria-label="Next photo">→</button>
            <div class="gallery-dots">${slideStyles.map((_, index) =>
              `<button type="button" aria-label="Show photo ${index + 1}" aria-pressed="${index === 0}"></button>`
            ).join('')}</div>` : ''}
        </div>
        <div class="editors-copy"><h2>${title}</h2><p class="editors-meta">${meta}</p><p>${desc}</p><a href="${link}" target="_blank" rel="noopener">View place <span>→</span></a></div>
      </article>
    </div>`;
  main.insertBefore(section, main.firstChild);

  const introTitle = main.querySelector('.cg-intro h2');
  if (introTitle) introTitle.remove();

  const tagRow = document.createElement('section');
  tagRow.className = 'guide-tags';
  section.after(tagRow);
  const typeFilters = document.querySelector('.type-filters');
  const areaFilters = document.querySelector('.area-filters');
  if (typeFilters && areaFilters) tagRow.append(typeFilters, areaFilters);

  let current = 0;
  const slides = [...section.querySelectorAll('.editors-image')];
  const dots = [...section.querySelectorAll('.gallery-dots button')];
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
  };
  section.querySelector('.gallery-prev')?.addEventListener('click', () => show(current - 1));
  section.querySelector('.gallery-next')?.addEventListener('click', () => show(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
})();
