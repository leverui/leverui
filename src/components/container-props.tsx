import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementTag } from './native-element-props';
import type { ResponsiveBooleanValue } from '../styled-system/responsive-values';
import { mergeRecipeProps } from './recipe-props-merge';

// A type alias, unlike an interface, is assignable to JSX props with `data-*` index signatures.
export type ContainerBaseProps = {
  /** Center children along the container's inline axis. */
  centerContent?: ResponsiveBooleanValue | undefined;
  /** Remove the default maximum width at selected breakpoints. */
  fluid?: ResponsiveBooleanValue | undefined;
  /** Suppress default layout rules while retaining the public class. */
  unstyled?: boolean | undefined;
};

export type ContainerRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  ContainerBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface ContainerPropsProviderProps {
  value: ContainerBaseProps | Accessor<ContainerBaseProps>;
  children: JSX.Element;
}

const ContainerContext = createOptionalContext<Accessor<ContainerBaseProps>>();

/** Provide reactive Container variant defaults to descendant instances. */
export function ContainerPropsProvider(props: ContainerPropsProviderProps): JSX.Element {
  /** Read either a fixed defaults object or the current accessor value. */
  function readDefaults(): ContainerBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ContainerContext value={readDefaults}>{props.children}</ContainerContext>;
}

/** Merge nearest variant defaults with current instance props. */
export function useContainerProps(instance: ContainerRootProps): ContainerRootProps {
  const inherited = useOptionalContext(ContainerContext);
  return mergeRecipeProps<ContainerRootProps>(
    /** Track provider updates while retaining instance precedence. */
    () => inherited?.() ?? {},
    instance,
  );
}
