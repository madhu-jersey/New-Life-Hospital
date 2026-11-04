import { type FormEvent, useState } from 'react';
import { CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { Icon, magnetic, PHONE, TEL } from './common';
import { BOOKING_WHATSAPP, DOCTORS, HOSPITAL_INFO } from '@/lib/hospital';
import { useLanguage } from '@/lib/i18n';
import { useClinicClock } from '@/lib/schedule';

type Errors = Partial<Record<'name' | 'phone' | 'date', string>>;

const ANY = 'any';

// Appointments can be requested for the next 3 days only. Change this number to widen or narrow the window.
const BOOKING_WINDOW_DAYS = 3;
const DAY_MS = 86_400_000;
const LAST_CONSULTATION_END = Math.max(...DOCTORS.flatMap((doctor) => doctor.slots.map((slot) => slot.end)));

// Calendar date (YYYY-MM-DD) in India, whatever timezone the visitor's phone is set to.
const indiaDate = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date);
const noonUtc = (iso: string) => new Date(`${iso}T12:00:00Z`);

type BookingDay = { iso: string; offset: number; sunday: boolean };

// Today and the next days, or from tomorrow once the last consultation of today is over.
function bookingDays(minutesNow: number): BookingDay[] {
  const start = minutesNow >= LAST_CONSULTATION_END ? 1 : 0;
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => {
    const offset = start + index;
    const iso = indiaDate(new Date(Date.now() + offset * DAY_MS));
    return { iso, offset, sunday: noonUtc(iso).getUTCDay() === 0 };
  });
}

// The request goes to the hospital in English whatever language the visitor reads the site in.
function buildMessage(fields: { name: string; phone: string; doctor: string; date: string; time: string; note: string }) {
  const doctor = DOCTORS.find((item) => item.initials === fields.doctor);
  return [
    `Appointment request – ${HOSPITAL_INFO.name}`,
    `Patient: ${fields.name}`,
    `Mobile: ${fields.phone}`,
    `Doctor: ${doctor ? `${doctor.name} (${doctor.department})` : 'Not sure / general enquiry'}`,
    `Preferred date: ${noonUtc(fields.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}`,
    `Preferred time: ${fields.time === ANY ? 'Any time' : fields.time}`,
    ...(fields.note ? [`Reason: ${fields.note}`] : []),
  ].join('\n');
}

export function Booking() {
  const { t, lang } = useLanguage();
  const clock = useClinicClock();
  const days = bookingDays(clock.minutes);
  const firstOpenDay = days.find((day) => !day.sunday)?.iso ?? '';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [doctor, setDoctor] = useState<string>(DOCTORS[0]?.initials ?? ANY);
  const [date, setDate] = useState(firstOpenDay);
  const [slot, setSlot] = useState(0);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  // A day that has slipped out of the window (the page was left open overnight) no longer counts.
  const chosenDay = days.find((day) => day.iso === date && !day.sunday);

  // Time choices follow the chosen doctor's hours; for today, slots that have already ended are left out.
  // Slots are stored by index so a language switch keeps the choice.
  const doctorData = DOCTORS.find((item) => item.initials === doctor);
  const slotLabels = doctor === ANY ? [] : t.doctors.list[doctor].timings;
  const openSlots = (doctorData?.slots ?? [])
    .map((item, index) => ({ ...item, index }))
    .filter((item) => !(chosenDay?.offset === 0 && clock.minutes >= item.end))
    .map((item) => item.index);
  const noSlotsLeft = Boolean(doctorData) && openSlots.length === 0;
  const activeSlot = openSlots.includes(slot) ? slot : openSlots[0];

  const dayName = (day: BookingDay) => {
    if (day.offset === 0) return t.booking.today;
    if (day.offset === 1) return t.booking.tomorrow;
    return noonUtc(day.iso).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { weekday: 'long', timeZone: 'UTC' });
  };
  const dayDate = (day: BookingDay) => noonUtc(day.iso).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    const next: Errors = {};
    if (!name.trim()) next.name = t.booking.errors.name;
    if (!/^[6-9]\d{9}$/.test(digits)) next.phone = t.booking.errors.phone;
    if (!chosenDay) next.date = t.booking.errors.date;
    else if (noSlotsLeft) next.date = t.booking.errors.noSlots;
    setErrors(next);
    if (Object.keys(next).length) {
      event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const time = activeSlot === undefined ? ANY : doctorData?.timings[activeSlot] ?? ANY;
    const message = buildMessage({ name: name.trim(), phone: digits, doctor, date, time, note: note.trim() });
    window.open(`https://wa.me/${BOOKING_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const reset = () => {
    setName(''); setPhone(''); setDate(firstOpenDay); setNote(''); setSlot(0); setErrors({}); setSent(false);
  };

  return (
    <section className="section booking" id="booking">
      <div className="container booking-grid">
        <div className="booking-copy">
          <h2 className="reveal reveal-title">{t.booking.title}</h2>
          <p className="section-subline reveal">{t.booking.subline}</p>
          <p className="booking-call reveal">{t.booking.orCall} <a href={TEL}>{PHONE}</a></p>
        </div>

        <div className="booking-card reveal">
          {sent ? (
            <div className="booking-success" role="status">
              <CheckCircle2 aria-hidden="true" />
              <h3>{t.booking.successTitle}</h3>
              <p>{t.booking.success}</p>
              <button className="button button-ghost" type="button" onClick={reset}><span>{t.booking.again}</span></button>
            </div>
          ) : (
            <form className="booking-form" noValidate onSubmit={submit}>
              <div className="field">
                <label htmlFor="booking-name">{t.booking.name}</label>
                <input id="booking-name" type="text" autoComplete="name" placeholder={t.booking.namePlaceholder} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'booking-name-error' : undefined} />
                {errors.name && <span className="field-error" id="booking-name-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="booking-phone">{t.booking.phone}</label>
                <input id="booking-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={t.booking.phonePlaceholder} value={phone} onChange={(event) => setPhone(event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'booking-phone-error' : undefined} />
                {errors.phone && <span className="field-error" id="booking-phone-error">{errors.phone}</span>}
              </div>
              <fieldset className="field field-wide doctor-pick">
                <legend>{t.booking.doctor}</legend>
                {[...DOCTORS.map((item) => item.initials), ANY].map((value) => (
                  <label className="doctor-option" key={value}>
                    <input type="radio" name="booking-doctor" value={value} checked={doctor === value} onChange={() => { setDoctor(value); setSlot(0); }} />
                    <span>
                      <strong>{value === ANY ? t.booking.anyDoctor : t.doctors.list[value].name}</strong>
                      {value !== ANY && <small>{t.doctors.list[value].department}</small>}
                    </span>
                  </label>
                ))}
              </fieldset>
              <fieldset className="field field-wide day-pick" aria-describedby={errors.date ? 'booking-date-error booking-date-hint' : 'booking-date-hint'}>
                <legend>{t.booking.date}</legend>
                {days.map((day) => (
                  <label className={`day-option${day.sunday ? ' is-holiday' : ''}`} key={day.iso}>
                    <input
                      type="radio"
                      name="booking-date"
                      value={day.iso}
                      checked={date === day.iso}
                      disabled={day.sunday}
                      aria-invalid={Boolean(errors.date)}
                      onChange={() => { setDate(day.iso); setErrors((current) => ({ ...current, date: undefined })); }}
                    />
                    <span>
                      <strong>{dayName(day)}</strong>
                      <small>{day.sunday ? t.booking.holiday : dayDate(day)}</small>
                    </span>
                  </label>
                ))}
                <p className="day-hint" id="booking-date-hint">{t.booking.window}</p>
                {errors.date && <span className="field-error" id="booking-date-error">{errors.date}</span>}
              </fieldset>
              <div className="field field-wide">
                <label htmlFor="booking-time">{t.booking.time}</label>
                <select
                  id="booking-time"
                  value={activeSlot ?? -1}
                  onChange={(event) => setSlot(Number(event.target.value))}
                  disabled={!slotLabels.length || noSlotsLeft}
                >
                  {!slotLabels.length && <option value={-1}>{t.booking.anyTime}</option>}
                  {slotLabels.length > 0 && noSlotsLeft && <option value={-1}>{t.booking.noSlotsOption}</option>}
                  {openSlots.map((index) => <option key={index} value={index}>{slotLabels[index]}</option>)}
                </select>
              </div>
              <div className="field field-wide">
                <label htmlFor="booking-note">{t.booking.note}</label>
                <textarea id="booking-note" rows={2} placeholder={t.booking.notePlaceholder} value={note} onChange={(event) => setNote(event.target.value)} />
              </div>
              <button className="button button-whatsapp field-wide" type="submit" {...magnetic}>
                <MessageCircle className="icon" aria-hidden="true" /><span>{t.booking.submit}</span>
              </button>
              <p className="booking-privacy field-wide"><ShieldCheck aria-hidden="true" />{t.booking.privacy}</p>
            </form>
          )}
        </div>
      </div>
      <Icon name="heart" className="booking-watermark" />
    </section>
  );
}
