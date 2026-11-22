import {
  RatingGroup,
  type RatingGroupIconProps,
  type RatingGroupItemProps,
  type RatingGroupPropsProviderProps,
  type RatingGroupRootProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type ProviderDefaults = Exclude<RatingGroupPropsProviderProps['value'], () => unknown>;

export type RatingSizeAccepted = ExpectTrue<
  Assignable<{ size: 'sm' }, Pick<RatingGroupRootProps, 'size'>>
>;
export type InvalidRatingSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, Pick<RatingGroupRootProps, 'size'>>
>;
export type RatingItemIndexRequired = ExpectFalse<
  Assignable<Record<string, never>, RatingGroupItemProps>
>;
export type ProviderCssRejected = ExpectFalse<'css' extends keyof ProviderDefaults ? true : false>;
export type ProviderChildrenRejected = ExpectFalse<
  'children' extends keyof ProviderDefaults ? true : false
>;

/** Draw a fresh SVG for either indicator color layer. */
function DiamondIcon(props: RatingGroupIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 2 22 12 12 22 2 12z" />
    </svg>
  );
}

/** Compile public machine, provider, item, and icon paths from an archive. */
export function PackedPolymorphicRatingGroup(): JSX.Element {
  const rating = RatingGroup.useRatingGroup({ name: 'quality', defaultValue: 1 });
  return (
    <RatingGroup.PropsProvider value={{ size: 'sm', style: { color: 'red' } }}>
      <RatingGroup.RootProvider value={rating}>
        <RatingGroup.Label>Quality</RatingGroup.Label>
        <RatingGroup.Control>
          <RatingGroup.Item index={1}>
            <RatingGroup.ItemIndicator as="strong" icon={DiamondIcon} />
          </RatingGroup.Item>
        </RatingGroup.Control>
        <RatingGroup.HiddenInput />
      </RatingGroup.RootProvider>
    </RatingGroup.PropsProvider>
  );
}
