import { createEffect, untrack } from 'solid-js';
import { createDecorator, type Decorator, type Preview } from 'storybook-solidjs-vite';
import '../dist/styles.css';
import '../demos/page-styles/index.css';
import '../demos/example-icons.css';
import '../demos/example-spinner.css';

declare const __LEVERUI_STORYBOOK_INTERNAL__: boolean;

if (!__LEVERUI_STORYBOOK_INTERNAL__) {
  void import('./gallery-fonts.css');
}

/** Keep the gallery's color mode aligned with its Storybook toolbar. */
function withGalleryTheme(
  Story: Parameters<Decorator>[0],
  context: Parameters<Decorator>[1],
): ReturnType<Decorator> {
  // Follow the toolbar in an effect and render the story untracked: re-running
  // the story on a globals change leaves the prerelease Solid 2 renderer's
  // root empty, while stories that read `context.globals` in JSX still update.
  createEffect(
    () => (context.globals.theme === 'dark' ? 'dark' : 'light'),
    (mode) => {
      document.documentElement.dataset.leveruiColorMode = mode;
      document.documentElement.classList.toggle('dark', mode === 'dark');
      document.documentElement.classList.toggle('light', mode === 'light');
    },
  );
  return untrack(() => Story());
}

const preview = {
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'Gallery color mode',
      toolbar: {
        dynamicTitle: true,
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [createDecorator(withGalleryTheme)],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Layout', 'Typography', 'Components', 'Charts'],
      },
    },
    actions: { disable: true },
    controls: { disable: true },
  },
} satisfies Preview;

export default preview;
