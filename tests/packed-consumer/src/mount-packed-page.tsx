import '@leverui/components/styles.css';
import './theme.css';
import { Theme } from '@leverui/components';
import { render, type JSX } from '@solidjs/web';

/** Mount one typed consumer page with the shared theme and package styles. */
export function mountPackedPage(content: () => JSX.Element): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('The packed consumer app has no root element.');
  render(
    /** Keep the page composition from the installed package and theme. */
    () => (
      <>
        <Theme class="brand-scope">{content()}</Theme>
      </>
    ),
    root,
  );
}
