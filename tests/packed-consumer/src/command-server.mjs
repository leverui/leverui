import assert from 'node:assert/strict';
import { Command } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Command parts with a primitive collection on the server. */
function renderCommand() {
  return renderToString(
    /** Build the collection and root under one server owner. */
    () => {
      const command = Command.useCommandCollection({
        initialItems: [{ value: 'open', label: 'Open file' }],
      });
      return createComponent(Command.Root, {
        command,
        size: 'sm',
        /** Keep the input and result inside the machine context. */
        get children() {
          return [
            createComponent(Command.Control, {
              /** Keep the primitive's native input under its control part. */
              get children() {
                return createComponent(Command.Input, {});
              },
            }),
            createComponent(Command.List, {
              /** Render one primitive option with its stable part class. */
              get children() {
                return createComponent(Command.Item, {
                  item: { value: 'open', label: 'Open file' },
                  /** Render the result label in the primitive's text part. */
                  get children() {
                    return createComponent(Command.ItemText, { children: 'Open file' });
                  },
                });
              },
            }),
          ];
        },
      });
    },
  );
}

const markup = renderCommand();
assert.match(markup, /lui-command__root/);
assert.match(markup, /lui-command__input/);
assert.match(markup, /lui-command__item/);
assert.match(markup, /role="combobox"/);
assert.match(markup, /data-size="sm"/);
assert.doesNotMatch(markup, /\s(?:css|recipe|unstyled)=/);
console.log('Packed Command server rendering passed.');
