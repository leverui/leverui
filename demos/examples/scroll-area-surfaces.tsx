import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Flex, LocaleProvider, ScrollArea, Stack, Text } from '../../src';
import { ExampleParagraphs } from './example-paragraphs';
import './scroll-area-surfaces.css';

const twelveItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const tenItems = twelveItems.slice(0, 10);
const arabicText = [
  'مرحباً بكم في نظام التمرير المخصص',
  'هذا مثال على النص العربي في منطقة التمرير',
  'يدعم النظام اللغات التي تُكتب من اليمين إلى اليسار',
  'التمرير الأفقي يعمل بشكل صحيح مع النصوص العربية',
  'يمكنك رؤية كيف تتكيف أشرطة التمرير مع اتجاه النص',
  'النظام يدعم التمرير العمودي والأفقي في نفس الوقت',
  'يمكن تخصيص مظهر أشرطة التمرير حسب التصميم المطلوب',
  'التفاعل مع أشرطة التمرير سهل ومريح للمستخدم',
  'يعمل النظام بسلاسة على جميع المتصفحات الحديثة',
  'يمكن دمج هذا المكون مع مكونات أخرى بسهولة',
  'الأداء محسّن للتعامل مع كميات كبيرة من المحتوى',
] as const;

/** Show a vertically scrollable three-paragraph surface. */
export function ScrollAreaBasic(): JSX.Element {
  return (
    <ScrollArea.Root class="scroll-area-example-basic">
      <ScrollArea.Viewport>
        <ScrollArea.Content class="scroll-area-example-copy">
          <ExampleParagraphs paragraphs={3} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

/** Enable horizontal and vertical scrolling on a wide text surface. */
export function ScrollAreaBothDirections(): JSX.Element {
  return (
    <ScrollArea.Root class="scroll-area-example-both" size="xs">
      <ScrollArea.Viewport>
        <ScrollArea.Content class="scroll-area-example-copy scroll-area-example-wide">
          <ExampleParagraphs paragraphs={3} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner class="scroll-area-example-corner" />
    </ScrollArea.Root>
  );
}

/** Scroll a row of twelve fixed-width patterned items horizontally. */
export function ScrollAreaHorizontal(): JSX.Element {
  return (
    <ScrollArea.Root class="scroll-area-example-horizontal" size="xs">
      <ScrollArea.Viewport>
        <ScrollArea.Content class="scroll-area-example-horizontal-content">
          <Flex wrap="nowrap" class="scroll-area-example-row">
            <For each={twelveItems}>
              {(number) => (
                <div class="scroll-area-example-tile scroll-area-example-tile-horizontal">
                  Item {number}
                </div>
              )}
            </For>
          </Flex>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

/** Show Arabic content with right-to-left scrolling behavior. */
export function ScrollAreaWithRtl(): JSX.Element {
  return (
    <LocaleProvider locale="ar-AE">
      <ScrollArea.Root class="scroll-area-example-rtl" size="sm">
        <ScrollArea.Viewport>
          <ScrollArea.Content class="scroll-area-example-rtl-content">
            <For each={arabicText}>{(sentence) => <span>{sentence}</span>}</For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </LocaleProvider>
  );
}

/** Fade scrollable content at the active top and bottom edges. */
export function ScrollAreaWithScrollShadow(): JSX.Element {
  return (
    <ScrollArea.Root class="scroll-area-example-shadow-root">
      <ScrollArea.Viewport class="scroll-area-example-shadow">
        <ScrollArea.Content class="scroll-area-example-copy">
          <For each={tenItems}>
            {(number) => (
              <div class="scroll-area-example-tile scroll-area-example-tile-shadow">
                Item {number}
              </div>
            )}
          </For>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
}

/** Compare every ScrollArea size with identical paragraph content. */
export function ScrollAreaWithSizes(): JSX.Element {
  return (
    <Stack gap="8" class="scroll-area-example-stack">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {(size) => (
          <Stack gap="2">
            <Text class="scroll-area-example-label">size="{size}"</Text>
            <ScrollArea.Root size={size} class="scroll-area-example-size" variant="always">
              <ScrollArea.Viewport>
                <ScrollArea.Content class="scroll-area-example-copy">
                  <ExampleParagraphs paragraphs={2} />
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar />
            </ScrollArea.Root>
          </Stack>
        )}
      </For>
    </Stack>
  );
}
