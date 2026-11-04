// Wheel and trackpad scrolling stay native: no scroll-jacking, so the page moves exactly as fast as the visitor scrolls.

const HEADER_OFFSET = () => (window.innerWidth < 768 ? -64 : -84);

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('is-scroll-locked', locked);
}

// In-page links glide to their section and leave the header clear of the heading.
export function scrollToHash(hash: string) {
  const target = hash === '#home' ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A link inside the open mobile menu fires while scrolling is still locked.
  lockScroll(false);
  const top = hash === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET();
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  history.replaceState(null, '', hash === '#home' ? window.location.pathname + window.location.search : hash);
}
