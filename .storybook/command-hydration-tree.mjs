import { createComponent } from 'solid-js';

const actions = [
  { value: 'open', label: 'Open file' },
  { value: 'save', label: 'Save file' },
];

/** Render matching Command parts from either published runtime entry. */
export function renderCommandHydrationTree({ Command }) {
  const command = Command.useCommandCollection({ initialItems: actions });
  return createComponent(Command.Root, {
    id: 'hydrated-command',
    command,
    size: 'sm',
    class: 'consumer-command',
    style: { width: '280px' },
    /** Give the native input and options one stable root. */
    get children() {
      return [
        createComponent(Command.Label, { children: 'Hydrated Command' }),
        createComponent(Command.Control, {
          /** Keep the input's native node through client attachment. */
          get children() {
            return createComponent(Command.Input, { 'data-testid': 'hydrated-command-input' });
          },
        }),
        createComponent(Command.List, {
          /** Keep each option in the same order on server and client. */
          get children() {
            return actions.map(
              /** Render one stable primitive option from the shared collection. */
              (item) =>
                createComponent(Command.Item, {
                  item,
                  'data-testid': `hydrated-command-${item.value}`,
                  /** Keep the visible result text in the text part. */
                  get children() {
                    return createComponent(Command.ItemText, { children: item.label });
                  },
                }),
            );
          },
        }),
      ];
    },
  });
}
