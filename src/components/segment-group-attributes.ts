import { readSegmentGroupSizes, type SegmentGroupAppearance } from './segment-group-choices';

type SegmentGroupBreakpoint = '' | '-sm' | '-md' | '-lg' | '-xl' | '-2xl';
type SegmentGroupAttributes = Partial<
  Record<`data-size${SegmentGroupBreakpoint}` | 'data-unstyled', string | undefined>
>;

/** Reflect finite Segment Group choices on the native machine root. */
export function segmentGroupAttributes(appearance: SegmentGroupAppearance): SegmentGroupAttributes {
  const size = readSegmentGroupSizes(appearance.size);
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
