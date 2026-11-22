import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedStatus } from './status-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Status app has no root element.');

render(
  /** Mount published Status parts with authored CSS. */
  () => <PackedStatus />,
  root,
);
