#!/usr/bin/env node
/**
 * Catalogue parity audit for The Dog Friendly Guide.
 * Safe by default: reports discrepancies without changing published data.
 * Usage: node scripts/audit-catalogue.mjs [path/to/build65-export.json]
 * The optional export must be an array or {places:[...]} from the actual build 65 data source.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mobile = JSON.parse(fs.readFileSync(path.join(root, 'mobile-catalogue.v1.json'), 'utf8'));
const paris = JSON.parse(fs.readFileSync(path.join(root, 'paris-places.json'), 'utf8'));
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const canonicalKey = p => [normalize(p.city), normalize(p.name)].join(':');
const coords = p => Array.isArray(p.coordinates) ? p.coordinates : p.coordinates ? [p.coordinates.longitude, p.coordinates.latitude] : null;
const near = (a,b) => {
  const x=coords(a),y=coords(b);
  return x && y && x.every(Number.isFinite) && y.every(Number.isFinite)
    && Math.abs(x[0]-y[0]) < 0.00035 && Math.abs(x[1]-y[1]) < 0.00035;
};
const website = [
  ...mobile.places,
  ...paris.places.map(p => ({
    ...p, id: 'paris-' + p.key, city: 'paris',
    coordinates: p.coordinates
  }))
];
const duplicateIds = [];
const seenIds = new Map();
const duplicateCandidates = [];
const seenNames = new Map();
for (const p of website) {
  if (seenIds.has(p.id)) duplicateIds.push([seenIds.get(p.id),p]);
  else seenIds.set(p.id,p);
  const key=canonicalKey(p);
  if (seenNames.has(key)) duplicateCandidates.push({first:seenNames.get(key).id,second:p.id,city:p.city,name:p.name,near:near(seenNames.get(key),p)});
  else seenNames.set(key,p);
}
let appMissing = [], websiteMissing = [];
if (process.argv[2]) {
  const raw = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const app = Array.isArray(raw) ? raw : raw.places;
  if (!Array.isArray(app)) throw Error('Build 65 export must be an array or {places:[]}');
  const appKeys=new Set(app.map(canonicalKey)), webKeys=new Set(website.map(canonicalKey));
  appMissing=app.filter(p=>!webKeys.has(canonicalKey(p)));
  websiteMissing=website.filter(p=>!appKeys.has(canonicalKey(p)));
}
const result = {
  sources:{mobileRevision:mobile.revision,mobileGeneratedAt:mobile.generatedAt,mobileCount:mobile.places.length,parisCount:paris.places.length},
  websiteCombinedCount:website.length,
  duplicateIds:duplicateIds.map(([a,b])=>({id:a.id,first:a.name,second:b.name})),
  duplicateCandidates,
  appOnly:appMissing.map(p=>({id:p.id,name:p.name,city:p.city})),
  webOnly:websiteMissing.map(p=>({id:p.id,name:p.name,city:p.city})),
  appComparisonPerformed:Boolean(process.argv[2]),
  note:'Do not publish additions until the actual TestFlight build 65 data source is verified.'
};
console.log(JSON.stringify(result,null,2));
if (duplicateIds.length) process.exitCode=1;
