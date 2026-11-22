import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedAlert } from './alert-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Alert app has no root element.');

render(
  /** Mount the installed Alert with its imported stylesheet. */
  () => <PackedAlert />,
  root,
);
