import '@leverui/components/styles.css';
import './tag-theme.css';
import { render } from '@solidjs/web';
import { PackedTag } from './tag-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Tag app has no root element.');

render(
  /** Mount published Tag parts with authored CSS. */
  () => <PackedTag />,
  root,
);
