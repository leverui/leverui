import '@leverui/components/styles.css';
import './action-bar.css';
import { render } from '@solidjs/web';
import { PackedActionBar } from './action-bar-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Action Bar app has no root element.');

render(
  /** Mount the installed Action Bar with only its imported stylesheet. */
  () => <PackedActionBar />,
  root,
);
