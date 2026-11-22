import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { PackedLink } from './link-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Link app has no root element.');

render(
  /** Mount published Link components with packaged CSS. */
  () => <PackedLink />,
  root,
);
