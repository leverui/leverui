import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedList } from './list-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed List app has no root element.');

render(
  /** Mount published List components with packaged CSS. */
  () => <PackedList />,
  root,
);
