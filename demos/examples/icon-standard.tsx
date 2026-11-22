import { type JSX } from '@solidjs/web';
import { Heart, Rotate3dIcon } from '@lucide/solid';
import { Icon, createIcon } from '../../src';
import './icon-colors.css';

/** Display a heart icon with Icon's sizing and color. */
export function IconBasic(): JSX.Element {
  return (
    <Icon as="span" size="lg" class="example-icon-pink">
      <Heart />
    </Icon>
  );
}

/** Show a Solid SVG icon component merged with Icon's sizing and color. */
export function IconWithSolidComponent(): JSX.Element {
  return (
    <Icon as="span" size="lg" class="example-icon-tomato">
      <Rotate3dIcon />
    </Icon>
  );
}

/** Merge Icon sizing and color into a consumer-owned SVG. */
export function IconWithCustomSvg(): JSX.Element {
  return (
    <Icon
      size="lg"
      class="example-icon-red"
      asChild={
        /** Spread the merged Icon attributes on the caller's SVG. */
        (getProps) => (
          <svg {...getProps()} viewBox="0 0 32 32">
            <g fill="currentColor">
              <path d="M16,11.5a3,3,0,1,0-3-3A3,3,0,0,0,16,11.5Z" />
              <path d="M16.868.044A8.579,8.579,0,0,0,16,0a15.99,15.99,0,0,0-.868,31.956A8.579,8.579,0,0,0,16,32,15.99,15.99,0,0,0,16.868.044ZM16,26.5a3,3,0,1,1,3-3A3,3,0,0,1,16,26.5ZM16,15A8.483,8.483,0,0,0,8.788,27.977,13.986,13.986,0,0,1,16,2a6.5,6.5,0,0,1,0,13Z" />
            </g>
          </svg>
        )
      }
    />
  );
}

const HeartIcon = createIcon({
  displayName: 'HeartIcon',
  path:
    /** Return fresh SVG path elements for each icon instance. */
    () => (
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
        />
      </>
    ),
});

/** Show the icon created from path data. */
export function IconWithCreateIcon(): JSX.Element {
  return <HeartIcon size="lg" class="example-icon-blue" />;
}
