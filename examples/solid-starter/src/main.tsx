import '@leverui/components/styles.css';
import './theme.css';
import { render } from '@solidjs/web';
import { App } from './App';

const root = document.getElementById('app');
if (!root) throw new Error('The Lever UI starter needs an #app element.');

render(
  /** Mount the example through Solid's browser renderer. */
  () => <App />,
  root,
);
