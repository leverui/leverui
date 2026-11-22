import { VisuallyHidden, type VisuallyHiddenProps } from '@leverui/components';
import { type JSX } from '@solidjs/web';

type GetChildProps = Parameters<NonNullable<VisuallyHiddenProps['asChild']>>[0];

/** Render the installed hidden input without a span wrapper. */
function renderInput(getProps: GetChildProps): JSX.Element {
  return (
    <input {...getProps()} id="packed-hidden-input" type="text" aria-label="Packed hidden input" />
  );
}

/** Exercise hidden button text and child composition from the installed package. */
export function PackedVisuallyHidden(): JSX.Element {
  return (
    <section id="packed-visually-hidden">
      <button id="packed-notifications" type="button">
        4 <VisuallyHidden id="packed-hidden-text">Unread messages</VisuallyHidden>
      </button>
      <VisuallyHidden asChild={renderInput} data-packed-parent="true" />
    </section>
  );
}
