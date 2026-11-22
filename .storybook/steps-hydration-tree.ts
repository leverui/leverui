import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  StepsCompletedContent as CompletedExport,
  StepsContent as ContentExport,
  StepsIndicator as IndicatorExport,
  StepsItem as ItemExport,
  StepsList as ListExport,
  StepsNextTrigger as NextExport,
  StepsRoot as RootExport,
  StepsTrigger as TriggerExport,
} from '../src';

export interface StepsHydrationComponents {
  StepsCompletedContent: typeof CompletedExport;
  StepsContent: typeof ContentExport;
  StepsIndicator: typeof IndicatorExport;
  StepsItem: typeof ItemExport;
  StepsList: typeof ListExport;
  StepsNextTrigger: typeof NextExport;
  StepsRoot: typeof RootExport;
  StepsTrigger: typeof TriggerExport;
}

/** Build the same Steps machine tree for published SSR and client hydration. */
export function renderStepsHydrationTree(components: StepsHydrationComponents): JSX.Element {
  return createComponent(components.StepsRoot, {
    items: [{ value: 'step-0' }, { value: 'step-1' }],
    defaultValue: 'step-0',
    'aria-label': 'Hydrated setup',
    /** Keep item, panel, and trigger order stable across hydration. */
    get children(): JSX.Element {
      return [
        createComponent(components.StepsList, {
          /** Render matching item indices and linked tab triggers. */
          get children(): JSX.Element {
            return [0, 1].map(
              /** Build one indexed item with its default indicator. */
              (index) =>
                createComponent(components.StepsItem, {
                  value: `step-${index}`,
                  /** Nest the indicator beneath its primitive item context. */
                  get children(): JSX.Element {
                    return createComponent(components.StepsTrigger, {
                      'data-testid': `hydrated-step-trigger-${index}`,
                      /** Keep the default status inside its labeled tab. */
                      get children(): JSX.Element {
                        return [
                          createComponent(components.StepsIndicator, {}),
                          index === 0 ? 'Account' : 'Review',
                        ];
                      },
                    });
                  },
                }),
            );
          },
        }),
        createComponent(components.StepsContent, { value: 'step-0', children: 'Account panel' }),
        createComponent(components.StepsContent, { value: 'step-1', children: 'Review panel' }),
        createComponent(components.StepsCompletedContent, { children: 'Setup complete' }),
        createComponent(components.StepsNextTrigger, {
          'data-testid': 'hydrated-step-next',
          children: 'Next step',
        }),
      ];
    },
  });
}
