import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedHeading } from './heading-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Heading app has no root element.');

render(
  /** Mount the installed component from the installed package. */
  () => (
    <>
      <PackedHeading />
    </>
  ),
  root,
);
