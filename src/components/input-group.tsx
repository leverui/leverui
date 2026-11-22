import { splitProps } from '../primitives/utils/split-props';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { GroupPropsWithOmitted } from './group';
import type { GroupItemElement } from './group-items';
import { Group } from './group';
import { InputAddon, type InputAddonProps } from './input-addon';
import { InputElement, type InputElementProps } from './input-element';
import { InputGroupChild } from './input-group-child';
import {
  inputGroupRootOffsets,
  mergeInputGroupStyle,
  type InputGroupOffsets,
} from './input-group-root-offsets';
import type { InputGroupOffset } from './input-group-offset';
import type { NativeElementTag } from './native-element-props';

interface InputGroupOptions {
  /** Add a consumer class through the `className` alias. */
  className?: string;
  startElement?: JSX.Element;
  startElementProps?: InputElementProps;
  endElement?: JSX.Element;
  endElementProps?: InputElementProps;
  startAddon?: JSX.Element;
  startAddonProps?: InputAddonProps;
  endAddon?: JSX.Element;
  endAddonProps?: InputAddonProps;
  startOffset?: InputGroupOffset;
  endOffset?: InputGroupOffset;
  children: JSX.Element;
}

export type InputGroupProps<As extends NativeElementTag = 'div'> = GroupPropsWithOmitted<
  As,
  keyof InputGroupOptions | 'skip' | 'attached'
> &
  InputGroupOptions;

/** Exclude adornments from Group's joined-edge and stacking calculations. */
function skipInputElement(child: GroupItemElement): boolean {
  return child.classList.contains('leverui-input-element');
}

/** Compose group-owned adornments and addons around one native Solid field. */
function InputGroupRoot(props: InputGroupProps<'div'>): JSX.Element {
  const [local, rest] = splitProps(props, [
    'startElement',
    'startElementProps',
    'endElement',
    'endElementProps',
    'startAddon',
    'startAddonProps',
    'endAddon',
    'endAddonProps',
    'startOffset',
    'endOffset',
    'children',
    'class',
    'className',
    'style',
  ]);
  const offsets = createMemo(
    /** Preserve responsive offsets while elements enter or leave the group. */
    (): InputGroupOffsets => ({
      ...(local.startElement && { start: local.startOffset ?? '0px' }),
      ...(local.endElement && { end: local.endOffset ?? '0px' }),
    }),
  );
  const rootOffsets = createMemo(
    /** Expose open offsets through native variables inherited by CSS fields. */
    () => inputGroupRootOffsets(offsets()),
  );

  return (
    <Group
      {...rest}
      {...rootOffsets().attributes}
      attached={Boolean(local.startAddon || local.endAddon)}
      skip={skipInputElement}
      class={['leverui-input-group', local.class, local.className]}
      style={mergeInputGroupStyle(local.style, rootOffsets().variables)}
    >
      {local.startAddon && <InputAddon {...local.startAddonProps}>{local.startAddon}</InputAddon>}
      {local.startElement && (
        <InputElement {...local.startElementProps} data-leverui-input-group-start-element="">
          {local.startElement}
        </InputElement>
      )}
      <InputGroupChild>{local.children}</InputGroupChild>
      {local.endElement && (
        <InputElement placement="end" {...local.endElementProps}>
          {local.endElement}
        </InputElement>
      )}
      {local.endAddon && <InputAddon {...local.endAddonProps}>{local.endAddon}</InputAddon>}
    </Group>
  );
}

/** Bind native element selection and its ref to the composed Group. */
export const InputGroup = InputGroupRoot as <As extends NativeElementTag = 'div'>(
  props: InputGroupProps<As>,
) => JSX.Element;
