import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedField } from './field-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Field app has no root element.');

render(
  /** Mount the installed Field with packaged CSS. */
  () => <PackedField />,
  root,
);
