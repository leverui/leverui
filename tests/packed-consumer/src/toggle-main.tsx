import '@leverui/components/styles.css';
import './toggle.css';
import { render } from '@solidjs/web';
import { PackedToggle } from './toggle-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Toggle app has no root element.');

render(
  /** Mount the installed Toggle with packaged CSS. */
  () => (
    <>
      <PackedToggle />
    </>
  ),
  root,
);
