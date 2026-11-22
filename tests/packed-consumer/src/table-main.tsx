import '@leverui/components/styles.css';
import './table-theme.css';
import { render } from '@solidjs/web';
import { PackedTable } from './table-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Table app has no root element.');

render(
  /** Mount installed Table parts with authored CSS. */
  () => <PackedTable />,
  root,
);
