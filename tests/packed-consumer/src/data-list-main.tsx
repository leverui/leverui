import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import { PackedDataList } from './data-list-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Data List app has no root element.');

render(
  /** Mount published Data List parts with packaged CSS. */
  () => <PackedDataList />,
  root,
);
