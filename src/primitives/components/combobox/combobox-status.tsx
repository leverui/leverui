import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { comboboxAnatomy } from './combobox.anatomy';

const parts = comboboxAnatomy.build();

export type ComboboxStatusBaseProps = PolymorphicProps<'div'>;
export type ComboboxStatusProps = Assign<HTMLProps<'div'>, ComboboxStatusBaseProps>;

/** Render the Combobox status. */
export const ComboboxStatus = (props: ComboboxStatusProps) => (
  <primitive.div
    {...parts.status.attrs('')}
    role="status"
    aria-live="polite"
    aria-atomic="true"
    {...props}
  />
);
