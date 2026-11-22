import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedCheckmark } from './checkmark-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Checkmark app has no root element.');

render(
  /** Mount the installed Checkmark with packaged CSS. */
  () => <PackedCheckmark />,
  root,
);
