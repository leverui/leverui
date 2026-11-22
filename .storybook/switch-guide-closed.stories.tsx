import { splitProps } from '../src/primitives/utils/split-props';
import { Show, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Switch, type SwitchRootProps } from '../src';

type ClosedSwitchProps = Omit<
  SwitchRootProps<'label'>,
  'children' | 'ref' | 'as' | 'asChild' | 'render'
> & {
  children?: JSX.Element;
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>;
  inputRef?: (element: HTMLInputElement) => void;
  rootRef?: (element: HTMLLabelElement) => void;
  trackLabel?: { on: JSX.Element; off: JSX.Element };
  thumbLabel?: { on: JSX.Element; off: JSX.Element };
};

/** Render the checked or unchecked thumb content from a closed wrapper. */
function renderThumbLabels(labels: Accessor<{ on: JSX.Element; off: JSX.Element }>): JSX.Element {
  return <Switch.ThumbIndicator fallback={labels().off}>{labels().on}</Switch.ThumbIndicator>;
}

/** Render the checked or unchecked track content from a closed wrapper. */
function renderTrackLabels(labels: Accessor<{ on: JSX.Element; off: JSX.Element }>): JSX.Element {
  return <Switch.Indicator fallback={labels().off}>{labels().on}</Switch.Indicator>;
}

/** Offer a consumer-owned closed Switch while forwarding both native refs. */
function ClosedSwitch(props: ClosedSwitchProps): JSX.Element {
  const [local, rootProps] = splitProps(props, [
    'children',
    'inputProps',
    'inputRef',
    'rootRef',
    'trackLabel',
    'thumbLabel',
  ]);

  /** Adapt the root's generic element ref to this label-only wrapper. */
  function forwardRootRef(element: Element): void {
    if (!(element instanceof HTMLLabelElement)) {
      throw new TypeError('Closed Switch root must render a label.');
    }
    local.rootRef?.(element);
  }

  return (
    <Switch.Root {...rootProps} ref={forwardRootRef}>
      <Switch.HiddenInput {...local.inputProps} ref={local.inputRef} />
      <Switch.Control>
        <Switch.Thumb>
          <Show when={local.thumbLabel}>{renderThumbLabels}</Show>
        </Switch.Thumb>
        <Show when={local.trackLabel}>{renderTrackLabels}</Show>
      </Switch.Control>
      <Show when={local.children != null}>
        <Switch.Label>{local.children}</Switch.Label>
      </Show>
    </Switch.Root>
  );
}

/** Demonstrate the default and fully customized closed branches. */
function ClosedSwitchGuide(): JSX.Element {
  /** Mark the native input reached through the closed wrapper. */
  function captureInput(element: HTMLInputElement): void {
    element.dataset.inputRef = 'true';
  }

  /** Mark the native label reached through the closed wrapper. */
  function captureRoot(element: HTMLLabelElement): void {
    element.dataset.rootRef = 'true';
  }

  return (
    <>
      <form
        data-testid="switch-closed-form"
        style={{ display: 'grid', gap: '24px', padding: '24px' }}
      >
        <ClosedSwitch name="basic" value="yes" data-testid="switch-closed-basic">
          Basic closed switch
        </ClosedSwitch>
        <ClosedSwitch
          name="custom"
          value="yes"
          defaultChecked
          size="lg"
          colorPalette="blue"
          inputProps={{ 'aria-label': 'Customized closed switch' }}
          inputRef={captureInput}
          rootRef={captureRoot}
          trackLabel={{ on: 'On', off: 'Off' }}
          thumbLabel={{ on: '✓', off: '−' }}
          data-testid="switch-closed-custom"
        />
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Switch Guide Closed',
  component: ClosedSwitchGuide,
} satisfies Meta<typeof ClosedSwitchGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ClosedSwitchGuide };
