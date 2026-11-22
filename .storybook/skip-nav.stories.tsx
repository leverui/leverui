import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SkipNavContent, SkipNavLink } from '../src';
import './skip-nav-contract.css';

/** Mark the native anchor delivered by the skip link. */
function markLinkRef(element: HTMLAnchorElement): void {
  element.dataset.receivedLinkRef = 'true';
}

/** Mark the programmatically focusable destination. */
function markContentRef(element: HTMLDivElement): void {
  element.dataset.receivedContentRef = 'true';
}

/** Mark the caller-owned destination delivered through the public ref. */
function markChildContentRef(element: Element): void {
  element.setAttribute('data-received-content-ref', 'true');
}

/** Put the default skip link before repeated navigation. */
function BasicSkipNav(): JSX.Element {
  return (
    <>
      <SkipNavLink ref={markLinkRef} data-testid="skip-nav-link">
        Skip to content
      </SkipNavLink>
      <header>
        <a href="#navigation" data-testid="navigation-link">
          Repeated navigation
        </a>
      </header>
      <SkipNavContent ref={markContentRef} data-testid="skip-nav-content">
        <h1>Main content</h1>
      </SkipNavContent>
    </>
  );
}

/** Keep a custom target ID reactive across both public components. */
function CustomSkipNav(): JSX.Element {
  const [targetId, setTargetId] = createSignal('main-content');

  /** Change the destination while retaining the existing native nodes. */
  function changeTarget(): void {
    setTargetId('updated-main-content');
  }

  return (
    <>
      <SkipNavLink id={targetId()} href="#ignored" data-testid="skip-nav-custom-link">
        Skip to main content
      </SkipNavLink>
      <button type="button" onClick={changeTarget} data-testid="skip-nav-change-target">
        Change target
      </button>
      <SkipNavContent id={targetId()} data-testid="skip-nav-custom-content">
        <h1>Custom main content</h1>
      </SkipNavContent>
    </>
  );
}

/** Keep skip behavior when the caller owns the anchor markup. */
function ChildSkipNav(): JSX.Element {
  return (
    <>
      <SkipNavLink
        asChild={
          /** Put the skip target and public class on a caller-owned anchor. */
          (getProps) => (
            <a {...getProps()} data-testid="skip-nav-child-link">
              Skip custom link
            </a>
          )
        }
      />
      <SkipNavContent
        ref={markChildContentRef}
        asChild={
          /** Apply the destination ID and focusability to a caller-owned main. */
          (getProps) => <main {...getProps()} data-testid="skip-nav-main-content" />
        }
      >
        Caller-owned main element
      </SkipNavContent>
    </>
  );
}

/** Apply a normal consumer stylesheet to the public panel-color token. */
function CssSkipNav(): JSX.Element {
  return (
    <div class="skip-nav-css">
      <SkipNavLink data-testid="skip-nav-css-link">Skip to content</SkipNavLink>
      <SkipNavContent>Styled content</SkipNavContent>
    </div>
  );
}

const meta = {
  title: 'Components/Skip Nav',
  component: BasicSkipNav,
} satisfies Meta<typeof BasicSkipNav>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
export const CustomId: Story = { render: CustomSkipNav };
export const Child: Story = { render: ChildSkipNav };
export const CssOverride: Story = { render: CssSkipNav };
