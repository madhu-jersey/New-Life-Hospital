import {
  AREAS_SERVED,
  DOCTORS,
  FAQ_ITEMS,
  GALLERY_IMAGES,
  HOSPITAL_ALTERNATE_NAMES,
  HOSPITAL_INFO,
  MEDICAL_SERVICES,
  MEDICAL_SPECIALTIES,
} from './hospital';
import { findServicePage, serviceStructuredData, servicePageUrl } from './service-pages';

// Pure (no DOM), so the build can bake the same JSON-LD into index.html for crawlers that skip JavaScript.
// Only confirmed facts go here: no opening hours, map pin, or founding year until the hospital provides them.
export function buildStructuredData(origin: string) {
  const absolute = (path: string) => new URL(path, `${origin}/`).href;
  const homeUrl = `${origin}/`;
  const hospitalId = `${origin}/#hospital`;
  const address = {
    '@type': 'PostalAddress',
    streetAddress: HOSPITAL_INFO.address,
    addressLocality: [HOSPITAL_INFO.locality, HOSPITAL_INFO.nearbyCity].filter(Boolean).join(', '),
    addressRegion: HOSPITAL_INFO.region,
    postalCode: HOSPITAL_INFO.postalCode,
    addressCountry: HOSPITAL_INFO.country,
  };
  const geo = HOSPITAL_INFO.latitude !== null && HOSPITAL_INFO.longitude !== null
    ? { geo: { '@type': 'GeoCoordinates', latitude: HOSPITAL_INFO.latitude, longitude: HOSPITAL_INFO.longitude } }
    : {};
  const sameAs = [HOSPITAL_INFO.instagramUrl, HOSPITAL_INFO.facebookUrl, HOSPITAL_INFO.googleMapsUrl].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Hospital', 'MedicalOrganization'],
        '@id': hospitalId,
        name: HOSPITAL_INFO.name,
        alternateName: HOSPITAL_ALTERNATE_NAMES,
        description: `${HOSPITAL_INFO.name} is a hospital on Tanuku Vari Street, ${HOSPITAL_INFO.nearbyCity}, ${HOSPITAL_INFO.region}, offering obstetrics and gynaecology, pregnancy care and scanning, infertility treatment including IUI, and cardiology with ECG, 2D Echo and TMT.`,
        slogan: 'Women’s care and heart care in Tanuku.',
        url: homeUrl,
        telephone: HOSPITAL_INFO.phone,
        email: HOSPITAL_INFO.email,
        contactPoint: [
          { '@type': 'ContactPoint', telephone: HOSPITAL_INFO.telephone, contactType: 'appointments', availableLanguage: ['en', 'te'] },
          { '@type': 'ContactPoint', telephone: HOSPITAL_INFO.alternateTelephone, contactType: 'appointments', availableLanguage: ['en', 'te'] },
          { '@type': 'ContactPoint', telephone: HOSPITAL_INFO.landlineTelephone, contactType: 'customer service', availableLanguage: ['en', 'te'] },
        ],
        address,
        ...geo,
        hasMap: HOSPITAL_INFO.googleMapsUrl,
        areaServed: AREAS_SERVED.map((name) => ({ '@type': 'Place', name })),
        logo: absolute(HOSPITAL_INFO.logo),
        ...(GALLERY_IMAGES.length ? { image: GALLERY_IMAGES.map((image) => absolute(image.path)) } : {}),
        ...(HOSPITAL_INFO.foundingYear ? { foundingDate: String(HOSPITAL_INFO.foundingYear) } : {}),
        isAcceptingNewPatients: true,
        medicalSpecialty: MEDICAL_SPECIALTIES,
        availableService: MEDICAL_SERVICES.map((service) => ({ '@type': service.type, name: service.name })),
        member: DOCTORS.map((_, index) => ({ '@id': `${origin}/#physician-${index + 1}` })),
        ...(sameAs.length ? { sameAs } : {}),
      },
      ...DOCTORS.map((doctor, index) => ({
        '@type': 'Physician',
        '@id': `${origin}/#physician-${index + 1}`,
        name: doctor.name,
        description: `${doctor.department} specialist in ${HOSPITAL_INFO.nearbyCity}: ${doctor.care}`,
        medicalSpecialty: { '@id': doctor.medicalSpecialty },
        ...(doctor.photo ? { image: absolute(`${doctor.photo}-800.webp`) } : {}),
        telephone: HOSPITAL_INFO.phone,
        address,
        ...geo,
        url: `${origin}/#doctors`,
        worksFor: { '@id': hospitalId },
        hospitalAffiliation: { '@id': hospitalId },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Medical qualification',
          name: doctor.degree,
        },
      })),
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: homeUrl,
        name: HOSPITAL_INFO.name,
        alternateName: HOSPITAL_ALTERNATE_NAMES,
        inLanguage: ['en-IN', 'te-IN'],
        publisher: { '@id': hospitalId },
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `${origin}/#webpage`,
        url: homeUrl,
        name: HOSPITAL_INFO.title,
        description: HOSPITAL_INFO.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': hospitalId },
        ...(HOSPITAL_INFO.image ? { primaryImageOfPage: absolute(HOSPITAL_INFO.image) } : {}),
        specialty: MEDICAL_SPECIALTIES,
      },
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.append(meta);
  }
  meta.content = content;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.append(link);
  }
  link.href = href;
}

export function updateSearchMetadata(pathname: string, configuredSiteUrl?: string) {
  const origin = new URL(configuredSiteUrl || `https://${HOSPITAL_INFO.siteDomain}`).origin;
  const isHome = pathname === '/' || pathname === '';
  const servicePage = findServicePage(pathname);
  const pageUrl = servicePage ? servicePageUrl(origin, servicePage) : new URL(pathname || '/', `${origin}/`).href;
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  const imageUrl = new URL(HOSPITAL_INFO.image || HOSPITAL_INFO.logo, `${origin}/`).href;
  const title = servicePage?.title ?? HOSPITAL_INFO.title;
  const description = servicePage?.description ?? HOSPITAL_INFO.description;
  const indexable = isHome || Boolean(servicePage);

  document.title = title;
  setMeta('meta[name="description"]', 'name', 'description', description);
  const robotsContent = HOSPITAL_INFO.noindex || isLocal || !indexable ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1';
  setMeta('meta[name="robots"]', 'name', 'robots', robotsContent);
  setMeta('meta[name="theme-color"]', 'name', 'theme-color', '#0F3A24');
  setMeta('meta[property="og:title"]', 'property', 'og:title', title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
  setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'en_IN');
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
  setLink('canonical', pageUrl);
  setLink('alternate', pageUrl, 'en-IN');
  setLink('alternate', pageUrl, 'x-default');

  const existingSchema = document.getElementById('hospital-jsonld') as HTMLScriptElement | null;
  if (!indexable) {
    existingSchema?.remove();
    return;
  }
  // The build already ships this JSON-LD in each page's HTML; refresh it in place rather than duplicating it.
  const script = existingSchema ?? document.createElement('script');
  script.id = 'hospital-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(servicePage ? serviceStructuredData(origin, servicePage) : buildStructuredData(origin));
  if (!existingSchema) document.head.append(script);
}
