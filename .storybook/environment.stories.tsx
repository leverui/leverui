import { createSignal, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal as SolidPortal } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { EnvironmentProvider, Portal, useEnvironmentContext } from '../src';

interface EnvironmentProbeProps {
  testId: string;
  expectedRoot?: Node | undefined;
}

/** Name the root kind reported by the public environment hook. */
function rootKind(root: Node): string {
  if (root.nodeType === 11) return 'shadow';
  if (root.nodeType === 9) return 'document';
  if (root.nodeType === 1) return 'element';
  return 'node';
}

/** Expose the resolved root, document, and window for browser checks. */
function EnvironmentProbe(props: EnvironmentProbeProps): JSX.Element {
  const environment = useEnvironmentContext();
  const [mounted, setMounted] = createSignal(false);

  /** Recheck DOM ownership after Solid adopts a portalled element. */
  function markMounted(): void {
    setMounted(true);
  }

  onSettled(markMounted);

  return (
    <output
      data-testid={props.testId}
      data-root={rootKind(environment().getRootNode())}
      data-matches={
        props.expectedRoot ? String(environment().getRootNode() === props.expectedRoot) : undefined
      }
      data-document={
        mounted() ? (environment().getDocument() === document ? 'main' : 'other') : 'pending'
      }
      data-window={
        mounted() ? (environment().getWindow() === window ? 'main' : 'other') : 'pending'
      }
    />
  );
}

/** Show implicit, nested, reactive, and iframe environment roots. */
function EnvironmentRootsExample(): JSX.Element {
  const [shadowRoot, setShadowRoot] = createSignal<ShadowRoot>();
  const [frameDocument, setFrameDocument] = createSignal<Document>();
  const [explicitMount, setExplicitMount] = createSignal<HTMLDivElement>();
  const [elementRoot, setElementRoot] = createSignal<HTMLDivElement>();
  const [useShadowRoot, setUseShadowRoot] = createSignal(false);
  let frame: HTMLIFrameElement | undefined;

  // Solid 2's Portal mounts into an element, so the shadow root gets one.
  const [shadowContainer, setShadowContainer] = createSignal<HTMLDivElement>();

  /** Attach an open shadow root and its portal container before rendering descendants. */
  function attachShadowHost(host: HTMLDivElement): void {
    const root = host.attachShadow({ mode: 'open' });
    const mount = document.createElement('div');
    root.append(mount);
    setShadowRoot(root);
    setShadowContainer(mount);
  }

  /** Read the iframe's own document after its initial navigation. */
  function captureFrameDocument(): void {
    if (frame?.contentDocument) setFrameDocument(frame.contentDocument);
  }

  /** Save the explicit portal destination inside the shadow root. */
  function captureExplicitMount(element: HTMLDivElement): void {
    setExplicitMount(element);
  }

  /** Save an element root inside the shadow tree. */
  function captureElementRoot(element: HTMLDivElement): void {
    setElementRoot(element);
  }

  /** Switch an explicit root without replacing its provider. */
  function toggleRoot(): void {
    setUseShadowRoot((current) => !current);
  }

  return (
    <div data-testid="environment-story">
      <EnvironmentProbe testId="environment-default" />
      <button type="button" data-testid="environment-toggle" onClick={toggleRoot}>
        Toggle root
      </button>
      <EnvironmentProvider value={() => (useShadowRoot() ? (shadowRoot() ?? document) : document)}>
        <EnvironmentProbe testId="environment-reactive" />
        <Portal>
          <span data-testid="environment-reactive-portal">Reactive portal</span>
        </Portal>
      </EnvironmentProvider>
      <EnvironmentProvider value={useShadowRoot() ? (shadowRoot() ?? document) : document}>
        <EnvironmentProbe testId="environment-direct" />
        <Portal>
          <span data-testid="environment-direct-portal">Direct value portal</span>
        </Portal>
      </EnvironmentProvider>
      <div data-testid="environment-shadow-host" ref={attachShadowHost} />
      <Show when={shadowContainer()}>
        {(container) => (
          <SolidPortal mount={container()}>
            <EnvironmentProvider>
              <EnvironmentProbe testId="environment-shadow" />
              <Portal>
                <span data-testid="environment-shadow-portal">Shadow portal</span>
              </Portal>
              <div data-testid="environment-element-host" ref={captureElementRoot} />
              <Show when={elementRoot()}>
                {(element) => (
                  <EnvironmentProvider value={element()}>
                    <EnvironmentProbe testId="environment-element" expectedRoot={element()} />
                    <Portal>
                      <span data-testid="environment-element-portal">Element root portal</span>
                    </Portal>
                  </EnvironmentProvider>
                )}
              </Show>
              <div data-testid="environment-explicit-host" ref={captureExplicitMount} />
              <Show when={explicitMount()}>
                {(mount) => (
                  <Portal mount={mount()}>
                    <span data-testid="environment-explicit-portal">Explicit portal</span>
                  </Portal>
                )}
              </Show>
              <EnvironmentProvider value={() => document}>
                <EnvironmentProbe testId="environment-nested" />
                <Portal>
                  <span data-testid="environment-nested-portal">Nested portal</span>
                </Portal>
              </EnvironmentProvider>
            </EnvironmentProvider>
          </SolidPortal>
        )}
      </Show>
      <iframe
        title="Environment frame"
        data-testid="environment-frame"
        ref={frame}
        onLoad={captureFrameDocument}
      />
      <Show when={frameDocument()}>
        {(frameRoot) => (
          <EnvironmentProvider value={frameRoot()}>
            <EnvironmentProbe testId="environment-iframe" />
            <Portal>
              <span data-testid="environment-iframe-portal">Frame portal</span>
            </Portal>
          </EnvironmentProvider>
        )}
      </Show>
    </div>
  );
}

const meta = {
  title: 'Utilities/Environment',
  component: EnvironmentRootsExample,
} satisfies Meta<typeof EnvironmentRootsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Roots: Story = {};
