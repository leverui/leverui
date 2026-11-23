import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Slider as SliderExport } from '../../src';

type ServerComponents = {
  Slider: typeof SliderExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Slider entry with a labeled native form control. */
function renderServerSlider(): string {
  return renderToString(
    /** Create the primitive's Slider machine in the server owner. */
    () =>
      createComponent(server.Slider.Root as Component<Record<string, unknown>>, {
        name: 'volume',
        defaultValue: [30],
        /** Preserve label, track, thumb, and native input order. */
        get children() {
          return [
            createComponent(server.Slider.Label, { children: 'Volume' }),
            createComponent(server.Slider.Control, {
              /** Place a thumb and selected range on one control. */
              get children() {
                return [
                  createComponent(server.Slider.Track, {
                    children: createComponent(server.Slider.Range, {}),
                  }),
                  createComponent(server.Slider.Thumb, {
                    index: 0,
                    /** Create the native input after the primitive supplies its thumb context. */
                    get children() {
                      return createComponent(server.Slider.HiddenInput, {});
                    },
                  }),
                ];
              },
            }),
          ];
        },
      }),
  );
}

/** Preserve machine semantics and strip recipe-only props on the server. */
function verifiesServerSlider(): void {
  const markup = renderServerSlider();
  expect(markup).toContain('data-slider-');
  expect(markup).toContain('lui-slider__root');
  expect(markup).toContain('lui-slider__thumb');
  expect(markup).toContain('role="slider"');
  expect(markup).toContain('aria-valuenow="30"');
  expect(markup).toContain('name="volume"');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size|variant)=/);
}

test('published Slider renders its labeled thumb and native form control', verifiesServerSlider);
