import {
  ScrollArea,
  ScrollAreaContext,
  ScrollAreaRoot,
  ScrollAreaViewport,
  useScrollArea,
  useScrollAreaContext,
  type ScrollAreaRootProps,
  type ScrollAreaScrollbarProps,
  type UseScrollAreaProps,
  type UseScrollAreaReturn,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

const rootProps: ScrollAreaRootProps = {
  id: 'packed-scroll-area',
  style: { height: '10rem', width: '20rem' },
  size: 'sm',
  variant: 'always',
};
const scrollbarProps: ScrollAreaScrollbarProps = { orientation: 'horizontal' };
const machineProps: UseScrollAreaProps = { id: 'packed-scroll-machine' };

/** Compile the installed root, parts, hooks, context, and native styles. */
export function PackedScrollAreaTypes(): JSX.Element {
  const machine: UseScrollAreaReturn = useScrollArea(machineProps);

  /** Read the machine from within an installed root. */
  function State(): JSX.Element {
    const area = useScrollAreaContext();
    return <output>{area().isAtBottom ? 'bottom' : 'away'}</output>;
  }

  return (
    <>
      <ScrollArea.RootProvider value={machine} style={{ height: '10rem' }}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>External machine</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar {...scrollbarProps} />
        <ScrollAreaContext>
          {/** Confirm the public machine context accepts its child callback. */}
          {(area) => <span>{area().isAtBottom ? 'bottom' : 'away'}</span>}
        </ScrollAreaContext>
      </ScrollArea.RootProvider>
      <ScrollAreaRoot {...rootProps}>
        <ScrollAreaViewport>
          <ScrollArea.Content>Installed package</ScrollArea.Content>
        </ScrollAreaViewport>
        <ScrollArea.Scrollbar />
        <State />
      </ScrollAreaRoot>
    </>
  );
}
