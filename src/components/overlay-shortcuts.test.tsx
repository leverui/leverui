import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { Button, InfoTip, ToggleTip, Tooltip, TooltipRoot, TooltipTrigger } from '../index';

/** Supply the layout observer unavailable in jsdom's DOM implementation. */
class TestResizeObserver implements ResizeObserver {
  /** Ignore layout changes in source rendering checks. */
  observe(): void {}
  /** Ignore removed elements in source rendering checks. */
  unobserve(): void {}
  /** Release all observed elements in source rendering checks. */
  disconnect(): void {}
}

beforeAll(
  /** Install the observer that popover positioning uses. */
  () => vi.stubGlobal('ResizeObserver', TestResizeObserver),
);
afterEach(cleanup);
afterAll(
  /** Restore the DOM environment after these checks. */
  () => vi.unstubAllGlobals(),
);

/** Keep the parts reachable from the same name as the shortcut. */
function verifiesTooltipNamespace(): void {
  expect(typeof Tooltip).toBe('function');
  expect(Tooltip.Root).toBe(TooltipRoot);
  expect(Tooltip.Trigger).toBe(TooltipTrigger);
}

/** Put the tooltip's trigger attributes on the caller's element. */
function verifiesTooltipTrigger(): void {
  render(
    /** Wrap one button with the shortcut. */
    () => (
      <Tooltip content="Save file">{(getProps) => <Button {...getProps()}>Save</Button>}</Tooltip>
    ),
  );
  const trigger = screen.getByRole('button', { name: 'Save' });
  expect(trigger.hasAttribute('data-tooltip-trigger')).toBe(true);
}

/** Open the compact popover from its trigger and label the surface. */
async function verifiesToggleTip(): Promise<void> {
  render(
    /** Wrap one button with a toggle tip. */
    () => (
      <ToggleTip content="Encrypted at rest">
        {(getProps) => <Button {...getProps()}>Details</Button>}
      </ToggleTip>
    ),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Details' }));
  const content = await screen.findByText('Encrypted at rest');
  const surface = content.closest('.leverui-popover__content');
  expect(surface?.classList.contains('leverui-toggle-tip')).toBe(true);
  expect(surface?.getAttribute('aria-label')).toBe('Additional information');
}

/** Render the info button with its own label and icon. */
function verifiesInfoTip(): void {
  render(
    /** Mount one info tip. */
    () => <InfoTip>Max 5 files</InfoTip>,
  );
  const button = screen.getByRole('button', { name: 'info' });
  expect(button.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
}

it('exposes Tooltip parts on the shortcut', verifiesTooltipNamespace);
it('passes Tooltip trigger attributes to the child', verifiesTooltipTrigger);
it('opens ToggleTip content with its compact class', verifiesToggleTip);
it('renders InfoTip as a labelled icon button', verifiesInfoTip);
