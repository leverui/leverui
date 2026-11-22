import { Button } from '@leverui/components';
import { type JSX } from '@solidjs/web';
import { GuideCodeBlock } from './guide-code-block';
import { HomeExamples } from './home-examples/index';
import { conceptRoute } from '../lib/concept-pages';

const usage = `import '@leverui/components/styles.css';
import { Button } from '@leverui/components';

export default function App() {
  return <Button>Save</Button>;
}`;

/** Introduce Lever UI beside a wall of working examples. */
export function HomeHero(): JSX.Element {
  return (
    <section class="hero-band" aria-labelledby="hero-title">
      <div class="hero-backdrop" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div class="hero page-container">
        <div class="hero-copy">
          <span class="hero-announcement">Built for Solid 2</span>
          <h1 id="hero-title">Build your Solid app with ready-made components</h1>
          <p>
            Accessible components you style with plain CSS. Import the stylesheet and start
            building.
          </p>
          <GuideCodeBlock class="hero-code" label="App.tsx" source={usage} showToolbar={false} />
          <div class="hero-actions">
            <Button as="a" href="/docs/getting-started" colorPalette="cyan" size="lg">
              Get started
            </Button>
            <Button as="a" href={conceptRoute('overview')} variant="outline" size="lg">
              Components
            </Button>
          </div>
        </div>
        <HomeExamples />
      </div>
    </section>
  );
}
