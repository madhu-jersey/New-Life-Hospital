import { Header, MobileDock } from '@/components/common';
import { Footer } from '@/components/Footer';
import { type ServicePage as ServicePageData, servicePageHtml } from '@/lib/service-pages';

// The body is the same HTML the build writes into /<slug>.html, so what search engines read is what people see.
export default function ServicePage({ page }: { page: ServicePageData }) {
  return (
    <>
      <Header />
      <main dangerouslySetInnerHTML={{ __html: servicePageHtml(page) }} />
      <Footer />
      <MobileDock />
    </>
  );
}
