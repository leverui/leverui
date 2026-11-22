import { type JSX } from '@solidjs/web';

/** The placeholder card brand mark, drawn in the card image's 24 by 16 view box. */
export function PlaceholderCardImage(): JSX.Element {
  return (
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g>
        <rect fill="#D8D8D8" x="0" y="0" width="24" height="16" rx="1" />
        <rect
          fill="#A6A6A6"
          x="0.923076923"
          y="10.3529412"
          width="4.61538462"
          height="1.88235294"
          rx="0.941176471"
        />
        <rect
          fill="#FFFFFF"
          x="16.6153846"
          y="3.76470588"
          width="4.61538462"
          height="2.82352941"
          rx="1"
        />
        <rect
          fill="#A6A6A6"
          x="6.46153846"
          y="10.3529412"
          width="4.61538462"
          height="1.88235294"
          rx="0.941176471"
        />
        <rect
          fill="#A6A6A6"
          x="11.9230769"
          y="10.3529412"
          width="5.61538462"
          height="1.88235294"
          rx="0.941176471"
        />
        <rect
          fill="#A6A6A6"
          x="18.4615385"
          y="10.3529412"
          width="4.61538462"
          height="1.88235294"
          rx="0.941176471"
        />
      </g>
    </g>
  );
}
