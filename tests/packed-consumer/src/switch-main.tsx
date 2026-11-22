import '@leverui/components/styles.css';
import './switch.css';
import { render } from '@solidjs/web';
import { PackedSwitch } from './switch-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Switch app has no root element.');

render(
  /** Mount the installed Switch with packaged CSS. */
  () => (
    <>
      <PackedSwitch />
    </>
  ),
  root,
);
