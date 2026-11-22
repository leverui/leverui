import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedVisuallyHidden } from './visually-hidden-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed VisuallyHidden app has no root element.');

render(
  /** Mount the installed component from the installed package. */
  () => (
    <>
      <PackedVisuallyHidden />
    </>
  ),
  root,
);
