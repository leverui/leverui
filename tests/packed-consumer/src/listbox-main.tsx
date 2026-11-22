import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedListbox } from './listbox-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Listbox app has no root element.');

render(
  /** Mount the installed Listbox with packaged CSS. */
  () => (
    <>
      <PackedListbox />
    </>
  ),
  root,
);
