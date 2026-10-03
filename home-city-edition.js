(() => {
  const editions = {
    hamburg: { name: 'Hamburg', count: 5, image: 'assets/places/hamburg-gotcha-matcha-editorial.webp', intro: 'Our Hamburg edit brings together two cafés, two dog shops and a harbour-side restaurant — from Eppendorf and Winterhude to the old town and HafenCity.', copy: 'Matcha, slow breakfasts, considered dog shops and a welcoming table by the harbour. Five places to enjoy Hamburg together.' },
    paris: { name: 'Paris', count: 29 },
    barcelona: { name: 'Barcelona', count: 8, image: 'assets/places/barcelona-mono-cafe-barcelona-1.webp', intro: 'Our Barcelona edit brings together six cafés, a Mediterranean restaurant and a considered city stay — from Poblenou to El Born and Eixample.', copy: 'From a quiet coffee in Poblenou to a Mediterranean lunch by the water. Explore our considered Barcelona addresses.' },
    madrid: { name: 'Madrid', count: 8, image: 'assets/places/madrid-hermanas-arce-editorial.webp', position: 'center 78%', intro: 'Our Madrid edit brings together characterful cafés, thoughtful food and a considered city stay — from Salesas and Chueca to Chamberí.', copy: 'Coffee, records, leafy terraces and a quiet city stay. Discover eight places to enjoy Madrid together.' },
    london: { name: 'London', count: 15, image: 'assets/places/london-abuelo-dog-editorial.webp', position: 'center bottom', intro: 'Our London edit brings together nine cafés and six dog shops — from Soho and Greenwich to Covent Garden, Chelsea and Wimbledon Village.', copy: 'Discover fifteen selected London cafés and dog shops by district and neighbourhood, in a list or on the map.', map: 'assets/london-curated-map.png' },
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
    // Apply the complete edition before the Paris-only enhancement scripts finish.
    const setText = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
    const photo = (node, src, position = 'center') => {
      if (!node) return;
      node.style.setProperty('background-image', `url('${src}')`, 'important');
      node.style.setProperty('background-position', position, 'important');
      node.style.setProperty('background-size', 'cover', 'important');
    };
    const shots = window.homeCityPlaces?.[city] || [];
    setText('.hero-copy > p', `A considered life together in ${edition.name}. Discover thoughtful places and neighbourhood moments for dogs and the people who share life with them.`);
    document.querySelectorAll('.desktop-nav a').forEach(link => {
      if (link.textContent.trim() === 'The Guide') link.href = `${city}-guide.html`;
    });
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      const choice = Object.keys(editions).find(key => link.textContent.trim() === `${editions[key].name} Guide`);
      if (choice) { link.href = `index.html?city=${choice}#cities`; link.toggleAttribute('data-selected-city', choice === city); }
    });
    document.querySelectorAll('a[href="coco-was-there.html"]').forEach(link => { link.href = '#coco'; if (city !== 'paris') link.textContent = 'City moments'; });
    const journal = document.querySelector('#journal');
    if (city !== 'paris' && journal) {
      const isBarcelona = city === 'barcelona';
      setText('#journal .ecosystem-copy > p:last-child', isBarcelona ? 'A Barcelona story and the ideas behind our selection.' : `The ideas behind our ${edition.name} selection: thoughtful design, a genuine welcome and time well spent together.`);
      const lead = journal.querySelector('.journal-lead');
      lead.href = isBarcelona ? 'journal-barcelona-with-dog.html' : 'journal-how-we-curate.html';
      lead.querySelector('h3').textContent = isBarcelona ? 'Barcelona, with your dog' : 'How we curate places worth sharing';
      lead.querySelector('p').textContent = isBarcelona ? 'Barcelona · The city journal' : 'Our point of view · 5 min read';
      photo(lead.querySelector('.crop'), edition.image, edition.position);
      journal.querySelector('.journal-list').hidden = true;
      journal.querySelector('.journal-grid').classList.add('city-journal-single');
      const more = journal.querySelector('.section-title > a');
      more.href = lead.href; more.textContent = 'Read the story →';
    }
    // Venue photography carries venue captions, never an invented Coco visit.
    if (shots.length) {
      setText('#coco .eyebrow', `In ${edition.name}`);
      setText('#coco h2', 'A closer look.');
      setText('#coco .coco-text > p:not(.eyebrow)', `A few of the places that give our ${edition.name} edit its character.`);
      const more = document.querySelector('#coco .outline-button');
      more.href = `${city}-guide.html`; more.textContent = `Explore ${edition.name}`;
      document.querySelectorAll('#coco .polaroid').forEach((figure, i) => {
        photo(figure.querySelector('.crop'), shots[i].image, shots[i].position);
        figure.querySelector('figcaption').textContent = shots[i].name;
      });
      document.querySelector('#coco .coco-logo-link').hidden = true;
      photo(document.querySelector('.newsletter-photo'), shots[0].image, shots[0].position);
    } else {
      // These are brand moments; their photos do not establish a city visit.
      ['A quiet pause', 'Out together', 'Little rituals'].forEach((caption, i) => {
        document.querySelectorAll('#coco figcaption')[i].textContent = caption;
      });
    }
    setText('#better-together > div:first-child > p:not(.eyebrow)', `Walks, coffee mornings and shared moments for dogs and their people in ${edition.name}.`);
    setText('.event-card-copy h3', `Better Together · ${edition.name}`);
    setText('.event-note', `Our next ${edition.name} gathering has not been announced yet. Details will appear here when it is ready.`);
    const poster = document.querySelector('.event-poster-stack');
    poster.hidden = city !== 'barcelona';
    document.querySelector('.event-card').classList.toggle('city-event-pending', city !== 'barcelona');
    setText('.circle-newsletter > div:nth-child(2) > p:not(.eyebrow)', `Thoughtful places in ${edition.name}, new city guides and news from The Dog Friendly Guide.`);
    // Keep contextual navigation explicit in URLs, including the trip back home.
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      const url = new URL(href, location.href);
      if (url.origin === location.origin && /\/(journal[^/]*|about|contact|submit)\.html$/.test(url.pathname)) {
        url.searchParams.set('city', city);
        link.href = url.pathname + url.search + url.hash;
      }
    });
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://thedogfriendlyguide.com/?city=${city}`;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description.content);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical.href);
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
    if (plans && shots.length) {
      plans.hidden = false;
      plans.innerHTML = `<p class="guide-preview-kicker">From the ${edition.name} guide</p><p class="guide-preview-intro">Places to keep close.</p><div class="guide-preview-rail city-place-highlights" aria-label="Selected ${edition.name} places">${shots.map(place => `<article class="guide-preview-card"><a class="guide-card-link" href="${place.href}"><img src="${place.image}" alt="${place.name}" style="object-position:${place.position || 'center'}" loading="lazy"><h3>${place.name}</h3></a><p class="guide-preview-tags">${place.meta}</p></article>`).join('')}</div>`;
    }
  };
  window.applyHomeCityEdition = applyCityEdition;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyCityEdition);
  else applyCityEdition();
})();
