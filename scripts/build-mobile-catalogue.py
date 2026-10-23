"""Generate the mobile content contract from the same published city pages.
Runs during website publication, not on a schedule. No app code is delivered.
"""
import json, re, html, os
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse
ROOT=Path(__file__).resolve().parents[1]
BASE='https://thedogfriendlyguide.com/'
def clean(value): return html.unescape(re.sub('<[^>]+>', '', value)).strip()
def attr(tag, name):
 m=re.search(r'\b'+re.escape(name)+r'=["\']([^"\']*)',tag)
 return html.unescape(m[1]) if m else ''
def paragraph(card, cls):
 m=re.search(r'<p\b[^>]*class=["\'][^"\']*\b'+cls+r'\b[^"\']*["\'][^>]*>(.*?)</p>',card,re.S)
 return clean(m[1]) if m else ''
def https(value):
 url=urljoin(BASE,value)
 if urlparse(url).scheme!='https': raise ValueError('HTTPS required')
 return url
categories={'cafes':'Drink','cafe':'Drink','restaurant':'Eat','restaurants':'Eat','hotel':'Stay','hotels':'Stay','shop':'Shop','shops':'Shop','walk':'Walk'}
places=[]; cities=[]
for page in sorted(ROOT.glob('*-guide.html')):
 city=page.stem.removesuffix('-guide')
 if city=='paris': continue
 city_places=[]
 for card in re.findall(r'<article\b.*?</article>',page.read_text(),re.S):
  tag=card.split('>')[0]
  if 'place-card' not in attr(tag,'class').split(): continue
  title=re.search(r'<h3\b[^>]*>(.*?)</h3>',card,re.S)
  if not title: continue
  name=clean(title[1]); key=attr(card,'data-place') or attr(tag,'id')
  if not key: raise ValueError('Missing stable ID: '+name)
  imgs=re.findall(r'<img\b[^>]*>',card)
  cover=next((attr(img,'src') for img in imgs if 'editorial-photo' in attr(img,'class').split()), '')
  if not cover:
   background=re.search(r"--thumb:url\(['\"]?([^)'\"]+)",card)
   if background: cover=html.unescape(background[1])
  gallery=attr(tag,'data-gallery').split('|') if attr(tag,'data-gallery') else []
  images=list(dict.fromkeys(https(src) for src in [cover]+gallery if src and not src.startswith('data:')))
  links=[html.unescape(x) for x in re.findall(r'href=["\']([^"\']+)',card)]
  maps=next((link for link in links if 'google.com/maps' in link),'')
  if not images or not maps: raise ValueError('Missing photo or directions: '+name)
  category=categories.get(attr(tag,'data-category'))
  if not category: raise ValueError('Unsupported category: '+name)
  policy=paragraph(card,'place-dog-policy')
  # Amenities are not inferred from a general welcome; the actual policy is in the editorial text.
  city_places.append(dict(id=key if key.startswith(city+'-') else city+'-'+key, name=name, city=city, area=attr(tag,'data-area').replace('-',' ').title(), category=category, shortDescription=paragraph(card,'place-category'),editorial=' '.join(x for x in [paragraph(card,'desc'),policy,paragraph(card,'photo-credit')] if x), image=images[0], images=images, mapsUrl=https(maps), websiteUrl=next((link for link in links if 'instagram.com' in link),''), coordinates=dict(latitude=0,longitude=0), coordinatesVerified=False,distanceKm=0,source='website',attributes=dict(dogsInside=False,dogsOutside=False,terrace=False,water=False,cocoWasThere=False)))
 if city_places:
  cities.append(dict(id=city,label=city.replace('-',' ').title(),subtitle='The Guide’s edit'))
  places.extend(city_places)
paris=json.loads((ROOT/'paris-places.json').read_text())
assert paris.get('places')
cities.append(dict(id='paris',label='Paris',subtitle='The Guide’s edit'))
home=(ROOT/'index.html').read_text()
covers={}
for article in re.findall(r'<article\b.*?</article>',home,re.S):
 key=attr(article.split('>')[0],'data-guide-key')
 image=re.search(r'<img\b[^>]*>',article)
 if key and image: covers[key]=https(attr(image[0],'src'))
plans=json.loads((ROOT/'paris-plans.json').read_text())['plans']
for plan in plans:
 plan['cover']=covers.get(plan['slug'],https(plan['cover']))
 pairs=[(key,plan['stopNotes'][i]) for i,key in enumerate(plan['stopKeys']) if any(place['key']==key for place in paris['places'])]
 plan['stopKeys']=[key for key,note in pairs]
 plan['stopNotes']=[note for key,note in pairs]
 assert pairs, 'A plan must have at least one currently listed stop'
ids=[p['id'] for p in places]
assert len(ids)==len(set(ids)), 'Duplicate place IDs'
result=dict(schemaVersion=1,revision=os.environ.get('BUILD_ID','local'),generatedAt=datetime.now(timezone.utc).isoformat(),cities=cities,places=places,paris=paris,plans=plans)
(ROOT/'mobile-catalogue.v1.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'Mobile catalogue: {len(places)+len(paris["places"])} places in {len(cities)} cities; {len(plans)} website plans')
