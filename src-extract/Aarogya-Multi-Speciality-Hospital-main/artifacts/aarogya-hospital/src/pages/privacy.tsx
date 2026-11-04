import { useEffect } from 'react';
import { Icon, Logo, MAILTO, TEL } from '@/components/common';
import { HOSPITAL_INFO } from '@/lib/hospital';
import { LanguageToggle, useLanguage } from '@/lib/i18n';
import { PRIVACY, PRIVACY_CONTACT, PRIVACY_UPDATED } from '@/lib/privacy';

const formatDate = (iso: string, lang: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function PrivacyPage() {
  const { lang, t } = useLanguage();
  const text = PRIVACY[lang];

  useEffect(() => {
    document.title = `${text.title} | ${HOSPITAL_INFO.name}, ${HOSPITAL_INFO.nearbyCity}`;
    window.scrollTo(0, 0);
  }, [text.title]);

  return (
    <div className="policy-page">
      <header className="policy-bar">
        <div className="container policy-bar-inner">
          <a className="brand" href="/" aria-label={t.header.homeAria}>
            <Logo className="brand-logo" />
            <span className="brand-copy">
              <span className="brand-name">{HOSPITAL_INFO.name}</span>
              <span className="brand-telugu telugu" lang="te">{HOSPITAL_INFO.teluguName}</span>
            </span>
          </a>
          <LanguageToggle className="header-lang" />
        </div>
      </header>
      <main className="container policy">
        <a className="policy-back" href="/"><Icon name="arrow" className="policy-back-icon" />{text.back}</a>
        <h1>{text.title}</h1>
        <p className="policy-updated">{text.updated(formatDate(PRIVACY_UPDATED, lang))}</p>
        <p className="policy-intro">{text.intro}</p>
        {text.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
          </section>
        ))}
        <section className="policy-contact">
          <h2>{text.contactHeading}</h2>
          <p>{HOSPITAL_INFO.name}, {PRIVACY_CONTACT.address}</p>
          <p><a href={TEL}>{HOSPITAL_INFO.phone}</a> · <a href={`tel:${HOSPITAL_INFO.landlineTelephone}`}>{HOSPITAL_INFO.landline}</a> · <a href={MAILTO}>{HOSPITAL_INFO.email}</a></p>
        </section>
      </main>
      <footer className="policy-foot">
        <div className="container">{t.footer.copyright}</div>
      </footer>
    </div>
  );
}
