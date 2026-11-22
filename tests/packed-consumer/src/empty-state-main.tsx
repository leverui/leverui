import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedEmptyState } from './empty-state-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Empty State app has no root element.');

render(
  /** Mount the installed component with packaged CSS. */
  () => (
    <>
      <PackedEmptyState />
    </>
  ),
  root,
);
