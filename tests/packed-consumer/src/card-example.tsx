import { Card, CardPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise published Card parts and changing provider defaults. */
export function PackedCard(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change inherited Card size without replacing the root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <CardPropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'outline' }}>
        <Card.Root id="packed-card">
          <Card.Header>
            <Card.Title>Installed card</Card.Title>
            <Card.Description>Installed description</Card.Description>
          </Card.Header>
          <Card.Body id="packed-card-body">Installed content</Card.Body>
          <Card.Footer>Installed actions</Card.Footer>
        </Card.Root>
      </CardPropsProvider>
      <Card.Root id="packed-custom-card" class="packed-custom-card">
        <Card.Title id="packed-custom-card-title">Custom CSS</Card.Title>
        <Card.Body id="packed-custom-card-body">Styled body</Card.Body>
      </Card.Root>
      <Card.Root id="packed-custom-override" variant="outline" size="sm">
        <Card.Body id="packed-custom-override-body">Explicit values</Card.Body>
      </Card.Root>
      <button id="packed-card-toggle" type="button" onClick={toggleSize}>
        Change card size
      </button>
    </>
  );
}
