import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import './radiomark-overrides.css';
import { PackedRadiomark } from './radiomark-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Radiomark app has no root element.');

render(
  /** Mount the installed mark with only the public CSS import. */
  () => <PackedRadiomark />,
  root,
);
