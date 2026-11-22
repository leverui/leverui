import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Theme, type ThemeProps } from '../src';
import './theme-scopes.css';

type GetThemeProps = Parameters<NonNullable<ThemeProps['asChild']>>[0];

/** Attach the portalled Theme scope to the destination element. */
function renderPortalScope(getProps: GetThemeProps): JSX.Element {
  return (
    <section {...getProps()} data-testid="portal-scope" data-as-child="true">
      <Box class="theme-scope-content" data-testid="portal-box">
        Portalled content
      </Box>
    </section>
  );
}

/** Demonstrate a reactive scope and a theme bridged through a portal. */
function ThemeScopesExample(): JSX.Element {
  const [appearance, setAppearance] = createSignal<'light' | 'dark'>('dark');

  /** Toggle both the nested scope and its explicitly bridged portal. */
  function toggleAppearance(): void {
    setAppearance(
      /** Select the opposite mode while preserving the current signal state. */
      (current) => (current === 'dark' ? 'light' : 'dark'),
    );
  }

  return (
    <>
      <Theme appearance={appearance()} data-testid="reactive-scope">
        <button type="button" onClick={toggleAppearance}>
          Toggle appearance
        </button>
        <Box class="theme-scope-content" data-testid="reactive-box">
          Scoped content
        </Box>
        <Portal>
          <Theme appearance={appearance()} hasBackground={false} asChild={renderPortalScope} />
        </Portal>
      </Theme>
    </>
  );
}

const meta = {
  title: 'Setup/Theme Scopes',
  component: ThemeScopesExample,
} satisfies Meta<typeof ThemeScopesExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReactivePortal: Story = {};
