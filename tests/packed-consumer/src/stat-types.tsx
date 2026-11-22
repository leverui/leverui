import { Stat, StatGroup, type StatGroupProps } from '@leverui/components';
import type * as LeverUIPackage from '@leverui/components';
import { type JSX } from '@solidjs/web';

type GroupRenderer = Extract<StatGroupProps, { asChild: unknown }>['asChild'];
type ExpectFalse<Value extends false> = Value;

export type StyleHookRemoved = ExpectFalse<
  'useStatStyles' extends keyof typeof LeverUIPackage ? true : false
>;

/** Read the caller-owned element type through the published group contract. */
function captureGroup(element: HTMLElement): void {
  element.dataset.groupRef = 'true';
}

/** Render a caller-owned native group through its child-props callback. */
function renderGroup(getProps: Parameters<GroupRenderer>[0]): JSX.Element {
  return <section {...getProps()} />;
}

/** Compile native, polymorphic, and caller-owned Stat attributes. */
export function AcceptedStatTypes(): JSX.Element {
  return (
    <StatGroup asChild={renderGroup} ref={captureGroup} size="lg">
      <Stat.Root id="typed-stat" size={{ base: 'sm', md: 'lg' }}>
        <Stat.Label title="Visitors">Visitors</Stat.Label>
        <Stat.ValueText as="div" role="presentation">
          42
        </Stat.ValueText>
      </Stat.Root>
    </StatGroup>
  );
}

/** Keep unsupported CSS objects, recipes, and style props outside public Stat types. */
export function RejectedStatTypes(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Stat has no CSS object prop. */}
      <Stat.Root css={{ padding: '4px' }} />
      {/* @ts-expect-error Stat has no custom recipe prop. */}
      <Stat.Root recipe={{ base: { color: 'red' } }} />
      {/* @ts-expect-error Stat has no arbitrary style-prop shortcut. */}
      <Stat.Label padding="4px" />
    </>
  );
}
