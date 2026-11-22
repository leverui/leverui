import {
  RadialBarChart,
  RadialChart,
  type RadialBarChartProps,
  type RadialChartProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
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

export type RadialCssRejected = ExpectFalse<'css' extends keyof RadialChartProps ? true : false>;
export type RadialRecipeRejected = ExpectFalse<
  'recipe' extends keyof RadialChartProps ? true : false
>;
export type RadialBarCssRejected = ExpectFalse<
  'css' extends keyof RadialBarChartProps ? true : false
>;
export type RadialNativeStyleAccepted = ExpectTrue<
  Assignable<{ data: readonly []; class: string; style: { width: string } }, RadialChartProps>
>;
export type RadialBarNativeStyleAccepted = ExpectTrue<
  Assignable<{ data: readonly []; class: string; style: { width: string } }, RadialBarChartProps>
>;

/** Typecheck both installed radial chart APIs with native CSS hooks. */
export function PackedRadialCharts(): JSX.Element {
  return (
    <>
      <RadialChart
        data={[{ name: 'A', value: 10, color: 'teal.solid' }]}
        class="share"
        id="share-chart"
        data-chart="share"
        onClick={
          /** Keep the native root event type in the installed package. */ (event) => {
            event.currentTarget.dataset.packed = 'true';
          }
        }
      />
      <RadialBarChart
        data={[{ name: 'B', value: 20, color: 'teal.solid' }]}
        class="rings"
        id="ring-chart"
        data-chart="rings"
        onKeyDown={
          /** Keep the native keyboard event type in the installed package. */ (event) => {
            event.currentTarget.dataset.packed = event.key;
          }
        }
      />
    </>
  );
}
