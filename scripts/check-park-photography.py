"""Require a credited, locally hosted real photo for each published placeholder park."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def check(target):
 data=json.loads((target/'mobile-catalogue.v1.json').read_text());photos=json.loads((target/'park-area-photos.v1.json').read_text())['photos'];parks=[p for p in data['places'] if p['category']=='Walk']
 for p in parks:
  if 'placeholder' not in p['image']:continue
  c=photos[p['id']];assert c['areaId'].startswith(p['city']+':'),p['id']
  assert all(c.get(k) for k in ['artist','subject','license','licenseUrl','page','changes']),p['id']
  assert c['image'].startswith('https://thedogfriendlyguide.com/assets/park-areas251/'),p['id']
  asset=target/c['image'].split('thedogfriendlyguide.com/')[1];assert asset.exists() and asset.read_bytes()[:2]==b'\xff\xd8',p['id']
  text=(target/(p['city']+'-guide.html')).read_text();card=re.search(r'<article[^>]*data-catalogue-id="'+re.escape(p['id'])+r'".*?</article>',text,re.S)[0]
  assert 'park-placeholder' not in card and 'Representative outdoor view' in card and 'park-photo-credit' in card,p['id']
 paris=(target/'paris-guide.html').read_text();assert re.search(r'<article[^>]*data-catalogue-id="([^"]+)',paris)[1]=='paris-barkers-brothers'
 assert 'casa-del-doggo-editorial-20261127.jpg' in paris
 print(f'PASS: real credited photography for {len(parks)} parks in {len({p["city"] for p in parks})} guides; Barkers first and new Casa cover.')
if __name__=='__main__':check(Path(sys.argv[1]).resolve())
