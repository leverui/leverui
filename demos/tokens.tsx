import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  TokensAnimationStyle,
  TokensFocusRing,
  TokensLayerStyle,
  TokensTextStyles,
} from './examples/token-style-examples';
import { TokensStatusTokens } from './examples/token-status-example';
import {
  TokensAspectRatio,
  TokensBreakpoints,
  TokensEasings,
  TokensRadius,
} from './examples/token-basic-docs';
import { TokensShadows, TokensZIndex } from './examples/token-shadow-zindex-docs';
import { TokensDurations, TokensKeyframes } from './examples/token-motion-docs';
import { TokensSizes, TokensSpacing } from './examples/token-size-docs';
import {
  TokensFont,
  TokensFontSizes,
  TokensFontWeights,
  TokensLetterSpacings,
  TokensLineHeights,
} from './examples/token-typography-docs';
import { TokensColors, TokensSemanticColors } from './examples/token-color-docs';

export const meta = {
  component: TokensAnimationStyle,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const AnimationStyle: Story = { render: TokensAnimationStyle };
export const FocusRing: Story = { render: TokensFocusRing };
export const LayerStyle: Story = { render: TokensLayerStyle };
export const TextStyles: Story = { render: TokensTextStyles };
export const StatusTokens: Story = { render: TokensStatusTokens };
export const AspectRatio: Story = { render: TokensAspectRatio };
export const Radius: Story = { render: TokensRadius };
export const Breakpoints: Story = { render: TokensBreakpoints };
export const Easings: Story = { render: TokensEasings };
export const Shadows: Story = { render: TokensShadows };
export const ZIndex: Story = { render: TokensZIndex };
export const Durations: Story = { render: TokensDurations };
export const Keyframes: Story = { render: TokensKeyframes };
export const Sizes: Story = { render: TokensSizes };
export const Spacing: Story = { render: TokensSpacing };
export const Font: Story = { render: TokensFont };
export const FontSizes: Story = { render: TokensFontSizes };
export const FontWeights: Story = { render: TokensFontWeights };
export const LetterSpacings: Story = { render: TokensLetterSpacings };
export const LineHeights: Story = { render: TokensLineHeights };
export const Colors: Story = { render: TokensColors };
export const SemanticColors: Story = { render: TokensSemanticColors };
