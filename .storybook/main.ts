import type { StorybookConfig } from 'storybook-solidjs-vite';
import solid from '@solidjs/vite-plugin';
import type { PluginOption } from 'vite';
import { lucideIconImports } from '../demos/lucide-icon-imports';

/** Flatten Vite's nested plugin arrays into one list. */
function flattenPlugins(plugins: readonly PluginOption[]): PluginOption[] {
  return plugins.flatMap(
    /** Expand one nested plugin array, keeping single plugins as they are. */
    (plugin) => (Array.isArray(plugin) ? flattenPlugins(plugin) : [plugin]),
  );
}

const config = {
  stories:
    process.env.LEVERUI_STORYBOOK_INTERNAL === '1'
      ? ['./**/!(*-examples).stories.tsx']
      : ['./*-examples.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
  // Demo images and Lever UI brand files are shared with the website.
  staticDirs: ['../website/public'],
  framework: {
    name: 'storybook-solidjs-vite',
    options: { docgen: false },
  },
  /** Compile stories and source components with hydration markers. */
  viteFinal(config) {
    // Storybook also loads the root vite.config.ts, whose non-hydratable `solid()`
    // returns several plugins (`solid`, `solid:*`). Drop all of them so the
    // hydratable compiler below is the only one that transforms JSX.
    const plugins = flattenPlugins(config.plugins ?? []).filter(
      /** Keep every plugin except the root config's Solid compiler parts. */
      (plugin) =>
        !plugin ||
        typeof plugin !== 'object' ||
        !('name' in plugin) ||
        typeof plugin.name !== 'string' ||
        !(plugin.name === 'solid' || plugin.name.startsWith('solid:')),
    );
    return {
      ...config,
      plugins: [lucideIconImports(), ...plugins, solid({ ssr: true, solid: { hydratable: true } })],
      define: {
        ...config.define,
        __LEVERUI_STORYBOOK_INTERNAL__: JSON.stringify(
          process.env.LEVERUI_STORYBOOK_INTERNAL === '1',
        ),
      },
    };
  },
  core: { disableTelemetry: true },
  features: {
    menuOnboardingChecklist: false,
    sidebarOnboardingChecklist: false,
  },
} satisfies StorybookConfig;

export default config;
