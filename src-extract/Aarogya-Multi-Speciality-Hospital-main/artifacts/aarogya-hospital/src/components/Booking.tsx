import { type FormEvent, useState } from 'react';
import { CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { Icon, PHONE, TEL } from './common';
import { BOOKING_WHATSAPP, DOCTORS, HOSPITAL_INFO } from '@/lib/hospital';
import { useLanguage } from '@/lib/i18n';
import { useClinicClock } from '@/lib/schedule';
import { DICTIONARIES } from '@/lib/translations';

type Errors = Partial<Record<'name' | 'phone' | 'doctor' | 'date' | 'time', string>>;

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

// WhatsApp shows *text* in bold. Strip its formatting characters from what the patient typed so their
// text cannot break the bold markers.
const plain = (value: string) => value.replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim();
const bold = (value: string) => `*${plain(value)}*`;

// The request goes to the hospital in English whatever language the visitor reads the site in.
function buildMessage(fields: { name: string; phone: string; doctor: string; date: string; time: string; note: string }) {
  const doctor = DOCTORS.find((item) => item.initials === fields.doctor);
  const date = noonUtc(fields.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return [
    `*APPOINTMENT REQUEST*`,
    `${HOSPITAL_INFO.name}, ${HOSPITAL_INFO.nearbyCity}`,
    '',
    `Patient name: ${bold(fields.name)}`,
    `Mobile: ${bold(fields.phone)}`,
    `Doctor: ${bold(doctor ? `${doctor.name} (${doctor.department})` : 'Not sure / general enquiry')}`,
    `Date: ${bold(date)}`,
    `Time: ${bold(fields.time === ANY ? 'Any time' : fields.time)}`,
    ...(plain(fields.note) ? [`Reason: ${bold(fields.note)}`] : []),
  ].join('\n');
}

export function Booking() {
  const { t, lang } = useLanguage();
  const clock = useClinicClock();
  const days = bookingDays(clock.minutes);
  // Nothing is pre-selected: the patient has to pick a doctor, a day and a time themselves.
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  // '' = not chosen, 'any' = any time (general enquiry), otherwise the index of the doctor's slot.
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  // A day that has slipped out of the window (the page was left open overnight) no longer counts.
  const chosenDay = days.find((day) => day.iso === date && !day.sunday);

  // Time choices follow the chosen doctor's hours; for today, slots that have already ended are left out.
  // Slots are stored by index so a language switch keeps the choice.
  const doctorData = DOCTORS.find((item) => item.initials === doctor);
  const slotLabels = doctorData ? t.doctors.list[doctorData.initials].timings : [];
  const openSlots = (doctorData?.slots ?? [])
    .map((item, index) => ({ ...item, index }))
    .filter((item) => !(chosenDay?.offset === 0 && clock.minutes >= item.end))
    .map((item) => item.index);
  const noSlotsLeft = Boolean(doctorData) && openSlots.length === 0;
  // A slot picked earlier that has since closed (another day was chosen, or time passed) is no longer a choice.
  const timeValid = doctor === ANY ? time === ANY : time !== '' && time !== ANY && openSlots.includes(Number(time));
  const timeValue = timeValid ? time : '';
  const clearError = (key: keyof Errors) => setErrors((current) => ({ ...current, [key]: undefined }));

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
    if (!doctor) next.doctor = t.booking.errors.doctor;
    if (!chosenDay) next.date = t.booking.errors.date;
    else if (noSlotsLeft) next.date = t.booking.errors.noSlots;
    if (doctor && !noSlotsLeft && !timeValid) next.time = t.booking.errors.time;
    setErrors(next);
    // Move to the first field that still needs filling, in the order the form shows them.
    const firstMissing = (['name', 'phone', 'doctor', 'date', 'time'] as const).find((key) => next[key]);
    if (firstMissing) {
      const target = {
        name: '#booking-name',
        phone: '#booking-phone',
        doctor: 'input[name="booking-doctor"]',
        date: 'input[name="booking-date"]:not(:disabled)',
        time: '#booking-time',
      }[firstMissing];
      event.currentTarget.querySelector<HTMLElement>(target)?.focus();
      return;
    }
    // English labels such as "Morning, 9:00 AM to 1:00 PM", matching what the form showed.
    const timeText = time === ANY || !doctorData ? ANY : DICTIONARIES.en.doctors.list[doctorData.initials].timings[Number(time)] ?? ANY;
    const message = buildMessage({ name: name.trim(), phone: digits, doctor, date, time: timeText, note: note.trim() });
    window.open(`https://wa.me/${BOOKING_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const reset = () => {
    setName(''); setPhone(''); setDoctor(''); setDate(''); setTime(''); setNote(''); setErrors({}); setSent(false);
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
              <p className="booking-required field-wide"><span className="req" aria-hidden="true">*</span> {t.booking.requiredNote}</p>
              <div className="field">
                <label htmlFor="booking-name">{t.booking.name} <span className="req" aria-hidden="true">*</span></label>
                <input id="booking-name" type="text" autoComplete="name" required placeholder={t.booking.namePlaceholder} value={name} onChange={(event) => { setName(event.target.value); clearError('name'); }} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'booking-name-error' : undefined} />
                {errors.name && <span className="field-error" id="booking-name-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="booking-phone">{t.booking.phone} <span className="req" aria-hidden="true">*</span></label>
                <input id="booking-phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder={t.booking.phonePlaceholder} value={phone} onChange={(event) => { setPhone(event.target.value); clearError('phone'); }} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'booking-phone-error' : undefined} />
                {errors.phone && <span className="field-error" id="booking-phone-error">{errors.phone}</span>}
              </div>
              <fieldset className="field field-wide doctor-pick" aria-describedby={errors.doctor ? 'booking-doctor-error' : undefined}>
                <legend>{t.booking.doctor} <span className="req" aria-hidden="true">*</span></legend>
                {[...DOCTORS.map((item) => item.initials), ANY].map((value) => (
                  <label className="doctor-option" key={value}>
                    <input type="radio" name="booking-doctor" value={value} required checked={doctor === value} aria-invalid={Boolean(errors.doctor)} onChange={() => { setDoctor(value); setTime(value === ANY ? ANY : ''); clearError('doctor'); clearError('time'); }} />
                    <span>
                      <strong>{value === ANY ? t.booking.anyDoctor : t.doctors.list[value].name}</strong>
                      {value !== ANY && <small>{t.doctors.list[value].department}</small>}
                    </span>
                  </label>
                ))}
                {errors.doctor && <span className="field-error" id="booking-doctor-error">{errors.doctor}</span>}
              </fieldset>
              <fieldset className="field field-wide day-pick" aria-describedby={errors.date ? 'booking-date-error booking-date-hint' : 'booking-date-hint'}>
                <legend>{t.booking.date} <span className="req" aria-hidden="true">*</span></legend>
                {days.map((day) => (
                  <label className={`day-option${day.sunday ? ' is-holiday' : ''}`} key={day.iso}>
                    <input
                      type="radio"
                      name="booking-date"
                      value={day.iso}
                      checked={date === day.iso}
                      disabled={day.sunday}
                      required
                      aria-invalid={Boolean(errors.date)}
                      onChange={() => { setDate(day.iso); clearError('date'); }}
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
                <label htmlFor="booking-time">{t.booking.time} <span className="req" aria-hidden="true">*</span></label>
                <select
                  id="booking-time"
                  required
                  value={timeValue}
                  onChange={(event) => { setTime(event.target.value); clearError('time'); }}
                  disabled={!doctor || noSlotsLeft}
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? 'booking-time-error' : undefined}
                >
                  <option value="" disabled>{!doctor ? t.booking.chooseDoctorFirst : noSlotsLeft ? t.booking.noSlotsOption : t.booking.chooseTime}</option>
                  {doctor === ANY && <option value={ANY}>{t.booking.anyTime}</option>}
                  {doctor !== ANY && openSlots.map((index) => <option key={index} value={String(index)}>{slotLabels[index]}</option>)}
                </select>
                {errors.time && <span className="field-error" id="booking-time-error">{errors.time}</span>}
              </div>
              <div className="field field-wide">
                <label htmlFor="booking-note">{t.booking.note}</label>
                <textarea id="booking-note" rows={2} placeholder={t.booking.notePlaceholder} value={note} onChange={(event) => setNote(event.target.value)} />
              </div>
              <button className="button button-whatsapp field-wide" type="submit">
                <MessageCircle className="icon" aria-hidden="true" /><span>{t.booking.submit}</span>
              </button>
              <p className="booking-privacy field-wide"><ShieldCheck aria-hidden="true" /><span>{t.booking.privacy} <a href="/privacy">{t.booking.privacyLink}</a></span></p>
            </form>
          )}
        </div>
      </div>
      <Icon name="heart" className="booking-watermark" />
    </section>
  );
}
