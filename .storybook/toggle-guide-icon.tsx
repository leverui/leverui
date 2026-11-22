import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { toggleGuideIcons } from './toggle-guide-icons.mjs';

export type ToggleGuideIconName = keyof typeof toggleGuideIcons;

/** Draw a decorative Lucide glyph with the pinned React Icons geometry. */
export function ToggleGuideIcon(props: { name: ToggleGuideIconName }): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      data-icon={props.name}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <For each={toggleGuideIcons[props.name]}>
        {
          /** Select the exact path or line geometry for each glyph stroke. */
          (node) =>
            node.tag === 'path' ? (
              <path d={node.d} />
            ) : node.tag === 'circle' ? (
              <circle cx={node.cx} cy={node.cy} r={node.r} />
            ) : (
              <line x1={node.x1} x2={node.x2} y1={node.y1} y2={node.y2} />
            )
        }
      </For>
    </svg>
  );
}
