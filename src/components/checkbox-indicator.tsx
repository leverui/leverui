import { splitProps } from '../primitives/utils/split-props';
import { mergeProps as mergePrimitiveProps } from '../primitives/utils';
import { useCheckboxContext } from '../primitives/components/checkbox';
import { createMemo, untrack } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useCheckboxPresentation } from './checkbox-presentation';
import { composeCheckboxRefs } from './checkbox-ref';

type SvgProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  [name: `data-${string}`]: string | undefined;
};

export type CheckboxIndicatorMark = (getProps: (childProps?: SvgProps) => SvgProps) => JSX.Element;
export type CheckboxIndicatorProps = Omit<
  JSX.SvgSVGAttributes<SVGSVGElement>,
  'checked' | 'as' | 'asChild'
> & {
  checked?: CheckboxIndicatorMark;
  indeterminate?: CheckboxIndicatorMark;
  className?: string;
  unstyled?: boolean;
};

/** Render the primitive's default mark or a consumer SVG without a component style tag. */
export function CheckboxIndicator(props: CheckboxIndicatorProps): JSX.Element {
  const checkbox = useCheckboxContext();
  const presentation = useCheckboxPresentation();
  const [local, native] = splitProps(props, [
    'checked',
    'indeterminate',
    'class',
    'className',
    'children',
    'unstyled',
    'ref',
  ]);
  const activeMark = createMemo(
    /** Mount only the custom mark for the current primitive state. */
    () => {
      const state = checkbox();
      if (state.indeterminate) return local.indeterminate;
      return state.checked ? local.checked : undefined;
    },
  );
  const nativeProps = createMemo(
    /** Keep SVG attributes, state, and consumer classes reactive. */
    (): SvgProps => ({
      ...native,
      viewBox: native.viewBox ?? '0 0 24 24',
      'aria-hidden': 'true',
      'data-state': checkbox().indeterminate
        ? 'indeterminate'
        : checkbox().checked
          ? 'checked'
          : 'unchecked',
      'data-disabled': checkbox().disabled ? '' : undefined,
      'data-unstyled': presentation().unstyled || local.unstyled ? '' : undefined,
      class: composeRecipeClassNames(
        'checkbox__indicator',
        undefined,
        local.class,
        local.className,
      ),
    }),
  );

  /** Preserve consumer classes, native style, and both refs on a custom SVG. */
  function getMarkProps(childProps?: SvgProps): SvgProps {
    return mergeProps(
      /** Follow root defaults and the primitive state without replacing the SVG. */
      () => mergePrimitiveProps(nativeProps(), childProps),
      { ref: composeCheckboxRefs(local, childProps) },
    );
  }

  /** Keep the default glyph tree stable through checked-state hydration. */
  function renderMark(): JSX.Element {
    const custom = activeMark();
    if (custom) {
      return untrack(
        /** Create the custom SVG once while its merged props stay live. */
        () => custom(getMarkProps),
      );
    }
    return (
      <Dynamic component="svg" {...getMarkProps()}>
        <Dynamic component="g" data-glyph="indeterminate">
          <Dynamic component="path" d="M5 12h14" />
        </Dynamic>
        <Dynamic component="g" data-glyph="checked">
          {local.children ?? <Dynamic component="polyline" points="20 6 9 17 4 12" />}
        </Dynamic>
      </Dynamic>
    );
  }

  return <>{renderMark()}</>;
}
