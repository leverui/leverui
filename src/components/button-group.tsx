import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { ButtonPropsProvider, type ButtonBaseProps } from './button-props';
import { Group, type GroupProps } from './group';
import type { NativeElementTag } from './native-element-props';

export type ButtonGroupProps<As extends NativeElementTag = 'div'> = GroupProps<As> &
  Pick<ButtonBaseProps, 'size' | 'variant' | 'colorPalette'> & {
    /** Add a consumer class through the `className` alias. */
    className?: string;
  };

/** Share Button variants while Group owns the native layout and joined edges. */
function ButtonGroupRoot(props: ButtonGroupProps<'div'>): JSX.Element {
  const [button, group] = splitProps(props, [
    'size',
    'variant',
    'colorPalette',
    'class',
    'className',
  ]);

  /** Keep inherited variants reactive without creating a styling recipe. */
  function readButtonDefaults(): ButtonBaseProps {
    return {
      size: button.size,
      variant: button.variant,
      colorPalette: button.colorPalette,
    };
  }

  return (
    <ButtonPropsProvider value={readButtonDefaults}>
      <Group {...group} class={['lui-button-group', button.class, button.className]} />
    </ButtonPropsProvider>
  );
}

/** Preserve Group's selected native tag and ref types in the public signature. */
export const ButtonGroup = ButtonGroupRoot as <As extends NativeElementTag = 'div'>(
  props: ButtonGroupProps<As>,
) => JSX.Element;
