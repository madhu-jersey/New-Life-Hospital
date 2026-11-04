import { DEMO_CONTENT, DEMO_RATING, DEMO_REVIEWS, GOOGLE_RATING, GOOGLE_REVIEWS, HOSPITAL_INFO, HOSPITAL_TOURS, PATIENT_REVIEWS } from './hospital';

export type GalleryPhoto = { src: string; srcSet?: string; width: number; height: number; demo: boolean };

// Gallery photos: every image file in src/assets/gallery-more/, ordered by file name.
// The first four fill the main grid; the rest sit behind "View more photos". Their real size is learned when they load.
// Files named demo-*.svg are "Photo coming soon" placeholders and only show while DEMO_CONTENT is on.
const photoUrls = import.meta.glob<string>('../assets/gallery-more/*.{jpg,jpeg,png,webp,avif,svg,JPG,JPEG,PNG,WEBP}', { eager: true, query: '?url', import: 'default' });
export const GALLERY_PHOTOS: GalleryPhoto[] = Object.keys(photoUrls)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((file) => ({ src: photoUrls[file], width: 1200, height: 900, demo: /\/demo-[^/]*$/.test(file) }))
  .filter((photo) => DEMO_CONTENT || !photo.demo);

// Real reviews win; the labelled samples fill in only while DEMO_CONTENT is on.
const hasRealReviews = Boolean(GOOGLE_REVIEWS) && GOOGLE_RATING.rating !== null && GOOGLE_RATING.count !== null && PATIENT_REVIEWS.length > 0;
export const REVIEW_DATA = hasRealReviews
  ? { demo: false, rating: GOOGLE_RATING.rating ?? 0, count: GOOGLE_RATING.count ?? 0, breakdown: GOOGLE_RATING.breakdown, reviews: PATIENT_REVIEWS, link: GOOGLE_REVIEWS }
  : { demo: true, ...DEMO_RATING, reviews: DEMO_REVIEWS, link: HOSPITAL_INFO.googleMapsUrl };

// Optional sections appear only once they have content.
export const HAS_GALLERY = GALLERY_PHOTOS.length > 0 || HOSPITAL_TOURS.some((tour) => tour.key === 'inside');
export const HAS_REVIEWS = hasRealReviews || DEMO_CONTENT;
