import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  DialogContent as DialogContentExport,
  DialogDescription as DialogDescriptionExport,
  DialogRoot as DialogRootExport,
  DialogTitle as DialogTitleExport,
  PopoverContent as PopoverContentExport,
  PopoverDescription as PopoverDescriptionExport,
  PopoverRoot as PopoverRootExport,
  PopoverTitle as PopoverTitleExport,
} from '../../src';

type ServerComponents = {
  DialogContent: typeof DialogContentExport;
  DialogDescription: typeof DialogDescriptionExport;
  DialogRoot: typeof DialogRootExport;
  DialogTitle: typeof DialogTitleExport;
  PopoverContent: typeof PopoverContentExport;
  PopoverDescription: typeof PopoverDescriptionExport;
  PopoverRoot: typeof PopoverRootExport;
  PopoverTitle: typeof PopoverTitleExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Which labelling parts a test renders inside the content. */
interface LabelChoice {
  readonly title: boolean;
  readonly description: boolean;
}

/** Render an open Popover with the chosen labelling parts. */
function renderPopover(choice: LabelChoice): string {
  return renderToString(
    /** Create the popover inside the server render. */
    (): JSX.Element =>
      createComponent(server.PopoverRoot, {
        defaultOpen: true,
        /** Place the content under the root. */
        get children() {
          return createComponent(server.PopoverContent, {
            /** Render only the chosen parts. */
            get children() {
              return [
                choice.title && createComponent(server.PopoverTitle, { children: 'Share' }),
                choice.description &&
                  createComponent(server.PopoverDescription, { children: 'Invite people.' }),
              ];
            },
          });
        },
      }),
  );
}

/** Render an open Dialog with the chosen labelling parts. */
function renderDialog(choice: LabelChoice): string {
  return renderToString(
    /** Create the dialog inside the server render. */
    (): JSX.Element =>
      createComponent(server.DialogRoot, {
        defaultOpen: true,
        /** Place the content under the root. */
        get children() {
          return createComponent(server.DialogContent, {
            /** Render only the chosen parts. */
            get children() {
              return [
                choice.title && createComponent(server.DialogTitle, { children: 'Delete' }),
                choice.description &&
                  createComponent(server.DialogDescription, { children: 'This cannot be undone.' }),
              ];
            },
          });
        },
      }),
  );
}

/** Read the content element's aria references, and whether each points at a rendered id. */
function references(markup: string, contentClass: string): Record<string, boolean> {
  const content = new RegExp(`<div[^>]*${contentClass}[^>]*>`).exec(markup)?.[0] ?? '';
  const found: Record<string, boolean> = {};
  for (const name of ['aria-labelledby', 'aria-describedby']) {
    const id = new RegExp(`${name}="([^"]+)"`).exec(content)?.[1];
    if (id) found[name] = markup.includes(`id="${id}"`);
  }
  return found;
}

const cases: readonly [string, LabelChoice, Record<string, boolean>][] = [
  [
    'both parts',
    { title: true, description: true },
    { 'aria-labelledby': true, 'aria-describedby': true },
  ],
  ['a title only', { title: true, description: false }, { 'aria-labelledby': true }],
  ['a description only', { title: false, description: true }, { 'aria-describedby': true }],
  ['neither part', { title: false, description: false }, {}],
];

/**
 * The server HTML references a title or description only when it is rendered, and every
 * reference points at an element that exists.
 */
function verifiesPopoverReferences(): void {
  for (const [, choice, expected] of cases) {
    expect(references(renderPopover(choice), 'lui-popover__content')).toEqual(expected);
  }
}

/** Dialog content references only the labelling parts it renders, too. */
function verifiesDialogReferences(): void {
  for (const [, choice, expected] of cases) {
    expect(references(renderDialog(choice), 'lui-dialog__content')).toEqual(expected);
  }
}

test(
  'Popover content references only the title and description it renders',
  verifiesPopoverReferences,
);
test(
  'Dialog content references only the title and description it renders',
  verifiesDialogReferences,
);
