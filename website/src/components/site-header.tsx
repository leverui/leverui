import { Badge } from '@leverui/components';
import { SiteIcon } from './site-icon';
import { SiteMenu } from './site-menu';
import { useLocation } from '@solidjs/router';
import { createEffect, createSignal, For, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SiteSearch } from './site-search';
import { SiteThemeToggle } from './site-theme-toggle';
import { SiteWordmark } from './site-wordmark';
import { docsSection, docsTabs } from '../lib/docs-sections';
import { listenForPageChanges } from '../lib/instant-page-scroll';

/** Render the global navigation with an accessible mobile menu. */
export function SiteHeader(): JSX.Element {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);
  const location = useLocation();

  onSettled(
    /** Track whether the page has scrolled, once the browser is running the page. */
    () => {
      /** Read the scroll position. */
      const update = (): void => {
        setScrolled(window.scrollY > 4);
      };
      /** Close the menu on Escape, wherever the focus is. */
      const closeOnEscape = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') setMenuOpen(false);
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      document.addEventListener('keydown', closeOnEscape);
      const stopPageChanges = listenForPageChanges();
      return (
        /** Stop listening when the header unmounts. */
        () => {
          window.removeEventListener('scroll', update);
          document.removeEventListener('keydown', closeOnEscape);
          stopPageChanges();
        }
      );
    },
  );

  /**
   * On the home page the header blends into the hero until the page scrolls or the menu opens.
   */
  const blended = () => location.pathname === '/' && !scrolled() && !menuOpen();

  /** Close the menu after a navigation choice. */
  function closeMenu(): void {
    setMenuOpen(false);
  }

  createEffect(
    /** Follow the address, including the browser's back and forward buttons. */
    () => location.pathname,
    /** A new page starts with the menu closed. */
    () => {
      setMenuOpen(false);
    },
  );

  /** The docs section the current page belongs to, or none outside the docs. */
  const activeSection = () =>
    location.pathname.startsWith('/docs') ? docsSection(location.pathname) : undefined;

  /** Toggle the mobile navigation on button activation. */
  function toggleMenu(): void {
    setMenuOpen(!menuOpen());
  }

  return (
    <div
      class="site-header-shell"
      data-blended={blended() ? '' : undefined}
      data-home={location.pathname === '/' ? '' : undefined}
    >
      <header class="site-header">
        <div class="site-header-inner">
          <div class="site-brand">
            <a class="wordmark" href="/" onClick={closeMenu} aria-label="Lever UI home">
              <SiteWordmark />
            </a>
            <Badge class="site-stage" size="sm" variant="outline" title="Lever UI is in alpha">
              Alpha
            </Badge>
          </div>
          <nav class="desktop-nav" aria-label="Main navigation">
            <For each={docsTabs}>
              {/** Render one docs section, marked when the current page is in it. */}
              {(tab) => (
                <a
                  href={tab.href}
                  preload={tab.section === 'components' ? 'eager' : undefined}
                  class={{ active: activeSection() === tab.section }}
                  aria-current={activeSection() === tab.section ? 'true' : undefined}
                >
                  {tab.label}
                </a>
              )}
            </For>
          </nav>
          <div class="header-actions">
            <Show when={location.pathname.startsWith('/docs')}>
              <SiteSearch />
            </Show>
            <a
              class="github-link"
              href="https://github.com/leverui/leverui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lever UI on GitHub"
            >
              <SiteIcon name="github" />
            </a>
            <SiteThemeToggle />
            <button
              class="menu-toggle"
              type="button"
              aria-label={menuOpen() ? 'Close navigation' : 'Open navigation'}
              aria-controls="site-menu"
              aria-expanded={menuOpen() ? 'true' : 'false'}
              onClick={toggleMenu}
            >
              <SiteIcon name={menuOpen() ? 'x-lg' : 'list'} />
            </button>
          </div>
        </div>
      </header>
      {/* Outside the header: its backdrop blur would trap a fixed panel inside it. */}
      <SiteMenu open={menuOpen()} path={location.pathname} onNavigate={closeMenu} />
    </div>
  );
}
