import { omit, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type BrandLogoProps = JSX.SvgSVGAttributes<SVGSVGElement> & { size?: string | number };

/** A fictional company's name and its single-path mark on a 24-unit grid. */
interface BrandMark {
  readonly title: string;
  readonly path: string;
}

/** Turn one fictional brand mark into a Solid component. */
function brandLogo(mark: BrandMark): Component<BrandLogoProps> {
  /** Draw the mark's path at the requested size in the current text color. */
  return function BrandLogo(props) {
    const svgProps = omit(props, 'size');
    return (
      <svg
        role="img"
        aria-label={mark.title}
        viewBox="0 0 24 24"
        width={props.size ?? '1em'}
        height={props.size ?? '1em'}
        fill="currentColor"
        fill-rule="evenodd"
        {...svgProps}
      >
        <path d={mark.path} />
      </svg>
    );
  };
}

export const NorthwindLogo = brandLogo({
  title: 'Northwind',
  path: 'M12 2l8 20-8-5-8 5Z',
});
export const HalcyonLogo = brandLogo({
  title: 'Halcyon',
  path: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 10c2-2 4-2 6 0s4 2 6 0v2.5c-2 2-4 2-6 0s-4-2-6 0Z',
});
export const QuartzLogo = brandLogo({
  title: 'Quartz',
  path: 'M12 2l8.66 5v10L12 22l-8.66-5V7Zm0 4.5-4.76 2.75v5.5L12 17.5l4.76-2.75v-5.5Z',
});
export const LumenLogo = brandLogo({
  title: 'Lumen',
  path: 'M12 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10ZM11 1h2v4h-2Zm0 18h2v4h-2ZM1 11h4v2H1Zm18 0h4v2h-4ZM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4Zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4ZM5.6 19.8l-1.4-1.4 2.1-2.1 1.4 1.4ZM17.7 7.7l-1.4-1.4 2.1-2.1 1.4 1.4Z',
});
export const OrbitLogo = brandLogo({
  title: 'Orbit',
  path: 'M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20Zm0 3a7 7 0 1 0 0 14a7 7 0 1 0 0-14Zm0 4a3 3 0 1 1 0 6a3 3 0 1 1 0-6Z',
});
export const FernwayLogo = brandLogo({
  title: 'Fernway',
  path: 'M20 3C11 3 4 8 4 16c0 1.4.2 2.7.5 4C6.5 13 10.5 9 15.5 7c-4.5 3.5-7.5 8-8.5 14 9 0 13-7.5 13-18Z',
});
