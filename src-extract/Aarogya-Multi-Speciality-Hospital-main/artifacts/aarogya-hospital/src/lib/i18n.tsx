import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DICTIONARIES, type Dictionary, type Lang } from './translations';

const STORAGE_KEY = 'new-life-lang';
const SWITCH_FADE_MS = 180;

type LanguageContextValue = { lang: Lang; setLang: (lang: Lang) => void; t: Dictionary };

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'te';
}

// Phones have no language switch, so they always show English and can never get stuck in Telugu.
const PHONE_QUERY = '(max-width: 767px)';

function isPhone() {
  return window.matchMedia(PHONE_QUERY).matches;
}

// A ?lang=te link (for example from Instagram) wins over the saved choice.
function initialLang(): Lang {
  if (isPhone()) return 'en';
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (isLang(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // Storage can be blocked in private windows; English is the safe default.
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const fadeTimer = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.classList.toggle('lang-te', lang === 'te');
    // Only a real choice is saved; the forced English on phones must not overwrite it.
    if (isPhone()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore: the choice simply will not persist.
    }
  }, [lang]);

  // Narrowing a window to phone width drops back to English, since the toggle disappears there.
  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const onChange = () => { if (query.matches) setLangState('en'); };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => () => {
    if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current);
  }, []);

  // Fade the page out, swap the words, then fade back in.
  const setLang = useCallback((next: Lang) => {
    if (next === lang) return;
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLangState(next);
      return;
    }
    root.classList.add('is-switching-lang');
    if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => {
      setLangState(next);
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-switching-lang')));
      fadeTimer.current = null;
    }, SWITCH_FADE_MS);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: DICTIONARIES[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className={`lang-toggle ${className}`} role="group" aria-label={t.language.group} data-lang={lang}>
      <span className="lang-toggle-thumb" aria-hidden="true" />
      <button type="button" lang="en" aria-pressed={lang === 'en'} aria-label={t.language.english} onClick={() => setLang('en')}>EN</button>
      <button type="button" lang="te" aria-pressed={lang === 'te'} aria-label={t.language.telugu} onClick={() => setLang('te')}>తె</button>
    </div>
  );
}
