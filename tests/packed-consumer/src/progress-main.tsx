import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedProgress } from './progress-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Progress app has no root element.');

render(
  /** Mount installed Progress with only its default stylesheet. */
  () => <PackedProgress />,
  root,
);
