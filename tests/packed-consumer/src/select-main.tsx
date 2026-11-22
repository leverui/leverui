import '@leverui/components/styles.css';
import './select.css';
import { render } from '@solidjs/web';
import { PackedSelect } from './select-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Select app has no root element.');

render(
  /** Mount the installed Select with packaged CSS. */
  () => (
    <>
      <PackedSelect />
    </>
  ),
  root,
);
