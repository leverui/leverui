import { splitProps } from '../primitives/utils/split-props';
import { createMemo, For, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { useCarouselAppearance } from './carousel-appearance';
import { useCarouselContext } from './carousel-machine';
import { CarouselIndicator, CarouselIndicatorGroup } from './carousel-parts';
import type { CarouselIndicatorProps } from './carousel-part-props';

type SharedIndicatorProps<Props> = Props extends unknown ? Omit<Props, 'index' | 'ref'> : never;

export type CarouselIndicatorsProps = SharedIndicatorProps<CarouselIndicatorProps> & {
  ref?: ((element: HTMLDivElement) => void) | undefined;
};

/** Render one indicator for every current machine page snap point. */
export function CarouselIndicators(props: CarouselIndicatorsProps): JSX.Element {
  const api = useCarouselContext();
  const [group, indicator] = splitProps(props, ['ref']);
  return (
    <CarouselIndicatorGroup ref={group.ref}>
      <For keyed={false} each={api().pageSnapPoints}>
        {
          /** Keep indicator indexes stable while snap points update. */
          (_, index) => <CarouselIndicator {...indicator} index={index} />
        }
      </For>
    </CarouselIndicatorGroup>
  );
}

export interface CarouselAutoplayIndicatorProps {
  play: JSX.Element;
  paused: JSX.Element;
}

/** Choose the caller's play or pause icon from current machine state. */
export function CarouselAutoplayIndicator(props: CarouselAutoplayIndicatorProps): JSX.Element {
  const api = useCarouselContext();
  return <>{api().isPlaying ? props.paused : props.play}</>;
}

type ProgressAppearance = { unstyled?: boolean | undefined; className?: string | undefined };
export type CarouselProgressTextProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  ProgressAppearance,
  As
>;
type RuntimeProgressTextProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  ProgressAppearance & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected native progress element without a style runtime. */
const NativeProgressElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Show the active page and total count with a stable CSS part hook. */
function CarouselProgressTextImpl(props: RuntimeProgressTextProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'class',
    'className',
    'unstyled',
    'as',
    'asChild',
    'ref',
  ]);
  const api = useCarouselContext();
  const appearance = useCarouselAppearance();
  const content = createMemo(
    /** Follow page and snap-point changes without replacing the element. */
    () => `${api().page + 1} / ${api().pageSnapPoints.length}`,
  );

  /** Forward the selected native node to the consumer. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and consumer classes reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames(
        'carousel__progressText',
        undefined,
        local.class,
        local.className,
      ),
      'data-unstyled': local.unstyled || appearance.unstyled() ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('CarouselProgressText', local.asChild, attributes, content)
      ) : (
        <NativeProgressElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeProgressElement>
      )}
    </>
  );
}

/** Bind the selected native tag to its matching ref type. */
export const CarouselProgressText = CarouselProgressTextImpl as <
  As extends NativeElementTag = 'div',
>(
  props: CarouselProgressTextProps<As>,
) => JSX.Element;
