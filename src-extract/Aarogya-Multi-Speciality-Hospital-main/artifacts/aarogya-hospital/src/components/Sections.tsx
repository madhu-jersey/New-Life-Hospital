import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Baby, Clock3, Flower2, Gauge, HandHeart, HeartHandshake, HeartPulse, Plus, ShieldCheck, BadgeCheck, Rotate3d, Sprout, SquarePen, Stethoscope, UserRound } from 'lucide-react';
import { ALT_PHONE, ALT_TEL, DIRECTIONS, EMAIL, Icon, LANDLINE, LANDLINE_TEL, MAILTO, magnetic, PHONE, TEL } from './common';
import { DOCTORS, HOSPITAL_INFO, HOSPITAL_MAP_EMBED, HOSPITAL_TOURS, type TourKey } from '@/lib/hospital';
import { useLanguage } from '@/lib/i18n';
import { GALLERY_PHOTOS, type GalleryPhoto, REVIEW_DATA } from '@/lib/sections';
import { lockScroll } from '@/lib/smooth-scroll';
import { doctorPhoto } from '@/lib/doctor-photos';
import { useLiveReviews } from '@/lib/live-reviews';

export function SectionHead({ title, subline, tone = '' }: { title: string; subline?: string; tone?: string }) {
  return (
    <div className={`section-head ${tone}`}>
      <h2 className="reveal reveal-title">{title}</h2>
      {subline && <p className="section-subline reveal">{subline}</p>}
    </div>
  );
}

const ACCENT_ICON = { heart: HeartPulse, women: Sprout };
const CARE_ITEM_ICONS = { heart: [HeartPulse, Activity, Gauge], women: [Baby, Flower2, HeartHandshake] };

// Line art behind each care panel: a heartbeat for heart care, unfurling leaves for women's care.
// Drawn once when the panel scrolls into view.
function CareArt({ kind }: { kind: 'heart' | 'women' }) {
  return (
    <svg className={`care-art care-art--${kind}`} viewBox={kind === 'heart' ? '0 0 600 110' : '0 0 600 240'} preserveAspectRatio="xMaxYMin slice" aria-hidden="true">
      {kind === 'heart' ? (
        <path pathLength="1" d="M0 64 H300 l12 0 l8 -12 l8 12 l14 0 l10 -50 l14 84 l10 -46 l16 0 l12 -14 l14 14 H600" />
      ) : (
        <>
          <path pathLength="1" d="M420 240 C420 170 430 120 470 70" />
          <path pathLength="1" d="M440 150 C400 150 360 120 350 70 C395 75 432 105 440 150 Z" />
          <path pathLength="1" d="M452 110 C490 100 530 70 540 24 C495 30 460 62 452 110 Z" />
          <path pathLength="1" d="M426 200 C380 205 330 180 310 140 C360 135 405 160 426 200 Z" />
        </>
      )}
    </svg>
  );
}
export function Doctors() {
  const { t } = useLanguage();
  return (
    <section className="section doctors" id="doctors">
      <div className="container">
        <SectionHead title={t.doctors.title} subline={t.doctors.subline} />
        <div className="doctor-list">
          {DOCTORS.map((doctor) => {
            const text = t.doctors.list[doctor.initials];
            const AccentIcon = ACCENT_ICON[doctor.accent];
            const photo = doctorPhoto(doctor.photoKey);
            return (
              <article className={`doctor doctor--${doctor.accent}${photo ? ' has-photo' : ''} reveal`} key={doctor.initials}>
                {photo ? (
                  <div className="doctor-portrait">
                    <img src={photo} alt={`${text.name}, ${text.department}, ${HOSPITAL_INFO.name}`} loading="lazy" decoding="async" />
                    <AccentIcon className="doctor-portrait-badge" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="doctor-mark" aria-hidden="true">
                    <AccentIcon className="doctor-mark-icon" />
                  </div>
                )}
                <div className="doctor-body">
                  <p className="doctor-dept">{text.department}</p>
                  <h3 className="doctor-name">{text.name}</h3>
                  <p className="doctor-degree" lang="en">{doctor.degree}</p>
                  <p className="doctor-role">{text.role}</p>
                  <ul className="doctor-points">
                    {text.points.map((point) => <li key={point}><Icon name="check" />{point}</li>)}
                  </ul>
                  <div className="doctor-hours">
                    <p className="doctor-hours-label"><Icon name="clock" />{t.doctors.hours}</p>
                    <ul className="doctor-times">
                      {text.timings.map((timing) => <li key={timing}>{timing}</li>)}
                    </ul>
                  </div>
                  {doctor.accent === 'women' && <p className="doctor-note">{t.doctors.infertility}</p>}
                  <a className="button doctor-book" href={TEL} {...magnetic}><Icon name="phone" /><span>{t.doctors.callToBook}</span></a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Facilities() {
  const { t } = useLanguage();
  return (
    <section className="section facilities" id="services">
      <div className="container">
        <SectionHead title={t.facilities.title} subline={t.facilities.subline} />
        <div className="care-panels">
          {t.facilities.groups.map((group) => {
            const GroupIcon = ACCENT_ICON[group.key];
            const doctor = DOCTORS.find((item) => item.accent === group.key);
            const doctorText = doctor ? t.doctors.list[doctor.initials] : null;
            const photo = doctor ? doctorPhoto(doctor.photoKey) : undefined;
            return (
              <article className={`care care--${group.key} reveal`} key={group.key}>
                <CareArt kind={group.key} />
                <header className="care-head">
                  <span className="care-icon"><GroupIcon aria-hidden="true" /></span>
                  <h3>{group.title}</h3>
                </header>
                {doctor && doctorText && (
                  <a className="care-doctor" href="#doctors">
                    {photo
                      ? <img className="care-avatar" src={photo} alt="" loading="lazy" decoding="async" />
                      : <span className="care-avatar care-avatar--empty" aria-hidden="true"><GroupIcon /></span>}
                    <span className="care-doctor-text">
                      <strong>{doctorText.name}</strong>
                      <small>{t.facilities.meetDoctor}</small>
                    </span>
                    <Icon name="arrow" className="care-doctor-arrow" />
                  </a>
                )}
                <ul className="care-list">
                  {group.items.map((item, index) => {
                    const ItemIcon = CARE_ITEM_ICONS[group.key][index] ?? GroupIcon;
                    return (
                      <li className="care-item" key={item.name} style={{ '--i': index } as CSSProperties}>
                        <span className="care-item-icon"><ItemIcon aria-hidden="true" /></span>
                        <div>
                          <strong>{item.name}</strong>
                          <p>{item.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { t } = useLanguage();
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <div className="about-copy">
          <SectionHead title={t.about.title} />
          {t.about.paragraphs.map((paragraph) => <p className="about-text reveal" key={paragraph.slice(0, 24)}>{paragraph}</p>)}
          <a className="about-link reveal" href="#doctors"><span>{t.about.meet}</span><Icon name="arrow" /></a>
        </div>
        <ul className="about-values">
          {t.about.values.map((value, index) => {
            const ValueIcon = index === 0 ? UserRound : HandHeart;
            return (
              <li className="about-value reveal" key={value.title}>
                <span className="about-value-icon"><ValueIcon aria-hidden="true" /></span>
                <div>
                  <strong>{value.title}</strong>
                  <p>{value.line}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// Reasons that are not already said on the doctor cards: one hospital, tests on site, infertility at any time.
const WHY_ICONS = [Stethoscope, Activity, Clock3];
const WHY_TONES = ['women', 'heart', 'marigold'];

export function WhyChooseUs() {
  const { t } = useLanguage();
  return (
    <section className="section why" id="why">
      <div className="container">
        <SectionHead title={t.why.title} subline={t.why.subline} />
        <ul className="why-grid">
          {t.why.reasons.map((reason, index) => {
            const ReasonIcon = WHY_ICONS[index] ?? HeartPulse;
            return (
              <li className={`why-item why-item--${WHY_TONES[index] ?? 'leaf'} reveal`} key={reason.title}>
                <span className="why-icon"><ReasonIcon aria-hidden="true" /></span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.line}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// Insurers are shown as plain names, without logos.
export function Insurance() {
  const { t } = useLanguage();
  return (
    <section className="section insurance" id="insurance">
      <div className="container">
        <SectionHead title={t.insurance.title} subline={t.insurance.subline} />
        <ul className="insurance-facilities reveal">
          {t.insurance.facilities.map((facility, index) => {
            const FacilityIcon = index === 0 ? ShieldCheck : BadgeCheck;
            return <li key={facility}><FacilityIcon aria-hidden="true" />{facility}</li>;
          })}
        </ul>
        <h3 className="insurance-label reveal">{t.insurance.partnersLabel}</h3>
        <ul className="insurance-grid">
          {t.insurance.partners.map((partner) => <li className="insurance-partner reveal" key={partner}>{partner}</li>)}
        </ul>
        <p className="insurance-tpa reveal"><strong>{t.insurance.tpaLabel}</strong>{t.insurance.tpa}</p>
        <p className="insurance-note reveal">{t.insurance.note}</p>
      </div>
    </section>
  );
}

export function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="section faq" id="faq">
      <div className="container faq-grid">
        <SectionHead title={t.faq.title} />
        <div className="faq-list">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const triggerId = `faq-trigger-${index}`;
            const panelId = `faq-panel-${index}`;
            return (
              <article className={`faq-item reveal${isOpen ? ' is-open' : ''}`} key={index}>
                <h3>
                  <button id={triggerId} className="faq-trigger" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenIndex(isOpen ? null : index)}>
                    <span>{item.question}</span>
                    <span className="faq-toggle" aria-hidden="true"><Plus /></span>
                  </button>
                </h3>
                <div id={panelId} className="faq-panel" role="region" aria-labelledby={triggerId} aria-hidden={!isOpen}>
                  <div className="faq-panel-inner"><p>{item.answer}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const INSIDE_TOUR = HOSPITAL_TOURS.find((tour) => tour.key === 'inside');
// The Visit map card keeps the outside view; the inside view lives in the Gallery.
const MAP_TOURS = HOSPITAL_TOURS.filter((tour) => tour.key !== 'inside');

// Google's 360° photo of the inside of the hospital, shown straight away (it loads as the Gallery comes near).
// Like the map, it ignores touches until it is tapped, so a thumb scrolling past the page never gets caught in it.
function InsideTour({ src }: { src: string }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  return (
    <div className={`inside-tour reveal${active ? ' is-active' : ''}`} onPointerLeave={() => setActive(false)}>
      <iframe
        title={t.visit.tourTitle(t.visit.viewInside)}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={active ? 0 : -1}
        onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
      />
      {!active && (
        <button className="inside-tour-overlay" type="button" onClick={() => setActive(true)}>
          <span className="inside-tour-chip"><Rotate3d className="icon" aria-hidden="true" />{t.gallery.insideHint}</span>
        </button>
      )}
    </div>
  );
}

// Up to six photos sit in an even grid; any more wait behind "View more photos".
const GRID_SIZE = 6;
const galleryPhotos = GALLERY_PHOTOS;
const featuredPhotos = galleryPhotos.slice(0, GRID_SIZE);
const morePhotos = galleryPhotos.slice(GRID_SIZE);
const measuredSizes = new Map<number, { width: number; height: number }>();

function photoSize(index: number) {
  return measuredSizes.get(index) ?? galleryPhotos[index];
}

function rememberSize(index: number, image: HTMLImageElement) {
  if (image.naturalWidth && image.naturalHeight) measuredSizes.set(index, { width: image.naturalWidth, height: image.naturalHeight });
}

const galleryImageCache = new Map<number, Promise<HTMLImageElement>>();
const gallerySizes = '(max-width: 1100px) 90vw, 1080px';

function loadDecodedGalleryPhoto(index: number) {
  const cached = galleryImageCache.get(index);
  if (cached) return cached;
  const photo = galleryPhotos[index];
  const image = new Image();
  const ready = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${photo.src}`));
    image.sizes = gallerySizes;
    if (photo.srcSet) image.srcset = photo.srcSet;
    image.src = photo.src;
    if (image.complete && image.naturalWidth) resolve(image);
  }).then(async (loadedImage) => {
    if (typeof loadedImage.decode === 'function') await loadedImage.decode();
    rememberSize(index, loadedImage);
    return loadedImage;
  }).catch((error: unknown) => {
    galleryImageCache.delete(index);
    throw error;
  });
  galleryImageCache.set(index, ready);
  return ready;
}

function getLightboxSize(width: number, height: number) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const mobile = viewportWidth < 768;
  const maxWidth = mobile ? viewportWidth - 24 : Math.min(viewportWidth * 0.92, viewportWidth - 176);
  const maxHeight = mobile ? Math.max(100, viewportHeight * 0.85 - 72) : viewportHeight * 0.88;
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function HospitalGallery() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const moreButtonRow = useRef<HTMLDivElement | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const incomingImage = useRef<HTMLImageElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const finishSwitchTimer = useRef<number | null>(null);
  const unlockSwitchTimer = useRef<number | null>(null);
  const switchLocked = useRef(false);
  const pendingIndexRef = useRef<number | null>(null);
  const switchRequest = useRef(0);

  const clearSwitch = useCallback(() => {
    switchRequest.current += 1;
    switchLocked.current = false;
    pendingIndexRef.current = null;
    if (finishSwitchTimer.current !== null) window.clearTimeout(finishSwitchTimer.current);
    if (unlockSwitchTimer.current !== null) window.clearTimeout(unlockSwitchTimer.current);
    finishSwitchTimer.current = null;
    unlockSwitchTimer.current = null;
    setPendingIndex(null);
    setIsCrossfading(false);
  }, []);

  const movePhoto = useCallback((direction: number) => {
    if (activeIndex === null || switchLocked.current || isClosing) return;
    const nextIndex = (activeIndex + direction + galleryPhotos.length) % galleryPhotos.length;
    switchLocked.current = true;
    const request = ++switchRequest.current;
    void loadDecodedGalleryPhoto(nextIndex).then((decodedImage) => {
      if (request !== switchRequest.current) return;
      const width = decodedImage.naturalWidth || photoSize(nextIndex).width;
      const height = decodedImage.naturalHeight || photoSize(nextIndex).height;
      pendingIndexRef.current = nextIndex;
      setPendingIndex(nextIndex);
      setFrameSize(getLightboxSize(width, height));
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setActiveIndex(nextIndex);
        pendingIndexRef.current = null;
        setPendingIndex(null);
        switchLocked.current = false;
        return;
      }
      const beginCrossfade = (attempt: number) => {
        if (request !== switchRequest.current) return;
        const image = incomingImage.current;
        if (!image) {
          if (attempt < 3) requestAnimationFrame(() => beginCrossfade(attempt + 1));
          else {
            pendingIndexRef.current = null;
            setPendingIndex(null);
            setFrameSize(getLightboxSize(photoSize(activeIndex).width, photoSize(activeIndex).height));
            switchLocked.current = false;
          }
          return;
        }
        const decoded = typeof image.decode === 'function' ? image.decode() : Promise.resolve();
        void decoded.then(() => {
          if (request !== switchRequest.current) return;
          setIsCrossfading(true);
          finishSwitchTimer.current = window.setTimeout(() => {
            if (request !== switchRequest.current) return;
            setActiveIndex(nextIndex);
            pendingIndexRef.current = null;
            setPendingIndex(null);
            setIsCrossfading(false);
            finishSwitchTimer.current = null;
          }, 350);
          unlockSwitchTimer.current = window.setTimeout(() => {
            if (request === switchRequest.current) switchLocked.current = false;
            unlockSwitchTimer.current = null;
          }, 450);
        }).catch(() => {
          if (request !== switchRequest.current) return;
          pendingIndexRef.current = null;
          setPendingIndex(null);
          setFrameSize(getLightboxSize(photoSize(activeIndex).width, photoSize(activeIndex).height));
          switchLocked.current = false;
        });
      };
      requestAnimationFrame(() => beginCrossfade(0));
    }).catch(() => {
      if (request === switchRequest.current) switchLocked.current = false;
    });
  }, [activeIndex, isClosing]);

  const closeLightbox = useCallback(() => {
    if (closeTimer.current !== null) return;
    clearSwitch();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveIndex(null);
      requestAnimationFrame(() => opener.current?.focus());
      return;
    }
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setActiveIndex(null);
      setIsClosing(false);
      requestAnimationFrame(() => opener.current?.focus());
    }, 300);
  }, [clearSwitch]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lockScroll(true);
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
      if (event.key === 'Tab' && dialog.current) {
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button:not(:disabled)')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      lockScroll(false);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, closeLightbox, movePhoto]);

  useEffect(() => {
    if (activeIndex === null) return;
    [
      (activeIndex + 1) % galleryPhotos.length,
      (activeIndex - 1 + galleryPhotos.length) % galleryPhotos.length,
    ].forEach((index) => { void loadDecodedGalleryPhoto(index).catch(() => undefined); });
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const resizeFrame = () => {
      const photo = photoSize(pendingIndexRef.current ?? activeIndex);
      setFrameSize(getLightboxSize(photo.width, photo.height));
    };
    window.addEventListener('resize', resizeFrame);
    return () => window.removeEventListener('resize', resizeFrame);
  }, [activeIndex]);

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    if (finishSwitchTimer.current !== null) window.clearTimeout(finishSwitchTimer.current);
    if (unlockSwitchTimer.current !== null) window.clearTimeout(unlockSwitchTimer.current);
  }, []);

  // Named photos use their caption; extra photos are described by number.
  const photoLabel = (index: number) => (galleryPhotos[index].demo ? t.gallery.placeholder : t.gallery.captions[index] ?? t.gallery.photo(index + 1));
  const photoAlt = (index: number) => t.gallery.alt(photoLabel(index));

  const openPhoto = (index: number, trigger: HTMLButtonElement) => {
    opener.current = trigger;
    clearSwitch();
    setIsClosing(false);
    setFrameSize(getLightboxSize(photoSize(index).width, photoSize(index).height));
    setActiveIndex(index);
    // Extra photos have no size until loaded; correct the frame once the real size is known.
    void loadDecodedGalleryPhoto(index).then(() => {
      setFrameSize((current) => (current ? getLightboxSize(photoSize(index).width, photoSize(index).height) : current));
    }).catch(() => undefined);
  };

  const toggleMore = () => {
    const closing = showMore;
    setShowMore(!showMore);
    // After collapsing, keep the button in view instead of leaving the visitor far down the page.
    if (closing) requestAnimationFrame(() => moreButtonRow.current?.scrollIntoView({ block: 'center' }));
  };

  const renderTile = (photo: GalleryPhoto, index: number, className: string, sizes: string) => (
    <button
      className={`gallery-tile ${className} reveal`}
      type="button"
      key={photo.src}
      aria-label={t.gallery.open(photoLabel(index))}
      onClick={(event) => openPhoto(index, event.currentTarget)}
    >
      <picture>
        {photo.srcSet && <source type="image/webp" srcSet={photo.srcSet} sizes={sizes} />}
        <img
          src={photo.src}
          alt={photoAlt(index)}
          loading="lazy"
          decoding="async"
          width={photo.width}
          height={photo.height}
          onLoad={(event) => rememberSize(index, event.currentTarget)}
        />
      </picture>
      <span className="gallery-caption" aria-hidden="true">{photoLabel(index)}</span>
    </button>
  );

  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        <SectionHead title={t.gallery.title} subline={t.gallery.subline} />
        {INSIDE_TOUR && <InsideTour src={INSIDE_TOUR.src} />}
        {galleryPhotos.length > 0 && (<>
        <div className="gallery-grid">
          {featuredPhotos.map((photo, index) => renderTile(photo, index, `gallery-grid-tile gallery-photo-${index + 1}`, '(max-width: 767px) 50vw, 33vw'))}
        </div>
        {showMore && (
          <div className="gallery-more-grid" id="gallery-more-grid">
            {morePhotos.map((photo, offset) => renderTile(photo, featuredPhotos.length + offset, 'gallery-grid-tile', '(max-width: 767px) 50vw, 33vw'))}
          </div>
        )}
        {/* Only when there are more photos than the grid shows; otherwise every photo is already on screen. */}
        {morePhotos.length > 0 && (
        <div className="gallery-more" ref={moreButtonRow}>
            <button
              className={`button button-ghost gallery-more-toggle${showMore ? ' is-open' : ''}`}
              type="button"
              aria-expanded={showMore}
              aria-controls="gallery-more-grid"
              onClick={toggleMore}
            >
              <span>{showMore ? t.gallery.less : t.gallery.more(morePhotos.length)}</span><Icon name="down" />
            </button>
        </div>
        )}
        </>)}
      </div>
      {activeIndex !== null && (
        <div
          className={`gallery-lightbox${isClosing ? ' is-closing' : ''}`}
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={t.gallery.dialog}
          onClick={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}
          onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            const end = event.changedTouches[0]?.clientX;
            if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 45) movePhoto(end < touchStart.current ? 1 : -1);
            touchStart.current = null;
          }}
        >
            <button className="gallery-arrow gallery-arrow-prev" type="button" aria-label={t.gallery.previous} onClick={() => movePhoto(-1)}>‹</button>
            <div
              className={`gallery-lightbox-image${isCrossfading ? ' is-crossfading' : ''}`}
              style={frameSize ? { width: `${frameSize.width}px`, height: `${frameSize.height}px` } : undefined}
              onClick={(event) => event.stopPropagation()}
            >
              {[activeIndex, ...(pendingIndex === null ? [] : [pendingIndex])].map((index) => {
                const photo = galleryPhotos[index];
                const isIncoming = index === pendingIndex;
                return (
                  <picture className={`gallery-lightbox-photo${isIncoming ? ' is-incoming' : ' is-outgoing'}`} key={photo.src}>
                    {photo.srcSet && <source type="image/webp" srcSet={photo.srcSet} sizes={gallerySizes} />}
                    <img ref={isIncoming ? incomingImage : undefined} src={photo.src} alt={photoAlt(index)} width={photoSize(index).width} height={photoSize(index).height} />
                  </picture>
                );
              })}
              <button className="gallery-close" ref={closeButton} type="button" aria-label={t.gallery.close} onClick={closeLightbox}>×</button>
            </div>
            <button className="gallery-arrow gallery-arrow-next" type="button" aria-label={t.gallery.next} onClick={() => movePhoto(1)}>›</button>
        </div>
      )}
    </section>
  );
}

// Five stars filled to the exact rating (4.1 fills a little more than four).
function Stars({ value, label, className = '' }: { value: number; label: string; className?: string }) {
  return (
    <span className={`stars ${className}`} role="img" aria-label={label}>
      <span className="stars-base" aria-hidden="true">★★★★★</span>
      <span className="stars-fill" aria-hidden="true" style={{ width: `${Math.max(0, Math.min(5, value)) * 20}%` }}>★★★★★</span>
    </span>
  );
}

// Live Google numbers when /api/google-reviews answers; otherwise the snapshot in hospital.ts.
// Labelled samples appear only while DEMO_CONTENT is on and there are no real reviews.
export function Reviews() {
  const { t } = useLanguage();
  const live = useLiveReviews();
  const snapshot = REVIEW_DATA;
  const rating = live?.rating ?? snapshot.rating;
  const count = live?.count ?? snapshot.count;
  // The per-star split is not in the Places API, so it shows only while it still matches the live count.
  const breakdown = !live || live.count === snapshot.count ? snapshot.breakdown : [];
  // Google returns up to five recent reviews; show the ones with words in them.
  const liveReviews = (live?.reviews ?? []).filter((review) => review.copy.trim() && (review.rating ?? 0) >= 4).slice(0, 4);
  const reviews = liveReviews.length ? liveReviews : snapshot.reviews;
  const { demo, link } = snapshot;
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <SectionHead title={t.reviews.title} subline={t.reviews.subline} />
        <div className="reviews-layout">
          <div className="reviews-summary reveal" aria-label={t.reviews.summaryAria(rating, count)}>
            {demo && <span className="demo-badge">{t.reviews.demoBadge}</span>}
            <p className="reviews-source">
              <GoogleMark />
              <span>{t.reviews.source}</span>
              {live && <span className="reviews-live"><i aria-hidden="true" />{t.reviews.live}</span>}
            </p>
            <strong className="reviews-score">{rating.toFixed(1)}</strong>
            <Stars value={rating} label={t.reviews.starsAria(rating)} className="rating-stars" />
            <span className="rating-count">{t.reviews.count(count)}</span>
            {breakdown.length === 5 && (
              <div className="reviews-breakdown" aria-hidden="true">
                {breakdown.map((fill, index) => (
                  <div className="rating-row" key={index}>
                    <span>{5 - index}</span>
                    <span className="rating-track"><span className="rating-fill" style={{ '--fill': fill, '--delay': `${index * 90}ms` } as CSSProperties} /></span>
                  </div>
                ))}
              </div>
            )}
            <a className="button button-ghost" href={link} target="_blank" rel="noopener noreferrer"><SquarePen className="icon" aria-hidden="true" /><span>{t.reviews.write}</span></a>
            <a className="reviews-more" href={link} target="_blank" rel="noopener noreferrer"><span>{t.reviews.readMore}</span><Icon name="external" /></a>
          </div>
          <div className="reviews-grid">
            {reviews.map((review, index) => {
              const stars = review.rating ?? 5;
              const name = review.authorUrl
                ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">{review.author}</a>
                : review.author;
              return (
                <figure className="review-card reveal" key={`${review.author}-${index}`}>
                  {demo && <span className="demo-badge">{t.reviews.sampleTag}</span>}
                  <figcaption className="review-head">
                    {review.photo
                      ? <img className="review-avatar" src={review.photo} alt="" loading="lazy" referrerPolicy="no-referrer" />
                      : <span className="review-avatar review-avatar--initial" aria-hidden="true">{review.author.trim().charAt(0).toUpperCase()}</span>}
                    <span className="review-who">
                      <strong>{name}</strong>
                      <span className="review-meta">
                        <Stars value={stars} label={t.reviews.starsAria(stars)} />
                        <time>{review.time}</time>
                      </span>
                    </span>
                  </figcaption>
                  {/* Patients' own words stay exactly as they wrote them. */}
                  <blockquote lang={review.lang}>{review.copy}</blockquote>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Google's "G", shown beside the rating because the numbers come from Google.
function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.6 5.9c4.4-4.1 6.7-10.1 6.7-17.3z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export function Visit() {
  const { t } = useLanguage();
  const [mapActive, setMapActive] = useState(false);
  const [view, setView] = useState<'map' | TourKey>('map');
  // 360° views are heavy panoramas: each loads only once someone asks for it, then stays ready.
  const [opened, setOpened] = useState<TourKey[]>([]);
  const show = (next: 'map' | TourKey) => {
    setView(next);
    setMapActive(false);
    if (next !== 'map') setOpened((current) => (current.includes(next) ? current : [...current, next]));
  };
  const tourLabel = { outside: t.visit.viewOutside, inside: t.visit.viewInside };
  return (
    <section className="section visit" id="visit">
      <div className="container visit-grid">
        <div className="visit-info">
          <SectionHead title={t.visit.title} />
          <dl className="visit-list">
            <div className="reveal">
              <dt>{t.visit.addressLabel}</dt>
              <dd className="visit-address">{t.visit.address}</dd>
            </div>
            <div className="reveal">
              <dt>{t.visit.phonesLabel}</dt>
              <dd className="visit-phones">
                <a href={TEL}><small>{t.visit.mobile}</small>{PHONE}</a>
                <a href={ALT_TEL}><small>{t.visit.mobile}</small>{ALT_PHONE}</a>
                <a href={LANDLINE_TEL}><small>{t.visit.landline}</small>{LANDLINE}</a>
              </dd>
            </div>
            <div className="reveal">
              <dt>{t.visit.emailLabel}</dt>
              <dd><a className="visit-email" href={MAILTO}>{EMAIL}</a></dd>
            </div>
            <div className="reveal">
              <dt>{t.visit.hoursLabel}</dt>
              <dd>{t.visit.hours}</dd>
            </div>
          </dl>
          <div className="visit-actions reveal">
            <a className="button" href={DIRECTIONS} target="_blank" rel="noopener noreferrer" {...magnetic}><Icon name="pin" /><span>{t.visit.directions}</span></a>
          </div>
          {HOSPITAL_INFO.instagramUrl && (
            <a className="visit-instagram reveal" href={HOSPITAL_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={t.instagram.aria}>
              <Icon name="instagram" /><span>{t.instagram.follow}</span>
            </a>
          )}
        </div>
        <div className={`map reveal${mapActive ? ' is-active' : ''}`} data-view={view} onClick={() => setMapActive(true)} onPointerLeave={() => setMapActive(false)}>
          <div className="map-switch" role="group" aria-label={t.visit.viewGroup} onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-pressed={view === 'map'} onClick={() => show('map')}>
              <Icon name="pin" /><span>{t.visit.viewMap}</span>
            </button>
            {MAP_TOURS.map((tour) => (
              <button type="button" key={tour.key} aria-pressed={view === tour.key} onClick={() => show(tour.key)}>
                <Rotate3d className="icon" aria-hidden="true" /><span>{tourLabel[tour.key]}</span>
              </button>
            ))}
          </div>
          <iframe
            className="map-frame map-frame--map"
            title={t.visit.mapTitle}
            src={HOSPITAL_MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-hidden={view !== 'map'}
            tabIndex={view === 'map' ? 0 : -1}
            onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
          />
          {MAP_TOURS.filter((tour) => opened.includes(tour.key)).map((tour) => (
            <iframe
              key={tour.key}
              className={`map-frame map-frame--tour${view === tour.key ? ' is-current' : ''}`}
              title={t.visit.tourTitle(tourLabel[tour.key])}
              src={tour.src}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              aria-hidden={view !== tour.key}
              tabIndex={view === tour.key ? 0 : -1}
              onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
            />
          ))}
          {!mapActive && <span className="map-hint">{view === 'map' ? t.visit.mapHint : t.visit.tourHint}</span>}
        </div>
      </div>
    </section>
  );
}
