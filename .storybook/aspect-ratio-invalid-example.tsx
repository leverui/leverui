import { render } from '@solidjs/web';
import { AspectRatio } from '../src';

export type InvalidRatioChild = 'none' | 'text' | 'multiple';

/** Capture the client error for an invalid ratio child shape. */
export function invalidAspectRatioMessage(kind: InvalidRatioChild): string {
  const host = document.createElement('div');
  const content = kind === 'none' ? null : kind === 'text' ? 'text' : [<div />, <span />];

  try {
    const dispose = render(
      /** Mount the component with its native content boundary. */
      () => <AspectRatio>{content}</AspectRatio>,
      host,
    );
    dispose();
    return 'accepted';
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
