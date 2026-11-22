import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Code, CodePropsProvider, Theme, type CodeProps } from '../src';
import './code-example.css';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['solid', 'subtle', 'outline', 'surface', 'plain'] as const;
type GetCodeChildProps = Parameters<NonNullable<CodeProps['asChild']>>[0];

/** Apply Code styling to a consumer-owned strong element. */
function renderStrong(getProps: GetCodeChildProps): JSX.Element {
  return (
    <strong {...getProps({})} data-testid="code-child">
      Child snippet
    </strong>
  );
}

/** Exercise inline Code choices, native props, and reactive defaults. */
function CodeMatrix(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [alternate, setAlternate] = createSignal(false);

  /** Change inherited size without replacing Code nodes. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change one mounted Code variant and color palette. */
  function toggleAppearance(): void {
    setAlternate(!alternate());
  }

  return (
    <>
      <div data-testid="code-matrix">
        <Code ref={markDefault} title="Build command" data-testid="code-default">
          npm run build
        </Code>
        {sizes.map(
          /** Render each guide size against authored Code CSS. */
          (size) => (
            <Code size={size} data-testid={`code-${size}`}>
              {size} snippet
            </Code>
          ),
        )}
        {variants.map(
          /** Render every inherited Badge appearance on Code. */
          (variant) => (
            <Code variant={variant} colorPalette="blue" data-testid={`code-${variant}`}>
              {variant} snippet
            </Code>
          ),
        )}
        <Code colorPalette="green" variant="solid" data-testid="code-green">
          Green snippet
        </Code>
        <Code size={{ base: 'xs', md: 'lg' }} data-testid="code-responsive">
          Responsive snippet
        </Code>
        <CodePropsProvider
          value={{ size: large() ? 'lg' : 'xs', variant: 'outline', class: 'provider-code' }}
        >
          <Code data-testid="code-inherited">Inherited snippet</Code>
          <Code class="fixed-code" size="sm" variant="solid" data-testid="code-fixed">
            Fixed snippet
          </Code>
        </CodePropsProvider>
        <Code
          variant={alternate() ? 'outline' : 'solid'}
          colorPalette={alternate() ? 'green' : 'blue'}
          data-testid="code-reactive"
        >
          Reactive snippet
        </Code>
        <Code as="span" data-testid="code-span">
          Selected snippet
        </Code>
        <Code asChild={renderStrong} title="Child code" class="consumer-child-code" />
        <Code
          variant="solid"
          colorPalette="blue"
          class="consumer-code"
          className="consumer-code-name"
          data-testid="code-css-class"
        >
          Styled snippet
        </Code>
        <Code unstyled data-testid="code-unstyled">
          Plain snippet
        </Code>
        <Code class="code-story-border" data-testid="code-border">
          Custom snippet
        </Code>
        <Code id="code-css-override" variant="solid" colorPalette="blue">
          CSS override
        </Code>
        <Theme appearance="dark" hasBackground={false}>
          <Code data-testid="code-dark">Dark snippet</Code>
          <Theme appearance="light" hasBackground={false}>
            <Code data-testid="code-nested-light">Nested light snippet</Code>
          </Theme>
        </Theme>
        <button type="button" onClick={toggleSize} data-testid="code-size-toggle">
          Toggle size
        </button>
        <button type="button" onClick={toggleAppearance} data-testid="code-appearance-toggle">
          Toggle appearance
        </button>
      </div>
    </>
  );
}

/** Record the native Code ref for browser assertions. */
function markDefault(element: HTMLElement): void {
  element.dataset.refTag = element.tagName.toLowerCase();
}

const meta = {
  title: 'Typography/Code',
  component: CodeMatrix,
} satisfies Meta<typeof CodeMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
