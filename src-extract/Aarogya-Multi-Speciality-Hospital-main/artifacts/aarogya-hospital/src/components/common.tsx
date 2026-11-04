import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, HeartPulse, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  BOOKING_WHATSAPP, GOOGLE_REVIEWS, HOSPITAL_ADDRESS_DISPLAY, HOSPITAL_ALT_TEL, HOSPITAL_DIRECTIONS, HOSPITAL_INFO,
  HOSPITAL_LANDLINE_TEL, HOSPITAL_MAILTO, HOSPITAL_TEL,
} from '@/lib/hospital';
import { HAS_GALLERY, HAS_REVIEWS } from '@/lib/sections';
import { LanguageToggle, useLanguage } from '@/lib/i18n';
import { lockScroll } from '@/lib/smooth-scroll';

export const HOSPITAL = HOSPITAL_INFO.name;
export const TELUGU = HOSPITAL_INFO.teluguName;
export const PHONE = HOSPITAL_INFO.phone;
export const TEL = HOSPITAL_TEL;
export const ALT_PHONE = HOSPITAL_INFO.alternatePhone;
export const ALT_TEL = HOSPITAL_ALT_TEL;
export const LANDLINE = HOSPITAL_INFO.landline;
export const LANDLINE_TEL = HOSPITAL_LANDLINE_TEL;
export const EMAIL = HOSPITAL_INFO.email;
export const MAILTO = HOSPITAL_MAILTO;
export const DIRECTIONS = HOSPITAL_DIRECTIONS;
export const ADDRESS = HOSPITAL_ADDRESS_DISPLAY;
export const WHATSAPP = `https://wa.me/${BOOKING_WHATSAPP}`;
export { GOOGLE_REVIEWS };

export function Logo({ className = '' }: { className?: string }) {
  return (
    <img className={className} src={HOSPITAL_INFO.logo} alt={`${HOSPITAL_INFO.name} logo`} width="512" height="512" />
  );
}

type IconName = 'check' | 'heart' | 'clock' | 'pin' | 'arrow' | 'down' | 'phone' | 'external' | 'instagram' | 'mail' | 'whatsapp';

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const props = { className: `icon ${className}`, 'aria-hidden': true as const };
  if (name === 'check') return <Check {...props} />;
  if (name === 'heart') return <HeartPulse {...props} />;
  if (name === 'clock') return <Clock3 {...props} />;
  if (name === 'pin') return <MapPin {...props} />;
  if (name === 'arrow') return <ArrowRight {...props} />;
  if (name === 'down') return <ArrowDown {...props} />;
  if (name === 'phone') return <Phone {...props} />;
  if (name === 'instagram') return <Instagram {...props} />;
  if (name === 'mail') return <Mail {...props} />;
  if (name === 'whatsapp') return <MessageCircle {...props} />;
  return <ArrowUpRight {...props} />;
}

export function InstagramLink({ className = '', children }: { className?: string; children?: ReactNode }) {
  const { t } = useLanguage();
  if (!HOSPITAL_INFO.instagramUrl) return null;
  return (
    <a className={className} href={HOSPITAL_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={children ? undefined : t.instagram.aria}>
      <Icon name="instagram" />
      {children}
    </a>
  );
}

const ALL_NAV_IDS = ['about', 'services', 'doctors', 'why', 'insurance', 'booking', 'gallery', 'reviews', 'visit', 'faq'] as const;
// Every section, for the mobile menu and the footer. Gallery and Reviews appear only once they have content.
export const ALL_LINK_IDS = ALL_NAV_IDS.filter((id) => (id !== 'gallery' || HAS_GALLERY) && (id !== 'reviews' || HAS_REVIEWS));
// The desktop header keeps to the main sections so it never wraps.
export const NAV_IDS = ALL_LINK_IDS.filter((id) => id !== 'gallery' && id !== 'reviews' && id !== 'insurance');

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        // Tuck the header away while reading down the page, bring it back on the way up.
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > window.innerHeight * 0.8);
          lastY = y;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const sections = ALL_LINK_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.find((entry) => entry.isIntersecting);
      if (current) setActive(current.target.id);
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    lockScroll(menuOpen);
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false); };
  }, [menuOpen]);

  const labels = t.nav as Record<(typeof ALL_NAV_IDS)[number], string>;
  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${hidden && !menuOpen ? ' is-hidden' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label={t.header.homeAria}>
          <Logo className="brand-logo" />
          <span className="brand-copy">
            <span className="brand-name">{HOSPITAL}</span>
            <span className="brand-telugu telugu" lang="te">{TELUGU}</span>
          </span>
        </a>
        <nav className="nav" aria-label={t.header.mainNav}>
          {NAV_IDS.map((id) => <a key={id} className={active === id ? 'is-active' : ''} href={`#${id}`}>{labels[id]}</a>)}
        </nav>
        <LanguageToggle className="header-lang" />
        <a className="button button-small header-call" href={TEL} aria-label={t.header.callAria(PHONE)}>
          <Icon name="phone" /><span>{t.header.call}</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`} id="mobile-menu" aria-hidden={!menuOpen}>
        <nav aria-label={t.header.mobileNav}>
          {ALL_LINK_IDS.map((id, index) => (
            <a key={id} href={`#${id}`} tabIndex={menuOpen ? 0 : -1} style={{ '--i': index } as CSSProperties} onClick={() => setMenuOpen(false)}>{labels[id]}</a>
          ))}
        </nav>
        <a className="button mobile-menu-call" href={TEL} tabIndex={menuOpen ? 0 : -1}><Icon name="phone" /><span>{t.header.call} {PHONE}</span></a>
      </div>
    </header>
  );
}

// Phone-only bar with the three things people come to a hospital site for.
export function MobileDock() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Checked at most once per frame so a fast flick doesn't queue work on every scroll event.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > window.innerHeight * 0.55);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <nav className={`mobile-dock${visible ? ' is-visible' : ''}`} aria-label={t.dock.aria}>
      <a className="dock-call" href={TEL}><Icon name="phone" /><span>{t.dock.call}</span></a>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /><span>{t.dock.whatsapp}</span></a>
      <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer"><Icon name="pin" /><span>{t.dock.directions}</span></a>
    </nav>
  );
}
