import { type JSX } from '@solidjs/web';
import { CheckIcon, PencilLineIcon, XIcon } from '@lucide/solid';
import { Editable, IconButton } from '../../src';

/** Render the edit, cancel, and submit icon buttons. */
export function EditableWithControls(): JSX.Element {
  return (
    <Editable.Root defaultValue="Click to edit">
      <Editable.Preview />
      <Editable.Input />
      <Editable.Control>
        <Editable.EditTrigger
          asChild={
            /** Preserve edit semantics on the styled icon button. */
            (getProps) => (
              <IconButton {...getProps()} aria-label="edit" variant="ghost" size="xs">
                <PencilLineIcon />
              </IconButton>
            )
          }
        />
        <Editable.CancelTrigger
          asChild={
            /** Preserve cancel semantics on the styled icon button. */
            (getProps) => (
              <IconButton {...getProps()} aria-label="cancel" variant="outline" size="xs">
                <XIcon />
              </IconButton>
            )
          }
        />
        <Editable.SubmitTrigger
          asChild={
            /** Preserve submit semantics on the styled icon button. */
            (getProps) => (
              <IconButton {...getProps()} aria-label="submit" variant="outline" size="xs">
                <CheckIcon />
              </IconButton>
            )
          }
        />
      </Editable.Control>
    </Editable.Root>
  );
}
