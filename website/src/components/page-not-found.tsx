import { Title } from '@solidjs/meta';
import { type JSX } from '@solidjs/web';
import '../styles/page-not-found.css';

/**
 * The not-found message shown inside the app, such as after a broken link within the site.
 * It says the same as the static 404 page the host serves, `public/404.html`.
 */
export function PageNotFound(): JSX.Element {
  return (
    <div class="page-not-found">
      <Title>Page not found | Lever UI</Title>
      <p class="page-not-found-code">404</p>
      <h1>Page not found</h1>
      <p>This page doesn't exist or has moved.</p>
      <nav aria-label="Pages">
        <a class="page-not-found-primary" href="/docs/getting-started">
          Browse the docs
        </a>
        <a href="/">Go to the home page</a>
      </nav>
    </div>
  );
}
