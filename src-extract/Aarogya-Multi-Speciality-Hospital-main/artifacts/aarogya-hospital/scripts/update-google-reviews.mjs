#!/usr/bin/env node
// Updates the Google rating snapshot in src/lib/hospital.ts.
//
// Usage (from artifacts/aarogya-hospital):
//   node scripts/update-google-reviews.mjs --rating 4.1 --stars 7,0,0,0,2
//
// --stars is the number of reviews at 5, 4, 3, 2 and 1 stars, exactly as Google Maps lists them.
// Prints one of:
//   UNCHANGED 9 reviews, 4.1          nothing to do
//   UPDATED 9 -> 10 reviews, 4.1 -> 4.2   file rewritten; rebuild and publish
// Exits with code 1 and prints ERROR ... if the numbers look wrong, so a bad read never reaches the site.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../src/lib/hospital.ts', import.meta.url));

function fail(message) {
  console.log(`ERROR ${message}`);
  process.exit(1);
}

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const rating = Number(arg('rating'));
const stars = (arg('stars') ?? '').split(',').map((value) => Number(value.trim()));

if (!Number.isFinite(rating) || rating < 1 || rating > 5) fail(`rating must be between 1 and 5, got "${arg('rating')}"`);
if (stars.length !== 5 || stars.some((value) => !Number.isInteger(value) || value < 0)) fail(`stars must be five whole numbers like 7,0,0,0,2, got "${arg('stars')}"`);

const count = stars.reduce((sum, value) => sum + value, 0);
if (count === 0) fail('stars add up to 0 reviews');

// Google rounds the average to one decimal; a read that does not add up is rejected rather than published.
const average = stars.reduce((sum, value, index) => sum + value * (5 - index), 0) / count;
if (Math.abs(average - rating) > 0.06) fail(`stars average ${average.toFixed(2)}, which does not match rating ${rating}`);

const source = readFileSync(FILE, 'utf8');
const ratingLine = /const GOOGLE_RATING_VALUE = ([\d.]+);/;
const starsLine = /const STAR_COUNTS = \[([\d,\s]+)\];/;
const checkedLine = /export const GOOGLE_RATING_CHECKED = '([\d-]+)';/;
const currentRating = source.match(ratingLine);
const currentStars = source.match(starsLine);
if (!currentRating || !currentStars || !checkedLine.test(source)) fail(`could not find the snapshot lines in ${FILE}`);

const oldStars = currentStars[1].split(',').map((value) => Number(value.trim()));
const oldCount = oldStars.reduce((sum, value) => sum + value, 0);
const oldRating = Number(currentRating[1]);
const sameStars = oldStars.length === 5 && oldStars.every((value, index) => value === stars[index]);

if (sameStars && oldRating === rating) {
  console.log(`UNCHANGED ${count} reviews, ${rating}`);
  process.exit(0);
}

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
const updated = source
  .replace(ratingLine, `const GOOGLE_RATING_VALUE = ${rating};`)
  .replace(starsLine, `const STAR_COUNTS = [${stars.join(', ')}];`)
  .replace(checkedLine, `export const GOOGLE_RATING_CHECKED = '${today}';`);
writeFileSync(FILE, updated);
console.log(`UPDATED ${oldCount} -> ${count} reviews, ${oldRating} -> ${rating}`);
