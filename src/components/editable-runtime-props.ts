import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { EditableAppearance } from './editable-choices';
import type { EditableIntrinsicElement } from './editable-types';
import type { UseEditableProps, UseEditableReturn } from './editable-machine-types';
import type { ClassValue } from '../utils/class-value';

/** Carry checked public Editable props across the primitive and recipe boundary. */
export type EditableRuntimeLocalProps = NativeHtmlAliases &
  EditableAppearance & {
    class?: ClassValue | undefined;
    ref?: unknown | undefined;
    as?: EditableIntrinsicElement | undefined;
    asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
    children?: JSX.Element | undefined;
  };

export type EditableRuntimeRootProps = EditableRuntimeLocalProps & UseEditableProps;
export type EditableRuntimeProviderProps = EditableRuntimeLocalProps & { value: UseEditableReturn };
