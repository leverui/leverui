import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  ProgressCircleAppearanceProvider,
  type ProgressCircleAppearanceState,
} from './progress-circle-appearance';
import { progressCircleAttributes } from './progress-circle-attributes';
import type { ProgressCircleAppearance } from './progress-circle-choices';
import {
  useProgressCircleProps,
  useProgressCircleRootProviderProps,
  type ProgressCircleRootProps,
  type ProgressCircleRootProviderProps,
} from './progress-circle-props';
import { renderProgressNativeRoot } from './progress-native-root';
import type { UseProgressProps, UseProgressReturn } from './progress-types';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = UseProgressProps &
  ProgressCircleAppearance & {
    class?: ClassValue | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeProviderProps = Omit<RuntimeRootProps, keyof UseProgressProps | 'value'> & {
  value: UseProgressReturn;
};
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Bind Circle appearance to either primitive Progress machine root. */
function renderProgressCircleRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(input.props, [
    'size',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const appearance: ProgressCircleAppearanceState = {
    /** Follow the root's current unstyled choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  return (
    <ProgressCircleAppearanceProvider value={appearance}>
      {renderProgressNativeRoot(
        input.mode,
        native,
        local,
        /** Keep ring size and palette reactive on the native root. */
        () => progressCircleAttributes(local),
        'progress-circle',
        /** Keep SVG parts beneath the primitive's active machine. */
        () => content.children,
      )}
    </ProgressCircleAppearanceProvider>
  );
}

/** Render a Circle with its own primitive and Zag Progress machine. */
function ProgressCircleRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderProgressCircleRoot(
    { mode: 'root', props: useProgressCircleProps(instance) },
    content,
  );
}

/** Expose a typed Circle root with caller-owned element selection. */
export const ProgressCircleRoot = ProgressCircleRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ProgressCircleRootProps<As>,
) => JSX.Element;

/** Render a Circle driven by a caller-owned primitive machine accessor. */
function ProgressCircleRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderProgressCircleRoot(
    { mode: 'provider', props: useProgressCircleRootProviderProps(instance) },
    content,
  );
}

/** Require an external Progress machine accessor. */
export const ProgressCircleRootProvider = ProgressCircleRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: ProgressCircleRootProviderProps<As>,
) => JSX.Element;
