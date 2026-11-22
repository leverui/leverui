import { type JSX } from '@solidjs/web';
import { Button, Group } from '../src';

/** Remove joined edges and growth while changing orientation at md. */
export function GroupResponsiveDetachExample(): JSX.Element {
  return (
    <Group
      attached={{ base: true, md: false }}
      orientation={{ base: 'horizontal', md: 'vertical' }}
      grow={{ base: true, md: false }}
      stacking={{ base: 'last-on-top', md: 'first-on-top' }}
      style={{ width: '180px' }}
      data-testid="group-responsive-detach"
    >
      <Button variant="outline" data-testid="group-detach-first">
        First
      </Button>
      <Button variant="outline" data-testid="group-detach-last">
        Last
      </Button>
    </Group>
  );
}

/** Join vertical edges at md after starting as an ordinary row. */
export function GroupResponsiveAttachExample(): JSX.Element {
  return (
    <Group
      attached={{ base: false, md: true }}
      orientation={{ base: 'horizontal', md: 'vertical' }}
      data-testid="group-responsive-attach"
    >
      <Button variant="outline" data-testid="group-attach-first">
        First
      </Button>
      <Button variant="outline" data-testid="group-attach-last">
        Last
      </Button>
    </Group>
  );
}

/** Keep a native child's own radius when joined edges detach. */
export function GroupResponsiveRadiusExample(): JSX.Element {
  return (
    <Group attached={{ base: true, md: false }} data-testid="group-responsive-radius">
      <button type="button" data-testid="group-radius-first">
        First
      </button>
      <button type="button" data-testid="group-radius-last">
        Last
      </button>
    </Group>
  );
}
