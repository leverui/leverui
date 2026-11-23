import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Badge,
  Button,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  type SkeletonProps,
} from '../../src';

const description =
  'Your order has shipped and should arrive on Thursday. We will send you a text message when the driver is close.';

type GetSkeletonChildProps = Parameters<NonNullable<SkeletonProps['asChild']>>[0];

/** Show retained text beside a loaded SkeletonText instance. */
export function SkeletonTextWithChildren(): JSX.Element {
  return (
    <Stack gap="4">
      <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>loading is true:</Text>
      <SkeletonText noOfLines={5}>{description}</SkeletonText>
      <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>loading is false:</Text>
      <SkeletonText noOfLines={5} loading={false}>
        {description}
      </SkeletonText>
    </Stack>
  );
}

/** Put Skeleton styles directly on a selected Badge element. */
function renderBadge(getProps: GetSkeletonChildProps): JSX.Element {
  return <Badge {...getProps()}>Select</Badge>;
}

/** Compare an unrendered badge with a loaded nested badge. */
export function SkeletonWithChildren(): JSX.Element {
  return (
    <HStack gap="4">
      <Skeleton asChild={renderBadge} loading />
      <Skeleton loading={false}>
        <Badge>Select</Badge>
      </Skeleton>
    </HStack>
  );
}

/** Switch a text placeholder to its visible content with a button. */
export function SkeletonWithLoaded(): JSX.Element {
  const [loading, setLoading] = createSignal(true);

  /** Toggle the example between its loading and loaded states. */
  function toggleLoading(): void {
    setLoading(!loading());
  }

  return (
    <Stack align="flex-start" gap="4">
      <Skeleton style={{ height: 'var(--lui-sizes-6)' }} loading={loading()}>
        <Text>Your report is ready</Text>
      </Skeleton>
      <Button size="sm" onClick={toggleLoading}>
        Toggle
      </Button>
    </Stack>
  );
}

/** Color the moving shine gradient with pink and orange tokens. */
export function SkeletonWithStartEndColor(): JSX.Element {
  return (
    <Skeleton
      variant="shine"
      style={{
        width: '100%',
        height: 'var(--lui-sizes-5)',
        '--lui-skeleton-start-color': 'var(--lui-colors-pink-500)',
        '--lui-skeleton-end-color': 'var(--lui-colors-orange-500)',
      }}
    />
  );
}
