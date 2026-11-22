import assert from 'node:assert/strict';
import {
  TimelineConnector,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineRoot,
  TimelineSeparator,
  TimelineTitle,
} from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Timeline parts with packaged CSS. */
function renderPackedTimeline() {
  return renderToString(
    /** Construct the native list through the public package. */
    () =>
      createComponent(TimelineRoot, {
        id: 'packed-server-timeline',
        size: 'sm',
        /** Mount one event under the root context. */
        get children() {
          return createComponent(TimelineItem, {
            /** Keep the marker and content under the native item. */
            get children() {
              return [
                createComponent(TimelineConnector, {
                  /** Place the line behind the event marker. */
                  get children() {
                    return [
                      createComponent(TimelineSeparator, {}),
                      createComponent(TimelineIndicator, { children: '1' }),
                    ];
                  },
                }),
                createComponent(TimelineContent, {
                  /** Render the public title part. */
                  get children() {
                    return createComponent(TimelineTitle, { children: 'Installed event' });
                  },
                }),
              ];
            },
          });
        },
      }),
  );
}

const markup = renderPackedTimeline();
assert.match(markup, /<div[^>]*id="packed-server-timeline"[^>]*role="list"/);
assert.match(markup, /<div[^>]*role="listitem"/);
assert.match(markup, /leverui-timeline__indicator/);
assert.match(markup, /Installed event/);
assert.doesNotMatch(markup, /<div[^>]*\s(?:size|variant|showLastSeparator)=/);
assert.doesNotMatch(markup, /data-leverui-private-style-runtime/);
