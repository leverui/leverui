import { Title, Meta } from '@solidjs/meta';
import { type JSX } from '@solidjs/web';
import { ThemePlayground } from '../components/theme-playground';
import '../styles/theme-playground.css';
import '../styles/theme-playground-responsive.css';

/** Demonstrate the public CSS-variable theming contract. */
export default function Playground(): JSX.Element {
  return (
    <main id="main-content" class="playground-page page-container">
      <Title>Theme playground | Lever UI</Title>
      <Meta
        name="description"
        content="Customize Lever UI CSS variables and preview real SolidJS components."
      />
      <div class="playground-hero">
        <span class="eyebrow">BUILD YOUR OWN LOOK</span>
        <h1>Make it feel like yours.</h1>
        <p>
          Change a few public CSS variables and watch the components respond. Copy the CSS into your
          own stylesheet when you find a direction you like.
        </p>
      </div>
      <ThemePlayground />
    </main>
  );
}
