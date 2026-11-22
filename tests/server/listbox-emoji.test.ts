import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Listbox as ListboxExport, createGridCollection as GridExport } from '../../src';

type ServerComponents = {
  Listbox: typeof ListboxExport;
  createGridCollection: typeof GridExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a selected grid option through the published server entry. */
function renderEmojiGrid(): string {
  const emoji = { hexcode: '1F600', label: 'grinning face', unicode: '😀' };
  const collection = server.createGridCollection({
    columnCount: 8,
    items: [emoji],
    /** Keep a stable string identity for the grid option. */
    itemToValue: (item) => item.hexcode,
    /** Give the machine human-readable option text. */
    itemToString: (item) => item.label,
  });
  return renderToString(
    /** Provide the package's theme and Listbox contexts during SSR. */
    () =>
      createComponent(server.Listbox.Root, {
        collection,
        defaultValue: ['1F600'],
        /** Keep the label and option under the same machine. */
        get children() {
          return [
            createComponent(server.Listbox.Label, { children: 'Emojis' }),
            createComponent(server.Listbox.Content, {
              /** Render the selected option with the guide's accessible name. */
              get children() {
                return createComponent(server.Listbox.List, {
                  /** Render the option inside the primitive's listbox. */
                  get children() {
                    return createComponent(server.Listbox.Item, {
                      item: emoji,
                      'aria-label': emoji.label,
                      children: emoji.unicode,
                    });
                  },
                });
              },
            }),
          ];
        },
      }),
  );
}

/** Confirm public grid collection selection survives server rendering. */
function verifiesServerEmojiGrid(): void {
  const html = renderEmojiGrid();
  expect(html).toContain('aria-label="grinning face"');
  expect(html).toContain('aria-selected="true"');
  expect(html).toContain('😀');
  expect(html).toContain('leverui-listbox__item');
}

test('published server entry renders a selected emoji grid option', verifiesServerEmojiGrid);

/** Verify row jumps against the public helper's eight-column positions. */
function verifiesEightColumnGrid(): void {
  const items = Array.from(
    { length: 17 },
    /** Give each position a stable value and accessible string. */
    (_, index) => ({ label: `Emoji ${index + 1}`, value: `emoji-${index + 1}` }),
  );
  const grid = server.createGridCollection({ columnCount: 8, items });
  expect(grid.getRowCount()).toBe(3);
  expect(grid.getCell(0, 7)?.value).toBe('emoji-8');
  expect(grid.getCell(1, 0)?.value).toBe('emoji-9');
  expect(grid.getValueCell('emoji-9')).toEqual({ row: 1, column: 0 });
  expect(grid.getNextRowValue('emoji-1')).toBe('emoji-9');
}

test('published grid collection preserves eight-column row navigation', verifiesEightColumnGrid);
