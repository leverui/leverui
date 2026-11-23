import { mergeProps } from '../primitives/utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import type { UseMarqueeReturn } from './marquee-machine';

const machineVariables = [
  '--marquee-duration',
  '--marquee-spacing',
  '--marquee-delay',
  '--marquee-loop-count',
  '--marquee-translate',
] as const;

type RootStyle = JSX.HTMLAttributes<HTMLElement>['style'];

/** Keep machine defaults inline while allowing public CSS variables to cascade. */
export function marqueeRootStyle(machine: UseMarqueeReturn, nativeProps: object): RootStyle {
  const machineStyle = machine().getRootProps().style as Record<string, string | number>;
  const defaults: Record<string, string | number | undefined> = {};
  for (const name of machineVariables) {
    defaults[name] = undefined;
    defaults[name.replace('--marquee-', '--lui-private-marquee-')] = machineStyle[name];
  }
  const callerStyle = (nativeProps as { style?: RootStyle }).style;
  return mergeProps({ style: defaults }, { style: callerStyle }).style as RootStyle;
}
