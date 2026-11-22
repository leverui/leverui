import { Button, Field, Input, Theme } from '@leverui/components';
import { createSignal } from 'solid-js';
import type { JSX } from '@solidjs/web';

/** Show a styled control, a labeled field, and reactive Solid state. */
export function App(): JSX.Element {
  const [clicks, setClicks] = createSignal(0);

  /** Update the visible count after a native button activation. */
  function increment(): void {
    setClicks(clicks() + 1);
  }

  return (
    <main class="page">
      <Theme appearance="light" class="demo-panel">
        <h1>Lever UI in Solid</h1>
        <p>Customize public CSS variables in your own stylesheet.</p>
        <Field.Root id="email">
          <Field.Label>Email address</Field.Label>
          <Input type="email" placeholder="you@example.com" />
          <Field.HelperText>Labels and help text stay connected to the input.</Field.HelperText>
        </Field.Root>
        <Button colorPalette="blue" onClick={increment}>
          Clicked {clicks()} times
        </Button>
      </Theme>
    </main>
  );
}
