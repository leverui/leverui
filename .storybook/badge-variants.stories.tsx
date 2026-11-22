import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Badge, Group, Theme } from '../src';

const variants = ['solid', 'subtle', 'outline', 'surface', 'plain'] as const;
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Show all Badge variants, sizes, and a responsive selection. */
function BadgeVariantMatrix(): JSX.Element {
  return (
    <>
      <div data-testid="badge-variants">
        <Badge data-testid="badge-default">Default</Badge>
        {variants.map(
          /** Render each visible palette treatment. */
          (variant) => (
            <Badge variant={variant} colorPalette="blue" data-testid={`badge-variant-${variant}`}>
              {variant}
            </Badge>
          ),
        )}
        {sizes.map(
          /** Render each supported size with the same palette. */
          (size) => (
            <Badge
              size={size}
              variant="solid"
              colorPalette="blue"
              data-testid={`badge-size-${size}`}
            >
              {size}
            </Badge>
          ),
        )}
        <Badge
          size={{ base: 'xs', md: 'lg' }}
          variant="solid"
          colorPalette="blue"
          data-testid="badge-responsive"
        >
          Responsive
        </Badge>
        <Badge variant="solid" colorPalette="blue" data-testid="badge-css-override">
          Themed
        </Badge>
        <Badge variant="solid" colorPalette="green" data-testid="badge-green">
          Green
        </Badge>
        <Badge variant="outline" colorPalette="blue" data-testid="badge-icon">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill="currentColor" />
          </svg>
          New
        </Badge>
        <Group attached data-testid="badge-attached-group">
          <Badge variant="solid" colorPalette="blue" data-testid="badge-group-blue">
            First
          </Badge>
          <Badge variant="solid" colorPalette="green" data-testid="badge-group-green">
            Second
          </Badge>
        </Group>
        <Theme appearance="dark" hasBackground={false} data-testid="badge-dark-scope">
          <Badge variant="subtle" colorPalette="blue" data-testid="badge-scope-dark">
            Dark scope
          </Badge>
          <Theme appearance="light" hasBackground={false} data-testid="badge-light-scope">
            <Badge variant="subtle" colorPalette="blue" data-testid="badge-scope-light">
              Light scope
            </Badge>
          </Theme>
        </Theme>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Badge Variants',
  component: BadgeVariantMatrix,
} satisfies Meta<typeof BadgeVariantMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
