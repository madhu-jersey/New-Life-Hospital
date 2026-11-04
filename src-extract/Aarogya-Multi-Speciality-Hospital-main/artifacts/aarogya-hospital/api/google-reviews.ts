// GET /api/google-reviews — the hospital's live Google rating, review count and latest reviews.
//
// Runs as a Vercel Function and calls the Google Places API (New), so the API key never reaches the browser.
// Vercel's CDN caches each answer for 6 hours: a new Google review shows on the site within a few hours,
// and the Places API is called only a few times a day (well inside Google's free monthly allowance).
//
// Set in Vercel → Project → Settings → Environment Variables:
//   GOOGLE_PLACES_API_KEY  required. A Google Cloud key with "Places API (New)" enabled.
//   GOOGLE_PLACE_ID        optional. The listing's place ID (starts with "ChIJ"). Without it the function finds
//                          "Newlife hospital" near the map pin itself; copy the placeId from this endpoint's
//                          response into this variable to save that extra lookup.
//
// Without a key the endpoint answers 503 and the site keeps showing the snapshot in src/lib/hospital.ts.

const HOSPITAL_PIN = { latitude: 16.7566922, longitude: 81.6826178 };
const SEARCH_TEXT = 'Newlife hospital, Tanuku Vari Street, Tanuku';
const PLACES = 'https://places.googleapis.com/v1';
const FIELDS = ['id', 'displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsUri', 'location'];
const CACHE_SECONDS = 6 * 60 * 60;

type GoogleReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  location?: { latitude?: number; longitude?: number };
  reviews?: GoogleReview[];
};

function json(body: unknown, status: number, cacheSeconds: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Browsers re-check every 10 minutes; Vercel's CDN serves the cached copy and refreshes it in the background.
      'Cache-Control': cacheSeconds > 0 ? `public, max-age=600, s-maxage=${cacheSeconds}, stale-while-revalidate=86400` : 'no-store',
    },
  });
}

const distance = (place: GooglePlace) => {
  const lat = place.location?.latitude ?? 0;
  const lng = place.location?.longitude ?? 0;
  return Math.hypot(lat - HOSPITAL_PIN.latitude, lng - HOSPITAL_PIN.longitude);
};

async function placeById(key: string, placeId: string): Promise<GooglePlace> {
  const response = await fetch(`${PLACES}/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS.join(',') },
  });
  if (!response.ok) throw new Error(`Place Details failed: ${response.status} ${await response.text()}`);
  return response.json() as Promise<GooglePlace>;
}

// Several hospitals in Tanuku have similar names, so take the result closest to the hospital's own pin.
async function placeBySearch(key: string): Promise<GooglePlace> {
  const response = await fetch(`${PLACES}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELDS.map((field) => `places.${field}`).join(','),
    },
    body: JSON.stringify({
      textQuery: SEARCH_TEXT,
      languageCode: 'en',
      locationBias: { circle: { center: HOSPITAL_PIN, radius: 400 } },
    }),
  });
  if (!response.ok) throw new Error(`Text Search failed: ${response.status} ${await response.text()}`);
  const { places = [] } = (await response.json()) as { places?: GooglePlace[] };
  const nearest = [...places].sort((a, b) => distance(a) - distance(b))[0];
  // About 100 m in degrees: anything further away is a different listing.
  if (!nearest || distance(nearest) > 0.001) throw new Error('Newlife hospital listing not found near the map pin');
  return nearest;
}

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return json({ error: 'GOOGLE_PLACES_API_KEY is not set' }, 503, 0);

  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const place = placeId ? await placeById(key, placeId) : await placeBySearch(key);
    const reviews = (place.reviews ?? []).map((review) => ({
      author: review.authorAttribution?.displayName ?? 'Google user',
      authorUrl: review.authorAttribution?.uri ?? '',
      photo: review.authorAttribution?.photoUri ?? '',
      rating: review.rating ?? 0,
      time: review.relativePublishTimeDescription ?? '',
      publishTime: review.publishTime ?? '',
      // The patient's own words, in the language they wrote them.
      copy: review.originalText?.text ?? review.text?.text ?? '',
      lang: review.originalText?.languageCode ?? review.text?.languageCode ?? 'en',
    }));
    return json({
      placeId: place.id ?? '',
      name: place.displayName?.text ?? '',
      rating: place.rating ?? null,
      count: place.userRatingCount ?? null,
      mapsUrl: place.googleMapsUri ?? '',
      reviews,
      fetchedAt: new Date().toISOString(),
    }, 200, CACHE_SECONDS);
  } catch (error) {
    console.error(error);
    // A short cache so a Google hiccup does not hammer the API, but recovers quickly.
    return json({ error: 'Could not reach Google' }, 502, 300);
  }
}
