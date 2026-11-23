import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Icon } from '../src';
import { switchGuideIcons } from './switch-guide-icons.mjs';

export type SwitchGuideIconName = keyof typeof switchGuideIcons;

/** Render pinned guide glyphs through Lever UI's public Icon styling. */
export function SwitchGuideIcon(props: {
  name: SwitchGuideIconName;
  color?: string;
  raw?: boolean;
}): JSX.Element {
  /** Read the selected glyph when the icon name changes. */
  const glyph = () => switchGuideIcons[props.name];
  return (
    <Show
      when={props.raw}
      fallback={
        <Icon
          data-icon={props.name}
          viewBox={glyph().viewBox}
          width="1em"
          height="1em"
          fill="currentColor"
          style={{
            color: props.color ? `var(--lui-colors-${props.color.replace('.', '-')})` : undefined,
          }}
        >
          <path d={glyph().path} />
        </Icon>
      }
    >
      <svg
        data-icon={props.name}
        aria-hidden="true"
        viewBox={glyph().viewBox}
        width="1em"
        height="1em"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="0"
        style={{ color: props.color }}
      >
        <path
          d={glyph().path}
          fill-rule={props.name === 'check' || props.name === 'x' ? 'evenodd' : undefined}
          clip-rule={props.name === 'check' || props.name === 'x' ? 'evenodd' : undefined}
        />
      </svg>
    </Show>
  );
}
