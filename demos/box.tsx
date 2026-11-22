import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Badge, Box, Heading, HStack, Image, Text } from '../src';
import { withLayoutInset } from './examples/example-frame';
import './box-examples.css';
import { Star } from '@lucide/solid';

const property = {
  imageUrl: '/demo-images/scenes/home-beach-studio.webp',
  imageAlt: 'Modern single-storey home with a pool and patio',
  beds: 4,
  title: 'Modern home with a pool and garden, ten minutes from the beach',
  formattedPrice: '$310',
  reviewCount: 52,
  rating: 4.8,
};

/** Show a Box holding content, with its look set by a CSS class. */
function BoxBasic(): JSX.Element {
  return <Box class="box-example-panel">A Box holds content, like any container.</Box>;
}

/** Render a Box as a section, so it reads as one part of the page. */
function BoxWithAsProp(): JSX.Element {
  return (
    <Box as="section" class="box-example-panel">
      <Heading size="sm" class="box-example-heading">
        Shipping
      </Heading>
      <Text>This Box renders as a section element.</Text>
    </Box>
  );
}

/** Set the font size and line height from the theme with textStyle. */
function BoxWithTextStyle(): JSX.Element {
  return (
    <Box textStyle="lg" class="box-example-panel">
      Larger text for everything inside this Box.
    </Box>
  );
}

/** Compose the property card from primitive surfaces. */
function BoxPropertyCard(): JSX.Element {
  return (
    <Box class="box-example-card">
      <Image src={property.imageUrl} alt={property.imageAlt} />
      <Box class="box-example-card-body">
        <HStack>
          <Badge colorPalette="teal" variant="solid">
            Top host
          </Badge>
          <HStack gap="1" class="box-example-rating">
            <Star class="box-property-star" />
            <Text>
              {property.rating} ({property.reviewCount})
            </Text>
          </HStack>
        </HStack>
        <Text class="box-example-title">{property.title}</Text>
        <HStack class="box-example-meta">
          {property.formattedPrice} • {property.beds} beds
        </HStack>
      </Box>
    </Box>
  );
}

export const meta = {
  component: BoxBasic,
  decorators: [withLayoutInset],
  parameters: { guide: { outerInset: true } },
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: BoxBasic };
export const AsProp: Story = {
  name: 'AsProp',
  render: BoxWithAsProp,
  parameters: {
    guide: {
      description:
        '`as` sets the HTML tag. Use it so a container carries meaning, such as a `section` with a heading, or a `nav` around links.',
    },
  },
};
export const TextStyle: Story = {
  render: BoxWithTextStyle,
  parameters: {
    guide: {
      description: '`textStyle` sets the font size and line height for everything inside.',
    },
  },
};
export const Composition: Story = {
  render: BoxPropertyCard,
  parameters: {
    guide: {
      description: 'A listing card built from Box, Image, Badge, and Text.',
    },
  },
};
