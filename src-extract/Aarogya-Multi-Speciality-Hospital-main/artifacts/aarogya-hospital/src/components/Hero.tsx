import type { CSSProperties } from 'react';
import { Icon, magnetic, PHONE, TEL } from './common';
import { DOCTORS, HOSPITAL_INFO } from '@/lib/hospital';
import { useLanguage } from '@/lib/i18n';
import { doctorStatus, useClinicClock } from '@/lib/schedule';
import type { Dictionary } from '@/lib/translations';

function statusText(t: Dictionary, status: ReturnType<typeof doctorStatus>) {
  if (status.kind === 'now') return { live: true, text: `${t.today.now}, ${t.today.until(t.time(status.until))}` };
  if (status.kind === 'later') return { live: false, text: t.today.later(t.time(status.from)) };
  if (status.kind === 'holiday') return { live: false, text: t.today.next(t.today.tomorrow, t.time(status.next)) };
  return { live: false, text: t.today.next(status.nextIsMonday ? t.today.monday : t.today.tomorrow, t.time(status.next)) };
}

// Who is consulting right now, read from the IST clock. This is the first thing a patient needs to know.
function TodayBoard() {
  const { t } = useLanguage();
  const clock = useClinicClock();
  const sunday = clock.day === 0;
  return (
    <aside className="today" aria-label={t.today.title}>
      <div className="today-head">
        <p className="today-title">{t.today.title}</p>
        {sunday && <span className="today-holiday">{t.today.holiday}</span>}
      </div>
      <ul className="today-list">
        {DOCTORS.map((doctor, index) => {
          const text = t.doctors.list[doctor.initials];
          const status = statusText(t, doctorStatus(doctor.slots, clock));
          return (
            <li className={`today-row today-row--${doctor.accent}${status.live ? ' is-live' : ''}`} key={doctor.initials} style={{ '--row': index } as CSSProperties}>
              <span className="today-dot" aria-hidden="true" />
              <div className="today-who">
                <strong>{text.name}</strong>
                <span>{text.department}</span>
              </div>
              <div className="today-when">
                <span className="today-status">{status.text}</span>
                <span className="today-slots">{doctor.slots.map((slot) => `${t.time(slot.start)} – ${t.time(slot.end)}`).join(', ')}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="today-foot">
        <Icon name="heart" />
        <span>{t.today.infertility} <a href={TEL}>{t.today.callAhead}</a></span>
      </p>
    </aside>
  );
}

export function Hero() {
  const { t } = useLanguage();
  return (
    <>
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-place"><Icon name="pin" />{t.hero.place}</p>
            <h1 className="hero-title">
              <span className="mask"><span>{HOSPITAL_INFO.shortName}</span></span>{' '}
              <span className="mask"><span className="hero-title-sub">Hospital</span></span>
            </h1>
            <p className="hero-other telugu-display" lang="te">{HOSPITAL_INFO.teluguName}</p>
            <p className="hero-lead">{t.hero.lead}</p>
            <div className="hero-actions">
              <a className="button" href={TEL} {...magnetic}><Icon name="phone" /><span>{t.hero.callNow}</span></a>
              <a className="button button-ghost" href="#booking" {...magnetic}><Icon name="whatsapp" /><span>{t.hero.book}</span></a>
            </div>
            <p className="hero-note">{t.hero.note} <a href={TEL}>{PHONE}</a></p>
          </div>
          <TodayBoard />
        </div>
        <svg className="hero-ecg" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
          <path
            pathLength="1"
            d="M0 92 H520 l16 0 l10 -16 l10 16 l18 0 l12 -64 l14 108 l12 -60 l16 0 l14 -20 l18 20 H840 l14 0 l8 -10 l8 10 l12 0 l10 -42 l12 70 l10 -38 l14 0 l12 -14 l14 14 H1440"
          />
        </svg>
      </section>
      <div className="band" aria-label={t.nav.services}>
        <div className="band-track">
          {[0, 1].map((copy) => (
            <ul className="band-list" key={copy} aria-hidden={copy === 1}>
              {t.band.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
