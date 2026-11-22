import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedText } from './text-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Text app has no root element.');

render(
  /** Mount published Text under its provider. */
  () => (
    <>
      <PackedText />
    </>
  ),
  root,
);
