"""Import supplied park records into the Guide's public, country-filtered catalogue."""
import argparse
import csv
import hashlib
import json
import math
import re
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import urlencode


ROOT = Path(__file__).resolve().parents[1]
COUNTRIES = {
    'Denmark': 'DK',
    'Germany': 'DE',
    'United Kingdom': 'GB',
    'Sweden': 'SE',
    'France': 'FR',
}
GUIDE_COUNTRIES = {
    'copenhagen': 'DK', 'berlin': 'DE', 'hamburg': 'DE',
    'london': 'GB', 'paris': 'FR',
}


def normalized(value):
    value = unicodedata.normalize('NFKD', value.casefold())
    return ' '.join(re.findall(r'\w+', ''.join(c for c in value if not unicodedata.combining(c))))


def name_tokens(value):
    return tuple(sorted(normalized(value).split()))


def in_ring(point, ring):
    x, y = point
    inside = False
    previous = ring[-1]
    for current in ring:
        ax, ay = previous[:2]
        bx, by = current[:2]
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            inside = not inside
        previous = current
    return inside


def in_geometry(point, geometry):
    polygons = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
    return any(in_ring(point, polygon[0]) and not any(in_ring(point, hole) for hole in polygon[1:]) for polygon in polygons)


def read_coordinates(row):
    if not row['Latitud'].strip() and not row['Longitud'].strip():
        return None
    latitude, longitude = float(row['Latitud']), float(row['Longitud'])
    if not all(map(math.isfinite, (latitude, longitude))):
        raise ValueError('Non-finite coordinates')
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        raise ValueError('Coordinates out of range')
    return {'latitude': latitude, 'longitude': longitude}


def parse_row(row):
    country = row['País'].strip()
    code = COUNTRIES[country]
    # A source URL contributes only to a stable opaque key. It is never published.
    fingerprint = hashlib.sha256(row['URL'].strip().encode()).hexdigest()[:16]
    rating = float(row['Rating (1-5)']) if row['Rating (1-5)'].strip() else None
    reviews = int(row['Nº reseñas']) if row['Nº reseñas'].strip() else None
    if rating is not None and not 0 <= rating <= 5:
        raise ValueError('Rating out of range')
    if reviews is not None and reviews < 0:
        raise ValueError('Negative review count')
    if row['Cercado'] not in ('Sí', 'No'):
        raise ValueError('Unknown fencing value')
    return {
        'id': f'park-{code.lower()}-{fingerprint}',
        'name': row['Nombre'].strip(),
        'countryCode': code,
        'country': country,
        'locality': row['Ciudad'].strip(),
        'address': row['Dirección'].strip(),
        'postalCode': row['Código postal'].strip() or None,
        'fenced': row['Cercado'] == 'Sí',
        'coordinates': read_coordinates(row),
        'referenceRating': rating,
        'referenceReviewCount': reviews,
        'detailsStatus': 'imported',
    }


def merge_locationless_aliases(parks):
    result = [park for park in parks if park['coordinates'] is not None]
    merges = []
    for park in parks:
        if park['coordinates'] is not None:
            continue
        candidates = [
            other for other in result
            if park['countryCode'] == other['countryCode']
            and name_tokens(park['name']) == name_tokens(other['name'])
            and normalized(other['locality']) in normalized(park['name'])
            and park['fenced'] == other['fenced']
        ]
        if len(candidates) != 1:
            result.append(park)
            continue
        canonical = candidates[0]
        canonical.setdefault('aliases', []).append(park['id'])
        for field in ['referenceRating', 'referenceReviewCount']:
            if canonical[field] is None:
                canonical[field] = park[field]
        merges.append({'mergedId': park['id'], 'retainedId': canonical['id'], 'name': canonical['name']})
    return result, merges


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('csv_path', type=Path)
    parser.add_argument('--report', required=True, type=Path)
    args = parser.parse_args()
    with args.csv_path.open(encoding='utf-8-sig', newline='') as stream:
        rows = [row for row in csv.DictReader(stream) if row['País'].strip() in COUNTRIES]
    parks = [parse_row(row) for row in rows]
    assert len({park['id'] for park in parks}) == len(parks), 'Repeated source record'
    parks, merged = merge_locationless_aliases(parks)
    boundaries = json.loads((ROOT / 'city-boundaries.v20.json').read_text())
    for park in parks:
        coordinates = park['coordinates']
        point = (coordinates['longitude'], coordinates['latitude']) if coordinates else None
        park['guideCity'] = next((
            city for city, country in GUIDE_COUNTRIES.items()
            if park['countryCode'] == country and point and in_geometry(point, boundaries[city]['geometry'])
        ), None)
        query = f"{coordinates['latitude']},{coordinates['longitude']}" if coordinates else f"{park['name']} {park['locality']} {park['country']}"
        park['mapsUrl'] = 'https://www.google.com/maps/search/?' + urlencode({'api': '1', 'query': query})
    parks.sort(key=lambda park: (list(COUNTRIES.values()).index(park['countryCode']), normalized(park['locality']), normalized(park['name']), park['id']))
    catalogue = {
        'schemaVersion': 1,
        'revision': 'parks-20261113',
        'countries': [{'code': code, 'name': name} for name, code in COUNTRIES.items()],
        'parks': parks,
    }
    payload = json.dumps(catalogue, ensure_ascii=False, indent=2) + '\n'
    (ROOT / 'parks-catalogue.v1.json').write_text(payload)
    report = {
        'inputSha256': hashlib.sha256(args.csv_path.read_bytes()).hexdigest(),
        'selectedRows': len(rows),
        'uniqueParks': len(parks),
        'byCountry': dict(Counter(park['country'] for park in parks)),
        'byGuideCity': dict(Counter(park['guideCity'] for park in parks if park['guideCity'])),
        'locationlessAliasesMerged': merged,
        'coordinatesMissing': [park['id'] for park in parks if park['coordinates'] is None],
        'recordsWithReferenceRatings': sum(park['referenceRating'] is not None for park in parks),
        'photosProvided': 0,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
