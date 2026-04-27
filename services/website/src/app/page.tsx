import { Hero } from '~/components/hero';
import { ExperienceSection } from '~/components/experience';
import { CompaniesStrip } from '~/components/companies-strip';
import { FeaturedProjects } from '~/components/featured-projects';
import { ContactSection } from '~/components/contact';
import { RevealObserver } from '~/components/primitives-client';

export default function HomePage() {
  return (
    <>
      <RevealObserver />
      <Hero />
      <ExperienceSection />
      <CompaniesStrip />
      <FeaturedProjects />
      <ContactSection />
    </>
  );
}
