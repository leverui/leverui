import { splitProps } from '../primitives/utils/split-props';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Input } from './input';
import type { InputRootProps } from './input-props';
import { InputGroup, type InputGroupProps } from './input-group';
import { PasswordHiddenIcon, PasswordVisibleIcon } from './password-visibility-icons';

export interface PasswordVisibilityProps {
  defaultVisible?: boolean;
  visible?: boolean;
  /** Observe a requested visibility change without taking ownership of controlled state. */
  onVisibleChange?: (visible: boolean) => void;
  visibilityIcon?: { on: JSX.Element; off: JSX.Element };
}

export type PasswordInputProps = Omit<InputRootProps, 'type' | 'as' | 'asChild' | 'ref'> &
  PasswordVisibilityProps & {
    ref?: ((element: HTMLInputElement) => void) | undefined;
    rootProps?: Omit<InputGroupProps<'div'>, 'children' | 'endElement' | 'as' | 'asChild'>;
  };

/** Render a styled password input with an optional controlled visibility state. */
export function PasswordInput(props: PasswordInputProps): JSX.Element {
  const [local, inputProps] = splitProps(props, [
    'rootProps',
    'defaultVisible',
    'visible',
    'onVisibleChange',
    'visibilityIcon',
  ]);
  const [uncontrolledVisible, setUncontrolledVisible] = createSignal(local.defaultVisible ?? false);
  /** Read either the controlled visibility prop or the local default. */
  const isVisible = (): boolean => local.visible ?? uncontrolledVisible();

  /** Toggle visibility on a primary pointer press without stealing input focus. */
  function toggleVisible(event: PointerEvent): void {
    if (inputProps.disabled || event.button !== 0) return;
    event.preventDefault();
    const next = !isVisible();
    if (local.visible === undefined) setUncontrolledVisible(next);
    local.onVisibleChange?.(next);
  }

  const visibilityTrigger = (
    <button
      type="button"
      aria-label="Toggle password visibility"
      tabindex={-1}
      disabled={inputProps.disabled}
      onPointerDown={toggleVisible}
      class="lui-button lui-icon-button lui-password-input__visibility-trigger"
      data-size="sm"
      data-variant="ghost"
      data-unstyled={inputProps.unstyled ? '' : undefined}
    >
      {isVisible()
        ? (local.visibilityIcon?.off ?? <PasswordHiddenIcon />)
        : (local.visibilityIcon?.on ?? <PasswordVisibleIcon />)}
    </button>
  );

  return (
    <InputGroup
      {...local.rootProps}
      class={['lui-password-input', local.rootProps?.class, local.rootProps?.className]}
      data-visible={isVisible() ? '' : undefined}
      data-disabled={inputProps.disabled ? '' : undefined}
      data-unstyled={inputProps.unstyled ? '' : undefined}
      unstyled={inputProps.unstyled || local.rootProps?.unstyled}
      endElement={visibilityTrigger}
    >
      <Input {...inputProps} type={isVisible() ? 'text' : 'password'} />
    </InputGroup>
  );
}
