import { Link, Meta, Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';

const gettingStartedPath = '/docs/getting-started';

/**
 * Send `/docs` to the Getting started guide. The static page carries a meta refresh, so the
 * redirect also works on a static host and without JavaScript.
 */
export default function DocsRedirect(): JSX.Element {
  const navigate = useNavigate();
  onSettled(
    /** Replace this entry, so Back returns to the page before `/docs`. */
    () => {
      navigate(gettingStartedPath, { replace: true });
    },
  );

  return (
    <main id="main-content" class="page-container">
      <Title>Documentation | Lever UI</Title>
      <Meta http-equiv="refresh" content={`0; url=${gettingStartedPath}`} />
      <Link rel="canonical" href={gettingStartedPath} />
      <p>
        Redirecting to <a href={gettingStartedPath}>Getting started</a>.
      </p>
    </main>
  );
}
