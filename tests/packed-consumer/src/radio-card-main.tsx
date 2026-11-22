import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedRadioCard } from './radio-card-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Radio Card app has no root element.');

render(
  /** Mount the installed Radio Card with packaged CSS. */
  () => (
    <>
      <PackedRadioCard />
    </>
  ),
  root,
);
