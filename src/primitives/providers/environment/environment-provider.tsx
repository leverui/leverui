import { getDocument, getWindow } from '@zag-js/dom-query';
import { Show, createMemo, createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { primitive } from '../../components/factory';
import { runIfFn } from '../../utils/run-if-fn';
import { EnvironmentContextProvider, type RootNode } from './use-environment-context';

export interface EnvironmentProviderProps {
  children?: JSX.Element | undefined;
  value?: RootNode | (() => RootNode) | undefined;
}

/**
 * Report the hidden probe element once it is in the document. Solid 2 runs
 * refs before the element is attached, when its root is the element itself
 * and its owner document may be a template's inert document.
 */
const RootProbe = (props: { onAttach: (element: HTMLSpanElement) => void }) => {
  let element: HTMLSpanElement | undefined;
  onSettled(() => {
    let frames = 0;
    let frame: number | undefined;
    /** Report the probe once it is connected; a portal may attach it a frame later. */
    const report = (): void => {
      if (!element) return;
      if (element.isConnected) {
        props.onAttach(element);
        return;
      }
      if (frames++ < 10) frame = requestAnimationFrame(report);
    };
    report();
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  });
  return (
    <primitive.span
      hidden
      ref={(node: HTMLSpanElement) => {
        element = node;
      }}
    />
  );
};

/** Provide the Environment provider to its children. */
export const EnvironmentProvider = (props: EnvironmentProviderProps) => {
  const [spanRef, setSpanRef] = createSignal<HTMLSpanElement>();
  /** Get the root node. */
  const getRootNode = () => {
    const span = spanRef();
    return runIfFn(props.value) ?? (span?.isConnected ? span.getRootNode() : undefined) ?? document;
  };

  const environment = createMemo(() => ({
    getRootNode,
    /** Get the document. */
    getDocument: () => getDocument(getRootNode()),
    /** Get the window. */
    getWindow: () => getWindow(getRootNode()),
  }));

  return (
    <EnvironmentContextProvider value={environment}>
      {props.children}
      <Show when={!props.value}>
        <RootProbe onAttach={setSpanRef} />
      </Show>
    </EnvironmentContextProvider>
  );
};
