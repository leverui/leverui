import { cleanup, render } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { afterEach, expect, it } from 'vitest';
import { Dialog } from '../components/dialog/index';
import { Popover } from '../components/popover/index';

afterEach(cleanup);

/** Read a content element's aria references, and whether each points at a rendered id. */
function references(content: Element | null): Record<string, boolean> {
  const found: Record<string, boolean> = {};
  for (const name of ['aria-labelledby', 'aria-describedby']) {
    const id = content?.getAttribute(name);
    if (id) found[name] = document.getElementById(id) !== null;
  }
  return found;
}

/**
 * A popover that renders its title and description points at both; one with neither points
 * at nothing. Rendering the parts must not throw: they count themselves in while rendering,
 * when Solid 2 forbids writing reactive state.
 */
function verifiesPopoverReferences(): void {
  const labelled = render(
    /** Render an open popover with both labelling parts. */
    () => (
      <Popover.Root defaultOpen>
        <Popover.Content data-testid="labelled">
          <Popover.Title>Share</Popover.Title>
          <Popover.Description>Invite people.</Popover.Description>
        </Popover.Content>
      </Popover.Root>
    ),
  );
  flush();
  expect(references(labelled.getByTestId('labelled'))).toEqual({
    'aria-labelledby': true,
    'aria-describedby': true,
  });
  cleanup();

  const bare = render(
    /** Render an open popover with no labelling parts. */
    () => (
      <Popover.Root defaultOpen>
        <Popover.Content data-testid="bare" aria-label="Help">
          Plain content
        </Popover.Content>
      </Popover.Root>
    ),
  );
  flush();
  expect(references(bare.getByTestId('bare'))).toEqual({});
}

/** A dialog with a title only points at its title, and not at a missing description. */
function verifiesDialogReferences(): void {
  const view = render(
    /** Render an open dialog with a title only. */
    () => (
      <Dialog.Root defaultOpen>
        <Dialog.Content data-testid="dialog">
          <Dialog.Title>Delete file</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>
    ),
  );
  flush();
  expect(references(view.getByTestId('dialog'))).toEqual({ 'aria-labelledby': true });
}

it('Popover content references only the labelling parts it renders', verifiesPopoverReferences);
it('Dialog content references only the labelling parts it renders', verifiesDialogReferences);
