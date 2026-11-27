"""Render published pages from the app catalogue; keep legacy sources in Git.
Run after copying the source tree: python3 scripts/align-website-catalogue.py _site
The full parks-catalogue and old HTML in the source checkout are preserved.
"""
import collections, html, json, re, sys
from pathlib import Path
from urllib.parse import urljoin
from importlib.machinery import SourceFileLoader
ROOT = Path(__file__).resolve().parents[1]
validate = SourceFileLoader('shared_catalogue', str(ROOT / 'scripts/build-mobile-catalogue.py')).load_module().validate
BASE = 'https://thedogfriendlyguide.com/'
PARK_PHOTOS = json.loads((ROOT/'park-area-photos.v1.json').read_text())['photos']
CATEGORIES = {'Drink':'cafe', 'Eat':'restaurant', 'Stay':'hotel', 'Shop':'shop', 'Walk':'walk', 'cafe':'cafe', 'restaurant':'restaurant', 'hotel':'hotel', 'shop':'shop', 'walk':'walk', 'cafes':'cafe', 'restaurants':'restaurant', 'hotels':'hotel', 'shops':'shop'}
def esc(value): return html.escape(str(value or ''), quote=True)
def slug(value): return re.sub(r'[^a-z0-9]+', '-', str(value).lower()).strip('-')
def normalized(data):
    places = data['places'] + [dict(p, id='paris-'+p['key'], city='paris', image=urljoin(BASE,p['images'][0]), images=[urljoin(BASE,i) for i in p['images']], editorial=p['description'], shortDescription=p['meta'], websiteUrl=p.get('instagram'), openingHours=data['paris'].get('openingHours',{}).get(p['key'])) for p in data['paris']['places']]
    # The requested Paris lead remains first, ahead of newly added park entries.
    return sorted(places, key=lambda p: 0 if p['id']=='paris-barkers-brothers' else 1)
def card(p):
    key = p['id'].removeprefix(p['city']+'-')
    area = 'arr-'+str(p['arrondissement']) if p['city']=='paris' and p.get('arrondissement') else slug(p['area'])
    # Keep original gallery behavior; explicit IDs allow set equality checks.
    images = p['images']
    photo = p['image']; alt = p.get('imageAlt') or p['name']; photo_note = ''
    representative = PARK_PHOTOS.get(p['id']) if p['category']=='Walk' and 'placeholder' in photo else None
    if representative:
        photo = representative['image']; images = [photo]
        alt = 'Representative outdoor view of '+representative['areaName']+': '+representative['subject']
        photo_note = '<span class="park-area-view">Area view</span><details class="park-photo-credit"><summary>Photo credits</summary><span>'+esc(representative['subject'])+' · '+esc(representative['artist'])+' · <a href="'+esc(representative['licenseUrl'])+'" target="_blank" rel="noopener">'+esc(representative['license'])+'</a> · <a href="'+esc(representative['page'])+'" target="_blank" rel="noopener">Source</a>. '+esc(representative['changes'])+'</span></details>'
    return f'''<article id="{esc(key)}" class="place-card" data-catalogue-id="{esc(p['id'])}" data-category="{CATEGORIES[p['category']]}" data-area="{esc(area)}" data-gallery="{esc('|'.join(images))}"><div class="place-thumb editorial-photography"><img class="editorial-photo" src="{esc(photo)}" alt="{esc(alt)}" loading="lazy" decoding="async">{photo_note}</div><div class="place-content"><h3>{esc(p['name'])}</h3><p class="place-category">{esc(p['shortDescription'])}</p><p class="desc">{esc(p['editorial'])}</p>{'<p class="place-hours">'+esc(p['openingHours'])+'</p>' if p.get('openingHours') else ''}<div class="place-actions"><a class="primary" href="{esc(p['mapsUrl'])}" target="_blank" rel="noopener">Get directions</a>{'<a href="'+esc(p['websiteUrl'])+'" target="_blank" rel="noopener">'+('Park details' if p['category']=='Walk' else 'Website')+'</a>' if p.get('websiteUrl') else ''}<button class="favourite" data-place="{esc(key)}" type="button">♡ Add to Favourites</button></div></div></article>'''
def build(target):
    data = validate(json.loads((ROOT/'mobile-catalogue.v1.json').read_text()))
    places = normalized(data)
    counts = collections.Counter(p['city'] for p in places)
    for city in data['cities']:
        city_id = city['id']; path = target / (city_id+'-guide.html')
        text = (ROOT / path.name).read_text()
        selected = [p for p in places if p['city']==city_id]
        grid = '<section class="place-grid">' + ''.join(card(p) for p in selected) + '<div class="empty-state">No places match these filters.</div></section>'
        text, n = re.subn(r'<section class="place-grid">.*?</section>', lambda m:grid, text, count=1, flags=re.S)
        assert n == 1, path
        text = text.replace('<body ', '<body data-catalogue-aligned="true" ', 1)
        # The unified filters cover every type and area, including parks.
        text = re.sub(r'<nav\b[^>]*class="[^"]*(?:area-filters|london-type-filters|london-region-filters|london-area-filters)[^"]*".*?</nav>', '', text, flags=re.S)
        text = text.replace('<section class="place-grid">','<nav class="cg-filters area-filters" aria-label="Filter places by area"><span class="filter-label">Area</span><button class="active" data-filter="all" aria-pressed="true">All</button>'+''.join(f'<button data-filter="{esc(area)}" aria-pressed="false">{esc(label)}</button>' for area,label in dict((('arr-'+str(p['arrondissement']),str(p['arrondissement'])+' arr.') if p['city']=='paris' and p.get('arrondissement') else (slug(p['area']),p['area'])) for p in selected).items())+'</nav><section class="place-grid">',1)
        # London formerly used an independent, stale map dropdown and filters.
        text = re.sub(r'<script[^>]*src="london-guide.js[^\"]*"[^>]*></script>', '', text)
        if 'src="city-guide.js' not in text:
            text = text.replace('</body>', '<script src="city-guide.js?v=aligned1"></script></body>')
        if city_id == 'london':
            text = re.sub(r'<section\b[^>]*data-view-panel="map".*?</section>', '<section class="guide-map-view" data-view-panel="map" hidden><iframe title="London places map" loading="lazy" src="paris-map-google-v2.html?city=london&amp;embed=1"></iframe></section>', text, flags=re.S)
            text = text.replace('</body>', '<script src="paris-guide-view.js?v=aligned1"></script></body>')
        text = re.sub(r'\d+ recommendations', str(len(selected))+' recommendations', text)
        text = re.sub(r'href="https://www.google.com/maps/d/[^"]*"', 'href="paris-map-google-v2.html?city='+city_id+'"', text)
        text = text.replace('</head>', '<link rel="stylesheet" href="catalogue-alignment.css?v=1"></head>')
        path.write_text(text)
    # Public park browsing is restricted to the exact parks in the app. The full
    # inventory stays in the source repository, never deleted or auto-published.
    archive = json.loads((ROOT/'parks-catalogue.v1.json').read_text())
    archive['parks'] = [p['parkDetails'] for p in places if p['category']=='Walk']
    (target/'parks-catalogue.v1.json').write_text(json.dumps(archive,ensure_ascii=False,indent=2)+'\n')
    (target/'paris-places.json').write_text(json.dumps(data['paris'],ensure_ascii=False,indent=2)+'\n')
    # Homepage highlights and edition counts also come from the same selection.
    highlights = {}
    editions = {}
    for c in data['cities']:
        venues = [p for p in places if p['city']==c['id'] and p['category']!='Walk']
        highlights[c['id']] = [dict(name=p['name'],image=p['image'],meta=p['shortDescription'],href=c['id']+'-guide.html#'+p['id'].removeprefix(c['id']+'-')) for p in venues[:3]]
        editions[c['id']] = dict(name=c['label'],count=counts[c['id']],image=venues[0]['image'],intro=f"Explore {counts[c['id']]} selected places in {c['label']}, for neighbourhood discoveries and time well spent together.",copy=f"Discover the Guide’s {counts[c['id']]} selected places in {c['label']}, in the list or on the map.")
    (target/'home-city-places.js').write_text('window.homeCityPlaces = '+json.dumps(highlights,ensure_ascii=False)+';\nwindow.guideCityEditions = '+json.dumps(editions,ensure_ascii=False)+';\n')
    for path in [target/'index.html', *[target/l/'index.html' for l in ['de','fr','es']]]:
        text = path.read_text()
        picker = ''.join(f'<a href="/index.html?city={c["id"]}#cities"><span>{esc(c["label"])}</span><small>{counts[c["id"]]} places</small></a>' for c in data['cities'])
        if 'class="guide-city-options"' in text:
            text = re.sub(r'(<nav class="guide-city-options"[^>]*>).*?</nav>',lambda m:m[1]+picker+'</nav>',text,flags=re.S)
        else:
            text = text.replace('<button class="menu-toggle"', '<details class="guide-city-picker"><summary>Choose city</summary><nav class="guide-city-options" aria-label="Choose a city guide">'+picker+'</nav></details><button class="menu-toggle"',1)
            text = text.replace('</head>', '<link rel="stylesheet" href="/home-city-selector.css"></head>')
            text = text.replace('</body>', '<script src="/home-city-places.js?v=aligned1"></script><script src="/home-city-edition.js?v=aligned1"></script></body>')
        # Preserve translated editorial copy; localized choosers open the shared
        # city guides directly rather than running the English edition script.
        if path.parent != target:
            text = re.sub(r'<script src="/home-city-(?:places|edition)\.js[^"]*"></script>', '', text)
            for c in data['cities']:
                text = text.replace('/index.html?city='+c['id']+'#cities', '/'+c['id']+'-guide.html')
            text = re.sub(r'<aside class="coming-next-card".*?</aside>', '', text, flags=re.S)
            text = re.sub(r'(<div class="paris-launch-copy">.*?<p>)(\d+)', lambda m:m[1]+str(counts['paris']), text, flags=re.S)
            text = re.sub(r'(src|href)="(?!https?:|/|#|mailto:)([^"]+\.(?:js|css|html)[^"]*)"', r'\1="/\2"', text)

        menu = re.search(r'<nav class="mobile-menu" id="mobile-menu">(.*?)</nav>', text, re.S)
        if menu:
            links = ''.join(f'<a href="/{c["id"]}-guide.html">{esc(c["label"])} Guide</a>' for c in data['cities'])
            rest = re.sub(r'<a[^>]*href="[^"]*-guide.html"[^>]*>.*?</a>', '', menu[1])
            text = text[:menu.start()]+'<nav class="mobile-menu" id="mobile-menu">'+links+rest+'</nav>'+text[menu.end():]
        text = text.replace('home-city-places.js?v=20261023-2','home-city-places.js?v=aligned1').replace('home-city-edition.js?v=20261023-2','home-city-edition.js?v=aligned1')
        path.write_text(text)
    # The publication revision invalidates all changed shared assets, including
    # future selection updates without a hardcoded browser cache key.
    for path in [target/'index.html', *[target/l/'index.html' for l in ['de','fr','es']], *target.glob('*-guide.html')]:
        text = path.read_text()
        for asset in ['city-guide.js', 'home-city-places.js', 'home-city-edition.js', 'paris-guide-view.js', 'catalogue-alignment.css', 'munich-guide.css']:
            text = re.sub(re.escape(asset)+r'(?:\?[^"\x27]*)?', asset+'?selection='+data['revision'][:12], text)
        path.write_text(text)
    # Cache tags cover changed scripts on every guide, in every viewport.
    proof = dict(revision=data['revision'],total=len(places),cities=dict(counts),parks=len(archive['parks']),source='mobile-catalogue.v1.json')
    (target/'catalogue-alignment.json').write_text(json.dumps(proof,indent=2)+'\n')
    print(json.dumps(proof))
if __name__=='__main__':
    target=Path(sys.argv[1]).resolve()
    assert target!=ROOT, 'Generate into a publication directory; preserve legacy sources.'
    build(target)
