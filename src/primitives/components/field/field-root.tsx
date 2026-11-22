import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { composeRefGetters } from '../../utils/compose-refs';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseFieldProps, useField } from './use-field';
import { FieldProvider } from './use-field-context';

export type FieldRootBaseProps = UseFieldProps & PolymorphicProps<'div'>;
export type FieldRootProps = Assign<HTMLProps<'div'>, FieldRootBaseProps>;

/** Render the Field root. */
export const FieldRoot = (props: FieldRootProps) => {
  const [useFieldProps, localProps] = createSplitProps<UseFieldProps>()(props, [
    'id',
    'ids',
    'disabled',
    'invalid',
    'readOnly',
    'required',
    'target',
  ]);
  const field = useField(useFieldProps);
  const mergedProps = mergeProps(() => field().getRootProps(), localProps);

  return (
    <FieldProvider value={field}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => field().refs.rootRef,
          () => props.ref,
        )}
      />
    </FieldProvider>
  );
};
