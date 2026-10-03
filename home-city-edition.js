(() => {
  const editions = {
    paris: { name: 'Paris', count: 29 },
    barcelona: { name: 'Barcelona', count: 8, image: 'assets/places/barcelona-mono-cafe-barcelona-1.webp', intro: 'Our Barcelona edit brings together six cafés, a Mediterranean restaurant and a considered city stay — from Poblenou to El Born and Eixample.', copy: 'From a quiet coffee in Poblenou to a Mediterranean lunch by the water. Explore our considered Barcelona addresses.' },
    madrid: { name: 'Madrid', count: 8, image: 'assets/places/madrid-hermanas-arce-editorial.webp', position: 'center 78%', intro: 'Our Madrid edit brings together characterful cafés, thoughtful food and a considered city stay — from Salesas and Chueca to Chamberí.', copy: 'Coffee, records, leafy terraces and a quiet city stay. Discover eight places to enjoy Madrid together.' },
    london: { name: 'London', count: 4, image: 'assets/places/london-abuelo-editorial.webp', intro: 'Our London edit starts with four considered coffee stops — from Golborne Road and Broadway Market to Covent Garden and Belgravia.', copy: 'Discover our four selected London cafés by district and neighbourhood, in a list or on the map.', map: 'assets/london-curated-map.png' },
    berlin: { name: 'Berlin', count: 7, image: 'assets/places/berlin-sofi-bakery-editorial.webp', intro: 'Our Berlin edit brings together seven cafés, bakeries and brunch spots — from Mitte and Prenzlauer Berg to Kreuzberg and Friedrichshain.', copy: 'Slow breakfasts, thoughtful coffee and neighbourhood bakeries. Seven places to explore Berlin together.' }
  };
  const applyCityEdition = () => {
    const requested = new URLSearchParams(location.search).get('city');
    const city = Object.hasOwn(editions, requested) ? requested : 'paris';
    const edition = editions[city];
    document.body.dataset.homeCity = city;
    const picker = document.querySelector('.guide-city-picker');
    picker?.querySelectorAll('a').forEach(link => {
      const choice = Object.keys(editions).find(name => link.textContent.toLowerCase().includes(name));
      if (!choice) return;
      link.href = `index.html?city=${choice}#cities`;
      if (choice === city) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const summary = picker?.querySelector('summary');
    if (summary) summary.textContent = edition.name;
    const section = document.querySelector('#cities');
    if (!section) return;
    section.querySelector('.featured-city-cards')?.classList.add('is-single-city');
    const secondary = section.querySelector('.home-london-card');
    if (secondary) secondary.hidden = true;
    document.title = `The Dog Friendly Guide · ${edition.name}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${edition.count} considered dog-friendly places in ${edition.name}.`;
    const intro = section.querySelector('.ecosystem-copy');
    if (intro) {
      intro.querySelector('h2').textContent = `${edition.name}, thoughtfully shared.`;
      intro.querySelector('p:last-child').textContent = edition.intro || 'Our Paris edit brings together beautiful dog-friendly cafés, restaurants, hotels and shops — chosen arrondissement by arrondissement for how they feel and how genuinely they welcome you both.';
    }
    if (city === 'paris') return;
    const primary = section.querySelector('.paris-launch-card');
    if (primary) {
      primary.href = `${city}-guide.html`;
      const crop = primary.querySelector('.crop');
      if (crop) { crop.classList.remove('city-paris'); crop.style.cssText = `background-image:url('${edition.image}');background-size:cover;background-position:${edition.position || 'center'}`; if (edition.position) crop.style.setProperty('background-position', edition.position, 'important'); }
      primary.querySelector('.launch-status').textContent = `Curated places · ${edition.name}`;
      primary.querySelector('h3').innerHTML = `${edition.count} curated places.<br>One considered guide.`;
      primary.querySelector('p').textContent = edition.copy;
      const preview = primary.querySelector('img');
      if (preview && edition.map) { preview.src = edition.map; preview.alt = `Illustrated map of ${edition.name}`; }
      else if (preview) preview.remove();
      primary.querySelector('.launch-link').textContent = `Browse the ${edition.name} guide →`;
    }
    const pathway = section.querySelector('.guide-pathway-head');
    if (pathway) {
      pathway.querySelector('h3').textContent = `Discover our selected ${edition.name} places`;
      pathway.querySelector('p').textContent = `Browse ${edition.count} thoughtful dog-friendly addresses by neighbourhood and type.`;
    }
    // Paris itineraries and quizzes are only relevant to the Paris edition.
    const play = section.querySelector('.guide-play-heading')?.parentElement;
    if (play) play.style.setProperty('display', 'none', 'important');
    const plans = section.querySelector('.home-plan-preview');
    if (plans) plans.hidden = true;
  };
  window.applyHomeCityEdition = applyCityEdition;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyCityEdition);
  else applyCityEdition();
})();
