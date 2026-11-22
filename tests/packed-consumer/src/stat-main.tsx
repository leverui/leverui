import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedStat } from './stat-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Stat app has no root element.');

render(
  /** Mount published Stat parts with authored CSS. */
  () => <PackedStat />,
  root,
);
