import '@leverui/components/styles.css';
import './skip-nav.css';
import { render } from '@solidjs/web';
import { PackedSkipNav } from './skip-nav-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Skip Nav app has no root element.');

render(
  /** Mount the installed pair from the installed package. */
  () => (
    <>
      <PackedSkipNav />
    </>
  ),
  root,
);
