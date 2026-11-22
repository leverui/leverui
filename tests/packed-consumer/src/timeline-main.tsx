import '@leverui/components/styles.css';
import './timeline-theme.css';
import { render } from '@solidjs/web';
import { PackedTimeline } from './timeline-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Timeline app has no root element.');

render(
  /** Mount the installed Timeline with authored CSS. */
  () => <PackedTimeline />,
  root,
);
