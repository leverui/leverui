import { Button, Tag } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ColorModeDemo, KeyboardDemo, ServerDemo, ThemeDemo } from './home-feature-demos';
import { conceptRoute } from '../lib/concept-pages';
import { guideCategories } from '../lib/guide-categories';

/** Count the guides in the groups that pass a test. */
function countGuides(keep: (category: (typeof guideCategories)[number]) => boolean): number {
  return guideCategories.filter(keep).flatMap(
    /** List one group's guides. */
    (category) => category.slugs.split(' '),
  ).length;
}

const componentCount = countGuides(
  /** Keep the groups under the Components tab. */
  (category) => category.section === 'components',
);
const chartCount = countGuides(
  /** Keep the group of chart types. */
  (category) => category.name === 'Charts',
);
const samples = ['Button', 'Dialog', 'Menu', 'Tabs', 'Combobox', 'Date Picker', 'Table', 'Toast'];

/** One feature: a small working demo, then what it means and where to read more. */
function FeatureCard(props: {
  wide?: boolean;
  title: string;
  text: string;
  href: string;
  link: string;
  children: JSX.Element;
}): JSX.Element {
  return (
    <article class={['feature-card', { 'feature-card-wide': props.wide }]}>
      <div class="feature-demo">{props.children}</div>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
      <a class="text-link" href={props.href}>
        {props.link}
      </a>
    </article>
  );
}

/** Show what every component comes with, each point backed by a working demo. */
export function HomeFeatures(): JSX.Element {
  return (
    <>
      <section class="section feature-section" aria-labelledby="feature-title">
        <div class="page-container">
          <h2 id="feature-title">Features</h2>
          <div class="feature-grid">
            <FeatureCard
              wide
              title="Accessible right out of the box"
              text="Every component works with a keyboard and a screen reader. Click a tab, then press an arrow key."
              href="/docs/accessibility"
              link="Accessibility"
            >
              <KeyboardDemo />
            </FeatureCard>
            <FeatureCard
              wide
              title="Your colors, in plain CSS"
              text="Pick a color. One CSS variable changes it everywhere."
              href="/docs/theme-guide"
              link="Customize with CSS"
            >
              <ThemeDemo />
            </FeatureCard>
            <FeatureCard
              title="Light and dark mode"
              text="Every color has a dark value. Force either mode on any part of a page."
              href={conceptRoute('color-mode')}
              link="Color mode"
            >
              <ColorModeDemo />
            </FeatureCard>
            <FeatureCard
              title="Renders on the server"
              text="Pages arrive as HTML, already styled, then become interactive."
              href="/docs/server-rendering"
              link="Server rendering"
            >
              <ServerDemo />
            </FeatureCard>
            <FeatureCard
              title={`${componentCount} components, ${chartCount} charts`}
              text="From buttons and forms to date pickers, tables, and charts."
              href={conceptRoute('overview')}
              link="See them all"
            >
              <div class="feature-demo-row feature-demo-wrap">
                <For each={samples}>
                  {/** Name one component. */}
                  {(name) => (
                    <Tag.Root size="sm">
                      <Tag.Label>{name}</Tag.Label>
                    </Tag.Root>
                  )}
                </For>
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>
      <section class="section closing-section" aria-labelledby="closing-title">
        <div class="page-container closing-inner">
          <h2 id="closing-title">Start building</h2>
          <code class="closing-command">pnpm add @leverui/components@next</code>
          <div class="closing-actions">
            <Button as="a" href="/docs/getting-started" colorPalette="cyan" size="lg">
              Get started
            </Button>
            <Button as="a" href={conceptRoute('overview')} variant="outline" size="lg">
              Components
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
