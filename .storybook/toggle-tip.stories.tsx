import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, FormatByte } from '../src';
import { ToggleGuideIcon } from './toggle-guide-icon';
import { InfoTipComposition, ToggleTipComposition } from './toggle-tip-composition';

const message = 'This is some additional information.';
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Show the plain icon trigger and Popover content. */
function BasicToggleTip(): JSX.Element {
  return (
    <>
      <div style={{ padding: '24px' }}>
        <ToggleTipComposition
          content={message}
          contentLabel="Additional information"
          contentTestId="tip-basic-content"
          trigger={
            /** Keep the public Button as the only trigger element. */
            (getProps) => (
              <Button
                {...getProps()}
                size="xs"
                variant="ghost"
                aria-label="Additional information"
                data-testid="tip-basic-trigger"
              >
                <ToggleGuideIcon name="info" />
              </Button>
            )
          }
        />
      </div>
    </>
  );
}

/** Compare arrow and dismissal options on independent information tips. */
function ToggleTipOptions(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', gap: '24px', padding: '80px' }}>
        <InfoTipComposition
          showArrow
          content={message}
          contentLabel="Arrow information"
          triggerLabel="Arrow information"
          triggerTestId="tip-arrow-trigger"
          contentTestId="tip-arrow-content"
        />
        <InfoTipComposition
          closeOnEscape={false}
          content={message}
          contentLabel="Escape dismissal information"
          triggerLabel="Escape dismissal information"
          triggerTestId="tip-escape-trigger"
          contentTestId="tip-escape-content"
        />
        <InfoTipComposition
          closeOnInteractOutside={false}
          content={message}
          contentLabel="Outside dismissal information"
          triggerLabel="Outside dismissal information"
          triggerTestId="tip-outside-trigger"
          contentTestId="tip-outside-content"
        />
        <button type="button" data-testid="tip-outside-target">
          Outside
        </button>
      </div>
    </>
  );
}

/** Show the file-size helper and all four Popover size variants. */
function ToggleTipSizes(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '32px', padding: '80px' }}>
        <div style={{ display: 'flex', 'align-items': 'center', gap: '8px' }}>
          <span>
            File size: <FormatByte value={1450.45} />
          </span>
          <InfoTipComposition
            content="The file size for content.tsx is 1.45kb"
            contentLabel="File size details"
            triggerLabel="File size information"
            triggerTestId="tip-file-trigger"
            contentTestId="tip-file-content"
          />
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <For each={sizes}>
            {
              /** Match each size on both Popover and Button. */
              (size) => (
                <InfoTipComposition
                  size={size}
                  buttonSize={size}
                  content={`This is the "${size}" size variant`}
                  contentLabel={`${size} size details`}
                  triggerLabel={`${size} size information`}
                  triggerTestId={`tip-${size}-trigger`}
                  contentTestId={`tip-${size}-content`}
                />
              )
            }
          </For>
        </div>
      </div>
    </>
  );
}

const meta = {
  title: 'Compositions/Toggle Tip',
  component: BasicToggleTip,
} satisfies Meta<typeof BasicToggleTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicToggleTip };
export const Options: Story = { render: ToggleTipOptions };
export const Sizes: Story = { render: ToggleTipSizes };
