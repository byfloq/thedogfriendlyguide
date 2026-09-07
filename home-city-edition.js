(() => {
  const requested = new URLSearchParams(location.search).get('city');
  const city = requested === 'london' ? 'london' : 'paris';
  document.body.dataset.homeCity = city;
  const picker = document.querySelector('.guide-city-picker');
  picker?.querySelectorAll('a').forEach((link) => {
    const choice = link.textContent.toLowerCase().includes('london') ? 'london' : 'paris';
    link.href = `index.html?city=${choice}#cities`;
    if (choice === city) link.setAttribute('aria-current', 'page');
  });
  const summary = picker?.querySelector('summary');
  if (summary) summary.textContent = city === 'london' ? 'London' : 'Paris';
  if (city !== 'london') return;
  const section = document.querySelector('#cities');
  if (!section) return;
  const intro = section.querySelector('.ecosystem-copy');
  if (intro) {
    intro.querySelector('h2').textContent = 'London, thoughtfully shared.';
    intro.querySelector('p:last-child').textContent = 'Our London edit brings together beautiful dog-friendly cafés, restaurants, hotels and shops — chosen neighbourhood by neighbourhood for how they feel and how genuinely they welcome you both.';
  }
  const primary = section.querySelector('.paris-launch-card');
  const secondary = section.querySelector('.home-london-card');
  if (primary) {
    primary.href = 'london-guide.html';
    const crop = primary.querySelector('.crop');
    if (crop) { crop.classList.remove('city-paris'); crop.style.cssText = "background-image:url('assets/city_london_hero.jpg');background-size:cover;background-position:center 52%"; }
    primary.querySelector('.launch-status').textContent = 'Curated places · London';
    primary.querySelector('h3').innerHTML = '4 curated places.<br>One considered guide.';
    primary.querySelector('p').textContent = 'Find thoughtful dog-friendly addresses across London by district and neighbourhood.';
    const preview = primary.querySelector('img');
    if (preview) { preview.src = 'assets/city_london.jpg'; preview.alt = 'The London dog-friendly guide'; }
    primary.querySelector('.launch-link').textContent = 'Browse the London guide →';
  }
  if (secondary) {
    secondary.href = 'paris-guide.html';
    const image = secondary.querySelector('img');
    if (image) { image.src = 'assets/journal-slow-sunday-persona-v1.jpg'; image.alt = 'A dog-friendly Paris street'; }
    secondary.querySelector('.launch-status').textContent = 'Curated places · Paris';
    secondary.querySelector('h3').innerHTML = 'Paris,<br>arrondissement by arrondissement.';
    secondary.querySelector('p').textContent = 'Browse our considered addresses across Paris.';
    secondary.querySelector('.launch-link').textContent = 'Open the Paris guide →';
  }
  const kicker = section.querySelector('.guide-preview-kicker');
  const guideIntro = section.querySelector('.guide-preview-intro');
  const rail = section.querySelector('.guide-preview-rail');
  if (kicker) kicker.textContent = 'Curated London guides';
  if (guideIntro) guideIntro.textContent = 'Thoughtful London plans for the two of you.';
  if (rail) rail.setAttribute('aria-label', 'Explore London guides and places');
  const guides = [
    ['A Slow Morning in Covent Garden','assets/places/abuelo.webp','A considered café in Covent Garden',['3 hours','4 stops','Central London','🐾 Relaxed']],
    ['An Afternoon on Broadway Market','assets/places/arabica.webp','A dog-friendly stop near Broadway Market',['4 hours','4 stops','East London','🐾🐾 Moderate']],
    ['A Sunday Along Golborne Road','assets/places/klear-labs.webp','A quiet London neighbourhood café',['3.5 hours','4 stops','West London','🐾 Relaxed']],
    ['Build your own London plan','assets/city_london.jpg','Plan a day in dog-friendly London',['Your time','Your area','Your mood']]
  ];
  section.querySelectorAll('.guide-preview-card').forEach((card, index) => {
    const data = guides[index]; if (!data) return;
    card.dataset.guideKey = `london-${index + 1}`;
    const link = card.querySelector('.guide-card-link'); if (link) link.href = 'london-guide.html';
    const image = card.querySelector('img'); if (image) { image.src = data[1]; image.alt = data[2]; }
    const title = card.querySelector('h3'); if (title) title.textContent = data[0];
    const tags = card.querySelector('.guide-preview-tags'); if (tags) tags.innerHTML = data[3].map((tag) => `<span>${tag}</span>`).join('');
    const badge = card.querySelector('.guide-editorial-badge'); if (badge) badge.textContent = index === 0 ? 'Coco’s pick' : '';
    const save = card.querySelector('.guide-save'); if (save) { save.dataset.saveGuide = `london-${index + 1}`; save.setAttribute('aria-label', `Save ${data[0]}`); }
  });
})();
