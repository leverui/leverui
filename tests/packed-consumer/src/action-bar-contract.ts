import type {
  ActionBarPropsProviderProps,
  ActionBarRootProps,
  ActionBarRootProviderProps,
  ActionBarPositionerProps,
  ActionBarContentProps,
} from '@leverui/components';

type Assert<Condition extends true> = Condition;
type PresenceKeys =
  | 'immediate'
  | 'lazyMount'
  | 'onEnterComplete'
  | 'onExitComplete'
  | 'present'
  | 'skipAnimationOnMount'
  | 'unmountOnExit';
type ProviderDefaults = Exclude<ActionBarPropsProviderProps['value'], () => unknown>;

/** Keep every primitive presence control available on the installed root. */
export type RootPresenceContract = Assert<
  PresenceKeys extends keyof ActionBarRootProps ? true : false
>;

/** Keep presence controls available when the caller owns the machine. */
export type ProviderPresenceContract = Assert<
  PresenceKeys extends keyof ActionBarRootProviderProps ? true : false
>;

/** Match the primitive's optional children on the caller-owned root provider. */
export type ProviderChildrenContract = Assert<
  object extends Pick<ActionBarRootProviderProps, 'children'> ? true : false
>;

/** Accept the primitive positioning defaults while the public Root still omits them. */
export type PositioningDefaultsContract = Assert<
  'positioning' extends keyof ProviderDefaults ? true : false
>;

/** Keep the unsupported object styling API out of packed public types. */
export type NativeStylingContract = Assert<
  'css' extends
    keyof ActionBarRootProps | keyof ActionBarPositionerProps | keyof ActionBarContentProps
    ? false
    : true
>;

/** Keep the unsupported root recipe override out of the public contract. */
export type AuthoredAppearanceContract = Assert<
  'recipe' extends keyof ActionBarRootProps ? false : true
>;
