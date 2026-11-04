import { useEffect, useState } from 'react';
import type { PatientReview } from './hospital';

// Live numbers from /api/google-reviews (see api/google-reviews.ts). Until that endpoint has its Google key,
// or whenever it cannot be reached (local dev, an outage), this stays null and the section shows the snapshot.
export type LiveReviews = { rating: number; count: number; reviews: PatientReview[]; fetchedAt: string };

type ApiReview = PatientReview & { rating: number };
type ApiResponse = { rating?: number | null; count?: number | null; reviews?: ApiReview[]; fetchedAt?: string };

// Shared across the page so the request is made once, however many components ask.
let request: Promise<LiveReviews | null> | null = null;

function loadLiveReviews() {
  request ??= fetch('/api/google-reviews', { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return null;
      const data = (await response.json()) as ApiResponse;
      if (typeof data.rating !== 'number' || typeof data.count !== 'number') return null;
      return { rating: data.rating, count: data.count, reviews: data.reviews ?? [], fetchedAt: data.fetchedAt ?? '' };
    })
    .catch(() => null);
  return request;
}

export function useLiveReviews() {
  const [live, setLive] = useState<LiveReviews | null>(null);
  useEffect(() => {
    let active = true;
    void loadLiveReviews().then((result) => { if (active) setLive(result); });
    return () => { active = false; };
  }, []);
  return live;
}
