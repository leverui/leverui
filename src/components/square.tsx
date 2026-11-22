import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { SquareFrame, type ShapeRuntimeProps } from './square-frame';
import type { SizedBoxProps } from './square-size';

export type SquareProps<As extends NativeElementTag = 'div'> = SizedBoxProps<As>;

/** Center content in an equally sized native box with a stable class hook. */
function SquareRoot(props: ShapeRuntimeProps): JSX.Element {
  return <SquareFrame {...props} family="Square" />;
}

/** Bind selected HTML attributes and refs to the native square element. */
export const Square = SquareRoot as <As extends NativeElementTag = 'div'>(
  props: SquareProps<As>,
) => JSX.Element;
