import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ActionBar, Portal, Theme } from '../src';
import type { ActionBarOpenChangeDetails } from '../src';

/** Exercise an explicit theme bridge around a body-mounted Action Bar. */
function PortalScopeStory(): JSX.Element {
  const [dark, setDark] = createSignal(true);

  /** Switch the source scope and the matching portal bridge together. */
  function toggleMode(): void {
    setDark(!dark());
  }

  /** Show that a caller ref reaches the portalled positioner. */
  function capturePositioner(element: Element): void {
    element.setAttribute('data-caller-ref', 'attached');
  }

  return (
    <>
      <Theme appearance={dark() ? 'dark' : 'light'} data-testid="action-bar-source-theme">
        <button type="button" onClick={toggleMode}>
          Toggle scope
        </button>
        <ActionBar.Root defaultOpen closeOnInteractOutside={false}>
          <Portal>
            <Theme
              appearance={dark() ? 'dark' : 'light'}
              hasBackground={false}
              data-testid="action-bar-portal-theme"
            >
              <ActionBar.Positioner
                ref={capturePositioner}
                data-testid="action-bar-scoped-positioner"
              >
                <ActionBar.Content
                  aria-label="Scoped actions"
                  data-testid="action-bar-scoped-content"
                >
                  <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                </ActionBar.Content>
              </ActionBar.Positioner>
            </Theme>
          </Portal>
        </ActionBar.Root>
      </Theme>
    </>
  );
}

/** Exercise outside dismissal, focus return, and presence lifecycle callbacks. */
function OutsideDismissalStory(): JSX.Element {
  const [open, setOpen] = createSignal(true);
  const [enterCount, setEnterCount] = createSignal(0);
  const [exitCount, setExitCount] = createSignal(0);
  const [escapeCount, setEscapeCount] = createSignal(0);
  let focusTarget: HTMLButtonElement | undefined;

  /** Keep the external selection state in sync with the primitive dismissal. */
  function changeOpen(details: ActionBarOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Reopen the controlled bar for another dismissal route. */
  function reopen(): void {
    setOpen(true);
  }

  /** Return focus to the caller's external control after dismissal. */
  function finalFocus(): HTMLButtonElement | null {
    return focusTarget ?? null;
  }

  /** Count one observed lifecycle or dismissable-layer event. */
  function incrementEventCount(count: number): number {
    return count + 1;
  }

  /** Record the completed exit after the primitive's presence transition. */
  function recordExit(): void {
    setExitCount(incrementEventCount);
  }

  /** Record a completed enter before testing the dismissable layer. */
  function recordEnter(): void {
    setEnterCount(incrementEventCount);
  }

  /** Record Escape notifications from the Zag dismissable layer. */
  function recordEscape(): void {
    setEscapeCount(incrementEventCount);
  }

  return (
    <>
      <div style={{ padding: '32px', 'min-height': '420px' }}>
        <button type="button" ref={focusTarget} onClick={reopen} data-testid="action-bar-reopen">
          Reopen actions
        </button>
        <button type="button" data-testid="action-bar-outside">
          Outside target
        </button>
        <output data-testid="action-bar-exit-count">{exitCount()}</output>
        <output data-testid="action-bar-enter-count">{enterCount()}</output>
        <output data-testid="action-bar-escape-count">{escapeCount()}</output>
        <ActionBar.Root
          open={open()}
          onOpenChange={changeOpen}
          finalFocusEl={finalFocus}
          onExitComplete={recordExit}
          onEnterComplete={recordEnter}
          onEscapeKeyDown={recordEscape}
        >
          <ActionBar.Context>
            {
              /** Expose the current primitive state while the controlled bar reopens. */
              (api) => (
                <output data-testid="action-bar-machine-state">
                  {api().open ? 'open' : 'closed'}
                </output>
              )
            }
          </ActionBar.Context>
          <ActionBar.Positioner>
            <ActionBar.Content
              aria-label="Outside actions"
              data-testid="action-bar-outside-content"
            >
              <ActionBar.SelectionTrigger>1 selected</ActionBar.SelectionTrigger>
              <ActionBar.CloseTrigger aria-label="Close outside actions">×</ActionBar.CloseTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
      </div>
    </>
  );
}

/** Exercise close behavior with a machine owned outside the styled root. */
function CallerOwnedStory(): JSX.Element {
  const machine = ActionBar.useActionBar({ defaultOpen: true });

  return (
    <>
      <ActionBar.RootProvider value={machine}>
        <ActionBar.Positioner>
          <ActionBar.Content aria-label="Caller-owned actions" data-testid="caller-action-bar">
            <ActionBar.CloseTrigger aria-label="Close caller-owned actions">
              Close
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </ActionBar.RootProvider>
    </>
  );
}

const meta = {
  title: 'Components/Action Bar Behavior',
  component: PortalScopeStory,
} satisfies Meta<typeof PortalScopeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PortalScope: Story = { render: PortalScopeStory };
export const OutsideDismissal: Story = { render: OutsideDismissalStory };
export const CallerOwned: Story = { render: CallerOwnedStory };
