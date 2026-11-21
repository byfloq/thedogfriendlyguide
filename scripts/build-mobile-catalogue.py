"""Validate the shared editorial selection and stamp the publication revision.

mobile-catalogue.v1.json is the source of truth for BOTH app and website.
Legacy HTML and the larger park archive must never expand that selection.
"""
import json, os, re
from pathlib import Path
from datetime import datetime, timezone
ROOT = Path(__file__).resolve().parents[1]

def validate(data):
    assert data['schemaVersion'] == 1
    cities = [c['id'] for c in data['cities']]
    assert 'paris' in cities and len(cities) == len(set(cities))
    places = data['places']
    ids = [p['id'] for p in places] + ['paris-' + p['key'] for p in data['paris']['places']]
    assert len(ids) == len(set(ids)), 'Duplicate place ID'
    for p in places:
        assert p['city'] in cities and p['category'] in ['Drink', 'Eat', 'Stay', 'Shop', 'Walk']
        assert p['name'] and p['mapsUrl'].startswith('https://')
        assert p['images'] and p['image'].startswith('https://')
        assert all(i.startswith('https://') for i in p['images'])
        if p['category'] == 'Walk':
            assert p['parkDetails']['id'] == p['id']
    keys = {p['key'] for p in data['paris']['places']}
    for p in data['plans']:
        assert p['stopKeys'] and set(p['stopKeys']) <= keys
        assert len(p['stopKeys']) == len(p['stopNotes'])
    return data

if __name__ == '__main__':
    path = ROOT / 'mobile-catalogue.v1.json'
    data = validate(json.loads(path.read_text()))
    revision = os.environ.get('BUILD_ID', data['revision'])
    assert re.fullmatch(r'[a-zA-Z0-9._-]{1,120}', revision)
    data.update(revision=revision, generatedAt=datetime.now(timezone.utc).isoformat())
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'Shared selection: {len(data["places"]) + len(data["paris"]["places"])} places in {len(data["cities"])} cities')
