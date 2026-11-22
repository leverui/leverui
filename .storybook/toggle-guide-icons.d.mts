export type ToggleGuideIconNode =
  | { readonly tag: 'path'; readonly d: string }
  | { readonly tag: 'circle'; readonly cx: string; readonly cy: string; readonly r: string }
  | {
      readonly tag: 'line';
      readonly x1: string;
      readonly x2: string;
      readonly y1: string;
      readonly y2: string;
    };

export declare const toggleGuideIcons: Readonly<
  Record<'bold' | 'volume2' | 'volumeX' | 'x' | 'info', readonly ToggleGuideIconNode[]>
>;
