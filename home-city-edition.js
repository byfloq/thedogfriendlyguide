(() => {
  const applyCityEdition = () => {
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
  const section = document.querySelector('#cities');
  if (!section) return;
  const featuredCards = section.querySelector('.featured-city-cards');
  const secondary = section.querySelector('.home-london-card');
  featuredCards?.classList.add('is-single-city');
  if (secondary) secondary.hidden = true;
  if (city !== 'london') {
    document.title = 'The Dog Friendly Guide · Paris';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'A curated guide to beautiful dog-friendly cafés, restaurants, hotels and shops in Paris.';
    const intro = section.querySelector('.ecosystem-copy');
    if (intro) {
      intro.querySelector('h2').textContent = 'Paris, thoughtfully shared.';
      intro.querySelector('p:last-child').textContent = 'Our Paris edit brings together beautiful dog-friendly cafés, restaurants, hotels and shops — chosen arrondissement by arrondissement for how they feel and how genuinely they welcome you both.';
    }
    return;
  }
  document.title = 'The Dog Friendly Guide · London';
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = 'A curated guide to beautiful dog-friendly cafés, restaurants, hotels and shops in London.';
  const intro = section.querySelector('.ecosystem-copy');
  if (intro) {
    intro.querySelector('h2').textContent = 'London, thoughtfully shared.';
    intro.querySelector('p:last-child').textContent = 'Our London edit brings together beautiful dog-friendly cafés, restaurants, hotels and shops — chosen neighbourhood by neighbourhood for how they feel and how genuinely they welcome you both.';
  }
  const primary = section.querySelector('.paris-launch-card');
  if (primary) {
    primary.href = 'london-guide.html';
    const crop = primary.querySelector('.crop');
    if (crop) { crop.classList.remove('city-paris'); crop.style.cssText = "background-image:url('assets/floq-guide-editorial-london-v1.png');background-size:cover;background-position:center 54%"; }
    primary.querySelector('.launch-status').textContent = 'Curated places · London';
    primary.querySelector('h3').innerHTML = '4 curated places.<br>One considered guide.';
    primary.querySelector('p').textContent = 'Find thoughtful dog-friendly addresses across London by district and neighbourhood.';
    const preview = primary.querySelector('img');
    if (preview) { preview.src = 'assets/london-curated-map.png'; preview.alt = 'Illustrated map of London with curated café, restaurant, hotel and dog-shop markers'; }
    primary.querySelector('.launch-link').textContent = 'Browse the London guide →';
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
    ['Build your own London plan','assets/city_london_hero.jpg','Plan a day in dog-friendly London',['Your time','Your area','Your mood']]
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
  const journal = document.querySelector('#journal');
  if (journal) {
    const lead = journal.querySelector('.journal-lead');
    if (lead) lead.href = 'journal.html';
    const leadTitle = journal.querySelector('.journal-lead h3');
    if (leadTitle) leadTitle.textContent = 'A slow Sunday in London';
    const leadMeta = journal.querySelector('.journal-lead p');
    if (leadMeta) leadMeta.textContent = 'London · The city journal';
    const firstStory = journal.querySelector('.journal-list a:first-child h3');
    if (firstStory) firstStory.textContent = 'A quiet London café where dogs are always welcome';
    const firstStoryLink = journal.querySelector('.journal-list a:first-child');
    if (firstStoryLink) firstStoryLink.href = 'journal.html';
  }
  document.querySelectorAll('.polaroids .polaroid figcaption').forEach((caption, index) => {
    caption.textContent = ['Day in London', 'Weekend in London', 'A quiet London morning'][index] || caption.textContent;
  });
  const londonCocoMoments = [
    ['assets/coco/coco-london-cafe.png', 'Coco beside a café on a rainy London street'],
    ['assets/coco/coco-london-townhouse.png', 'Coco on the steps of a Georgian London townhouse'],
    ['assets/coco/coco-london-canal.png', 'Coco walking beside Regent’s Canal in London']
  ];
  document.querySelectorAll('.polaroids .polaroid img').forEach((image, index) => {
    const moment = londonCocoMoments[index];
    if (!moment) return;
    image.src = moment[0];
    image.alt = moment[1];
  });
  const circleCopy = document.querySelector('.circle-newsletter > div:nth-child(2) > p:not(.eyebrow)');
  if (circleCopy) circleCopy.textContent = 'New London guides, thoughtful places and Better Together gatherings—sent occasionally, and always worth opening.';
  };
  window.applyHomeCityEdition = applyCityEdition;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyCityEdition);
  else applyCityEdition();
})();
