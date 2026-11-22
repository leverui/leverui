import { createComponent, For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';

interface PackedSection {
  default: Component;
}

/** Render every typed section included in one packed consumer page. */
export function PackedSections(props: {
  modules: Readonly<Record<string, PackedSection>>;
}): JSX.Element {
  const modules = Object.values(props.modules);
  if (modules.length === 0) throw new Error('The packed consumer page has no sections.');
  return (
    <For each={modules}>
      {
        /** Mount each validated section component under the page provider. */
        (module) => createComponent(module.default, {})
      }
    </For>
  );
}
