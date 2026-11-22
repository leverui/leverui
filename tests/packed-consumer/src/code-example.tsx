import { Code, CodePropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Code and a consumer-authored CSS override. */
export function PackedCode(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change inherited Code size without remounting the element. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <Code id="packed-code-solid" variant="solid" colorPalette="blue" title="Build command">
        npm run build
      </Code>
      <CodePropsProvider
        value={{ size: large() ? 'lg' : 'xs', variant: 'outline', class: 'provider-code' }}
      >
        <Code id="packed-code-inherited">Inherited code</Code>
        <Code class="fixed-code" id="packed-code-fixed" size="sm">
          Fixed code
        </Code>
      </CodePropsProvider>
      <Code class="packed-code-custom" id="packed-code-custom">
        Configured code
      </Code>
      <Code id="packed-code-override" variant="outline" size="sm">
        Explicit code
      </Code>
      <button id="packed-code-toggle" type="button" onClick={toggleSize}>
        Change Code
      </button>
    </>
  );
}
