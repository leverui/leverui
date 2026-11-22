import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedSemanticInline } from './semantic-inline-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed semantic typography app has no root element.');

render(
  /** Mount published semantic typography from the installed package. */
  () => (
    <>
      <PackedSemanticInline />
    </>
  ),
  root,
);
