import '@leverui/components/styles.css';
import './collapsible.css';
import { render } from '@solidjs/web';
import { PackedCollapsible } from './collapsible-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Collapsible app has no root element.');

render(
  /** Mount the installed Collapsible with packaged CSS. */
  () => (
    <>
      <PackedCollapsible />
    </>
  ),
  root,
);
