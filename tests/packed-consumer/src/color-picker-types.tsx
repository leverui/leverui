import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerEyeDropperTrigger,
  ColorPickerRoot,
  parseColor,
  useColorPicker,
  useColorPickerContext,
  type ColorPickerEyeDropperTriggerProps,
  type ColorPickerRootProps,
  type ColorPickerValueChangeDetails,
  type UseColorPickerProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type ColorValueAccepted = ExpectTrue<
  Assignable<{ defaultValue: ReturnType<typeof parseColor> }, UseColorPickerProps>
>;
export type InvalidColorRejected = ExpectFalse<
  Assignable<{ defaultValue: string }, UseColorPickerProps>
>;
export type NativeRootAccepted = ExpectTrue<
  Assignable<{ title: string; size: 'sm' }, ColorPickerRootProps>
>;
export type ColorPickerObjectCssRemoved = ExpectFalse<
  'css' extends keyof ColorPickerRootProps ? true : false
>;
export type ColorPickerRecipeRemoved = ExpectFalse<
  'recipe' extends keyof ColorPickerRootProps ? true : false
>;
export type ColorPickerStylePropRemoved = ExpectFalse<
  'bg' extends keyof ColorPickerRootProps ? true : false
>;
export type NativeEyeDropperAccepted = ExpectTrue<
  Assignable<
    { size: 'sm'; variant: 'outline'; loading: boolean },
    ColorPickerEyeDropperTriggerProps
  >
>;

/** Read the installed package's typed context accessor. */
function ConsumerContext(): JSX.Element {
  const machine = useColorPickerContext();
  return <output>{machine().value.toString('css')}</output>;
}

/** Compile named, namespace, machine, and button APIs from the packed archive. */
export function PackedColorPickerTypes(): JSX.Element {
  /** Check the public machine callback detail. */
  function reportValue(details: ColorPickerValueChangeDetails): void {
    if (details.valueAsString) return;
  }

  const machine = useColorPicker({
    defaultValue: parseColor('#eb5e41'),
    onValueChange: reportValue,
  });

  return (
    <>
      <ColorPicker.PropsProvider value={{ size: 'sm', variant: 'outline' }}>
        <ColorPicker.RootProvider value={machine}>
          <ColorPicker.Label>Typed color</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Input />
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <ColorPickerArea />
          <ColorPickerEyeDropperTrigger loading={false} size="sm" variant="outline" />
          <ConsumerContext />
          <ColorPicker.Context>
            {
              /** Read the machine through the namespace render prop. */
              (api) => <output>{api().value.toString('css')}</output>
            }
          </ColorPicker.Context>
        </ColorPicker.RootProvider>
        <ColorPickerRoot defaultValue={parseColor('#123456')}>
          <ColorPicker.Sliders />
          <ColorPicker.EyeDropper size="sm" variant="outline" />
        </ColorPickerRoot>
      </ColorPicker.PropsProvider>
    </>
  );
}
