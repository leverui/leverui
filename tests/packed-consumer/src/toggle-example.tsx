import { Button, Toggle } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Toggle through a styled child Button. */
export function PackedToggle(): JSX.Element {
  const [pressed, setPressed] = createSignal(false);

  /** Keep consumer state synchronized with the installed machine. */
  function handlePressedChange(value: boolean): void {
    setPressed(value);
  }

  return (
    <form data-testid="packed-toggle-form">
      <Toggle.Root
        pressed={pressed()}
        onPressedChange={handlePressedChange}
        aria-label="Packed Bold"
        class="packed-toggle"
        data-testid="packed-toggle-root"
        asChild={
          /** Keep the primitive button attributes on the styled child. */
          (getProps) => (
            <Button {...getProps()} variant="subtle">
              <Toggle.Indicator fallback="Off">On</Toggle.Indicator>
            </Button>
          )
        }
      />
    </form>
  );
}
