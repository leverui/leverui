import '@leverui/components/styles.css';
import '../../demos/page-styles/index.css';
import { createRouter, eagerPreload, intentPreload, useLocation } from '@solidjs/router';
import { type JSX } from '@solidjs/web';
import { lazy, Loading, Show } from 'solid-js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../demos/example-icons.css';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import './styles/site-base.css';
import './styles/site-header.css';
import './styles/site-footer.css';
import './styles/site-responsive.css';
import './styles/site-theme-tokens.css';
import './styles/site-theme-shell.css';
import './styles/site-theme-docs.css';
import './styles/site-theme-overlays.css';
import './styles/site-theme-playground.css';

/**
 * Every public page, each loaded as its own chunk. A page's code loads when a link to it is
 * hovered, focused or touched, and links marked `preload="eager"` load theirs once the browser
 * is idle, so the switch does not wait on the download.
 */
const Router = createRouter({
  preloadLinks: [intentPreload(), eagerPreload()],
  routes: [
    { path: '/', component: lazy(() => import('./routes/index')) },
    { path: '/playground', component: lazy(() => import('./routes/playground')) },
    { path: '/guides', component: lazy(() => import('./routes/guides')) },
    { path: '/docs', component: lazy(() => import('./routes/docs/index')) },
    {
      path: '/docs/components/concepts/overview',
      component: lazy(() => import('./routes/docs/overview')),
    },
    { path: '/docs/colors', component: lazy(() => import('./routes/docs/colors')) },
    { path: '/docs/*slug', component: lazy(() => import('./routes/docs/[...slug]')) },
  ],
});

/** Sections that, like the docs and playground, end without the site footer. */
const footerlessPrefixes = ['/docs', '/playground'];

/** Show the footer on the home and guides pages only. */
function RouteFooter(): JSX.Element {
  const location = useLocation();
  return (
    <Show
      when={
        !footerlessPrefixes.some(
          /** Match a section by its first path segment. */
          (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`),
        )
      }
    >
      <SiteFooter />
    </Show>
  );
}

/** Wrap every route in the public website shell. */
export default function App(): JSX.Element {
  return (
    <Router>
      {
        /** Keep the navigation shell stable between route changes. */
        (props) => (
          <>
            <a class="skip-link" href="#main-content">
              Skip to content
            </a>
            <SiteHeader />
            <Loading>{props.children}</Loading>
            <RouteFooter />
          </>
        )
      }
    </Router>
  );
}
