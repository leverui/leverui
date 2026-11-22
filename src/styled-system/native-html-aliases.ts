/** Native HTML attributes kept distinct from same-named style props. */
export interface NativeHtmlAliases {
  htmlWidth?: string | number | undefined;
  htmlHeight?: string | number | undefined;
  htmlSize?: number | undefined;
  htmlTranslate?: 'yes' | 'no' | undefined;
}

const nativeNames = {
  htmlWidth: 'width',
  htmlHeight: 'height',
  htmlSize: 'size',
  htmlTranslate: 'translate',
} as const satisfies Record<keyof NativeHtmlAliases, string>;

export type NativeHtmlAttributes = {
  [Alias in keyof NativeHtmlAliases as (typeof nativeNames)[Alias]]?: NativeHtmlAliases[Alias];
};

// Object.keys loses literal keys; the map is checked against the public alias interface.
export const nativeHtmlAliasNames = Object.keys(nativeNames) as Array<keyof NativeHtmlAliases>;

/** Convert html-prefixed props such as htmlWidth into native attribute names. */
export function nativeHtmlAttributes(props: NativeHtmlAliases): NativeHtmlAttributes {
  const attributes: NativeHtmlAttributes = {};
  for (const alias of nativeHtmlAliasNames) {
    const value = props[alias];
    if (value !== undefined) Object.assign(attributes, { [nativeNames[alias]]: value });
  }
  return attributes;
}
