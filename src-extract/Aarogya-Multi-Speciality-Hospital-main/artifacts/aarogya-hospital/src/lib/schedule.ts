import { useEffect, useState } from 'react';
import type { Slot } from './hospital';

// The hospital keeps Indian time, so the board reads the clock in IST whatever the visitor's timezone.
export type ClinicClock = { day: number; minutes: number };

const DAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function clinicClock(date = new Date()): ClinicClock {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return { day: DAY_INDEX[read('weekday')] ?? 1, minutes: Number(read('hour')) * 60 + Number(read('minute')) };
}

// Re-reads the clock every 30 seconds so the "now" states change on their own.
export function useClinicClock() {
  const [clock, setClock] = useState<ClinicClock>(() => clinicClock());
  useEffect(() => {
    const timer = window.setInterval(() => setClock(clinicClock()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return clock;
}

export type DoctorStatus =
  | { kind: 'holiday'; next: number }
  | { kind: 'now'; until: number }
  | { kind: 'later'; from: number }
  | { kind: 'done'; next: number; nextIsMonday: boolean };

export function doctorStatus(slots: Slot[], clock: ClinicClock): DoctorStatus {
  const first = slots[0]?.start ?? 0;
  if (clock.day === 0) return { kind: 'holiday', next: first };
  const current = slots.find((slot) => clock.minutes >= slot.start && clock.minutes < slot.end);
  if (current) return { kind: 'now', until: current.end };
  const upcoming = slots.find((slot) => clock.minutes < slot.start);
  if (upcoming) return { kind: 'later', from: upcoming.start };
  return { kind: 'done', next: first, nextIsMonday: clock.day === 6 };
}

// Ruler shown under each doctor: 8 AM to 9 PM.
export const RULER_START = 8 * 60;
export const RULER_END = 21 * 60;
export const rulerPercent = (minutes: number) => ((minutes - RULER_START) / (RULER_END - RULER_START)) * 100;
