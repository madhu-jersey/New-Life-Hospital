import { type ReactNode, useEffect, useLayoutEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Hero } from './components/Hero';
import { Header, MobileDock } from './components/common';
import { About, Doctors, FAQ, Facilities, HospitalGallery, Reviews, Visit, WhyChooseUs } from './components/Sections';
import { Footer } from './components/Footer';
import { Booking } from './components/Booking';
import { updateSearchMetadata } from './lib/seo';
import { scrollToHash } from './lib/smooth-scroll';
import { LanguageProvider } from './lib/i18n';
import { HAS_GALLERY, HAS_REVIEWS } from './lib/sections';
import './index.css';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function SearchHead() {
  const [location] = useLocation();
  useEffect(() => {
    updateSearchMetadata(location, import.meta.env.VITE_SITE_URL);
  }, [location]);
  return null;
}

function App() {
  // In-page links glide to their section instead of jumping.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash === '#') return;
      event.preventDefault();
      scrollToHash(hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useLayoutEffect(() => {
    const elements = [...document.querySelectorAll('.reveal')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.setAttribute('data-revealed', ''));
      return;
    }
    document.documentElement.classList.add('has-reveal-observer');
    const observer = new IntersectionObserver((entries) => {
      // Stagger elements that enter together, counted per parent so each grid ripples in order.
      const batchIndex = new Map<Element | null, number>();
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          const target = entry.target as HTMLElement;
          const index = batchIndex.get(target.parentElement) ?? 0;
          batchIndex.set(target.parentElement, index + 1);
          target.style.setProperty('--reveal-delay', `${Math.min(index * 90, 540)}ms`);
          // An attribute, not a class: React rewrites className on re-render (an FAQ toggle, a map tap) and would wipe it.
          target.setAttribute('data-revealed', '');
          observer.unobserve(target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    elements.forEach((element) => observer.observe(element));
    // Anything rendered later (for example after a language switch) still gets revealed.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        [node, ...node.querySelectorAll('.reveal')]
          .filter((element) => element.classList.contains('reveal') && !element.hasAttribute('data-revealed'))
          .forEach((element) => observer.observe(element));
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.documentElement.classList.remove('has-reveal-observer');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SearchHead />
          <RoutedErrorBoundary>
            <Switch>
              <Route path="/">
                <>
                  <div className="top-progress" aria-hidden="true" />
                  <Header />
                  <main>
                    <Hero />
                    <About />
                    <Facilities />
                    <Doctors />
                    <WhyChooseUs />
                    <Booking />
                    {HAS_GALLERY && <HospitalGallery />}
                    {HAS_REVIEWS && <Reviews />}
                    <Visit />
                    <FAQ />
                  </main>
                  <Footer />
                  <MobileDock />
                </>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </RoutedErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
