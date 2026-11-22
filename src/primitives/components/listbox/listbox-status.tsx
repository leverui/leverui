import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { listboxAnatomy } from './listbox.anatomy';

const parts = listboxAnatomy.build();

export type ListboxStatusBaseProps = PolymorphicProps<'div'>;
export type ListboxStatusProps = Assign<HTMLProps<'div'>, ListboxStatusBaseProps>;

/** Render the Listbox status. */
export const ListboxStatus = (props: ListboxStatusProps) => (
  <primitive.div
    {...parts.status.attrs('')}
    role="status"
    aria-live="polite"
    aria-atomic="true"
    {...props}
  />
);
