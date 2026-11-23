import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  StepsContent as ContentExport,
  StepsIndicator as IndicatorExport,
  StepsItem as ItemExport,
  StepsList as ListExport,
  StepsRoot as RootExport,
  StepsTitle as TitleExport,
} from '../../src';

type ServerComponents = {
  StepsContent: typeof ContentExport;
  StepsIndicator: typeof IndicatorExport;
  StepsItem: typeof ItemExport;
  StepsList: typeof ListExport;
  StepsRoot: typeof RootExport;
  StepsTitle: typeof TitleExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a complete Steps composition through the provider-free server entry. */
function renderServerSteps(): string {
  return renderToString(
    /** Construct the machine without a presentation provider. */
    () =>
      createComponent(server.StepsRoot, {
        items: [{ value: 'setup' }],
        defaultValue: 'setup',
        'aria-label': 'Setup progress',
        /** Render a labeled item and matching content. */
        get children(): JSX.Element {
          return [
            createComponent(server.StepsList, {
              /** Nest the item under the primitive's list. */
              get children(): JSX.Element {
                return createComponent(server.StepsItem, {
                  value: 'setup',
                  /** Read the item context for its default number. */
                  get children(): JSX.Element {
                    return [
                      createComponent(server.StepsIndicator, {}),
                      createComponent(server.StepsTitle, { children: 'Setup' }),
                    ];
                  },
                });
              },
            }),
            createComponent(server.StepsContent, { value: 'setup', children: 'Setup details' }),
          ];
        },
      }),
  );
}

/** Confirm the primitive state and stable classes without inserted presentation CSS. */
function verifiesServerMarkup(): void {
  const markup = renderServerSteps();
  expect(markup).toContain('aria-label="Setup progress"');
  expect(markup).toContain('lui-steps__root');
  expect(markup).toContain('lui-steps__indicator');
  expect(markup).toContain('Setup details');
}

test('published Steps renders labeled server markup', verifiesServerMarkup);
