import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { composeRefGetters } from '../../utils/compose-refs';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseFieldsetProps, useFieldset } from './use-fieldset';
import { FieldsetProvider } from './use-fieldset-context';

export type FieldsetRootBaseProps = UseFieldsetProps & PolymorphicProps<'fieldset'>;
export type FieldsetRootProps = Assign<HTMLProps<'fieldset'>, FieldsetRootBaseProps>;

/** Render the Fieldset root. */
export const FieldsetRoot = (props: FieldsetRootProps) => {
  const [useFieldsetProps, localProps] = createSplitProps<UseFieldsetProps>()(props, [
    'id',
    'disabled',
    'invalid',
  ]);
  const fieldset = useFieldset(useFieldsetProps);
  const mergedProps = mergeProps(() => fieldset().getRootProps(), localProps);

  return (
    <FieldsetProvider value={fieldset}>
      <primitive.fieldset
        {...mergedProps}
        ref={composeRefGetters(
          () => fieldset().refs.rootRef,
          () => props.ref,
        )}
      />
    </FieldsetProvider>
  );
};

FieldsetRoot.displayName = 'FieldsetRoot';
