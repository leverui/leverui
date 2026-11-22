import {
  Carousel,
  CarouselItem,
  CarouselRoot,
  useCarousel,
  type CarouselItemProps,
  type CarouselRootProps,
  type UseCarouselProps,
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
type HasKey<Props, Key extends PropertyKey> = Key extends keyof Props ? true : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type RootAcceptsMachineProps = ExpectTrue<
  Assignable<{ count: number; loop: boolean; page: number }, CarouselRootProps>
>;
export type RootRejectsInvalidOrientation = ExpectFalse<
  Assignable<{ orientation: 'diagonal' }, UseCarouselProps>
>;
export type ItemRequiresIndex = ExpectFalse<Assignable<object, CarouselItemProps>>;
export type RootRejectsObjectCss = ExpectFalse<HasKey<CarouselRootProps, 'css'>>;
export type RootRejectsBgShorthand = ExpectFalse<HasKey<CarouselRootProps, 'bg'>>;
export type ItemRejectsMinHeightShorthand = ExpectFalse<HasKey<CarouselItemProps, 'minH'>>;

/** Exercise direct and compound Carousel exports from an isolated install. */
export function CarouselConsumer(): JSX.Element {
  return (
    <CarouselRoot count={2} spacing="1rem" aria-label="Featured items">
      <Carousel.ItemGroup>
        <CarouselItem index={0}>First</CarouselItem>
        <Carousel.Item index={1}>Second</Carousel.Item>
      </Carousel.ItemGroup>
      <Carousel.Control>
        <Carousel.PrevTrigger />
        <Carousel.Indicators />
        <Carousel.NextTrigger />
        <Carousel.ProgressText />
      </Carousel.Control>
    </CarouselRoot>
  );
}

/** Exercise the public Solid machine accessor and compound store provider. */
export function CarouselStoreConsumer(): JSX.Element {
  const machine = useCarousel({ count: 2, defaultPage: 1 });
  return (
    <Carousel.RootProvider value={machine}>
      <Carousel.ItemGroup>
        <Carousel.Item index={0}>First</Carousel.Item>
        <Carousel.Item index={1}>Second</Carousel.Item>
      </Carousel.ItemGroup>
      <Carousel.ProgressText />
    </Carousel.RootProvider>
  );
}
