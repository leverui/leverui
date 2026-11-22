import { createComponent, merge } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { CheckboxCard as CardExport, CheckboxCardIndicatorProps } from '../src';

type CardIndicatorGetProps = Parameters<NonNullable<CheckboxCardIndicatorProps['asChild']>>[0];

type CardHydrationComponents = {
  CheckboxCard: typeof CardExport;
};

/** Build the same card parts beneath both server and browser machines. */
function renderCardParts(Card: typeof CardExport, label: string, custom = false): JSX.Element[] {
  return [
    custom
      ? createComponent(Card.HiddenInput, {
          /** Keep the primitive's native input attributes on the selected element. */
          asChild: (getProps) =>
            createComponent(
              Dynamic,
              merge({ component: 'input', 'data-testid': 'hydrated-custom-input' }, getProps()),
            ),
        })
      : createComponent(Card.HiddenInput, {}),
    createComponent(Card.Control, {
      /** Keep visible parts under the primitive's control provider. */
      get children() {
        return [
          createComponent(Card.Content, {
            /** Render the machine label and supporting text. */
            get children() {
              return [
                createComponent(Card.Label, { children: label }),
                createComponent(Card.Description, { children: 'Hydrated description' }),
              ];
            },
          }),
          custom
            ? createComponent(Card.Indicator, {
                'aria-hidden': 'false' as const,
                /** Hydrate the caller-owned SVG without replacing it. */
                asChild: (getProps: CardIndicatorGetProps) =>
                  createComponent(
                    Dynamic,
                    merge({ component: 'svg', 'data-testid': 'hydrated-custom-svg' }, getProps()),
                  ),
              })
            : createComponent(Card.Indicator, {}),
        ];
      },
    }),
  ];
}

/** Build matching published-server and source-client Checkbox Card trees. */
export function renderCheckboxCardHydrationTree({
  CheckboxCard: Card,
}: CardHydrationComponents): JSX.Element {
  const external = Card.useCheckboxCard({ defaultChecked: true, name: 'external', value: 'yes' });
  return createComponent(Dynamic, {
    component: 'form',
    'data-testid': 'hydrated-card-form',
    /** Mount uncontrolled and caller-owned card machines in a stable order. */
    get children() {
      return [
        createComponent(Card.Root, {
          defaultChecked: true,
          name: 'plan',
          value: 'pro',
          /** Render a complete card under the uncontrolled machine. */
          get children() {
            return renderCardParts(Card, 'Hydrated card', true);
          },
        }),
        createComponent(Card.RootProvider, {
          value: external,
          /** Render the same part contract under the external store. */
          get children() {
            return renderCardParts(Card, 'Hydrated external card');
          },
        }),
      ];
    },
  });
}
