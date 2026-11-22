import '@leverui/components/styles.css';
import './avatar.css';
import { render } from '@solidjs/web';
import { PackedAvatar } from './avatar-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Avatar app has no root element.');

render(
  /** Mount installed Avatar parts with their imported stylesheet only. */
  () => <PackedAvatar />,
  root,
);
