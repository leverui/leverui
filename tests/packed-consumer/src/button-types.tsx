import { Button, ButtonPropsProvider, CloseButton, IconButton } from '@leverui/components';

export const nativeActions = (
  <ButtonPropsProvider value={{ size: 'sm', variant: 'outline' }}>
    <Button
      size={{ base: 'xs', md: 'lg' }}
      variant={{ base: 'ghost', md: 'solid' }}
      colorPalette="blue"
      class="consumer-action"
      style={{ 'min-width': '8rem' }}
    >
      Save
    </Button>
    <Button
      as="a"
      href="/docs"
      ref={
        /** Preserve the selected anchor's exact ref type. */
        (element: HTMLAnchorElement) => {
          element.dataset.ready = 'true';
        }
      }
    >
      Read docs
    </Button>
    <IconButton aria-label="More" class="consumer-icon-action">
      ⋯
    </IconButton>
    <CloseButton style={{ color: 'rebeccapurple' }} />
  </ButtonPropsProvider>
);

export const invalidActions = (
  <>
    {/* @ts-expect-error Button no longer accepts object CSS. */}
    <Button css={{ padding: 2 }}>Old style</Button>
    {/* @ts-expect-error Button no longer accepts a custom recipe. */}
    <Button recipe={{}}>Old recipe</Button>
    {/* @ts-expect-error Button rejects arbitrary style shortcuts. */}
    <Button px="4">Old spacing</Button>
    {/* @ts-expect-error Button sizes are finite CSS choices. */}
    <Button size="3xl">Too large</Button>
    {/* @ts-expect-error Button variants are finite CSS choices. */}
    <Button variant="brand">Custom variant</Button>
  </>
);
