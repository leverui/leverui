import { createSignal, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { BoxIcon, TrashIcon } from '@lucide/solid';
import { Badge, Button, Center, HStack, Span, Splitter, Stack } from '../../src';

const storageKey = 'splitter-sizes';

/** Persist the finished resize and restore the saved sizes on a later visit. */
export function SplitterWithStorage(): JSX.Element {
  const [sizes, setSizes] = createSignal<number[] | undefined>([70, 50]);
  const [ready, setReady] = createSignal(false);

  /** Read only valid numeric panel sizes from local storage. */
  function loadSizes(): void {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === 2 &&
          parsed.every(
            /** Accept only finite numeric panel sizes. */
            (size) => typeof size === 'number' && Number.isFinite(size),
          )
        ) {
          setSizes(parsed);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setReady(true);
  }

  /** Save the panel sizes after a completed drag or keyboard resize. */
  function saveSizes(details: { size: number[] }): void {
    window.localStorage.setItem(storageKey, JSON.stringify(details.size));
    setSizes(details.size);
  }

  /** Forget the saved layout and update the storage badge. */
  function clearStorage(): void {
    window.localStorage.removeItem(storageKey);
    setSizes(undefined);
  }

  onSettled(loadSizes);

  return (
    <Stack gap="4" align="start">
      <HStack
        justify="space-between"
        textStyle="sm"
        style={{
          'align-self': 'stretch',
        }}
      >
        <HStack gap="2" textStyle="sm">
          <Span>Drag to resize panels</Span>
        </HStack>
        <Show when={sizes()}>
          <Button size="xs" variant="ghost" onClick={clearStorage}>
            <TrashIcon /> Clear storage
          </Button>
        </Show>
      </HStack>
      <Show when={ready()}>
        <Splitter.Root
          panels={[{ id: 'a' }, { id: 'b' }]}
          defaultSize={sizes()}
          onResizeEnd={saveSizes}
          class="splitter-example-framed"
        >
          <Splitter.Panel id="a">
            <Center
              textStyle="2xl"
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              A
            </Center>
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" />
          <Splitter.Panel id="b">
            <Center
              textStyle="2xl"
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              B
            </Center>
          </Splitter.Panel>
        </Splitter.Root>
      </Show>
      <Badge>
        <BoxIcon /> LocalStorage{' '}
        {sizes()
          ? `[${sizes()
              ?.map(
                /** Format one stored panel percentage. */
                (size) => size.toFixed(1),
              )
              .join(', ')}]`
          : '[Not saved]'}
      </Badge>
    </Stack>
  );
}
