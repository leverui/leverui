import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel, useCarousel, type CarouselPageChangeDetails } from '../src';

const slides = ['Alpha', 'Beta', 'Gamma'];

/** Exercise a caller-controlled page and a caller-owned next button. */
function ControlledCarousel(): JSX.Element {
  const [page, setPage] = createSignal(0);

  /** Mirror the primitive's requested page into caller-owned state. */
  function updatePage(details: CarouselPageChangeDetails): void {
    setPage(details.page);
  }

  /** Move the controlled Carousel to its final page. */
  function jumpToLast(): void {
    setPage(2);
  }

  /** Mark the native button delivered to the part ref. */
  function captureParent(element: Element): void {
    element.setAttribute('data-parent-ref', 'true');
  }

  /** Mark the same button delivered to the child ref. */
  function captureChild(element: Element): void {
    element.setAttribute('data-child-ref', 'true');
  }

  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.Root
          count={slides.length}
          page={page()}
          onPageChange={updatePage}
          data-testid="carousel-controlled-root"
        >
          <Carousel.ItemGroup>
            <For keyed={false} each={slides}>
              {
                /** Preserve slide indexes while the controlled page changes. */
                (label, index) => (
                  <Carousel.Item index={index}>
                    <div style={{ height: '120px', background: '#dbeafe' }}>{label()}</div>
                  </Carousel.Item>
                )
              }
            </For>
          </Carousel.ItemGroup>
          <Carousel.Control>
            <Carousel.PrevTrigger data-testid="carousel-controlled-prev">
              Previous
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger
              ref={captureParent}
              asChild={
                /** Apply machine props to a caller-owned native button. */
                (getProps) => (
                  <button
                    {...getProps({ ref: captureChild })}
                    type="button"
                    data-testid="carousel-controlled-next"
                  >
                    Next custom
                  </button>
                )
              }
            />
            <Carousel.ProgressText data-testid="carousel-controlled-progress" />
          </Carousel.Control>
          <Carousel.Context>
            {
              /** Expose the same page through the public machine context. */
              (api) => <output data-testid="carousel-context-page">{api().page}</output>
            }
          </Carousel.Context>
        </Carousel.Root>
        <button type="button" onClick={jumpToLast} data-testid="carousel-jump-last">
          Last page
        </button>
        <output data-testid="carousel-controlled-value">{page()}</output>
      </div>
    </>
  );
}

/** Exercise a caller-owned primitive machine through RootProvider. */
function StoreCarousel(): JSX.Element {
  const machine = useCarousel({ count: slides.length, defaultPage: 1 });

  /** Move the external machine to its final page. */
  function scrollToLast(): void {
    machine().scrollToIndex(2);
  }

  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.PropsProvider value={{ spacing: '24px' }}>
          <Carousel.RootProvider value={machine} data-testid="carousel-store-root">
            <Carousel.ItemGroup>
              <For keyed={false} each={slides}>
                {
                  /** Preserve each slide's index under the external machine. */
                  (label, index) => (
                    <Carousel.Item index={index}>
                      <div style={{ height: '120px', background: '#dbeafe' }}>{label()}</div>
                    </Carousel.Item>
                  )
                }
              </For>
            </Carousel.ItemGroup>
            <Carousel.Control>
              <Carousel.PrevTrigger data-testid="carousel-store-prev">
                Previous
              </Carousel.PrevTrigger>
              <Carousel.NextTrigger data-testid="carousel-store-next">Next</Carousel.NextTrigger>
              <Carousel.ProgressText data-testid="carousel-store-progress" />
            </Carousel.Control>
          </Carousel.RootProvider>
        </Carousel.PropsProvider>
        <button type="button" onClick={scrollToLast} data-testid="carousel-store-jump">
          Move store
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Carousel/State',
  component: ControlledCarousel,
} satisfies Meta<typeof ControlledCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = {};
export const Store: Story = { render: StoreCarousel };
