import Lenis from 'lenis';

let lenis: Lenis | null = null;

const HEADER_OFFSET = () => (window.innerWidth < 768 ? -64 : -84);

// Eased wheel scrolling on desktop. Touch devices keep their native momentum scrolling,
// which is already smooth and is what phone users expect.
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false });
  let frame = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
  document.documentElement.classList.add('has-smooth-scroll');
  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
    document.documentElement.classList.remove('has-smooth-scroll');
  };
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.classList.toggle('is-scroll-locked', locked);
}

// In-page links glide to their section and leave the header clear of the heading.
export function scrollToHash(hash: string) {
  const target = hash === '#home' ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A link inside the open mobile menu fires while scrolling is still locked.
  lockScroll(false);
  if (lenis) {
    lenis.scrollTo(hash === '#home' ? 0 : target, { offset: HEADER_OFFSET(), duration: 1.25, force: true });
  } else {
    const top = hash === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET();
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
  history.replaceState(null, '', hash === '#home' ? window.location.pathname + window.location.search : hash);
}
