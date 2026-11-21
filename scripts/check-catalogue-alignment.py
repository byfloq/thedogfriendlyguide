"""Fail publication if a website recommendation differs from the app selection."""
import collections, json, re, sys
from html.parser import HTMLParser
from pathlib import Path
from importlib.machinery import SourceFileLoader
ROOT=Path(__file__).resolve().parents[1]
module=SourceFileLoader('align_catalogue',str(ROOT/'scripts/align-website-catalogue.py')).load_module()
class Cards(HTMLParser):
    def __init__(self): super().__init__();self.ids=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='article' and 'place-card' in a.get('class','').split(): self.ids.append(a.get('data-catalogue-id'))
def check(target):
    data=json.loads((target/'mobile-catalogue.v1.json').read_text());module.validate(data)
    places=module.normalized(data)
    for city in data['cities']:
        expected=[p['id'] for p in places if p['city']==city['id']]
        text=(target/(city['id']+'-guide.html')).read_text();parser=Cards();parser.feed(text)
        assert parser.ids==expected,(city['id'],set(expected)-set(parser.ids),set(parser.ids)-set(expected))
        assert 'data-catalogue-aligned="true"' in text
        assert 'city-guide.js?selection='+data['revision'][:12] in text,city['id']
    park_ids=[p['id'] for p in places if p['category']=='Walk']
    assert [p['id'] for p in json.loads((target/'parks-catalogue.v1.json').read_text())['parks']]==park_ids
    assert json.loads((target/'paris-places.json').read_text())==data['paris']
    for language in ['', 'de/', 'fr/', 'es/']:
        text=(target/language/'index.html').read_text()
        picker=re.search(r'<nav class="guide-city-options"[^>]*>(.*?)</nav>',text,re.S)[1]
        for c in data['cities']:
            count=sum(p['city']==c['id'] for p in places)
            assert (f'city={c["id"]}#cities' in picker or f'/{c["id"]}-guide.html' in picker) and f'{count} places' in picker
    print(f'PASS: exact app/web equality for {len(places)} places, {len(data["cities"])} city guides, {len(park_ids)} parks and four homepage languages.')
if __name__=='__main__': check(Path(sys.argv[1]).resolve())
