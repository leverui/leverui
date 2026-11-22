import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import { ProgressAppearanceProvider, type ProgressAppearanceState } from './progress-appearance';
import { progressAttributes } from './progress-attributes';
import type { ProgressAppearance } from './progress-choices';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderProgressNativeRoot } from './progress-native-root';
import {
  useProgressProps,
  useProgressRootProviderProps,
  type ProgressRootProps,
  type ProgressRootProviderProps,
} from './progress-props';
import type { UseProgressProps, UseProgressReturn } from './progress-types';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = UseProgressProps &
  ProgressAppearance & {
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

/** Bind native appearance attributes to either primitive Progress root. */
function renderProgressRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(input.props, [
    'size',
    'variant',
    'shape',
    'striped',
    'animated',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const appearance: ProgressAppearanceState = {
    /** Follow the root's current unstyled choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  return (
    <ProgressAppearanceProvider value={appearance}>
      {renderProgressNativeRoot(
        input.mode,
        native,
        local,
        /** Keep appearance choices reactive on the native root. */
        () => progressAttributes(local),
        'progress',
        /** Keep children beneath the primitive's active machine. */
        () => content.children,
      )}
    </ProgressAppearanceProvider>
  );
}

/** Render a Progress with its own primitive and Zag machine. */
function ProgressRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderProgressRoot({ mode: 'root', props: useProgressProps(instance) }, content);
}

/** Expose a typed Progress root with caller-owned element selection. */
export const ProgressRoot = ProgressRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ProgressRootProps<As>,
) => JSX.Element;

/** Render a Progress driven by a caller-owned primitive machine accessor. */
function ProgressRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderProgressRoot(
    { mode: 'provider', props: useProgressRootProviderProps(instance) },
    content,
  );
}

/** Require an external Progress machine accessor. */
export const ProgressRootProvider = ProgressRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: ProgressRootProviderProps<As>,
) => JSX.Element;
