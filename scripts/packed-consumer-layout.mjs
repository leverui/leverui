import { verifyPackedAbsoluteCenter } from './packed-consumer-absolute-center.mjs';
import { verifyPackedAspectRatio } from './packed-consumer-aspect-ratio.mjs';
import { verifyPackedBleed } from './packed-consumer-bleed.mjs';
import { verifyPackedCenter } from './packed-consumer-center.mjs';
import { verifyPackedCircle } from './packed-consumer-circle.mjs';
import { verifyPackedSquare } from './packed-consumer-square.mjs';
import { verifyPackedStack } from './packed-consumer-stack.mjs';
import { verifyPackedContainer } from './packed-consumer-container.mjs';
import { verifyPackedFlex } from './packed-consumer-flex.mjs';
import { verifyPackedFloat } from './packed-consumer-float.mjs';
import { verifyPackedGrid } from './packed-consumer-grid.mjs';
import { verifyPackedGroup } from './packed-consumer-group.mjs';
import { verifyPackedImage } from './packed-consumer-image.mjs';
import { verifyPackedSimpleGrid } from './packed-consumer-simple-grid.mjs';
import { verifyPackedSpacer } from './packed-consumer-spacer.mjs';
import { verifyPackedSticky } from './packed-consumer-sticky.mjs';
import { verifyPackedWrap } from './packed-consumer-wrap.mjs';

/** Verify every installed layout component in the independent browser app. */
export async function verifyPackedLayout(page) {
  await verifyPackedAbsoluteCenter(page);
  await verifyPackedAspectRatio(page);
  await verifyPackedBleed(page);
  await verifyPackedCenter(page);
  await verifyPackedCircle(page);
  await verifyPackedSquare(page);
  await verifyPackedStack(page);
  await verifyPackedContainer(page);
  await verifyPackedFlex(page);
  await verifyPackedFloat(page);
  await verifyPackedGrid(page);
  await verifyPackedGroup(page);
  await verifyPackedImage(page);
  await verifyPackedSimpleGrid(page);
  await verifyPackedSpacer(page);
  await verifyPackedSticky(page);
  await verifyPackedWrap(page);
}
