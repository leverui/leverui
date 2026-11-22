import { verifyPackedList } from './packed-consumer-list.mjs';
import { verifyPackedQrCode } from './packed-consumer-qr-code.mjs';
import { verifyPackedQuote } from './packed-consumer-quote.mjs';
import { verifyPackedSeparator } from './packed-consumer-separator.mjs';
import { verifyPackedSpan } from './packed-consumer-span.mjs';
import { verifyPackedStrong } from './packed-consumer-strong.mjs';
import { verifyPackedStat } from './packed-consumer-stat.mjs';
import { verifyPackedStatus } from './packed-consumer-status.mjs';
import { verifyPackedTable } from './packed-consumer-table.mjs';
import { verifyPackedTag } from './packed-consumer-tag.mjs';
import { verifyPackedTimeline } from './packed-consumer-timeline.mjs';

/** Verify installed content components in the consumer browser. */
export async function verifyPackedContent(page) {
  await verifyPackedList(page);
  await verifyPackedQrCode(page);
  await verifyPackedQuote(page);
  await verifyPackedSeparator(page);
  await verifyPackedSpan(page);
  await verifyPackedStrong(page);
  await verifyPackedStat(page);
  await verifyPackedStatus(page);
  await verifyPackedTable(page);
  await verifyPackedTag(page);
  await verifyPackedTimeline(page);
}
