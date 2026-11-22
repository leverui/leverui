import { splitProps } from '../primitives/utils/split-props';
import { TagsInput as PrimitiveTagsInput } from '../primitives/components/tags-input';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';

type HiddenInputProps = Parameters<typeof PrimitiveTagsInput.HiddenInput>[0] & {
  className?: string;
};

/** Keep the primitive form input native while exposing its stable public part hook. */
function TagsInputHiddenInputImpl(props: HiddenInputProps): JSX.Element {
  const [local, native] = splitProps(props, ['class', 'className']);
  const forwarded = mergeProps(
    /** Preserve the primitive's current form attributes and native input props. */
    () => native,
    {
      /** Include the hidden field in the public Tags Input anatomy. */
      get class() {
        return composeRecipeClassNames(
          'tags-input__hiddenInput',
          undefined,
          local.class,
          local.className,
        );
      },
    },
  );
  return createComponent(PrimitiveTagsInput.HiddenInput as Component<typeof forwarded>, forwarded);
}

/** Preserve the primitive's polymorphic hidden-input signature for consumers. */
export const TagsInputHiddenInput =
  TagsInputHiddenInputImpl as typeof PrimitiveTagsInput.HiddenInput;
