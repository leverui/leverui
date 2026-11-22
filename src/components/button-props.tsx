import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { ButtonAppearance } from './button-appearance';
import type { NativeElementTag } from './native-element-props';

export interface ButtonLoadingProps {
  loading?: boolean | undefined;
  loadingText?: JSX.Element | undefined;
  spinner?: JSX.Element | undefined;
  spinnerPlacement?: 'start' | 'end' | undefined;
}

export type ButtonBaseProps = ButtonAppearance & ButtonLoadingProps;
export type ButtonRootProps = JSX.HTMLAttributes<HTMLElement> &
  ButtonBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    disabled?: boolean;
    type?: string;
  };

export interface ButtonPropsProviderProps {
  value: ButtonBaseProps | Accessor<ButtonBaseProps>;
  children: JSX.Element;
}

const ButtonContext = createOptionalContext<Accessor<ButtonBaseProps>>();

/** Read inherited Button selections without merging the full native prop set. */
export function useButtonDefaultProps(): Accessor<ButtonBaseProps> | undefined {
  return useOptionalContext(ButtonContext);
}

/** Provide default presentation and loading props to descendant Buttons. */
export function ButtonPropsProvider(props: ButtonPropsProviderProps): JSX.Element {
  /** Read current defaults without recreating the context provider. */
  function readValue(): ButtonBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ButtonContext value={readValue}>{props.children}</ButtonContext>;
}

/** Merge changing provider defaults with defined instance props. */
export function useButtonProps(instance: ButtonRootProps): ButtonRootProps {
  const inherited = useOptionalContext(ButtonContext);
  if (!inherited) return instance;
  return mergeProps(
    /** Preserve a provider default when an instance explicitly passes undefined. */
    () => {
      const merged: Record<string, unknown> = { ...inherited() };
      for (const [name, value] of Object.entries(instance)) {
        if (value !== undefined) merged[name] = value;
      }
      // The public Button signature checks finite appearance choices.
      return merged as ButtonRootProps;
    },
  );
}
