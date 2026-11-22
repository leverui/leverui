import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';

export type EditableIntrinsicElement = PrimitiveNativeTag;

/** Keep each Editable part's native tag and selected tag attributes precise. */
export type EditableElementProps<
  Tag extends EditableIntrinsicElement,
  As extends EditableIntrinsicElement = Tag,
> = PrimitiveNativeElementProps<
  Tag,
  NativeHtmlAliases & { unstyled?: boolean | undefined; className?: string | undefined },
  As
>;
