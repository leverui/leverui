import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { CopyStatusCheckIcon, CopyStatusCopyIcon } from './copy-status-icons';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderClipboardPart } from './clipboard-part';
import type {
  ClipboardControlProps,
  ClipboardCopyTextProps,
  ClipboardIndicatorProps,
  ClipboardInputProps,
  ClipboardLabelProps,
  ClipboardTriggerProps,
  ClipboardValueTextProps,
} from './clipboard-part-props';

/** Render the primitive button that copies the current value. */
export function ClipboardTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: ClipboardTriggerProps<As>,
): JSX.Element {
  return renderClipboardPart({ slot: 'trigger', props });
}

/** Group the Clipboard value and its copy trigger. */
export function ClipboardControl<As extends PrimitiveNativeTag = 'div'>(
  props: ClipboardControlProps<As>,
): JSX.Element {
  return renderClipboardPart({ slot: 'control', props });
}

/** Switch between the copy and copied glyphs. */
function ClipboardIndicatorImpl(props: ClipboardIndicatorProps): JSX.Element {
  const [content, rest] = splitProps(props, ['copied', 'children']);

  /** Create caller or default confirmation content only when the primitive needs it. */
  function renderCopied(): JSX.Element {
    return content.copied === undefined ? <CopyStatusCheckIcon /> : content.copied;
  }

  const merged = mergeProps(
    {
      /** Pass a lazy branch to Solid's conditional renderer. */
      get copied() {
        return renderCopied;
      },
      /** Preserve caller content and the default copy glyph. */
      get children() {
        return <>{content.children === undefined ? <CopyStatusCopyIcon /> : content.children}</>;
      },
    },
    rest,
  );
  return renderClipboardPart({ slot: 'indicator', props: merged });
}

/** Preserve selected native element typing around the shared renderer. */
export const ClipboardIndicator = ClipboardIndicatorImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ClipboardIndicatorProps<As>,
) => JSX.Element;

/** Expose the machine-owned, selectable Clipboard input. */
export function ClipboardInput<As extends PrimitiveNativeTag = 'input'>(
  props: ClipboardInputProps<As>,
): JSX.Element {
  return renderClipboardPart({ slot: 'input', props });
}

/** Associate a visible label with the Clipboard input. */
export function ClipboardLabel<As extends PrimitiveNativeTag = 'label'>(
  props: ClipboardLabelProps<As>,
): JSX.Element {
  return renderClipboardPart({ slot: 'label', props });
}

/** Render the current value as reactive text. */
export function ClipboardValueText<As extends PrimitiveNativeTag = 'span'>(
  props: ClipboardValueTextProps<As>,
): JSX.Element {
  return renderClipboardPart({ slot: 'valueText', props });
}

/** Show short Copy or Copied status text. */
export function ClipboardCopyText<As extends PrimitiveNativeTag = 'div'>(
  props: ClipboardCopyTextProps<As>,
): JSX.Element {
  return (
    <ClipboardIndicator
      {...props}
      class={composeRecipeClassNames('clipboard__copyText', undefined, props.class)}
      copied={props.copied === undefined ? 'Copied' : props.copied}
    >
      Copy
    </ClipboardIndicator>
  );
}
