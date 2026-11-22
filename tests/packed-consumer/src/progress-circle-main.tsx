import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedProgressCircle } from './progress-circle-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Progress Circle app has no root element.');

render(
  /** Mount installed Circle parts with only their default stylesheet. */
  () => <PackedProgressCircle />,
  root,
);
