import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { EnvironmentProvider, useEnvironmentContext } from '../../src';
import { EnvironmentFrame } from './environment-frame';

interface WindowDimensions {
  w: number;
  h: number;
  match: boolean;
}

/** Display the owning window's dimensions and 600px media-query state. */
function WindowSize(): JSX.Element {
  const environment = useEnvironmentContext();
  const [dimensions, setDimensions] = createSignal<WindowDimensions>({
    w: 0,
    h: 0,
    match: false,
  });

  /** Read the current size and media query from the nearest DOM environment. */
  function updateDimensions(): void {
    const owner = environment().getWindow();
    setDimensions({
      w: owner.innerWidth,
      h: owner.innerHeight,
      match: owner.matchMedia('(min-width: 600px)').matches,
    });
  }

  /** Subscribe to size changes on this environment's window. */
  function startWatching(): (() => void) | undefined {
    const owner = environment().getWindow();
    owner.addEventListener('resize', updateDimensions);
    updateDimensions();
    /** Release this story's window listener when its frame unmounts. */
    return () => owner.removeEventListener('resize', updateDimensions);
  }

  onSettled(startWatching);
  return <pre>{JSON.stringify(dimensions())}</pre>;
}

/** Scope a second size display to the frame's window. */
function renderFrameSize(document: Document): JSX.Element {
  return (
    <EnvironmentProvider value={() => document}>
      <WindowSize />
    </EnvironmentProvider>
  );
}

/** Compare the outer viewport with a 300px iframe viewport. */
export function EnvironmentWithSize(): JSX.Element {
  return (
    <>
      <WindowSize />
      <EnvironmentFrame render={renderFrameSize} width="min(100%, 300px)" />
    </>
  );
}
