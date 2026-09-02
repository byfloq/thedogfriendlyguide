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
