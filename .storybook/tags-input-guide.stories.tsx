import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { InputGroup, TagsInput } from '../src';
import '../demos/tags-input-examples.css';

/** Keep multiple unbroken email tags within a constrained control. */
function LongTagsExample(): JSX.Element {
  return (
    <>
      <div style={{ width: '360px', padding: '24px' }}>
        <TagsInput.Root
          defaultValue={[
            'verylongemailaddressthatdoesnthavespaces@example.com',
            'anothersuperlongemailaddresswithoutanyspaceswhatsoever@verylongdomainname.com',
            'short@email.com',
          ]}
        >
          <TagsInput.Label>Email addresses</TagsInput.Label>
          <TagsInput.Control data-testid="long-tags-control">
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add email address" />
          </TagsInput.Control>
        </TagsInput.Root>
      </div>
    </>
  );
}

/** Place a leading icon beside a tag control and keep typing available. */
function StartElementExample(): JSX.Element {
  return (
    <>
      <div style={{ width: '360px', padding: '24px' }}>
        <TagsInput.Root defaultValue={['SolidJS', 'TypeScript']}>
          <TagsInput.Label>Tagged frameworks</TagsInput.Label>
          <InputGroup
            style={{ '--lui-group-gap': '0px' }}
            startElement={
              <svg
                data-testid="tags-start-icon"
                aria-hidden="true"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path d="M2 2h5l7 7-5 5-7-7V2z" fill="none" stroke="currentColor" />
              </svg>
            }
          >
            <TagsInput.Control class="tags-input-start-control" data-testid="tags-start-control">
              <TagsInput.Items />
              <TagsInput.Input placeholder="Add tagged framework" />
            </TagsInput.Control>
          </InputGroup>
        </TagsInput.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Guide',
  component: LongTagsExample,
} satisfies Meta<typeof LongTagsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LongTags: Story = { render: LongTagsExample };
export const StartElement: Story = { render: StartElementExample };
