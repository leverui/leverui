import '@leverui/components/styles.css';
import './slider.css';
import { render } from '@solidjs/web';
import { PackedSlider } from './slider-example';

const root = document.getElementById('app');
if (!root) throw new Error('The packed Slider app has no root element.');

render(
  /** Mount the installed Slider with packaged CSS. */
  () => (
    <>
      <PackedSlider />
    </>
  ),
  root,
);
