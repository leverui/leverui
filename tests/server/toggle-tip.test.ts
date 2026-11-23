import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  CloseButton as CloseButtonExport,
  InfoTip as InfoTipExport,
  ToggleTip as ToggleTipExport,
} from '../../src';

type ServerComponents = {
  CloseButton: typeof CloseButtonExport;
  InfoTip: typeof InfoTipExport;
  ToggleTip: typeof ToggleTipExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a ToggleTip on the server, with a Close Button as its trigger. */
function renderToggleTip(defaultOpen: boolean): string {
  return renderToString(
    /** Create the tip inside the server render. */
    (): JSX.Element =>
      createComponent(server.ToggleTip, {
        content: 'Drafts sync every minute.',
        defaultOpen,
        portalled: false,
        /** Render the trigger with the tip's props. */
        children: (getProps) => createComponent(server.CloseButton, getProps()),
      }),
  );
}

/** A closed tip renders its trigger and hidden content, wired together for assistive tech. */
function verifiesClosedToggleTip(): void {
  const markup = renderToggleTip(false);
  expect(markup).toMatch(/<button[^>]*aria-haspopup="dialog"[^>]*aria-expanded="false"/);
  expect(markup).toMatch(/aria-controls="([^"]+)"[\s\S]*id="\1"/);
  expect(markup).toMatch(/role="dialog" hidden data-state="closed"/);
  expect(markup).toContain('Drafts sync every minute.');
  expect(markup).toContain('class="lui-popover__content lui-toggle-tip"');
  // The tip is named by its aria-label and has no title or description to point at.
  expect(markup).not.toContain('aria-labelledby');
  expect(markup).not.toContain('aria-describedby');
}

/** An open tip renders its content visible and marks its trigger expanded. */
function verifiesOpenToggleTip(): void {
  const markup = renderToggleTip(true);
  expect(markup).toMatch(/aria-expanded="true" data-state="open"/);
  expect(markup).toMatch(/role="dialog" data-state="open"/);
  expect(markup).not.toMatch(/role="dialog" hidden/);
}

/** InfoTip renders a labeled icon trigger, so it has a name before any script runs. */
function verifiesInfoTip(): void {
  const markup = renderToString(
    /** Create the info tip inside the server render. */
    (): JSX.Element => createComponent(server.InfoTip, { content: 'More about billing.' }),
  );
  expect(markup).toMatch(/<button[^>]*aria-label="info"[^>]*type="button"/);
  expect(markup).toContain('aria-label="Additional information"');
  expect(markup).toContain('More about billing.');
}

test('ToggleTip renders a closed, wired-up tip on the server', verifiesClosedToggleTip);
test('ToggleTip renders an open tip on the server', verifiesOpenToggleTip);
test('InfoTip renders a labeled trigger on the server', verifiesInfoTip);
