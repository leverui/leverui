import { type JSX } from '@solidjs/web';
import { SiteWordmark } from './site-wordmark';

/** Render product and community links beneath the home and guides pages. */
export function SiteFooter(): JSX.Element {
  return (
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div>
          <a class="wordmark" href="/" aria-label="Lever UI home">
            <SiteWordmark />
          </a>
          <p>Thoughtful components for SolidJS.</p>
        </div>
        <div class="footer-links">
          <div>
            <strong>Explore</strong>
            <a href="/docs/getting-started">Documentation</a>
            <a href="/docs/components/concepts/overview">Components</a>
            <a href="/playground">Playground</a>
          </div>
          <div>
            <strong>Resources</strong>
            <a href="/guides">Guides</a>
            <a href="/docs/theme-guide">Theming</a>
            <a href="/docs/accessibility">Accessibility</a>
          </div>
          <div>
            <strong>Community</strong>
            <a href="https://github.com/leverui/leverui">GitHub</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© {new Date().getFullYear()} Lever UI</div>
    </footer>
  );
}
