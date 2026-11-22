import { createComponent } from 'solid-js';
import type { StepsItem } from '../../src/primitives/components/steps/steps-item';
import type { StepsRoot } from '../../src/primitives/components/steps/steps-root';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  StepsNumber as NumberExport,
  StepsPropsProvider as DefaultsExport,
  StepsRootProvider as RootProviderExport,
  StepsStatus as StatusExport,
  useSteps as UseStepsExport,
} from '../../src';

type ServerComponents = {
  StepsNumber: typeof NumberExport;
  StepsPropsProvider: typeof DefaultsExport;
  StepsRootProvider: typeof RootProviderExport;
  StepsStatus: typeof StatusExport;
  useSteps: typeof UseStepsExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;
// The Steps primitives from the same server build, so the helpers share their item context.
const stepsRoot = '../../dist/server/primitives/components/steps/steps-root.js';
const stepsItem = '../../dist/server/primitives/components/steps/steps-item.js';
const PrimitiveSteps = {
  Root: ((await import(stepsRoot)) as { StepsRoot: typeof StepsRoot }).StepsRoot,
  Item: ((await import(stepsItem)) as { StepsItem: typeof StepsItem }).StepsItem,
};

/** Render conflicting defaults around a caller-owned horizontal machine. */
function renderExternalMachine(): string {
  return renderToString(
    /** Create the Steps machine in one server owner. */
    () => {
      const machine = server.useSteps({ items: [{ value: 'only' }], orientation: 'horizontal' });
      return createComponent(server.StepsPropsProvider, {
        value: { orientation: 'vertical' },
        /** Require the provider root to follow the machine. */
        get children(): JSX.Element {
          return createComponent(server.StepsRootProvider, { value: machine });
        },
      });
    },
  );
}

/** Confirm the root and ARIA direction follow the machine's orientation. */
function verifiesExternalOrientation(): void {
  const markup = renderExternalMachine();
  const root = markup.match(/<div[^>]*data-steps-root[^>]*>/)?.[0];
  expect(root).toContain('data-orientation="horizontal"');
  expect(root).not.toMatch(/\sorientation=/);
}

test(
  'published RootProvider does not forward conflicting orientation',
  verifiesExternalOrientation,
);

/** Render standalone number and status helpers beneath the primitive item contexts. */
function renderStandaloneHelpers(): string {
  return renderToString(
    /** Render the isolated Step without a Steps root. */
    () =>
      createComponent(PrimitiveSteps.Root, {
        items: [{ value: 'first' }, { value: 'second' }],
        defaultValue: 'first',
        /** Render current number and future-step fallback. */
        get children(): JSX.Element {
          return [
            createComponent(PrimitiveSteps.Item, {
              value: 'first',
              /** Read the current item's one-based index. */
              get children(): JSX.Element {
                return createComponent(server.StepsNumber<'span'>, { as: 'span' });
              },
            }),
            createComponent(PrimitiveSteps.Item, {
              value: 'second',
              /** Fall back to current when incomplete is null. */
              get children(): JSX.Element {
                return createComponent(server.StepsStatus, {
                  complete: 'Complete',
                  incomplete: null,
                  current: 'Future fallback',
                });
              },
            }),
          ];
        },
      }),
  );
}

/** Check both helpers in the package's published server bundle. */
function verifiesStandaloneHelpers(): void {
  const markup = renderStandaloneHelpers();
  expect(markup).toMatch(/<span[^>]*>1<\/span>/);
  expect(markup).toContain('Future fallback');
}

test(
  'published standalone Steps helpers render under the primitive contexts',
  verifiesStandaloneHelpers,
);
