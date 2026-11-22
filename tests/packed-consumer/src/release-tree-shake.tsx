import '@leverui/components/styles.css';
import './box-layout.css';
import { Box } from '@leverui/components';
import { render, type JSX } from '@solidjs/web';

/** Import only the visual foundation through the published package root. */
function TreeShakeExample(): JSX.Element {
  return <Box class="release-tree-shake-box">Release tree shaking</Box>;
}

render(TreeShakeExample, document.body);
