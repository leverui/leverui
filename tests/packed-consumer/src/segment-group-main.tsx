import '@leverui/components/styles.css';
import './segment-group.css';
import { render } from '@solidjs/web';
import { PackedSegmentGroup } from './segment-group-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Segment Group app has no root element.');

render(
  /** Mount the installed Segment Group with packaged CSS. */
  () => (
    <>
      <PackedSegmentGroup />
    </>
  ),
  root,
);
