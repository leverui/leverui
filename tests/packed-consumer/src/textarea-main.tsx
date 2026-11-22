import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import './textarea-consumer.css';
import { PackedTextarea } from './textarea-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Textarea app has no root element.');

render(
  /** Mount Field and Textarea from the installed package. */
  () => (
    <>
      <PackedTextarea />
    </>
  ),
  root,
);
