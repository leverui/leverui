import '@leverui/components/styles.css';
import './tags-input.css';
import { render } from '@solidjs/web';
import { PackedTagsInput } from './tags-input-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Tags Input app has no root element.');

render(
  /** Mount the installed Tags Input with packaged CSS. */
  () => (
    <>
      <PackedTagsInput />
    </>
  ),
  root,
);
