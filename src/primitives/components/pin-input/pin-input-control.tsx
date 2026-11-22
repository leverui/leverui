import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { usePinInputContext } from './use-pin-input-context';

export type PinInputControlBaseProps = PolymorphicProps<'div'>;
export type PinInputControlProps = Assign<HTMLProps<'div'>, PinInputControlBaseProps>;

/** Render the PinInput control. */
export const PinInputControl = (props: PinInputControlProps) => {
  const api = usePinInputContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);
  // TODO: remove role and aria-labelledby once a @zag-js/pin-input release includes Zag change #3461.
  const field = useFieldContext();

  return (
    <primitive.div
      role="group"
      aria-labelledby={field?.().ids.label}
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
    />
  );
};
