import type { StoryContext } from 'storybook-solidjs-vite';
import { type JSX } from '@solidjs/web';
import { meta as demo, Themes as ThemesDemo } from '../demos/code-block';
import { CodeBlockWithThemes } from '../demos/examples/code-block-overflow';

export default { ...demo, title: 'Components/CodeBlock' };

/** Accept only the two color modes the syntax themes support. */
function themeMode(value: unknown): 'light' | 'dark' | undefined {
  return value === 'light' || value === 'dark' ? value : undefined;
}

export {
  Basic,
  Sizes,
  Title,
  CopyButton,
  LineNumbers,
  LineHighlighting,
  LineFocusing,
  Diff,
  MaxLines,
  LanguageSwitcher,
  FloatingCopyButton,
  Tabs,
  TabsSync,
} from '../demos/code-block';

/** In Storybook, the syntax theme follows the gallery's color-mode toolbar. */
export const Themes = {
  ...ThemesDemo,
  /** Pass the toolbar's color mode to the example. */
  render(_args: unknown, context: StoryContext): JSX.Element {
    return <CodeBlockWithThemes mode={themeMode(context.globals['theme'])} />;
  },
};

export {
  WordWrap,
  LineNumbersWordWrap,
  HighlightJs,
  PlainText,
  CustomAction,
  HorizontalOverflow,
  OverflowAndOverlay,
} from '../demos/code-block';
