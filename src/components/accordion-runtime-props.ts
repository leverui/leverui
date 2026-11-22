import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { AccordionAppearance } from './accordion-appearance';
import type { UseAccordionProps, UseAccordionReturn } from './accordion-machine';

/** Carry native and finite appearance props through the primitive's root boundary. */
export type AccordionRuntimeLocalProps = Omit<
  JSX.IntrinsicElements['div'],
  keyof AccordionAppearance | 'ref' | 'value'
> &
  AccordionAppearance & {
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
    children?: JSX.Element | undefined;
  };

export type AccordionRuntimeRootProps = AccordionRuntimeLocalProps &
  UseAccordionProps & {
    lazyMount?: boolean | undefined;
    unmountOnExit?: boolean | undefined;
  };
export type AccordionRuntimeProviderProps = AccordionRuntimeLocalProps & {
  value: UseAccordionReturn;
  lazyMount?: boolean | undefined;
  unmountOnExit?: boolean | undefined;
};
