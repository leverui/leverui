import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedRadioGroup } from './radio-group-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Radio Group app has no root element.');

render(
  /** Mount the installed Radio Group with packaged CSS. */
  () => (
    <>
      <PackedRadioGroup />
    </>
  ),
  root,
);
