import { Title, Meta } from '@solidjs/meta';
import { type JSX } from '@solidjs/web';
import { HomeFeatures } from '../components/home-features';
import { HomeHero } from '../components/home-hero';
import { HomeShowcase } from '../components/home-showcase/index';
import '../styles/home-common.css';
import '../styles/home-hero.css';
import '../styles/home-platform.css';
import '../styles/home-responsive.css';

/** Present the library's components, theming approach, and documentation paths. */
export default function Home(): JSX.Element {
  return (
    <main id="main-content" class="home">
      <Title>Lever UI — Components for SolidJS</Title>
      <Meta
        name="description"
        content="Accessible SolidJS components and a CSS-first design system for thoughtful interfaces."
      />
      <HomeHero />
      <HomeShowcase />
      <HomeFeatures />
    </main>
  );
}
