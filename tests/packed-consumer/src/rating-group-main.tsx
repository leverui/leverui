import '@leverui/components/styles.css';
import './rating-group.css';
import { render } from '@solidjs/web';
import { PackedRatingGroup } from './rating-group-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Rating Group app has no root element.');

render(
  /** Mount the installed Rating Group with packaged CSS. */
  () => (
    <>
      <PackedRatingGroup />
    </>
  ),
  root,
);
