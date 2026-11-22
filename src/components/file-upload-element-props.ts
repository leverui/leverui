import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';

export type FileUploadIntrinsicElement = PrimitiveNativeTag;

export type FileUploadAppearance = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  className?: string | undefined;
};

/** Keep native refs precise and selected element refs honest. */
export type FileUploadElementProps<
  Tag extends FileUploadIntrinsicElement,
  Behavior = object,
  As extends FileUploadIntrinsicElement = Tag,
> = PrimitiveNativeElementProps<Tag, Behavior & FileUploadAppearance, As>;
