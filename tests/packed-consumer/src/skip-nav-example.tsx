import { SkipNavContent, SkipNavLink } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Skip Nav with a custom target and consumer CSS. */
export function PackedSkipNav(): JSX.Element {
  const [target, setTarget] = createSignal('packed-main');

  /** Change the installed pair without replacing its native nodes. */
  function changeTarget(): void {
    setTarget('packed-updated-main');
  }

  return (
    <>
      <SkipNavLink id={target()} data-testid="packed-skip-link">
        Skip to main content
      </SkipNavLink>
      <button type="button" id="packed-skip-change" onClick={changeTarget}>
        Change target
      </button>
      <nav>
        <a href="#navigation">Repeated navigation</a>
      </nav>
      <SkipNavContent as="main" id={target()} data-testid="packed-skip-content">
        Installed main content
      </SkipNavContent>
      <SkipNavLink id="packed-child-main" data-testid="packed-child-skip-link">
        Skip to child content
      </SkipNavLink>
      <SkipNavContent
        id="packed-child-main"
        asChild={
          /** Apply destination attributes to a consumer-owned section. */
          (getProps) => <section {...getProps()} data-testid="packed-child-skip-content" />
        }
      >
        Consumer-owned content
      </SkipNavContent>
    </>
  );
}
