import { SiteIcon } from '../components/site-icon';
import { Title, Meta } from '@solidjs/meta';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { guides } from '../lib/docs';
import '../styles/docs-index.css';
import '../styles/docs-responsive.css';

/** Collect the implementation guides that sit beyond individual components. */
export default function Guides(): JSX.Element {
  const overviews = guides.filter(
    /** Show the library's introductory and systems guides. */
    (guide) => guide.kind === 'overview',
  );

  return (
    <main id="main-content" class="docs-index page-container">
      <Title>Guides | Lever UI</Title>
      <Meta
        name="description"
        content="Practical guides for themes, accessibility, and server rendering with Lever UI."
      />
      <div class="docs-index-hero">
        <span class="eyebrow">LEARN LEVER UI</span>
        <h1>
          Go from idea to <em>interface.</em>
        </h1>
        <p>Practical paths through setup, styling, accessibility, and delivery.</p>
      </div>
      <div class="guide-card-grid">
        <For each={overviews}>
          {/** Present one maintained guide with a link to its full content. */}
          {(guide, index) => (
            <a href={guide.path}>
              <span class="guide-card-number">{String(index() + 1).padStart(2, '0')}</span>
              <h2>{guide.title}</h2>
              <p>Explore {guide.title.toLowerCase()} in the Lever UI documentation.</p>
              <SiteIcon name="arrow-right" class="guide-card-arrow" />
            </a>
          )}
        </For>
      </div>
    </main>
  );
}
