import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { SegmentGroup as SegmentGroupExport } from '../../src';

type ServerComponents = {
  SegmentGroup: typeof SegmentGroupExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the public Segment Group composition through the server package. */
function renderServerSegmentGroup(): string {
  return renderToString(
    /** Create the primitive's radio machine without a styling provider. */
    () =>
      createComponent(server.SegmentGroup.Root as Component<Record<string, unknown>>, {
        name: 'framework',
        defaultValue: 'Solid',
        'aria-label': 'Framework',
        /** Keep items beneath the machine root and the primitive context. */
        get children() {
          return [
            createComponent(server.SegmentGroup.Indicator, {}),
            createComponent(server.SegmentGroup.Items, { items: ['React', 'Solid'] }),
          ];
        },
      }),
  );
}

/** Retain orientation, selected state, form semantics, and style classes in SSR. */
function verifiesServerSegmentGroup(): void {
  const markup = renderServerSegmentGroup();
  // The primitive keeps SegmentGroup on the radio group's part attributes.
  expect(markup).toContain('data-radio-group-root');
  expect(markup).toContain('lui-segment-group__root');
  expect(markup).toContain('lui-segment-group__indicator');
  expect(markup).toContain('data-orientation="horizontal"');
  expect(markup).toContain('data-size="md"');
  expect(markup).toContain('data-state="checked"');
  expect(markup).toContain('type="radio"');
  expect(markup).toContain('Solid');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size)=/);
}

test('published Segment Group renders selected native radios', verifiesServerSegmentGroup);
