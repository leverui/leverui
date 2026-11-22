import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useCodeBlockAppearance } from './code-block-appearance';
import type { ClassValue } from '../utils/class-value';

export type CodeBlockPart =
  | 'header'
  | 'title'
  | 'control'
  | 'footer'
  | 'content'
  | 'overlay'
  | 'code'
  | 'codeText'
  | 'copyTrigger'
  | 'copyIndicator'
  | 'collapseTrigger'
  | 'collapseIndicator';

export interface CodeBlockPartAppearance {
  className: () => string;
  unstyled: () => '' | undefined;
}

/** Compose a stable part hook and inherit the nearest root's unstyled choice. */
export function useCodeBlockPartStyle(
  slot: CodeBlockPart,
  props: {
    class?: ClassValue;
    className?: string | undefined;
    unstyled?: boolean | undefined;
  },
): CodeBlockPartAppearance {
  const appearance = useCodeBlockAppearance();
  return {
    /** Keep consumer classes reactive. */
    className: () =>
      composeRecipeClassNames(`code-block__${slot}`, undefined, props.class, props.className),
    /** Suppress authored styles for this part or its root. */
    unstyled: () => (props.unstyled || appearance.unstyled() ? '' : undefined),
  };
}
