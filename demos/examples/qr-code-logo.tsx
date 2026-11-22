import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const symbolParts = [
  {
    fill: '#67BEE4',
    transform: 'translate(16.8 16.8) scale(0.94)',
    d: 'M250 170H310A80 80 0 0 1 390 250V390H170V250A80 80 0 0 1 250 170Z',
  },
  { fill: '#008DB8', transform: 'translate(16.8 30) scale(0.94)', d: 'M170 390H390V610H170Z' },
  {
    fill: '#125B76',
    transform: 'translate(16.8 43.2) scale(0.94)',
    d: 'M170 610H390V830A220 220 0 0 1 170 610Z',
  },
  { fill: '#008DB8', transform: 'translate(30 43.2) scale(0.94)', d: 'M390 610H610V830H390Z' },
  {
    fill: '#67BEE4',
    transform: 'translate(43.2 43.2) scale(0.94)',
    d: 'M610 610H830A220 220 0 0 1 610 830Z',
  },
] as const;

/** Render the Lever UI symbol in a fixed or fluid square. */
export function QrCodeLogo(props: { fluid?: boolean }): JSX.Element {
  return (
    <svg
      width={props.fluid ? '100%' : '40'}
      height={props.fluid ? '100%' : '40'}
      viewBox="80 80 840 840"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <For each={symbolParts}>
        {
          /** Draw one block of the symbol. */
          (part) => <path fill={part.fill} transform={part.transform} d={part.d} />
        }
      </For>
    </svg>
  );
}
