import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { Grid, type GridOptions, type GridProps } from './grid';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import {
  countToColumns,
  widthToColumns,
  type SimpleGridCount,
  type SimpleGridWidth,
} from './simple-grid-columns';

interface SimpleGridOptions {
  /** Minimum child width used to make as many columns as will fit. */
  minChildWidth?: SimpleGridWidth | undefined;
  /** Number of equal-width columns at ordinary breakpoints. */
  columns?: SimpleGridCount | undefined;
}

export type SimpleGridProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  SimpleGridOptions & GridOptions & { unstyled?: boolean | undefined },
  As
>;

/** Render a Grid with tracks derived from count or minimum child width. */
function SimpleGridRoot(props: GridProps<'div'> & SimpleGridOptions): JSX.Element {
  const [local, rest] = splitProps(props, ['columns', 'minChildWidth', 'templateColumns', 'class']);

  return (
    <Grid
      {...rest}
      templateColumns={
        local.templateColumns ??
        (local.minChildWidth ? widthToColumns(local.minChildWidth) : countToColumns(local.columns))
      }
      class={composeRecipeClassNames('simple-grid', undefined, local.class)}
    />
  );
}

/** Bind native attributes and refs to the selected intrinsic element. */
export const SimpleGrid = SimpleGridRoot as <As extends NativeElementTag = 'div'>(
  props: SimpleGridProps<As>,
) => JSX.Element;
