import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, type BoxProps } from '../src';
import './box-contract.css';

type GetBoxProps = Parameters<NonNullable<BoxProps['asChild']>>[0];

/** Exercise Box's native, CSS, polymorphic, and reactive rendering paths. */
function BoxContractExample(): JSX.Element {
  const [active, setActive] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);

  /** Capture the actual section element supplied through Solid's ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Confirm Box preserves SVG intrinsic selection and its native ref. */
  function markSvg(element: SVGSVGElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Confirm the asChild parent receives the rendered anchor. */
  function markParentLink(element: Element): void {
    element.setAttribute('data-parent-ref-tag', element.tagName.toLowerCase());
  }

  /** Confirm the child ref receives the same native anchor. */
  function markChildLink(element: HTMLElement): void {
    element.dataset.childRefTag = element.tagName.toLowerCase();
  }

  /** Count a click forwarded from a Box rendered through asChild. */
  function countClick(): void {
    setClicks(clicks() + 1);
  }

  /** Switch the consumer class while keeping the same Box element mounted. */
  function toggleColor(): void {
    setActive(!active());
  }

  /** Render a native anchor with Box's public class and click handler. */
  function renderAnchor(getProps: GetBoxProps): JSX.Element {
    return (
      <a
        {...getProps({ class: 'child-link', ref: markChildLink })}
        href="#box-target"
        data-testid="child-box"
      >
        Jump
      </a>
    );
  }

  return (
    <>
      <Box
        as="section"
        ref={markSection}
        data-testid="styled-box"
        aria-label="Box contract"
        class={active() ? 'consumer-box active-box' : 'consumer-box'}
      >
        Styled content
      </Box>
      <Box
        asChild={renderAnchor}
        class={active() ? 'consumer-child-box active-box' : 'consumer-child-box'}
        aria-label={active() ? 'Active link' : 'Inactive link'}
        onClick={countClick}
        ref={markParentLink}
      />
      <Box
        as="img"
        width={active() ? 80 : 40}
        height={20}
        style={{ width: '10px' }}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
        alt="Native image contract"
        data-testid="native-image-box"
      />
      <Box
        as="input"
        type="text"
        size={5}
        aria-label="Native size input"
        data-testid="native-size-box"
      />
      <Box as="svg" viewBox="0 0 20 20" aria-label="Native SVG" ref={markSvg} data-testid="svg-box">
        <circle cx="10" cy="10" r="8" />
      </Box>
      <Box class="consumer-hide-below" data-testid="hide-below-box">
        Wide only
      </Box>
      <Box class="consumer-hide-from" data-testid="hide-from-box">
        Narrow only
      </Box>
      <Box
        data-testid="conditional-box"
        class={active() ? 'consumer-conditional-box active-box' : 'consumer-conditional-box'}
      >
        Reactive CSS
      </Box>
      <button type="button" data-testid="box-toggle" onClick={toggleColor}>
        Toggle color
      </button>
      <output data-testid="box-clicks">{clicks()}</output>
      <div id="box-target">Target</div>
    </>
  );
}

const meta = {
  title: 'Components/Box',
  component: BoxContractExample,
} satisfies Meta<typeof BoxContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
