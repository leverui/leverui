import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { AvatarAppearance } from './avatar-appearance';
import { Group, type GroupProps } from './group';
import { AvatarPropsProvider, type AvatarGroupProps } from './avatar-props';
import type { NativeElementTag } from './native-element-props';

/** Stack Avatar roots and share the group's finite appearance choices. */
function AvatarGroupRoot(props: AvatarGroupProps<'div'>): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'size',
    'variant',
    'shape',
    'borderless',
    'colorPalette',
    'unstyled',
    'class',
  ]);

  /** Pass live group choices to each descendant Avatar root. */
  function readDefaults(): AvatarAppearance {
    return {
      size: local.size,
      variant: local.variant,
      shape: local.shape,
      borderless: local.borderless,
      colorPalette: local.colorPalette,
      unstyled: local.unstyled,
    };
  }

  return (
    <AvatarPropsProvider value={readDefaults}>
      <Group
        {...(native as GroupProps<'div'>)}
        unstyled={local.unstyled}
        class={composeRecipeClassNames('avatar-group', undefined, local.class)}
      >
        {local.children}
      </Group>
    </AvatarPropsProvider>
  );
}

/** Bind AvatarGroup native attributes and refs to its selected element. */
export const AvatarGroup = AvatarGroupRoot as <As extends NativeElementTag = 'div'>(
  props: AvatarGroupProps<As>,
) => JSX.Element;
