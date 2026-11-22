import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedCombobox } from './combobox-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Combobox app has no root element.');

render(
  /** Mount the installed Combobox under its public provider. */
  () => (
    <>
      <PackedCombobox />
    </>
  ),
  root,
);
