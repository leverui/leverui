import { Accordion } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Use provider render defaults around a caller-owned installed machine. */
function PackedInheritedAccordion(): JSX.Element {
  const machine = Accordion.useAccordion();
  return (
    <Accordion.PropsProvider value={{ lazyMount: true }}>
      <Accordion.RootProvider value={machine}>
        <Accordion.Item value="inherited">
          <Accordion.ItemTrigger data-testid="packed-accordion-inherited">
            Inherited packed panel
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Packed inherited content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.RootProvider>
    </Accordion.PropsProvider>
  );
}

/** Exercise the installed Accordion namespace and authored presentation. */
export function PackedAccordion(): JSX.Element {
  return (
    <div class="packed-accordion">
      <Accordion.Root collapsible defaultValue={['second']}>
        <Accordion.Item value="first">
          <Accordion.ItemTrigger data-testid="packed-accordion-first">
            First packed panel
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>First packed content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item value="second">
          <Accordion.ItemTrigger data-testid="packed-accordion-second">
            Second packed panel
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>Second packed content</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
      <PackedInheritedAccordion />
    </div>
  );
}

/** Type-check primitive's `render` contract and its exclusivity on installed parts. */
export function PackedAccordionRenderTypes(): JSX.Element {
  return (
    <Accordion.Root>
      <Accordion.Item value="typed" render={(props) => <section {...props()} />}>
        <Accordion.ItemTrigger render={(props) => <button {...props()} />} />
        <Accordion.ItemContent>
          {/* @ts-expect-error `render` and `asChild` cannot be combined. */}
          <Accordion.ItemBody
            render={(props) => <div {...props()} />}
            asChild={(props) => <div {...props()} />}
          />
          {/* @ts-expect-error `render` and `as` cannot be combined. */}
          <Accordion.ItemBody as="section" render={(props) => <div {...props()} />} />
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
