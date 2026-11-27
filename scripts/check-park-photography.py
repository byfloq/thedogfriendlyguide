"""Check published park photos and their attribution."""
import html,json,re,sys
from pathlib import Path
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parents[1]

def place_card(guide, place_id):
 return re.search(r'<article[^>]*data-catalogue-id="'+re.escape(place_id)+r'".*?</article>',guide,re.S)[0]

def check_berlin(target, parks, hotel):
 guide=(target/'berlin-guide.html').read_text()
 directory=json.loads((target/'parks-catalogue.v1.json').read_text())['parks']
 directory={park['id']:park for park in directory}
 assert len({p['image'] for p in parks})==len(parks), 'Each Berlin park needs its own cover'
 for p in parks:
  credit=p['photoCredit']
  assert credit['scope'] in ('dog-area','park','nearby'),p['id']
  assert all(credit.get(key) for key in ('subject','artist','license','licenseUrl','page','changes')),p['id']
  for key,host in [('page','commons.wikimedia.org'),('licenseUrl','creativecommons.org')]:
   url=urlparse(credit[key]);assert url.scheme=='https' and url.hostname==host,p['id']
  asset=f'assets/places/berlin-parks/{p["id"]}.jpg'
  assert p['images']==[p['image']]==['https://thedogfriendlyguide.com/'+asset],p['id']
  assert (target/asset).read_bytes().startswith(b'\xff\xd8'),p['id']
  assert directory[p['id']]['guidePhoto']==dict(src=p['image'],alt=p['imageAlt'],credit=credit),p['id']
  card=place_card(guide,p['id'])
  assert all(html.escape(value,quote=True) in card for value in (p['image'],p['imageAlt'],credit['page'],credit['licenseUrl'])),p['id']
  label={'park':'Park view','nearby':'Nearby view'}.get(credit['scope'])
  assert label in card if label else 'park-area-view' not in card,p['id']
 assert hotel['images']==[hotel['image']]
 assert urlparse(hotel['image']).hostname=='www.datocms-assets.com'
 assert '1762950452-light-filled-overlook-suite' in hotel['image']
 assert html.escape(hotel['image']) in place_card(guide,hotel['id'])

def check(target):
 data=json.loads((target/'mobile-catalogue.v1.json').read_text());photos=json.loads((target/'park-area-photos.v1.json').read_text())['photos'];parks=[p for p in data['places'] if p['category']=='Walk']
 for p in parks:
  if 'placeholder' not in p['image']:continue
  c=photos[p['id']];assert c['areaId'].startswith(p['city']+':'),p['id']
  assert all(c.get(k) for k in ['artist','subject','license','licenseUrl','page','changes']),p['id']
  assert c['image'].startswith('https://thedogfriendlyguide.com/assets/park-areas251/'),p['id']
  asset=target/c['image'].split('thedogfriendlyguide.com/')[1];assert asset.exists() and asset.read_bytes()[:2]==b'\xff\xd8',p['id']
  text=(target/(p['city']+'-guide.html')).read_text();card=place_card(text,p['id'])
  assert 'park-placeholder' not in card and 'Representative outdoor view' in card and 'park-photo-credit' in card,p['id']
 berlin=[p for p in parks if p['city']=='berlin']
 check_berlin(target,berlin,next(p for p in data['places'] if p['id']=='berlin-michelberger-hotel'))
 paris=(target/'paris-guide.html').read_text();assert re.search(r'<article[^>]*data-catalogue-id="([^"]+)',paris)[1]=='paris-barkers-brothers'
 assert 'casa-del-doggo-editorial-20261127.jpg' in paris
 print(f'PASS: real credited photography for {len(parks)} parks in {len({p["city"] for p in parks})} guides; Barkers first and new Casa cover.')
 print(f'PASS: {len(berlin)} distinct licensed Berlin park covers and the official Michelberger Overlook cover.')
if __name__=='__main__':check(Path(sys.argv[1]).resolve())
