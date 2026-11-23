import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  FloatingPanelBody,
  FloatingPanelContent,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelRoot,
  FloatingPanelTitle,
} from '@leverui/components';

/** Render an initially open Floating Panel from the installed server bundle. */
function renderPanel() {
  return createComponent(FloatingPanelRoot, {
    defaultOpen: true,
    /** Put the visible panel under its primitive presence context. */
    get children() {
      return createComponent(FloatingPanelPositioner, {
        /** Render the named panel and layout slots. */
        get children() {
          return createComponent(FloatingPanelContent, {
            /** Keep the heading and body inside the dialog. */
            get children() {
              return [
                createComponent(FloatingPanelHeader, {
                  /** Give the installed panel an accessible title. */
                  get children() {
                    return createComponent(FloatingPanelTitle, { children: 'Installed panel' });
                  },
                }),
                createComponent(FloatingPanelBody, { children: 'Server body' }),
              ];
            },
          });
        },
      });
    },
  });
}

const markup = renderToString(renderPanel);
assert.match(markup, /role="dialog"/);
assert.match(markup, /aria-labelledby="[^"]+"/);
assert.match(markup, /<h2\b[^>]*lui-floating-panel__title/);
assert.match(markup, /lui-floating-panel__content/);
assert.match(markup, /lui-floating-panel__header/);
assert.match(markup, /lui-floating-panel__body/);
assert.match(markup, /Installed panel/);
assert.match(markup, /Server body/);
