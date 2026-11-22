import { type JSX } from '@solidjs/web';
import { PackedAvatar } from './avatar-example';
import { PackedBadge } from './badge-example';
import { PackedBlockquote } from './blockquote-example';
import { PackedCard } from './card-example';
import { PackedCode } from './code-example';
import { PackedCodeBlock } from './code-block-example';

/** Render the packaged identity and framed-content specimens. */
export default function PackedPresentationFeedback(): JSX.Element {
  return (
    <>
      <PackedAvatar />
      <PackedBadge />
      <PackedBlockquote />
      <PackedCard />
      <PackedCode />
      <PackedCodeBlock />
    </>
  );
}
