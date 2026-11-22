import '@leverui/components/styles.css';
import { render } from '@solidjs/web';
import './skeleton-overrides.css';
import { PackedSkeleton } from './skeleton-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Skeleton app has no root element.');

render(
  /** Mount installed placeholders with packaged CSS. */
  () => (
    <>
      <PackedSkeleton />
    </>
  ),
  root,
);
