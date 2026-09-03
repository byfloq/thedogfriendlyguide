(() => {
  // Canonical cross-project catalogue: paris-places.json.
  // Keep it aligned whenever a Paris recommendation changes so the Flōq app
  // and the website consume the same complete list.
  const grid = document.querySelector('.place-grid');
  if (!grid || !document.body.classList.contains('city-guide-page') || !location.pathname.endsWith('paris-guide.html')) return;

  const approvedPlaces = [
    {
      title: 'Clove Coffee Shop', meta: 'Specialty coffee · Montmartre', area: 'montmartre', key: 'clove-coffee-shop', category: 'cafe',
      description: 'A Montmartre multiroaster where rotating specialty coffees meet a small ceramics collection, with dogs warmly welcomed by the resident café family.',
      instagram: 'https://www.instagram.com/clovecoffeeshop/', maps: 'Clove Coffee Shop 14 Rue Chappe 75018 Paris',
      images: ['assets/places/clove-coffee-hq.jpg', 'assets/places/clove-iced-tea-hq.jpg', 'assets/places/clove-friends-hq.jpg']
    },
    {
      title: 'Mardi', meta: 'Coffee & baked goods · Belleville', area: 'belleville', key: 'mardi-cafe', category: 'cafe',
      description: 'A neighbourhood café on Rue de la Villette serving fresh coffee and baked goods every day, with an easygoing, dog-friendly welcome.',
      instagram: 'https://www.instagram.com/mardicafeparis/', maps: 'Mardi Cafe 29 Rue de la Villette Paris',
      images: ['assets/places/mardi-space-hq.jpg', 'assets/places/mardi-baked-goods-hq.jpg', 'assets/places/mardi-facade.jpg']
    },
    {
      title: 'Niwa', meta: 'Bakery & café · Vaneau', area: 'vaneau', key: 'niwa-paris', category: 'cafe',
      description: 'A serene maison de pétrissage on Rue Vaneau, pairing Japanese sensibility with breads and vegetable-led plates - and a warm welcome for dogs.',
      instagram: 'https://www.instagram.com/niwa_paris_/', maps: 'Niwa 56 Rue Vaneau 75007 Paris',
      images: ['assets/places/niwa-soft-serve.jpg', 'assets/places/niwa-space-hq.jpg', 'assets/places/niwa-bread-hq.jpg']
    },
    {
      title: 'Partisan Café', meta: 'Café & roastery · Étienne Marcel', area: 'etienne-marcel', key: 'partisan-cafe', category: 'cafe',
      description: 'A spacious Rue de Turbigo café and working roastery devoted to specialty coffee, where dogs are welcome inside.',
      instagram: 'https://www.instagram.com/parispartisancafe/', maps: 'Partisan Cafe 36 Rue de Turbigo 75003 Paris',
      images: ['assets/places/partisan-machine.jpg', 'assets/places/partisan-community-hq.jpg', 'assets/places/partisan-affogato-hq.jpg']
    },
    {
      title: 'Tanat Victoria', meta: 'Specialty coffee · Châtelet', area: 'chatelet', key: 'tanat-victoria', category: 'cafe',
      description: 'Tanat’s clean-lined Victoria coffee shop near Châtelet pairs precisely roasted specialty coffee with the warmest dog welcome in the group, according to its team.',
      instagram: 'https://www.instagram.com/tanat.coffee/', maps: 'Tanat Victoria Châtelet Paris',
      images: ['assets/places/tanat-victoria-interior.jpg', 'assets/places/tanat-victoria-detail.jpg', 'assets/places/tanat-victoria-espresso.jpg']
    },
    {
      title: 'Forêt Forêt', meta: 'Specialty coffee & tea · Le Marais', area: 'le-marais', key: 'foret-foret', category: 'cafe',
      description: 'A calm, laptop-free coffee and tea stop near Place des Vosges where sociable dogs are welcome alongside Serge, the resident American Shepherd.',
      instagram: 'https://www.instagram.com/foretforet_paris/', maps: 'Forêt Forêt 64 Rue des Tournelles 75003 Paris',
      images: ['assets/places/foret-foret-dog-space.jpg', 'assets/places/foret-foret-pour-over.jpg', 'assets/places/foret-foret-architecture.jpg']
    },
    {
      title: 'Barkers + Brothers', meta: 'Dog shop & café · Montmartre', area: 'montmartre', key: 'barkers-brothers', category: 'shop',
      description: 'A warm Montmartre concept store pairing thoughtfully chosen dog goods with coffee, treats and an easy neighbourhood feel.',
      instagram: 'https://www.instagram.com/barkersandbrothers/', maps: 'Barkers and Brothers 46 Rue Berthe 75018 Paris', images: ['assets/places/barkers-brothers.jpg', 'assets/places/barkers-brothers-2.jpg', 'assets/places/barkers-brothers-3.jpg']
    },
    {
      title: "Gino's Paris", meta: 'Boutique, grooming & daycare · Latin Quarter', area: 'latin-quarter', key: 'ginos-paris', category: 'shop',
      description: 'A polished canine concept store combining premium accessories, gentle grooming and daycare in the heart of the Latin Quarter.',
      instagram: 'https://www.instagram.com/ginos.paris/', maps: "Gino's Paris 7 Rue de la Montagne Sainte-Geneviève 75005 Paris", images: ['assets/places/ginos-paris.jpg', 'assets/places/ginos-paris-2.jpg', 'assets/places/ginos-paris-3.jpg']
    },
    {
      title: 'Animal Particulier', meta: 'Independent pet shop · Montmartre', area: 'montmartre', key: 'animal-particulier', category: 'shop',
      description: 'An independent Montmartre address for distinctive accessories, clothing and small-batch finds for dogs and cats.',
      instagram: 'https://www.instagram.com/animal_particulier/', maps: 'Animal Particulier 11 Square de Clignancourt 75018 Paris', images: ['assets/places/animal-particulier.jpg', 'assets/places/animal-particulier-2.jpg', 'assets/places/animal-particulier-3.jpg']
    },
    {
      title: 'Casa del Doggo', meta: 'Dog bakery & concept store · Auteuil', area: 'auteuil', key: 'casa-del-doggo', category: 'shop',
      description: 'A joyful dog-first bakery with handmade treats, a colourful shop and a self-service dog wash designed for time together.',
      instagram: 'https://www.instagram.com/casadeldoggobakery/', maps: 'Casa del Doggo 13 Rue Pierre Guérin 75016 Paris', images: ['assets/places/casa-del-doggo.jpg', 'assets/places/casa-del-doggo-2.jpg', 'assets/places/casa-del-doggo-3.jpg']
    },
    {
      title: 'Le Bone Appart', meta: 'Dog café & boutique · Le Marais', area: 'le-marais', key: 'le-bone-appart', category: 'shop',
      description: 'A dog café and boutique beside Place des Vosges, made for coffee, canine pâtisseries and playful Parisian accessories.',
      instagram: 'https://www.instagram.com/leboneappart/', maps: 'Le Bone Appart 9 Rue de Birague 75004 Paris', images: ['assets/places/le-bone-appart.jpg', 'assets/places/le-bone-appart-2.jpg', 'assets/places/le-bone-appart-3.jpg']
    },
    {
      title: 'Two Tails', meta: 'Pet boutique · Grenelle', area: 'grenelle', key: 'two-tails', category: 'shop',
      description: 'A friendly neighbourhood boutique with a broad, carefully selected world of food, care and everyday essentials for dogs and cats.',
      instagram: 'https://www.instagram.com/twotails_fr/', maps: 'Two Tails 199 Rue de Grenelle 75007 Paris', images: ['assets/places/two-tails.jpg', 'assets/places/two-tails-2.jpg', 'assets/places/two-tails-3.jpg']
    },
    {
      title: 'Petsochic', meta: 'Boutique & spa · Saint-Germain', area: 'saint-germain', key: 'petsochic', category: 'shop',
      description: 'A refined Left Bank boutique and grooming spa bringing together French-made accessories, personalisation and attentive care.',
      instagram: 'https://www.instagram.com/petsochic/', maps: 'Petsochic 16 Rue Dauphine 75006 Paris', images: ['assets/places/petsochic.jpg', 'assets/places/petsochic-2.jpg', 'assets/places/petsochic-3.jpg']
    },
    {
      title: 'Pantoufle', meta: 'Restaurant & wine bar · Buttes-Chaumont', area: 'buttes-chaumont', key: 'pantoufle-paris', category: 'restaurant',
      description: 'A relaxed wine bar and restaurant hosting rotating chef residencies, with expressive seasonal plates and an intimate neighbourhood mood.',
      instagram: 'https://www.instagram.com/pantoufle.paris/', maps: 'Pantoufle 5 Rue de Chaumont 75019 Paris', images: ['assets/places/pantoufle-paris.jpg', 'assets/places/pantoufle-paris-2.jpg', 'assets/places/pantoufle-paris-3.jpg']
    },
    {
      title: 'Griffon', meta: 'Café, restaurant & bar · Le Marais', area: 'le-marais', key: 'griffon-paris', category: 'restaurant',
      description: 'A characterful Marais hideaway for coffee, fresh food and natural wine, with collected interiors and a leafy secret terrace.',
      instagram: 'https://www.instagram.com/griffon.paris/', maps: 'Griffon 55 bis Rue des Francs-Bourgeois 75004 Paris', images: ['assets/places/griffon-paris-2.jpg', 'assets/places/griffon-paris.jpg', 'assets/places/griffon-paris-3.jpg']
    },
    {
      title: 'Coloré', meta: 'French-Japanese restaurant · Montmartre', area: 'montmartre', key: 'colore-paris', category: 'restaurant',
      description: 'A quietly creative Montmartre restaurant where seasonal French produce meets delicate Japanese influences and natural wine.',
      instagram: 'https://www.instagram.com/colore.paris/', maps: 'Coloré 20 Rue du Ruisseau 75018 Paris', images: ['assets/places/colore-paris.jpg', 'assets/places/colore-paris-2.jpg', 'assets/places/colore-paris-3.jpg']
    },
    {
      title: 'Tekés', meta: 'Vegetable-led restaurant · Étienne Marcel', area: 'etienne-marcel', key: 'tekes-paris', category: 'restaurant',
      description: 'A vibrant open-kitchen restaurant centred on vegetables, fire and Jerusalem-inspired flavours in the heart of the 2nd arrondissement.',
      instagram: 'https://www.instagram.com/tekes_paris/', maps: 'Tekés 4 bis Rue Saint-Sauveur 75002 Paris', images: ['assets/places/tekes-paris.webp', 'assets/places/tekes-paris-2.webp', 'assets/places/tekes-paris-3.webp']
    },
    {
      title: 'Maison Mère', meta: 'Boutique hotel · Cadet', area: 'cadet', key: 'maison-mere', category: 'hotel',
      description: 'A characterful four-star maison with art-filled rooms and a residential spirit, welcoming small dogs up to 10 kg in selected rooms.',
      instagram: 'https://www.instagram.com/maisonmere.lovers/', maps: 'Maison Mère 7 Rue Mayran 75009 Paris', images: ['assets/places/maison-mere.jpg', 'assets/places/maison-mere-2.jpg', 'assets/places/maison-mere-3.jpg']
    },
    {
      title: 'Kimpton St Honoré Paris', meta: 'Luxury hotel · Opéra', area: 'opera', key: 'kimpton-st-honore', category: 'hotel',
      description: 'An Art Deco-inspired Paris stay with a rooftop, spa and exceptionally generous pet policy - every size and breed is welcome at no extra charge.',
      instagram: 'https://www.instagram.com/kimptonsthonore/', maps: 'Kimpton St Honoré Paris 27-29 Boulevard des Capucines 75002 Paris', images: ['assets/places/kimpton-st-honore.jpg', 'assets/places/kimpton-st-honore-2.jpg', 'assets/places/kimpton-st-honore-3.jpg']
    },
    {
      title: 'The Hoxton, Paris', meta: 'Boutique hotel · Sentier', area: 'sentier', key: 'hoxton-paris', category: 'hotel',
      description: 'A lively 18th-century hôtel particulier in Sentier with characterful rooms and a dog-friendly stay for one pup up to 20 kg, at no extra charge.',
      instagram: 'https://www.instagram.com/thehoxtonhotel/', maps: 'The Hoxton Paris 30-32 Rue du Sentier 75002 Paris', images: ['assets/places/hoxton-paris-lobby.jpg', 'assets/places/hoxton-paris-room.jpg', 'assets/places/hoxton-paris-terrace.jpg']
    },
    {
      title: 'Mesa', meta: 'Plant-based café & restaurant · Rue des Martyrs', area: 'montmartre', key: 'mesa-paris', category: 'cafe',
      description: 'A plant-based table inside HOY Paris, moving from breakfast and specialty coffee to colourful plates and evening dining.', instagram: 'https://www.instagram.com/mesa.paris/', maps: 'Mesa 68 Rue des Martyrs 75009 Paris', images: ['assets/places/mesa-paris-1.jpg', 'assets/places/mesa-paris-2.jpg', 'assets/places/mesa-paris-3.jpg']
    },
    {
      title: 'WHITE Coffee', meta: 'Specialty coffee & matcha · Le Marais', area: 'le-marais', key: 'white-coffee-marais', category: 'cafe',
      description: 'A bright Marais stop devoted to specialty coffee, matcha, pastries and freshly pressed juices, open throughout the week.', instagram: 'https://www.instagram.com/drink.white/', maps: 'WHITE Coffee 16 Rue Vieille du Temple 75004 Paris', images: ['assets/places/white-coffee-1.jpg', 'assets/places/white-coffee-2.jpg', 'assets/places/white-coffee-3.jpg']
    },
    {
      title: 'Café Papeterie', meta: 'Neighbourhood café · Place des Petits-Pères', area: 'vivienne', key: 'cafe-papeterie', category: 'cafe',
      description: 'A compact new café beside Place des Petits-Pères, bringing a simple coffee pause to the calm streets behind the Bourse.', instagram: 'https://www.instagram.com/cafepapeterie/', maps: 'Cafe Papeterie 4 Rue des Petits Peres 75002 Paris', images: ['assets/places/photo-coming-soon-cafe.svg']
    },
    {
      title: 'NOIR Coffee Shop', meta: 'Coffee shop & roastery · Montmartre', area: 'montmartre', key: 'noir-montmartre', category: 'cafe',
      description: 'One of NOIR\'s design-led Paris coffee shops, serving house-roasted beans from a compact address just below Sacré-Cœur.', instagram: 'https://www.instagram.com/noir_coffeeshop/', maps: 'NOIR Coffee 6 Rue des Trois Freres 75018 Paris', images: ['assets/places/noir-coffee-1.jpg', 'assets/places/noir-coffee-2.jpg', 'assets/places/noir-coffee-3.jpg']
    },
    {
      title: 'Daark', meta: 'Curated coffee corner · Le Marais', area: 'le-marais', key: 'daark-paris', category: 'cafe',
      description: 'A fashion-minded coffee corner on Rue de Turenne where a restrained interior frames carefully made drinks and small details.', instagram: 'https://www.instagram.com/daark.paris/', maps: 'Daark 50 Rue de Turenne 75003 Paris', images: ['assets/places/daark-paris-1.jpg', 'assets/places/daark-paris-2.jpg', 'assets/places/daark-paris-3.jpg']
    },
    {
      title: 'The Broken Arm Cafeteria', meta: 'Cafeteria · Haut-Marais', area: 'le-marais', key: 'broken-arm-cafeteria', category: 'cafe',
      description: 'The relaxed café counterpart to The Broken Arm, pairing considered breakfasts and lunches with a leafy Square du Temple setting.', instagram: 'https://www.instagram.com/thebrokenarmcafeteria/', maps: 'The Broken Arm Cafeteria 12 Rue Perree 75003 Paris', images: ['assets/places/broken-arm-1.jpg', 'assets/places/broken-arm-2.jpg', 'assets/places/broken-arm-3.jpg']
    },
    {
      title: 'Parisien Tête de Chien', meta: 'Dog-friendly café, shop & yoga studio · Batignolles', area: 'batignolles', key: 'parisien-tete-de-chien', category: 'shop',
      description: 'A colourful Batignolles meeting place combining specialty coffee, brunch, a lifestyle boutique and yoga with an explicitly dog-friendly welcome.', instagram: 'https://www.instagram.com/parisien_tete_de_chien/', maps: 'Parisien Tete de Chien 19 Rue des Moines 75017 Paris', images: ['assets/places/parisien-tete-de-chien-1.jpg', 'assets/places/parisien-tete-de-chien-2.jpg', 'assets/places/parisien-tete-de-chien-3.jpg']
    },
    {
      title: 'CAYU Canidés Club', meta: 'Independent dog shop · Buttes-Chaumont', area: 'buttes-chaumont', key: 'cayu-canides-club', category: 'shop',
      description: 'A Paris-designed dog shop on Rue Bouret, bringing together thoughtful accessories, an independent label and a community-minded club spirit.', instagram: 'https://www.instagram.com/cayu.canidesclub/', maps: 'CAYU Canides Club 28 Rue Bouret 75019 Paris', images: ['assets/places/cayu-1.jpg', 'assets/places/cayu-2.jpg', 'assets/places/cayu-3.jpg']
    },
    {
      title: 'Vivide', meta: 'Plant-based restaurant · Montmartre', area: 'montmartre', key: 'vivide-paris', category: 'restaurant',
      description: 'A produce-driven, plant-based dinner restaurant near Abbesses, shaped around expressive seasonal plates and an intimate evening mood.', instagram: 'https://www.instagram.com/vivide_paris/', maps: 'Vivide 3 Rue Dancourt 75018 Paris', images: ['assets/places/vivide-1.jpg', 'assets/places/vivide-2.jpg', 'assets/places/vivide-3.jpg']
    },
    {
      title: 'Season Paris', meta: 'All-day restaurant · Haut-Marais', area: 'le-marais', key: 'season-paris', category: 'restaurant',
      description: 'A lively all-day Marais address for colourful breakfast plates, generous lunches and the polished comfort-food style Season has served since 2015.', instagram: 'https://www.instagram.com/seasonparis/', maps: 'Season 1 Rue Charles-Francois Dupuis 75003 Paris', images: ['assets/places/season-paris-1.jpg', 'assets/places/season-paris-2.jpg', 'assets/places/season-paris-3.jpg']
    },
    {
      title: 'Jaja', meta: 'Restaurant & wine · Le Marais', area: 'le-marais', key: 'jaja-paris', category: 'restaurant',
      description: 'A hidden Marais courtyard restaurant serving convivial seasonal cooking and characterful wines from lunch through dinner every day.', instagram: 'https://www.instagram.com/jaja.resto/', maps: 'Jaja 3 Rue Sainte-Croix de la Bretonnerie 75004 Paris', images: ['assets/places/jaja-1.jpg', 'assets/places/jaja-2.jpg', 'assets/places/jaja-3.jpg']
    },
    {
      title: 'Café Charlot', meta: 'Parisian bistro · Haut-Marais', area: 'le-marais', key: 'cafe-charlot-paris', category: 'restaurant',
      description: 'A classic Haut-Marais bistro opposite Marché des Enfants Rouges, serving French favourites from morning coffee to late-night drinks.', instagram: 'https://www.instagram.com/cafecharlotparis/', maps: 'Cafe Charlot 38 Rue de Bretagne 75003 Paris', images: ['assets/places/cafe-charlot-1.jpg', 'assets/places/cafe-charlot-2.jpg', 'assets/places/cafe-charlot-3.jpg']
    },
    {
      title: 'Hôtel Suzie Blue', meta: 'Hotel & coffee shop · Le Marais', area: 'le-marais', key: 'hotel-suzie-blue', category: 'hotel',
      description: 'A vibrant Marais hotel with its own everyday coffee shop, blending playful rooms with an easy base for brunch and neighbourhood walks.', instagram: 'https://www.instagram.com/hotelsuzieblue/', maps: 'Hotel Suzie Blue 4 Rue de Saintonge 75003 Paris', images: ['assets/places/hotel-suzie-blue-1.jpg', 'assets/places/hotel-suzie-blue-2.jpg', 'assets/places/hotel-suzie-blue-3.jpg']
    },
    {
      title: 'HOY Paris', meta: 'Wellness hotel · Rue des Martyrs', area: 'montmartre', key: 'hoy-paris', category: 'hotel',
      description: 'A holistic Rue des Martyrs stay bringing together serene rooms, yoga, treatments and the plant-based Mesa restaurant under one roof.', instagram: 'https://www.instagram.com/hoyparis/', maps: 'HOY Paris 68 Rue des Martyrs 75009 Paris', images: ['assets/places/hoy-paris-1.jpg', 'assets/places/hoy-paris-2.jpg', 'assets/places/hoy-paris-3.jpg']
    }
  ];

  const emptyState = grid.querySelector('.empty-state');
  approvedPlaces.forEach(place => {
    const images = place.images?.length ? place.images : ['assets/places/photo-coming-soon-cafe.svg'];
    const article = document.createElement('article');
    article.className = 'place-card';
    article.dataset.category = place.category;
    article.dataset.area = place.area;
    article.dataset.gallery = images.join('|');
    article.innerHTML = `<div class="place-thumb" style="--thumb:url('${images[0]}')"></div>
      <div class="place-content"><h3>${place.title}</h3><p class="place-category">${place.meta}</p>
      <p class="desc">${place.description}</p><div class="place-actions">
      <a class="primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.maps)}" target="_blank" rel="noopener">Get Directions →</a>
      <a href="${place.instagram}" target="_blank" rel="noopener">View on Instagram</a>
      <button class="favourite" data-place="${place.key}" type="button">♡ Add to Favourites</button></div></div>`;
    grid.insertBefore(article, emptyState);
  });

  const arrondissementByPlace = {
    'Simple Coffee': ['arr-18', 'Café · 18th arrondissement · Montmartre'],
    'Merlo Café': ['arr-3', 'Café · 3rd arrondissement · Le Marais'],
    'Grave Café': ['arr-3', 'Café · 3rd arrondissement · Haut-Marais'],
    'Cuvée Noire': ['arr-9', 'Specialty coffee · 9th arrondissement · Saint-Lazare'],
    'Sevenly Heart': ['arr-3', 'Coffee & brunch · 3rd arrondissement · Le Marais'],
    'Nami Coffee': ['arr-2', 'Specialty coffee & bakery · 2nd arrondissement · Étienne Marcel'],
    'Clove Coffee Shop': ['arr-18', 'Specialty coffee · 18th arrondissement · Montmartre'],
    'Mardi': ['arr-19', 'Coffee & baked goods · 19th arrondissement · Belleville'],
    'Niwa': ['arr-7', 'Bakery & café · 7th arrondissement · Vaneau'],
    'Partisan Café': ['arr-3', 'Café & roastery · 3rd arrondissement · Arts et Métiers'],
    'Tanat Victoria': ['arr-1', 'Specialty coffee · 1st arrondissement · Châtelet'],
    'Forêt Forêt': ['arr-3', 'Specialty coffee & tea · 3rd arrondissement · Le Marais'],
    'Barkers + Brothers': ['arr-18', 'Dog shop & café · 18th arrondissement · Montmartre'],
    "Gino's Paris": ['arr-5', 'Boutique, grooming & daycare · 5th arrondissement · Latin Quarter'],
    'Animal Particulier': ['arr-18', 'Independent pet shop · 18th arrondissement · Montmartre'],
    'Casa del Doggo': ['arr-16', 'Dog bakery & concept store · 16th arrondissement · Auteuil'],
    'Le Bone Appart': ['arr-4', 'Dog café & boutique · 4th arrondissement · Le Marais'],
    'Two Tails': ['arr-7', 'Pet boutique · 7th arrondissement · Grenelle'],
    'Petsochic': ['arr-6', 'Boutique & spa · 6th arrondissement · Saint-Germain'],
    'Pantoufle': ['arr-19', 'Restaurant & wine bar · 19th arrondissement · Buttes-Chaumont'],
    'Griffon': ['arr-4', 'Café, restaurant & bar · 4th arrondissement · Le Marais'],
    'Coloré': ['arr-18', 'French-Japanese restaurant · 18th arrondissement · Montmartre'],
    'Tekés': ['arr-2', 'Vegetable-led restaurant · 2nd arrondissement · Étienne Marcel'],
    'Maison Mère': ['arr-9', 'Boutique hotel · 9th arrondissement · Cadet'],
    'Kimpton St Honoré Paris': ['arr-2', 'Luxury hotel · 2nd arrondissement · Opéra'],
    'The Hoxton, Paris': ['arr-2', 'Boutique hotel · 2nd arrondissement · Sentier'],
    'Mesa': ['arr-9', 'Plant-based café & restaurant · 9th arrondissement · Rue des Martyrs'],
    'WHITE Coffee': ['arr-4', 'Specialty coffee & matcha · 4th arrondissement · Le Marais'],
    'Café Papeterie': ['arr-2', 'Neighbourhood café · 2nd arrondissement · Vivienne'],
    'NOIR Coffee Shop': ['arr-18', 'Coffee shop & roastery · 18th arrondissement · Montmartre'],
    'Daark': ['arr-3', 'Curated coffee corner · 3rd arrondissement · Le Marais'],
    'The Broken Arm Cafeteria': ['arr-3', 'Cafeteria · 3rd arrondissement · Haut-Marais'],
    'Parisien Tête de Chien': ['arr-17', 'Dog-friendly café, shop & yoga studio · 17th arrondissement · Batignolles'],
    'CAYU Canidés Club': ['arr-19', 'Independent dog shop · 19th arrondissement · Buttes-Chaumont'],
    'Vivide': ['arr-18', 'Plant-based restaurant · 18th arrondissement · Montmartre'],
    'Season Paris': ['arr-3', 'All-day restaurant · 3rd arrondissement · Haut-Marais'],
    'Jaja': ['arr-4', 'Restaurant & wine · 4th arrondissement · Le Marais'],
    'Café Charlot': ['arr-3', 'Parisian bistro · 3rd arrondissement · Haut-Marais'],
    'Hôtel Suzie Blue': ['arr-3', 'Hotel & coffee shop · 3rd arrondissement · Le Marais'],
    'HOY Paris': ['arr-9', 'Wellness hotel · 9th arrondissement · Rue des Martyrs']
  };

  const openingHoursByPlace = {
    'Simple Coffee': 'Mon, Wed-Fri 08:00-17:30 · Sat-Sun 09:00-17:30 · Tue closed',
    'Merlo Café': 'Mon-Fri 09:15-16:45 · Sat-Sun 10:15-17:30',
    'Grave Café': 'Mon-Fri 08:30-18:00 · Sat-Sun 09:30-18:00',
    'Cuvée Noire': 'Mon-Fri 08:00-18:00 · Sat-Sun 10:00-18:00',
    'Sevenly Heart': 'Mon-Fri 09:30-20:00 · Sat-Sun 10:00-20:00',
    'Nami Coffee': 'Mon-Fri 08:30-18:00 · Sat 10:00-19:00 · Sun 10:00-18:00',
    'Clove Coffee Shop': 'Mon-Tue, Thu-Sun 09:00-16:00 · Wed closed',
    'Mardi': 'Mon-Fri 08:30-17:00 · Sat-Sun 10:00-17:30',
    'Niwa': 'Mon-Fri 08:00-17:30 · Sat-Sun 08:30-17:30',
    'Partisan Café': 'Mon-Fri 08:30-18:00 · Sat-Sun 09:00-18:30',
    'Tanat Victoria': 'Mon-Fri 08:00-18:00 · Sat 09:00-19:00 · Sun 10:00-18:00',
    'Forêt Forêt': 'Mon-Fri 08:00-18:00 · Sat-Sun 10:00-18:00',
    'Barkers + Brothers': 'Tue-Sat 09:00-19:00 · Sun 10:00-16:00 · Mon closed',
    "Gino's Paris": 'Mon-Sat 10:00-19:00 · Sun closed',
    'Animal Particulier': 'Tue-Sat 11:00-19:00 · Sun-Mon closed',
    'Casa del Doggo': 'Wed-Sat 10:00-12:00 & 13:00-19:00 · Sun 10:00-16:00 · Mon-Tue closed',
    'Le Bone Appart': 'Mon-Fri 08:00-18:00 · Sat-Sun 09:00-18:00',
    'Two Tails': 'Mon-Sat 09:30-19:30 · Sun 09:30-13:30',
    'Petsochic': 'Tue-Fri 11:00-13:00 & 14:00-18:30 · Sat until 19:00 · Sun-Mon closed',
    'Pantoufle': 'Tue 17:30-00:00 · Wed-Sat 15:30-00:00 · Sun-Mon closed',
    'Griffon': 'Tue 17:00-00:00 · Wed-Sat 11:00-00:00 · Sun 11:00-18:00 · Mon closed',
    'Coloré': 'Wed-Fri 10:00-14:15 & 19:00-22:00 · Sat 10:00-15:00 & 19:00-22:00 · Sun 10:00-17:00',
    'Tekés': 'Daily 12:00-14:30 & 19:00-22:30 · Sun brunch 12:00-15:00',
    'Maison Mère': 'Open 24 hours',
    'Kimpton St Honoré Paris': 'Open 24 hours',
    'The Hoxton, Paris': 'Open 24 hours',
    'Mesa': 'Open daily for breakfast, lunch and dinner',
    'WHITE Coffee': 'Open daily',
    'Café Papeterie': 'Check Instagram for current hours',
    'NOIR Coffee Shop': 'Open daily',
    'Daark': 'Mon-Fri 09:00-18:00 · Sat-Sun 10:00-19:00',
    'The Broken Arm Cafeteria': 'Tue-Sat 09:00-17:00 · Sun-Mon closed',
    'Parisien Tête de Chien': 'Check Instagram for current hours',
    'CAYU Canidés Club': 'Wed-Sun · Check Instagram for daily hours',
    'Vivide': 'Dinner Tue-Sat · Sun-Mon closed',
    'Season Paris': 'Open daily · Walk-ins only',
    'Jaja': 'Open daily for lunch and dinner',
    'Hôtel Suzie Blue': 'Open 24 hours',
    'HOY Paris': 'Open 24 hours'
  };

  grid.querySelectorAll('.place-card').forEach(card => {
    const place = arrondissementByPlace[card.querySelector('h3')?.textContent?.trim()];
    if (!place) return;
    card.dataset.area = place[0];
    const meta = card.querySelector('.place-category');
    if (meta) meta.textContent = place[1];
    const title = card.querySelector('h3')?.textContent?.trim();
    const hours = openingHoursByPlace[title];
    if (hours && !card.querySelector('.place-hours')) {
      const hoursLine = document.createElement('p');
      hoursLine.className = 'place-hours';
      hoursLine.innerHTML = `<span>Opening hours</span>${hours}`;
      card.querySelector('.desc')?.insertAdjacentElement('afterend', hoursLine);
    }
  });

  const areaFilters = document.querySelector('.area-filters');
  if (areaFilters) {
    areaFilters.setAttribute('aria-label', 'Filter places by arrondissement');
    areaFilters.innerHTML = `<span class="filter-label">Explore by arrondissement</span>
      <button class="active" data-filter="all" aria-pressed="true">All</button>
      ${[
        ['arr-1', '1st'], ['arr-2', '2nd'], ['arr-3', '3rd'], ['arr-4', '4th'], ['arr-5', '5th'],
        ['arr-6', '6th'], ['arr-7', '7th'], ['arr-9', '9th'], ['arr-16', '16th'],
        ['arr-17', '17th'], ['arr-18', '18th'], ['arr-19', '19th']
      ].map(([value, label]) => `<button data-filter="${value}" aria-pressed="false" aria-label="${label} arrondissement">${label}</button>`).join('')}`;
  }
  const count = document.querySelector('.cg-intro p');
  if (count) count.textContent = `${grid.querySelectorAll('.place-card').length} recommendations`;
})();

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
  const cafesFirst = location.pathname.endsWith('paris-guide.html');
  typeFilters.innerHTML = `<span class="filter-label">Type of place</span>
    <button class="${cafesFirst ? '' : 'active'}" data-filter="all" aria-pressed="${cafesFirst ? 'false' : 'true'}">All</button>
    ${categoryLabels.filter(([value]) => available.has(value)).map(([value, label]) =>
      `<button class="${cafesFirst && value === 'cafe' ? 'active' : ''}" data-filter="${value}" aria-pressed="${cafesFirst && value === 'cafe' ? 'true' : 'false'}">${label}</button>`
    ).join('')}`;
  areaFilters.before(typeFilters);

  const selected = { type: cafesFirst ? 'cafe' : 'all', area: 'all' };
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
    const count = document.querySelector('.cg-intro p');
    if (count) count.textContent = `${shown} ${shown === 1 ? 'recommendation' : 'recommendations'}`;
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
  applyFilters();
})();

(() => {
  const main = document.querySelector('.cg-main');
  const grid = document.querySelector('.place-grid');
  const cards = [...document.querySelectorAll('.place-card')];
  if (!main || !grid || !cards.length) return;

  const editor = cards[0];
  const cardGalleries = {
    'Merlo Café': ['assets/places/merlo-storefront-hq.jpg', 'assets/places/merlo-coffee-cake-hq.jpg', 'assets/places/merlo-dog-snow-hq.jpg'],
    'Grave Café': ['assets/places/grave-cafe.jpg', 'assets/places/grave-regular-dogs.jpg', 'assets/places/grave-peach-cake-hq.jpg'],
    'Cuvée Noire': ['assets/places/cuv-e-noire.webp', 'assets/places/cuvee-drinks-hq.jpg', 'assets/places/cuvee-afternoon-hq.jpg'],
    'Sevenly Heart': ['assets/places/sevenly-heart.webp', 'assets/places/sevenly-space-hq.jpg', 'assets/places/sevenly-cake-hq.jpg'],
    'Nami Coffee': ['assets/places/nami-coffee-new.jpg', 'assets/places/nami-coffee-2.jpg', 'assets/places/nami-coffee-3.jpg']
  };
  cards.forEach(card => {
    const placeTitle = card.querySelector('h3')?.textContent?.trim();
    const images = cardGalleries[placeTitle];
    if (!images) return;
    card.dataset.gallery = images.join('|');
    card.querySelector('.place-thumb')?.style.setProperty('--thumb', `url('${images[0]}')`);
  });
  const merlo = cards.find(card => card.querySelector('h3')?.textContent?.trim() === 'Merlo Café');
  if (merlo) {
    const merloDescription = merlo.querySelector('.desc');
    if (merloDescription) merloDescription.textContent = 'Behind its deep-red Rue de Turenne façade, Merlo is a quietly polished Marais coffee stop for espresso, matcha and cake, with warm wood, fresh flowers and two pavement stools made for watching Paris go by.';
  }
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
            `<div class="editors-image${index === 0 ? ' active' : ''}" style="${style}" role="img" aria-label="${title.replace(/"/g, '&quot;')} - photo ${index + 1}"></div>`
          ).join('')}</div>
          ${slideStyles.length > 1 ? `
            <button class="gallery-arrow gallery-prev" type="button" aria-label="Previous photo">←</button>
            <button class="gallery-arrow gallery-next" type="button" aria-label="Next photo">→</button>
            <div class="gallery-dots">${slideStyles.map((_, index) =>
              `<button type="button" aria-label="Show photo ${index + 1}" aria-pressed="${index === 0}"></button>`
            ).join('')}</div>` : ''}
        </div>
        <div class="editors-copy"><span class="editors-badge">Guide favourite</span><h2>${title}</h2><p class="editors-meta">${meta}</p><p>${desc}</p><a href="${link}" target="_blank" rel="noopener">View place <span>→</span></a></div>
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

  cards.filter(card => card.dataset.gallery).forEach(card => {
    const thumb = card.querySelector('.place-thumb');
    const placeTitle = card.querySelector('h3')?.textContent?.trim() || 'Place';
    const images = card.dataset.gallery.split('|').map(value => value.trim()).filter(Boolean);
    if (!thumb || images.length < 2) return;

    thumb.classList.add('place-card-gallery');
    thumb.insertAdjacentHTML('beforeend', `
      <button class="card-gallery-arrow card-gallery-prev" type="button" aria-label="Previous ${placeTitle} photo">←</button>
      <button class="card-gallery-arrow card-gallery-next" type="button" aria-label="Next ${placeTitle} photo">→</button>
      <div class="card-gallery-dots">${images.map((_, index) =>
        `<button type="button" aria-label="Show ${placeTitle} photo ${index + 1}" aria-pressed="${index === 0}"></button>`
      ).join('')}</div>`);

    let cardIndex = 0;
    const cardDots = [...thumb.querySelectorAll('.card-gallery-dots button')];
    const showCardImage = index => {
      cardIndex = (index + images.length) % images.length;
      thumb.style.setProperty('--thumb', `url('${images[cardIndex].replace(/['"]/g, '')}')`);
      cardDots.forEach((dot, dotIndex) => dot.setAttribute('aria-pressed', String(dotIndex === cardIndex)));
    };
    thumb.querySelector('.card-gallery-prev')?.addEventListener('click', () => showCardImage(cardIndex - 1));
    thumb.querySelector('.card-gallery-next')?.addEventListener('click', () => showCardImage(cardIndex + 1));
    cardDots.forEach((dot, index) => dot.addEventListener('click', () => showCardImage(index)));
  });
})();
