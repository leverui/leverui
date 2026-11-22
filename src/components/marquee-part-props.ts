import type { Marquee as PrimitiveMarquee } from '../primitives/components/marquee';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';

type MarqueeEdgeBehavior = Pick<PrimitiveMarquee.EdgeBaseProps, 'side'>;
type MarqueePartBehavior = { unstyled?: boolean } & NativeHtmlAliases;

export type MarqueeViewportProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', MarqueePartBehavior, As>;
export type MarqueeContentProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', MarqueePartBehavior, As>;
export type MarqueeItemProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  MarqueePartBehavior,
  As
>;
export type MarqueeEdgeProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  MarqueeEdgeBehavior & MarqueePartBehavior,
  As
>;
