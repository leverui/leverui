import { mergeProps } from '../merge-props';

/** Expose reactively merged provider defaults and instance props. */
export function mergeRecipeProps<Props extends object>(
  defaults: () => Partial<Props>,
  instance: Props,
): Props {
  // Native event keys and generated recipe variants require one assertion at the merge boundary.
  return mergeProps(defaults, instance) as Props;
}
