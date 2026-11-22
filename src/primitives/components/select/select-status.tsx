import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { selectAnatomy } from './select.anatomy';

const parts = selectAnatomy.build();

export type SelectStatusBaseProps = PolymorphicProps<'div'>;
export type SelectStatusProps = Assign<HTMLProps<'div'>, SelectStatusBaseProps>;

/** Render the Select status. */
export const SelectStatus = (props: SelectStatusProps) => (
  <primitive.div
    {...parts.status.attrs('')}
    role="status"
    aria-live="polite"
    aria-atomic="true"
    {...props}
  />
);
