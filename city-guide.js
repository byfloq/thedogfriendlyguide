document.querySelectorAll('.cg-filters button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.cg-filters button').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  const filter = btn.dataset.filter;
  let shown = 0;
  document.querySelectorAll('.place-card').forEach(card => {
    const visible = filter === 'all' || card.dataset.area === filter || card.dataset.category === filter;
    card.classList.toggle('hidden', !visible);
    if (visible) shown++;
  });
  const empty = document.querySelector('.empty-state');
  if (empty) empty.style.display = shown ? 'none' : 'block';
}));

(() => {
  const main = document.querySelector('.cg-main');
  const grid = document.querySelector('.place-grid');
  const cards = [...document.querySelectorAll('.place-card')];
  const filters = [...document.querySelectorAll('.cg-filters button')]
    .filter(button => button.dataset.filter && button.dataset.filter !== 'all');
  if (!main || !grid || !cards.length) return;

  const editor = cards[0];
  const title = editor.querySelector('h3')?.textContent?.trim() || 'A local favourite';
  const meta = editor.querySelector('.place-category')?.textContent?.trim() || 'Editor selected';
  const desc = editor.querySelector('.desc')?.textContent?.trim() || 'A thoughtful, dog-friendly place selected by our editors.';
  const editorStyle = editor.querySelector('.place-thumb')?.getAttribute('style') || '';
  const link = editor.querySelector('.place-actions a')?.getAttribute('href') || '#';

  const gallery = (editor.dataset.gallery || '').split('|').map(value => value.trim()).filter(Boolean);
  const slideStyles = gallery.length
    ? gallery.map(url => `--thumb:url('${url.replace(/['"]/g, '')}')`)
    : [editorStyle];

  const collectionCards = filters.slice(0, 3).map(filter =>
    cards.find(card => card.dataset.area === filter.dataset.filter) || cards[0]
  );
  const names = ['Slow mornings', 'Coffee & treats', 'Terraces & walks'];
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
    </div>
    <div class="guide-collections">
      <p class="discovery-eyebrow">Collections</p>
      <div class="collection-grid">${filters.slice(0, 3).map((filter, index) => {
        const card = collectionCards[index];
        const style = card.querySelector('.place-thumb')?.getAttribute('style') || editorStyle;
        return `<button type="button" class="collection-card" data-collection-filter="${filter.dataset.filter}"><span class="collection-image" style="${style}"></span><strong>${names[index]}</strong><small>Explore ${filter.textContent.trim()}</small></button>`;
      }).join('')}</div>
    </div>`;
  main.insertBefore(section, main.firstChild);

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
  section.querySelectorAll('[data-collection-filter]').forEach(button => button.addEventListener('click', () => {
    const target = document.querySelector(`.cg-filters button[data-filter="${button.dataset.collectionFilter}"]`);
    if (target) {
      target.click();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));
})();
