import { ALT_PHONE, ALT_TEL, EMAIL, InstagramLink, LANDLINE, LANDLINE_TEL, Logo, MAILTO, ALL_LINK_IDS, PHONE, TEL, useSectionBase } from './common';
import { HOSPITAL_INFO } from '@/lib/hospital';
import { useLanguage } from '@/lib/i18n';
import { SERVICE_PAGES } from '@/lib/service-pages';

export function Footer() {
  const { t } = useLanguage();
  const labels = t.nav as Record<string, string>;
  const base = useSectionBase();
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-telugu telugu-display" lang="te">{HOSPITAL_INFO.teluguName}</p>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Logo className="footer-logo" />
              <div>
                <p className="footer-name">{HOSPITAL_INFO.name}</p>
                <p className="footer-tagline">{t.footer.tagline}</p>
              </div>
            </div>
            <p className="footer-loc">{t.visit.address}</p>
          </div>
          <div>
            <h3>{t.footer.explore}</h3>
            <nav className="footer-nav" aria-label={t.footer.nav}>
              {ALL_LINK_IDS.map((id) => <a key={id} href={`${base}#${id}`}>{labels[id]}</a>)}
            </nav>
          </div>
          <div>
            <h3>{t.footer.servicesInTanuku}</h3>
            <nav className="footer-nav" aria-label={t.footer.servicesInTanuku}>
              {SERVICE_PAGES.map((page) => <a key={page.slug} href={`/${page.slug}`}>{page.h1}</a>)}
            </nav>
          </div>
          <div className="footer-contact">
            <h3>{t.footer.connect}</h3>
            <a href={TEL}>{PHONE}</a>
            <a href={ALT_TEL}>{ALT_PHONE}</a>
            <a href={LANDLINE_TEL}>{LANDLINE}</a>
            <a href={MAILTO}>{EMAIL}</a>
            <InstagramLink className="footer-instagram"><span>{HOSPITAL_INFO.instagramHandle}</span></InstagramLink>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
