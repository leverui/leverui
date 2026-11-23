import { type JSX } from '@solidjs/web';
import { HStack, Skeleton, SkeletonCircle, SkeletonText, Stack, Text } from '../../src';

/** Pair a circular avatar placeholder with two text bars. */
export function SkeletonBasic(): JSX.Element {
  return (
    <HStack gap="5">
      <SkeletonCircle size="12" />
      <Stack style={{ flex: '1' }}>
        <Skeleton style={{ height: 'var(--lui-sizes-5)' }} />
        <Skeleton style={{ height: 'var(--lui-sizes-5)', width: '80%' }} />
      </Stack>
    </HStack>
  );
}

/** Show avatar, text, and media placeholders for a feed card. */
export function SkeletonForFeed(): JSX.Element {
  return (
    <Stack gap="6" style={{ 'max-width': 'var(--lui-sizes-xs)' }}>
      <HStack style={{ width: '100%' }}>
        <SkeletonCircle size="10" />
        <SkeletonText noOfLines={2} />
      </HStack>
      <Skeleton style={{ height: '200px' }} />
    </Stack>
  );
}

/** Render three placeholder lines with spacing. */
export function SkeletonForText(): JSX.Element {
  return <SkeletonText noOfLines={3} gap="4" />;
}

/** Compare the pulse and shine CSS variants. */
export function SkeletonWithVariants(): JSX.Element {
  return (
    <Stack gap="5">
      <HStack gap="5">
        <Text style={{ width: '8ch' }}>pulse</Text>
        <Skeleton style={{ flex: '1', height: 'var(--lui-sizes-5)' }} variant="pulse" />
      </HStack>
      <HStack gap="5">
        <Text style={{ width: '8ch' }}>shine</Text>
        <Skeleton style={{ flex: '1', height: 'var(--lui-sizes-5)' }} variant="shine" />
      </HStack>
    </Stack>
  );
}
