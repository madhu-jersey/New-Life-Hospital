// One page per service, each written for the way people search ("gynaecologist in Tanuku", "ECG test in Tanuku").
// Pure (no DOM): the build turns each page into a ready-made HTML file that search engines can read without
// running JavaScript, and the app shows the very same markup. Facts only from the hospital brochure.
import { DOCTORS, HOSPITAL_ADDRESS_DISPLAY, HOSPITAL_DIRECTIONS, HOSPITAL_INFO, BOOKING_WHATSAPP, PATIENT_REVIEWS } from './hospital';
import { buildStructuredData } from './seo';

type Accent = 'women' | 'heart';
type Faq = { question: string; answer: string };

export type ServicePage = {
  slug: string;
  accent: Accent;
  /** Short name used in links and breadcrumbs. */
  label: string;
  title: string;
  description: string;
  h1: string;
  telugu: string;
  intro: string;
  servicesTitle: string;
  services: { name: string; detail: string }[];
  doctorIndex: number;
  faqs: Faq[];
  /** A real Google review that fits this page, by author. */
  reviewAuthor?: string;
};

const [VANDANA, VENKATESH] = DOCTORS;
const WOMEN_HOURS = `${VANDANA.timings.join(' and ')}, Monday to Saturday`;
const HEART_HOURS = `${VENKATESH.timings.join(' and ')}, Monday to Saturday`;
const PHONES = `${HOSPITAL_INFO.phone}, ${HOSPITAL_INFO.alternatePhone} or the landline ${HOSPITAL_INFO.landline}`;
const WHERE = 'New Life Hospital, Tanuku Vari Street (the street behind the Old Post Office), Tanuku';

const bookingFaq: Faq = {
  question: 'How do I book an appointment at New Life Hospital, Tanuku?',
  answer: `Please take an appointment before you visit. Call ${PHONES}, or send a request on WhatsApp from this website.`,
};
const locationFaq: Faq = {
  question: 'Where is New Life Hospital in Tanuku?',
  answer: `On Tanuku Vari Street, the street behind the Old Post Office, Tanuku – ${HOSPITAL_INFO.postalCode}, West Godavari district, Andhra Pradesh.`,
};
const insuranceFaq: Faq = {
  question: 'Is cashless insurance accepted?',
  answer: 'Yes. Cashless treatment is available with insurance companies including Star Health, HDFC ERGO, Tata AIG, ICICI Lombard and SBI General Insurance, and with TPAs such as Medi Assist, FHPL, Paramount Health and MD India. Cashless facilities are subject to policy terms, eligibility and approval.',
};

const WOMEN_SERVICES = [
  { name: 'Pregnancy care and scanning', detail: 'Check-ups and scans through pregnancy, with scanning done at the hospital.' },
  { name: 'Gynaecology', detail: 'Consultation and treatment for uterine and other women’s health conditions.' },
  { name: 'Infertility treatment and IUI', detail: 'Modern treatment for couples, including intrauterine insemination (IUI).' },
];
const HEART_SERVICES = [
  { name: 'Heart diseases', detail: 'Out-patient consultation and treatment with a cardiologist.' },
  { name: 'ECG', detail: 'Heart tracing done at the hospital.' },
  { name: '2D Echo', detail: 'Ultrasound scan of the heart’s chambers, valves and pumping.' },
  { name: 'TMT (treadmill test)', detail: 'Stress test that checks the heart while you walk on a treadmill.' },
  { name: 'Trop T test', detail: 'Blood test that helps detect damage to the heart muscle.' },
  { name: 'Lab tests', detail: 'Blood and other routine tests done at the hospital.' },
];

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'gynaecologist-in-tanuku',
    accent: 'women',
    label: 'Gynaecologist in Tanuku',
    title: 'Gynaecologist in Tanuku | Dr. K. N. Vandana | New Life Hospital',
    description: `Gynaecologist Dr. K. N. Vandana (M.B.B.S., D.G.O., FMAS) at New Life Hospital, Tanuku Vari Street, Tanuku: pregnancy care and scanning, uterine problems and infertility (IUI). ${WOMEN_HOURS}.`,
    h1: 'Gynaecologist in Tanuku',
    telugu: 'తణుకులో గైనకాలజిస్ట్ – డా. కె. ఎన్. వందన',
    intro: `Dr. K. N. Vandana, obstetrician and gynaecologist, consults at ${WHERE}. She sees women for pregnancy care and scanning, uterine and other gynaecological problems, and infertility treatment including IUI.`,
    servicesTitle: 'What the gynaecologist treats',
    services: WOMEN_SERVICES,
    doctorIndex: 0,
    faqs: [
      {
        question: 'Who is the gynaecologist at New Life Hospital, Tanuku?',
        answer: `Dr. K. N. Vandana, ${VANDANA.degree}. She consults from ${WOMEN_HOURS}.`,
      },
      {
        question: 'What are the gynaecologist’s timings in Tanuku?',
        answer: `Dr. K. N. Vandana consults from ${WOMEN_HOURS}. Sunday is a holiday. Infertility cases are attended to at all times; call before you come.`,
      },
      bookingFaq,
      locationFaq,
    ],
    reviewAuthor: 'Ramesh Komarapuri',
  },
  {
    slug: 'pregnancy-care-scanning-in-tanuku',
    accent: 'women',
    label: 'Pregnancy care & scanning',
    title: 'Pregnancy Care & Scanning in Tanuku | Maternity | New Life Hospital',
    description: `Pregnancy check-ups and scanning in Tanuku with obstetrician Dr. K. N. Vandana at New Life Hospital, Tanuku Vari Street. Scans done at the hospital. ${WOMEN_HOURS}. Call ${HOSPITAL_INFO.phone}.`,
    h1: 'Pregnancy care and scanning in Tanuku',
    telugu: 'తణుకులో గర్భిణీ స్త్రీలకు వైద్య సేవలు, స్కానింగ్',
    intro: `Expecting a baby? At ${WHERE}, obstetrician Dr. K. N. Vandana looks after you through your pregnancy, with regular check-ups and pregnancy scans done in the same building.`,
    servicesTitle: 'Pregnancy and women’s care',
    services: WOMEN_SERVICES,
    doctorIndex: 0,
    faqs: [
      {
        question: 'Where can I get pregnancy care and scanning in Tanuku?',
        answer: `At ${WHERE}. Dr. K. N. Vandana, obstetrician and gynaecologist, provides pregnancy care, and pregnancy scanning is done at the hospital.`,
      },
      {
        question: 'When can I see the doctor for a pregnancy check-up?',
        answer: `Dr. K. N. Vandana consults from ${WOMEN_HOURS}. Sunday is a holiday. Please take an appointment before you visit.`,
      },
      bookingFaq,
      insuranceFaq,
    ],
    reviewAuthor: 'Ramesh Komarapuri',
  },
  {
    slug: 'infertility-iui-treatment-in-tanuku',
    accent: 'women',
    label: 'Infertility & IUI treatment',
    title: 'Infertility & IUI Treatment in Tanuku | New Life Hospital',
    description: 'Infertility treatment with modern methods, including IUI (intrauterine insemination), in Tanuku with Dr. K. N. Vandana (FMAS, Fellowship in Infertility & Laparoscopy). Infertility cases attended to at all times.',
    h1: 'Infertility and IUI treatment in Tanuku',
    telugu: 'తణుకులో సంతానోత్పత్తి చికిత్స (IUI)',
    intro: `Couples hoping for a child can see Dr. K. N. Vandana at ${WHERE}. She holds a Fellowship in Infertility & Laparoscopy (FMAS) and offers infertility treatment with modern methods, including IUI (intrauterine insemination). Infertility cases are attended to at all times, not only in consultation hours.`,
    servicesTitle: 'Infertility and women’s care',
    services: [WOMEN_SERVICES[2], WOMEN_SERVICES[0], WOMEN_SERVICES[1]],
    doctorIndex: 0,
    faqs: [
      {
        question: 'Is IUI and infertility treatment available in Tanuku?',
        answer: 'Yes. New Life Hospital, Tanuku offers infertility treatment with modern methods, including IUI (intrauterine insemination), under Dr. K. N. Vandana.',
      },
      {
        question: 'When can infertility cases be seen?',
        answer: `Infertility cases are attended to at all times. Please call ${HOSPITAL_INFO.phone} before you come. Regular consultations are ${WOMEN_HOURS}.`,
      },
      bookingFaq,
      locationFaq,
    ],
  },
  {
    slug: 'cardiologist-in-tanuku',
    accent: 'heart',
    label: 'Cardiologist in Tanuku',
    title: 'Cardiologist in Tanuku | Heart Specialist Dr. U. Venkatesh | New Life Hospital',
    description: `Cardiologist (heart specialist) Dr. U. Venkatesh, M.D., D.M. (Cardiology), senior interventional cardiologist, at New Life Hospital, Tanuku. ECG, 2D Echo, TMT and Trop T tests. ${HEART_HOURS}.`,
    h1: 'Cardiologist in Tanuku',
    telugu: 'తణుకులో గుండె వైద్య నిపుణులు – డా. యు. వెంకటేష్',
    intro: `Dr. U. Venkatesh, M.D., D.M. (Cardiology), a senior interventional cardiologist and former Assistant Professor at SVIMS, consults every evening at ${WHERE}. Heart tests such as ECG, 2D Echo, TMT and Trop T are done in the same building.`,
    servicesTitle: 'Heart care at New Life Hospital',
    services: HEART_SERVICES,
    doctorIndex: 1,
    faqs: [
      {
        question: 'Is there a cardiologist (heart specialist) in Tanuku?',
        answer: `Yes. Dr. U. Venkatesh, M.D., D.M. (Cardiology), a senior interventional cardiologist and former Assistant Professor at SVIMS, consults at ${WHERE}.`,
      },
      {
        question: 'What are the cardiologist’s timings?',
        answer: `Dr. U. Venkatesh consults from ${HEART_HOURS}. Sunday is a holiday.`,
      },
      bookingFaq,
      insuranceFaq,
    ],
  },
  {
    slug: 'ecg-2d-echo-tmt-test-in-tanuku',
    accent: 'heart',
    label: 'ECG, 2D Echo & TMT tests',
    title: 'ECG, 2D Echo & TMT Test in Tanuku | Heart Tests | New Life Hospital',
    description: `ECG, 2D Echo, TMT (treadmill test), Trop T and lab tests in Tanuku at New Life Hospital, Tanuku Vari Street, with cardiologist Dr. U. Venkatesh, ${HEART_HOURS}. Call ${HOSPITAL_INFO.phone}.`,
    h1: 'ECG, 2D Echo and TMT tests in Tanuku',
    telugu: 'తణుకులో ఈసీజీ, 2డి ఎకో, టీఎంటీ పరీక్షలు',
    intro: `Heart tests are done at ${WHERE}: ECG, 2D Echo, TMT (treadmill test) and the Trop T blood test, along with routine lab tests. Cardiologist Dr. U. Venkatesh is available in the evening to read your results and advise treatment.`,
    servicesTitle: 'Heart tests done at the hospital',
    services: [HEART_SERVICES[1], HEART_SERVICES[2], HEART_SERVICES[3], HEART_SERVICES[4], HEART_SERVICES[5], HEART_SERVICES[0]],
    doctorIndex: 1,
    faqs: [
      {
        question: 'Can I get an ECG, 2D Echo or TMT test in Tanuku?',
        answer: `Yes. ECG, 2D Echo, TMT (treadmill test) and Trop T tests are done at ${WHERE}.`,
      },
      {
        question: 'Can I see a cardiologist with my test results?',
        answer: `Yes. Cardiologist Dr. U. Venkatesh consults at the same hospital from ${HEART_HOURS}.`,
      },
      bookingFaq,
      locationFaq,
    ],
  },
];

export function findServicePage(pathname: string): ServicePage | undefined {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return SERVICE_PAGES.find((page) => page.slug === slug);
}

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const ICON_PHONE = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const ICON_PIN = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
const ICON_ARROW = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/** The page body as plain HTML: shipped inside the prebuilt file and shown as-is by the app. */
export function servicePageHtml(page: ServicePage): string {
  const doctor = DOCTORS[page.doctorIndex];
  const role = page.accent === 'heart' ? 'Senior Interventional Cardiologist · Former Assistant Professor, SVIMS' : 'Obstetrician & Gynaecologist · Specialist in infertility treatment';
  const review = page.reviewAuthor ? PATIENT_REVIEWS.find((item) => item.author === page.reviewAuthor) : undefined;
  const others = SERVICE_PAGES.filter((item) => item.slug !== page.slug);
  const whatsapp = `https://wa.me/${BOOKING_WHATSAPP}?text=${encodeURIComponent(`Hello, I would like an appointment with ${doctor.name} at New Life Hospital, Tanuku.`)}`;
  return `
<div class="svc svc--${page.accent}">
  <section class="svc-hero">
    <div class="container">
      <nav class="svc-crumbs" aria-label="Breadcrumb"><a href="/">New Life Hospital</a><span aria-hidden="true">/</span><span>${escapeHtml(page.label)}</span></nav>
      <p class="svc-place">${ICON_PIN}<span>Tanuku Vari Street, Tanuku</span></p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="svc-telugu telugu" lang="te">${escapeHtml(page.telugu)}</p>
      <p class="svc-lead">${escapeHtml(page.intro)}</p>
      <div class="svc-actions">
        <a class="button" href="tel:${HOSPITAL_INFO.telephone}">${ICON_PHONE}<span>Call ${escapeHtml(HOSPITAL_INFO.phone)}</span></a>
        <a class="button button-ghost" href="${escapeHtml(whatsapp)}" target="_blank" rel="noopener noreferrer"><span>Book on WhatsApp</span></a>
      </div>
    </div>
  </section>
  <section class="section svc-body">
    <div class="container svc-grid">
      <div class="svc-main">
        <h2>${escapeHtml(page.servicesTitle)}</h2>
        <ul class="svc-list">
          ${page.services.map((item) => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.detail)}</span></li>`).join('\n          ')}
        </ul>
        <h2>Your doctor</h2>
        <div class="svc-doctor">
          <p class="svc-doctor-name">${escapeHtml(doctor.name)}</p>
          <p class="svc-doctor-dept">${escapeHtml(doctor.department)}</p>
          <p>${escapeHtml(doctor.degree)}</p>
          <p>${escapeHtml(role)}</p>
          <p class="svc-doctor-reg">Regd. No. ${escapeHtml(doctor.regNo)}</p>
        </div>
        ${review ? `<figure class="svc-review"><blockquote>${escapeHtml(review.copy.split('\n')[0])}</blockquote><figcaption>${escapeHtml(review.author)}, Google review</figcaption></figure>` : ''}
      </div>
      <aside class="svc-card" aria-label="Timings and contact">
        <h2>Consultation hours</h2>
        <ul class="svc-hours">
          ${doctor.timings.map((time) => `<li>${escapeHtml(time)}</li>`).join('')}
        </ul>
        <p class="svc-note">Monday to Saturday. Sunday is a holiday.${page.accent === 'women' ? ' Infertility cases are attended to at all times; call before you come.' : ''}</p>
        <h2>Address</h2>
        <p>${escapeHtml(HOSPITAL_ADDRESS_DISPLAY)}</p>
        <p class="svc-phones"><a href="tel:${HOSPITAL_INFO.telephone}">${escapeHtml(HOSPITAL_INFO.phone)}</a><a href="tel:${HOSPITAL_INFO.alternateTelephone}">${escapeHtml(HOSPITAL_INFO.alternatePhone)}</a><a href="tel:${HOSPITAL_INFO.landlineTelephone}">${escapeHtml(HOSPITAL_INFO.landline)}</a></p>
        <a class="svc-link" href="${escapeHtml(HOSPITAL_DIRECTIONS)}" target="_blank" rel="noopener noreferrer"><span>Get directions</span>${ICON_ARROW}</a>
        <a class="svc-link" href="/#booking"><span>Request an appointment</span>${ICON_ARROW}</a>
      </aside>
    </div>
  </section>
  <section class="section svc-faq">
    <div class="container">
      <h2>Questions</h2>
      <div class="svc-faq-list">
        ${page.faqs.map((faq) => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section svc-more">
    <div class="container">
      <h2>More at New Life Hospital, Tanuku</h2>
      <ul class="svc-more-list">
        ${others.map((item) => `<li><a href="/${item.slug}"><span>${escapeHtml(item.h1)}</span>${ICON_ARROW}</a></li>`).join('\n        ')}
        <li><a href="/"><span>New Life Hospital home</span>${ICON_ARROW}</a></li>
      </ul>
    </div>
  </section>
</div>`;
}

export function servicePageUrl(origin: string, page: ServicePage) {
  return `${origin}/${page.slug}`;
}

export function serviceStructuredData(origin: string, page: ServicePage) {
  const site = buildStructuredData(origin);
  const graph = site['@graph'] as Record<string, unknown>[];
  const hospital = graph[0];
  const physician = graph.find((node) => node['@id'] === `${origin}/#physician-${page.doctorIndex + 1}`);
  const url = servicePageUrl(origin, page);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      hospital,
      ...(physician ? [physician] : []),
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#hospital` },
        ...(physician ? { mainEntity: { '@id': physician['@id'] } } : {}),
        specialty: page.accent === 'heart' ? ['Cardiovascular'] : ['Obstetric', 'Gynecologic'],
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: HOSPITAL_INFO.name, item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: page.label, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  };
}

/** Turns the built home page into this service page's own file: its title, description, links and body. */
export function renderServiceDocument(html: string, page: ServicePage, origin: string): string {
  const url = servicePageUrl(origin, page);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const jsonLd = JSON.stringify(serviceStructuredData(origin, page)).replaceAll('<', '\\u003c');
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${description}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="alternate" hreflang="en-IN" href=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="alternate" hreflang="x-default" href=")[^"]*/, `$1${url}`)
    .replace(/(<script id="hospital-jsonld" type="application\/ld\+json">)[\s\S]*?(<\/script>)/, `$1${jsonLd}$2`)
    .replace(/<noscript>[\s\S]*?<\/noscript>/, '')
    .replace('<div id="root"></div>', `<div id="root">${servicePageHtml(page)}</div>`);
}
