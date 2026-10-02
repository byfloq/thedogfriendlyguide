# The Dog Friendly Guide

Static multi-page GitHub Pages website. Upload the contents of this folder to the root of the existing repository.

## Included

- `index.html` — page structure and editorial content
- `link-in-bio.html` — Instagram link-in-bio page
- `paris-guide.html` — editorial Paris city guide
- `paris-places.json` — canonical machine-readable catalogue for the Paris website and Flōq app
- `paris-map-google.html` — parallel Google Maps comparison; add a browser-restricted key in `google-maps-config.js` to activate it
- `maps-paris.html` — saved-map collection experience
- `styles.css` — responsive desktop/mobile design
- `script.js` — mobile menu and newsletter form feedback
- `guide.js` — guide filters and save buttons
- `assets/` — local photography used by the page

The newsletter form currently confirms submissions in the browser. Connect it to your preferred email platform when ready.

## Paris catalogue sync

The Flōq app should use `paris-places.json` as the canonical list of Paris recommendations. The catalogue contains the stable place key, name, category, area, editorial description, Instagram URL, Maps URL and image list for every place shown by the Paris guide.

Repository: `https://github.com/byfloq/thedogfriendlyguide`

Production catalogue: `https://thedogfriendlyguide.com/paris-places.json`

Update the catalogue whenever a Paris recommendation is added, removed or edited so the website and app remain aligned.

## Café photography

Paris café galleries were visually reviewed on 2 October 2026 at 1280px desktop and 390px mobile widths. All 14 cafés and all 42 selected slides were checked, including carousel navigation.

Use complete, clear photographs from the existing source collection rather than cropped social-media thumbnails. Review each image in the actual 4:5 card frame, including its focal point, before adding it. Do not add filler just to reach three slides. Keep the gallery arrays in `city-guide.js` and `paris-places.json` in sync, and update the descriptive alt text when replacing a photo.

The approved third photographs for Mardi and WHITE Coffee were added after a desktop/mobile card review:

- `assets/places/mardi-interior-approved.jpg` — interior, published by [Architectural Digest](https://www.admagazine.com/articulos/paris-cafes-tres-chic-que-no-te-puedes-perder), credited “Cortesía Mardi”.
- `assets/places/white-marais-coffee-selection.jpg` — coffee bags, from [WHITE Coffee’s official Marais gallery](https://cafes.white-coffee.com/en/restaurant-coffee-shop/rue-vieille-du-temple-paris-4/).

## Restaurant, hotel and dog-shop photography

On 2 October 2026, all 45 gallery slides across five restaurants, two hotels and eight dog shops were reviewed at 1280px desktop and 390px mobile widths. Paris cards share a native image element with a 4:5 cover frame and individually reviewed focal points. Each remaining place retains three photos. The catalogue contains 29 places; removed recommendations are also removed from route suggestions.

Replacement photo sources:

- `griffon-dining-room.jpg` and `griffon-interior-sign.jpg`: [Griffon official gallery](https://griffon.paris/), source files `DSC_0458-scaled-e1678733150410.jpg` and `Diapo-1.png`.
- `cafe-charlot-vintage-sign.jpg`: [Café Charlot official website](https://www.lecharlot-paris.com/en/), `img_8894-550x550.jpg`.
- `hoy-guest-room.jpg`: [HOY official room gallery](https://www.hoyparis.com/hotel), Sophia van den Hoek / @un_fold_ed (8).
- `cayu-knitwear-dog.jpg`: [CAYU official journal](https://www.cayucanidesclub.com/blogs/infos/cayu-canides-club-le-dog-cafe-et-boutique-incontournable-de-paris-19e), `Home_495b58d0-67b9-4647-a51e-009bf756269d.jpg`.
- `cayu-window-accessories.jpg` and `cayu-patterned-collar.jpg`: [CAYU official collection](https://www.cayucanidesclub.com/), `787E762F-CF9C-4E4E-B39E-88F381F15B0A.jpg` and `FullSizeRender_7be07d1b-419e-4afc-bbb1-3fee8b1d813a.jpg`.
- `parisien-colourful-interior.jpg`: [Lump, Parisien Tête de Chien](https://www.lumpmedia.fr/lieux/parisien-tete-de-chien-tiers-lieu-dog-friendly-paris17), Canelle & Paupiette, `IMG_4231.jpg`.

## Barcelona restoration and photography

Restored the eight existing Barcelona recommendations on 2 October 2026: Mono Café, El Tribut, Les Filles, Jaç Hi-Fi Café, Grand Hyatt Barcelona, Onis Coffee, LOT Roasters and M.A.M.I. Café. Each has three locally hosted WebP photographs, a consistent 4:5 frame, descriptive alt text and reviewed focal points. No venues were invented or added to the recovered selection.

`barcelona-places.json` records the selection, image paths, original source filenames and source pages. Keep it aligned with the static cards in `barcelona-guide.html` and the photo descriptions/positions in `city-guide.js`. Existing first photographs are retained for Mono, El Tribut, Les Filles, Hyatt and LOT. M.A.M.I.’s existing drinks and breakfast photos are retained; the DJ detail comes from its official carousel. Jaç uses the project designer’s gallery, Onis uses In & Out Barcelona’s venue feature, and the remaining additions use official venue websites or Instagram posts.

All 24 slides were visually reviewed in desktop (1280px) and mobile (390px) layouts. Images are at most 1600px, never upscaled, and total approximately 3.3 MiB across all eight galleries. Checked category and area filters, carousel navigation and favourite persistence. Barcelona is available in the homepage city selector and indexed in the sitemap.
