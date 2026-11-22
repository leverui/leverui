import { type JSX } from '@solidjs/web';
import { type UseMarqueeContext, useMarqueeContext } from './use-marquee-context';

export interface MarqueeContextProps {
  children: (context: UseMarqueeContext) => JSX.Element;
}

/** Render the Marquee context context through a function child. */
export const MarqueeContext = (props: MarqueeContextProps) => props.children(useMarqueeContext());
