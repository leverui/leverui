import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useSwitchContext } from './use-switch-context';

export type SwitchHiddenInputBaseProps = PolymorphicProps<'input'>;
export type SwitchHiddenInputProps = Assign<HTMLProps<'input'>, SwitchHiddenInputBaseProps>;

/** Render the Switch hidden input. */
export const SwitchHiddenInput = (props: SwitchHiddenInputProps) => {
  const api = useSwitchContext();
  const mergedProps = mergeProps(() => api().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
