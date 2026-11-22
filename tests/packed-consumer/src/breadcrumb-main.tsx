import '@leverui/components/styles.css';
import './breadcrumb-theme.css';
import { render } from '@solidjs/web';
import { PackedBreadcrumb } from './breadcrumb-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Breadcrumb app has no root element.');

render(
  /** Mount published Breadcrumb parts with packaged CSS. */
  () => <PackedBreadcrumb />,
  root,
);
