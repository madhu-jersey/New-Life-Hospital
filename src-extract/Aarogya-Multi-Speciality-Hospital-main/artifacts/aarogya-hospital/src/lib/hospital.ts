// Facts below come from the New Life Hospital brochure and the details the hospital supplied.
// Empty strings mean "not provided yet": the matching link, button, or section is hidden until it is filled in.
export const HOSPITAL_INFO = {
  // The hospital's own domain. Canonical links, robots.txt, the sitemap and structured data all follow this value;
  // a Cloudflare redirect rule sends www here.
  siteDomain: 'newlifehospitaltanuku.com',
  facebookUrl: '',
  instagramUrl: '',
  instagramHandle: '',
  // The hospital's own Google Maps listing ("Newlife hospital").
  googleMapsUrl: 'https://www.google.com/maps/place/Newlife+hospital/@16.7578483,81.6808267,1050m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3a37b7faedb6ac81:0x37b5a379caa9dce7!2sLIFE+HOSPITALS!8m2!3d16.7578432!4d81.6834016!16s%2Fg%2F11g9q8vgpy!3m5!1s0x3a37b76158b982f7:0x8282ab3c3935a0c9!8m2!3d16.7566922!4d81.6826178!16s%2Fg%2F11xg57sdl5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D',
  // The same listing opened on its Reviews tab: used for "Read more on Google" and "Write a review".
  googleReviewsUrl: 'https://www.google.com/maps/place/Newlife+hospital/@16.7578483,81.6808267,1050m/data=!3m1!1e3!4m16!1m7!3m6!1s0x3a37b7faedb6ac81:0x37b5a379caa9dce7!2sLIFE+HOSPITALS!8m2!3d16.7578432!4d81.6834016!16s%2Fg%2F11g9q8vgpy!3m7!1s0x3a37b76158b982f7:0x8282ab3c3935a0c9!8m2!3d16.7566922!4d81.6826178!9m1!1b1!16s%2Fg%2F11xg57sdl5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D',
  // true hides the whole site from search engines. Open to Google since 2026-11-06.
  noindex: false,
  name: 'New Life Hospital',
  shortName: 'New Life',
  foundingYear: null as number | null,
  teluguName: 'న్యూ లైఫ్ హాస్పిటల్',
  address: 'Tanuku Vari Street (street behind the Old Post Office)',
  locality: '',
  nearbyCity: 'Tanuku',
  region: 'Andhra Pradesh',
  postalCode: '534211',
  country: 'IN',
  phone: '+91 79933 64444',
  telephone: '+917993364444',
  alternatePhone: '+91 79933 74444',
  alternateTelephone: '+917993374444',
  landline: '08819 229444',
  landlineTelephone: '+918819229444',
  email: 'newlifehospitaltanuku@gmail.com',
  // Pin of the "Newlife hospital" Google Maps listing.
  latitude: 16.7566922 as number | null,
  longitude: 81.6826178 as number | null,
  mapQuery: 'New Life Hospital, Tanuku Vari Street, Tanuku, Andhra Pradesh 534211',
  // The hospital's own logo, cropped to the artwork on a transparent background (512 px).
  logo: '/assets/logo-512.webp',
  // Shown as the preview picture when the site link is shared (WhatsApp, Facebook) and in Google's data.
  image: '/assets/hospital-entrance.webp',
  imageWebpSrcSet: '',
  title: 'New Life Hospital, Tanuku | Gynaecology, Pregnancy, Infertility (IUI) & Cardiology',
  description: 'New Life Hospital, Tanuku Vari Street, Tanuku: obstetrics, gynaecology, pregnancy care and infertility (IUI) with Dr. K. N. Vandana, and cardiology with Dr. U. Venkatesh (ECG, 2D Echo, TMT, heart care). Lab tests and cashless insurance.',
};

// Spellings people actually type when searching for the hospital.
export const HOSPITAL_ALTERNATE_NAMES = [
  HOSPITAL_INFO.teluguName,
  'New Life Hospital Tanuku',
  'Newlife Hospital Tanuku',
];

export const AREAS_SERVED = ['Tanuku', 'West Godavari'];

export const SEO_KEYWORDS = [
  'New Life Hospital', 'New Life Hospital Tanuku', 'hospital in Tanuku', 'gynaecologist in Tanuku',
  'maternity hospital Tanuku', 'pregnancy scanning Tanuku', 'infertility treatment Tanuku', 'IUI Tanuku',
  'cardiologist in Tanuku', 'heart specialist Tanuku', 'ECG Tanuku', 'Dr K N Vandana gynaecologist',
  'Dr U Venkatesh cardiologist', 'న్యూ లైఫ్ హాస్పిటల్ తణుకు',
];

// Every service on the site, typed for schema.org so search engines can match "service + Tanuku" queries.
export const MEDICAL_SERVICES: { type: 'MedicalProcedure' | 'MedicalTest' | 'MedicalTherapy'; name: string }[] = [
  { type: 'MedicalTherapy', name: 'Pregnancy care' },
  { type: 'MedicalTest', name: 'Pregnancy scanning' },
  { type: 'MedicalTherapy', name: 'Gynaecological treatment' },
  { type: 'MedicalProcedure', name: 'Intrauterine insemination (IUI)' },
  { type: 'MedicalTherapy', name: 'Heart disease treatment' },
  { type: 'MedicalTest', name: 'ECG' },
  { type: 'MedicalTest', name: 'TMT (treadmill test)' },
  { type: 'MedicalTest', name: '2D Echo' },
  { type: 'MedicalTest', name: 'Trop T test' },
  { type: 'MedicalTest', name: 'Lab tests' },
];

// schema.org MedicalSpecialty values covered by the hospital.
export const MEDICAL_SPECIALTIES = ['Obstetric', 'Gynecologic', 'Cardiovascular'];

// Real hospital photos only, for structured data.
export const GALLERY_IMAGES: { path: string; caption: string }[] = [
  { path: '/assets/hospital-entrance.webp', caption: 'New Life Hospital entrance, Tanuku Vari Street, Tanuku' },
];

export const HOSPITAL_ADDRESS_DISPLAY = [HOSPITAL_INFO.address, HOSPITAL_INFO.locality, HOSPITAL_INFO.nearbyCity]
  .filter(Boolean)
  .join(', ') + ` – ${HOSPITAL_INFO.postalCode}, ${HOSPITAL_INFO.region}.`;
export const HOSPITAL_TEL = `tel:${HOSPITAL_INFO.telephone}`;
export const HOSPITAL_ALT_TEL = `tel:${HOSPITAL_INFO.alternateTelephone}`;
export const HOSPITAL_LANDLINE_TEL = `tel:${HOSPITAL_INFO.landlineTelephone}`;
export const HOSPITAL_MAILTO = `mailto:${HOSPITAL_INFO.email}`;
const mapTarget = HOSPITAL_INFO.latitude !== null && HOSPITAL_INFO.longitude !== null
  ? `${HOSPITAL_INFO.latitude},${HOSPITAL_INFO.longitude}`
  : encodeURIComponent(HOSPITAL_INFO.mapQuery);
export const HOSPITAL_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${mapTarget}`;
// Google's own embed of the "Newlife hospital" listing (CID = decimal of the listing ID 0x8282ab3c3935a0c9).
// Its card shows the live Google rating and review count, straight from Google, with no API key.
export const GOOGLE_LISTING_CID = '9404267247049220297';
export const HOSPITAL_MAP_EMBED = `https://maps.google.com/maps?cid=${GOOGLE_LISTING_CID}&hl=en&z=17&output=embed`;
// Google 360° photos of the hospital (Google Maps → open the 360° photo → Share → Embed a map → copy the src).
// Shown on the Visit map card as "Outside" and "Inside"; each loads only when someone taps it.
export type TourKey = 'outside' | 'inside';
export const HOSPITAL_TOURS: { key: TourKey; src: string }[] = [
  { key: 'outside', src: 'https://www.google.com/maps/embed?pb=!4v1793787607326!6m8!1m7!1sZCbx_tyZya4f4wAkPl0gig!2m2!1d16.75662207880169!2d81.68282964291566!3f287.9206311788489!4f1.8878840544173983!5f0.7820865974627469' },
  { key: 'inside', src: 'https://www.google.com/maps/embed?pb=!4v1793806862611!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDJ2dWZxclFF!2m2!1d16.75705279535072!2d81.68285320384368!3f218.6529853943955!4f2.4202360794776467!5f0.7820865974627469' },
];
export const GOOGLE_REVIEWS = HOSPITAL_INFO.googleReviewsUrl;

// Copy these from the hospital's own Google Maps listing only.
// Snapshot of the Google listing. A weekly task on the hospital PC re-reads the listing and rewrites the three
// lines below through scripts/update-google-reviews.mjs, then rebuilds and republishes the site.
// (If api/google-reviews.ts is ever given a Places API key, the live numbers take over instead.)
// Reviews per star level, 5 down to 1.
export const GOOGLE_RATING_CHECKED = '2026-11-04';
const GOOGLE_RATING_VALUE = 4.1;
const STAR_COUNTS = [7, 0, 0, 0, 2];
const STAR_TOTAL = STAR_COUNTS.reduce((sum, value) => sum + value, 0);
export const GOOGLE_RATING = {
  rating: GOOGLE_RATING_VALUE as number | null,
  count: STAR_TOTAL as number | null,
  breakdown: STAR_COUNTS.map((value) => `${Math.round((value / STAR_TOTAL) * 100)}%`),
};

export type PatientReview = { author: string; lang: string; time: string; copy: string; rating?: number; authorUrl?: string; photo?: string };

// Patients' own words, copied exactly from Google.
export const PATIENT_REVIEWS: PatientReview[] = [
  {
    author: 'Ramesh Komarapuri',
    lang: 'en',
    time: 'a month ago',
    rating: 5,
    copy: 'We had a very good experience at New Life Hospital during my wife’s pregnancy. Dr. K. N. Vandana is an excellent doctor—very caring, patient, and supportive throughout the pregnancy journey. She explained everything clearly and made us feel comfortable and confident at every stage.\n\nWe are truly thankful to Dr. Vandana and the hospital team for their care and support. Highly recommended for maternity and pregnancy care.',
  },
  { author: 'Mafisha Shiek', lang: 'en', time: '11 months ago', rating: 5, copy: 'good hospital and doctors' },
];

// Demo content for previewing the layout: labelled sample reviews and "Photo coming soon" gallery tiles.
// Set to false before going live; real reviews above always replace the samples.
export const DEMO_CONTENT = false;
export const DEMO_RATING = { rating: 4.8, count: 120, breakdown: ['88%', '8%', '2%', '1%', '1%'] };
export const DEMO_REVIEWS: typeof PATIENT_REVIEWS = [
  { author: 'Sample patient', lang: 'en', time: 'Demo', copy: 'This is a sample review to preview the layout. Real Google reviews from patients will appear here once the hospital shares them.' },
  { author: 'Sample patient', lang: 'en', time: 'Demo', copy: 'Sample text: describes the care during pregnancy check-ups and scanning. Replace with a real review.' },
  { author: 'Sample patient', lang: 'en', time: 'Demo', copy: 'Sample text: mentions the ECG and the evening cardiology consultation. Replace with a real review.' },
];

// WhatsApp number that receives appointment requests from the booking form (digits only, with country code).
export const BOOKING_WHATSAPP = '917993364444';

// Consultation windows in minutes after midnight (IST), Monday to Saturday. Sunday is a holiday.
export type Slot = { start: number; end: number };

export const DOCTORS = [
  {
    initials: 'KV',
    photo: '',
    photoKey: 'vandana',
    accent: 'women' as const,
    name: 'Dr. K. N. Vandana',
    department: 'Obstetrics & Gynaecology',
    medicalSpecialty: 'https://schema.org/Gynecologic',
    degree: 'M.B.B.S., D.G.O. (Obstetrics & Gynaecology), FMAS (Fellowship in Infertility & Laparoscopy)',
    regNo: '64361',
    care: 'Pregnancy care and scanning, gynaecology, and infertility treatment including IUI.',
    slots: [{ start: 9 * 60, end: 13 * 60 }, { start: 17 * 60, end: 19 * 60 }] as Slot[],
    timings: ['9:00 AM to 1:00 PM', '5:00 PM to 7:00 PM'],
  },
  {
    initials: 'UV',
    photo: '',
    photoKey: 'venkatesh',
    accent: 'heart' as const,
    name: 'Dr. U. Venkatesh',
    department: 'Cardiology',
    medicalSpecialty: 'https://schema.org/Cardiovascular',
    degree: 'M.D., D.M. (Cardiology)',
    regNo: '51574',
    care: 'Heart diseases, ECG, 2D Echo, TMT and Trop T tests.',
    slots: [{ start: 17 * 60, end: 20 * 60 }] as Slot[],
    timings: ['5:00 PM to 8:00 PM'],
  },
];

// Written the way people search ("cardiologist in Tanuku", "IUI treatment in Tanuku"). Each answer names the
// hospital, the doctor and Tanuku, so it still makes sense when Google shows it on its own. These also feed
// the FAQPage structured data in seo.ts. Facts only from the hospital brochure.
export const FAQ_ITEMS = [
  {
    question: 'Who is the gynaecologist at New Life Hospital, Tanuku?',
    answer: 'Dr. K. N. Vandana, M.B.B.S., D.G.O. (Obstetrics & Gynaecology), FMAS (Fellowship in Infertility & Laparoscopy). She consults from 9:00 AM to 1:00 PM and 5:00 PM to 7:00 PM, Monday to Saturday.',
  },
  {
    question: 'Is IUI and infertility treatment available in Tanuku?',
    answer: 'Yes. New Life Hospital, Tanuku offers infertility treatment with modern methods, including IUI (intrauterine insemination), under Dr. K. N. Vandana. Infertility cases are attended to at all times; call before you come.',
  },
  {
    question: 'Where can I get pregnancy care and scanning in Tanuku?',
    answer: 'New Life Hospital on Tanuku Vari Street provides pregnancy care and scanning with Dr. K. N. Vandana, obstetrician and gynaecologist, along with treatment for uterine and other gynaecological conditions.',
  },
  {
    question: 'Is there a cardiologist (heart specialist) in Tanuku?',
    answer: 'Yes. Dr. U. Venkatesh, M.D., D.M. (Cardiology), a senior interventional cardiologist and former Assistant Professor at SVIMS, consults at New Life Hospital, Tanuku Vari Street, Tanuku, from 5:00 PM to 8:00 PM, Monday to Saturday.',
  },
  {
    question: 'Can I get an ECG, 2D Echo or TMT test in Tanuku?',
    answer: 'Yes. ECG, 2D Echo, TMT (treadmill test) and Trop T tests are done at New Life Hospital, Tanuku, and you can consult cardiologist Dr. U. Venkatesh in the evening, from 5:00 PM to 8:00 PM, for heart diseases.',
  },
  {
    question: 'What are the OPD timings of New Life Hospital, Tanuku?',
    answer: 'Obstetrics & Gynaecology (Dr. K. N. Vandana): 9:00 AM to 1:00 PM and 5:00 PM to 7:00 PM. Cardiology (Dr. U. Venkatesh): 5:00 PM to 8:00 PM. Monday to Saturday; Sunday is a holiday.',
  },
  {
    question: 'Is New Life Hospital, Tanuku open on Sunday?',
    answer: 'No. Sunday is a holiday for regular consultations. Infertility cases are attended to at all times; call the hospital first.',
  },
  {
    question: 'How do I book an appointment at New Life Hospital, Tanuku?',
    answer: `Please take an appointment before you visit. Call ${HOSPITAL_INFO.phone} or ${HOSPITAL_INFO.alternatePhone}, the landline ${HOSPITAL_INFO.landline}, or send a request on WhatsApp from this website.`,
  },
  {
    question: 'Where is New Life Hospital located in Tanuku?',
    answer: `New Life Hospital is on Tanuku Vari Street, the street behind the Old Post Office, Tanuku – ${HOSPITAL_INFO.postalCode}, West Godavari district, Andhra Pradesh. Phone ${HOSPITAL_INFO.landline}; email ${HOSPITAL_INFO.email}.`,
  },
];
