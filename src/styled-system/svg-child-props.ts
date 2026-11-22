import { type JSX } from '@solidjs/web';

/** Attributes for a consumer-selected native SVG root. */
export type SvgChildAttributes = Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'ref'> & {
  ref?: ((element: SVGSVGElement) => void) | undefined;
};

/** Merged attributes for a selected native SVG root, which always carry the component's class. */
export type SvgChildProps = SvgChildAttributes & { class: string };

/** Return merged attributes for a selected native SVG root. */
export type GetSvgChildProps = (childProps?: SvgChildAttributes) => SvgChildProps;

/** Render a consumer-owned SVG with merged component attributes. */
export type RenderSvgChild = (getProps: GetSvgChildProps) => JSX.Element;
