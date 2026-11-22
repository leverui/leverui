import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Input,
  Portal,
  type CheckboxCheckedChangeDetails,
  type CheckboxCheckedState,
  type DialogOpenChangeDetails,
} from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise packaged field, selection, and overlay APIs in a real Solid app. */
export function PackedInteractions(): JSX.Element {
  const [checked, setChecked] = createSignal<CheckboxCheckedState>(false);
  const [open, setOpen] = createSignal(false);

  /** Translate the packaged Checkbox event into controlled Solid state. */
  function updateChecked(details: CheckboxCheckedChangeDetails): void {
    setChecked(details.checked);
  }

  /** Translate the packaged Dialog event into controlled Solid state. */
  function updateOpen(details: DialogOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Direct the primitive's initial modal focus to the consumer's native input. */
  function initialFocus(): HTMLElement | null {
    return document.querySelector('[data-testid="packed-dialog-input"]');
  }

  return (
    <section aria-label="Packed interaction examples">
      <form data-testid="packed-input-form">
        <Input aria-label="Packed name" defaultValue="draft" data-testid="packed-input" />
        <button type="reset" data-testid="packed-input-reset">
          Reset name
        </button>
      </form>
      <form data-testid="packed-checkbox-form">
        <CheckboxRoot
          checked={checked()}
          onCheckedChange={updateChecked}
          name="packed-choice"
          value="yes"
          data-testid="packed-checkbox-root"
        >
          <CheckboxControl />
          <CheckboxLabel>Packed consent</CheckboxLabel>
          <CheckboxHiddenInput data-testid="packed-checkbox-input" />
        </CheckboxRoot>
      </form>
      <DialogRoot open={open()} onOpenChange={updateOpen} initialFocusEl={initialFocus}>
        <DialogTrigger data-testid="packed-dialog-trigger">Open packed dialog</DialogTrigger>
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent data-testid="packed-dialog-content">
              <DialogTitle>Packed dialog</DialogTitle>
              <DialogDescription>Installed portal and focus</DialogDescription>
              <input data-testid="packed-dialog-input" aria-label="Packed dialog input" />
              <DialogCloseTrigger data-testid="packed-dialog-close">
                Close packed dialog
              </DialogCloseTrigger>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </section>
  );
}
