import { type JSX } from '@solidjs/web';

type SiteIconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'box'
  | 'check-lg'
  | 'chevron-left'
  | 'chevron-right'
  | 'code-square'
  | 'copy'
  | 'github'
  | 'list'
  | 'moon'
  | 'palette'
  | 'search'
  | 'shield-check'
  | 'stars'
  | 'sun'
  | 'terminal'
  | 'type'
  | 'window-stack'
  | 'x-lg';

interface SiteIconProps {
  name: SiteIconName;
  class?: string;
}

/** Render a decorative Bootstrap Icon with a consistent site class. */
export function SiteIcon(props: SiteIconProps): JSX.Element {
  return <i class={['site-icon', 'bi', `bi-${props.name}`, props.class]} aria-hidden="true" />;
}
