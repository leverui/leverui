import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Button,
  ButtonGroup,
  ButtonPropsProvider,
  CloseButton,
  IconButton,
  type ButtonProps,
} from '../src';
import './button-contract.css';

type GetButtonChildProps = Parameters<NonNullable<ButtonProps['asChild']>>[0];

/** Prevent navigation for the guide's disabled-link pattern. */
function preventNavigation(event: MouseEvent): void {
  event.preventDefault();
}

/** Render a disabled native link through Solid's Button child contract. */
function renderDisabledLink(getProps: GetButtonChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#button-target" data-disabled="" onClick={preventNavigation}>
      Disabled link
    </a>
  );
}

/** Exercise Button parts, native semantics, CSS variants, and updates. */
function ButtonContractExample(): JSX.Element {
  const [loading, setLoading] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const [activations, setActivations] = createSignal(0);

  /** Mark the native element received through Button's ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the native group div supplied to a consumer ref. */
  function markGroup(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Count mouse and keyboard activation of the default Button. */
  function countActivation(): void {
    setActivations(activations() + 1);
  }

  /** Switch loading and inherited size without remounting the actions. */
  function toggleState(): void {
    setLoading(!loading());
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  return (
    <>
      <ButtonPropsProvider value={{ size: size() }}>
        <Button ref={markButton} onClick={countActivation} data-testid="default-button">
          Default
        </Button>
        <Button data-testid="loading-button" loading={loading()} loadingText="Saving">
          Save
        </Button>
        <Button variant="outline" data-testid="outline-button">
          Outline
        </Button>
        <Button disabled data-testid="disabled-button">
          Disabled
        </Button>
        <Button as="a" href="#button-target" data-testid="link-button">
          Linked action
        </Button>
        <Button asChild={renderDisabledLink} />
        <Button
          loading
          loadingText="Starting"
          spinnerPlacement="start"
          spinner={<span data-testid="start-spinner">●</span>}
          data-testid="start-spinner-button"
        >
          Start
        </Button>
        <Button
          loading
          loadingText="Sending"
          spinnerPlacement="end"
          spinner={<span data-testid="custom-spinner">●</span>}
          data-testid="custom-spinner-button"
        >
          Send
        </Button>
        <Button class="button-contract-custom" data-testid="css-button">
          Custom CSS
        </Button>
        <IconButton aria-label="Open settings" data-testid="icon-button">
          <span aria-hidden="true">⚙</span>
        </IconButton>
        <CloseButton data-testid="close-button" />
        <ButtonGroup
          size="lg"
          attached
          stacking="last-on-top"
          ref={markGroup}
          data-testid="button-group"
        >
          <Button variant="outline">First</Button>
          <Button variant="outline">Last</Button>
        </ButtonGroup>
        <ButtonGroup grow data-testid="grow-group">
          <Button>Grow first</Button>
          <Button>Grow last</Button>
        </ButtonGroup>
        <ButtonGroup attached data-testid="single-group">
          <Button variant="outline">Only</Button>
        </ButtonGroup>
        <ButtonGroup attached data-testid="skipped-single-group">
          <Button variant="outline">Keep</Button>
          <Button variant="outline" data-leverui-group-skip="">
            Skip
          </Button>
        </ButtonGroup>
        <ButtonGroup
          orientation="vertical"
          attached
          stacking="first-on-top"
          data-testid="vertical-group"
        >
          <Button variant="outline">Top</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </ButtonPropsProvider>
      <button type="button" data-testid="button-toggle" onClick={toggleState}>
        Toggle
      </button>
      <output data-testid="button-activations">{activations()}</output>
      <span id="button-target">Target</span>
    </>
  );
}

const meta = {
  title: 'Components/Button',
  component: ButtonContractExample,
} satisfies Meta<typeof ButtonContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
