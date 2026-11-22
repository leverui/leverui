import { createMemo } from 'solid-js';
import type { DialogAuthoredStyleState } from './dialog-authored-style-state';
import type { DrawerRootProps } from './drawer-props';
import { readOverlayBooleanChoice, readOverlayChoice } from './overlay-responsive-choice';

type DrawerAppearance = Pick<DrawerRootProps, 'size' | 'placement' | 'contained' | 'unstyled'>;
const sizes = new Set(['xs', 'sm', 'md', 'lg', 'xl', 'full']);
const placements = new Set(['start', 'end', 'top', 'bottom']);

/** Reflect boolean choices for scalar CSS and consumer selectors. */
function containedAttribute(value: boolean | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
}

/** Reflect finite Drawer choices into portal-safe authored CSS hooks. */
export function useDrawerAuthoredStyles(props: DrawerAppearance): DialogAuthoredStyleState {
  const size = createMemo(
    /** Reject unsupported sizes with a clear error. */
    () => {
      const choice = readOverlayChoice(props.size, sizes, 'xs');
      if (!choice) throw new TypeError('Drawer size must use a supported finite choice.');
      return choice;
    },
  );
  const placement = createMemo(
    /** Reject unsupported placements at the component boundary. */
    () => {
      const choice = readOverlayChoice(props.placement, placements, 'end');
      if (!choice) throw new TypeError('Drawer placement must use a supported finite choice.');
      return choice;
    },
  );
  const contained = createMemo(
    /** Reject unsupported inset choices at the component boundary. */
    () => {
      const choice = readOverlayBooleanChoice(props.contained);
      if (!choice) throw new TypeError('Drawer contained must use a boolean finite choice.');
      return choice;
    },
  );
  const usesAuthoredCss = createMemo(
    /** Keep authored CSS active for every supported Drawer appearance. */
    () => Boolean(size() && placement() && contained()),
  );
  /** Reflect finite choices on every portal-safe Drawer part. */
  function partAttributes(
    unstyled?: boolean,
  ): ReturnType<DialogAuthoredStyleState['partAttributes']> {
    const authored = usesAuthoredCss();
    const bare = Boolean(props.unstyled || unstyled);
    return {
      'data-leverui-drawer-css': authored && !bare ? '' : undefined,
      'data-size': authored ? size().base : undefined,
      'data-size-sm': authored ? size().sm : undefined,
      'data-size-lg': authored ? size().lg : undefined,
      'data-size-xl': authored ? size().xl : undefined,
      'data-size-2xl': authored ? size()['2xl'] : undefined,
      'data-size-sm-down': authored ? size().smDown : undefined,
      'data-size-md-down': authored ? size().mdDown : undefined,
      'data-size-lg-down': authored ? size().lgDown : undefined,
      'data-size-xl-down': authored ? size().xlDown : undefined,
      'data-size-2xl-down': authored ? size()['2xlDown'] : undefined,
      'data-size-md': authored ? size().md : undefined,
      'data-placement': authored ? placement().base : undefined,
      'data-placement-sm': authored ? placement().sm : undefined,
      'data-placement-lg': authored ? placement().lg : undefined,
      'data-placement-xl': authored ? placement().xl : undefined,
      'data-placement-2xl': authored ? placement()['2xl'] : undefined,
      'data-placement-sm-down': authored ? placement().smDown : undefined,
      'data-placement-md-down': authored ? placement().mdDown : undefined,
      'data-placement-lg-down': authored ? placement().lgDown : undefined,
      'data-placement-xl-down': authored ? placement().xlDown : undefined,
      'data-placement-2xl-down': authored ? placement()['2xlDown'] : undefined,
      'data-placement-md': authored ? placement().md : undefined,
      'data-contained': authored ? containedAttribute(contained().base) : undefined,
      'data-contained-sm': authored ? containedAttribute(contained().sm) : undefined,
      'data-contained-md': authored ? containedAttribute(contained().md) : undefined,
      'data-contained-lg': authored ? containedAttribute(contained().lg) : undefined,
      'data-contained-xl': authored ? containedAttribute(contained().xl) : undefined,
      'data-contained-2xl': authored ? containedAttribute(contained()['2xl']) : undefined,
      'data-contained-sm-down': authored ? containedAttribute(contained().smDown) : undefined,
      'data-contained-md-down': authored ? containedAttribute(contained().mdDown) : undefined,
      'data-contained-lg-down': authored ? containedAttribute(contained().lgDown) : undefined,
      'data-contained-xl-down': authored ? containedAttribute(contained().xlDown) : undefined,
      'data-contained-2xl-down': authored ? containedAttribute(contained()['2xlDown']) : undefined,
      'data-unstyled': bare ? '' : undefined,
    };
  }

  return { family: 'drawer', usesAuthoredCss, partAttributes };
}
