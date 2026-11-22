import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { SquareFrame, type ShapeRuntimeProps } from './square-frame';
import type { SizedBoxProps } from './square-size';

export type CircleProps<As extends NativeElementTag = 'div'> = SizedBoxProps<As>;

/** Center content in a sized native circle. */
function CircleRoot(props: ShapeRuntimeProps): JSX.Element {
  return <SquareFrame {...props} family="Circle" />;
}

/** Bind selected HTML attributes and refs to the native circle element. */
export const Circle = CircleRoot as <As extends NativeElementTag = 'div'>(
  props: CircleProps<As>,
) => JSX.Element;
