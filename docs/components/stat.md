# Stat

Shows a single number with its label, and how it changed, such as revenue this
month.

```tsx
import { Stat } from '@leverui/components';
```

```tsx
<Stat.Root>
  <Stat.Label />
  <Stat.ValueText />
  <Stat.HelpText />
  <Stat.UpIndicator />
</Stat.Root>
```

## Closed Component

Uses [`InfoTip`](toggle-tip.md).

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import {
  Badge,
  FormatNumber,
  type FormatNumberProps,
  InfoTip,
  Stat as LeverUIStat,
  type StatRootProps,
} from '@leverui/components';

export type StatProps = StatRootProps & {
  label?: JSX.Element;
  value?: number | undefined;
  info?: JSX.Element;
  valueText?: JSX.Element;
  formatOptions?: Omit<FormatNumberProps, 'value'> | undefined;
  change?: number | undefined;
};

export function Stat(props: StatProps) {
  const root = omit(props, 'label', 'value', 'info', 'valueText', 'formatOptions', 'change');

  function change(): number {
    return props.change ?? 0;
  }

  return (
    <LeverUIStat.Root {...root}>
      <Show when={props.label}>
        <LeverUIStat.Label>
          {props.label}
          <Show when={props.info}>
            <InfoTip>{props.info}</InfoTip>
          </Show>
        </LeverUIStat.Label>
      </Show>
      <LeverUIStat.ValueText>
        <Show
          when={props.valueText}
          fallback={<FormatNumber value={props.value ?? 0} {...props.formatOptions} />}
        >
          {props.valueText}
        </Show>
      </LeverUIStat.ValueText>
      <Show when={props.change != null}>
        <Badge colorPalette={change() > 0 ? 'green' : 'red'} style={{ gap: '0' }}>
          <Show when={change() > 0} fallback={<LeverUIStat.DownIndicator />}>
            <LeverUIStat.UpIndicator />
          </Show>
          <FormatNumber value={Math.abs(change())} style="percent" maximumFractionDigits={2} />
        </Badge>
      </Show>
    </LeverUIStat.Root>
  );
}
```

## Guides

### Semantics

`Stat.Root` renders a `<dl>`, `Stat.Label` a `<dt>`, and `Stat.ValueText` a
`<dd>`. `Stat.HelpText` and `Stat.ValueUnit` render `<span>` elements. Each
indicator renders an arrow icon and sets `data-type` to `up` or `down`. Pass
children to replace the icon.

### StatGroup

`StatGroup` renders a `div` with `role="group"`. Its stats wrap when they do
not fit. It passes its size to the stats inside it. A size on a stat wins.
`StatPropsProvider` gives the stats inside it reactive default props.

### Composition

Put a `FormatNumber`, an icon, a badge, or a progress bar inside the part where
it belongs. The parts do not format numbers or track whether a value went up or
down.

## Props

### Root

| Prop       | Default | Type                                     | Description                                    |
| ---------- | ------- | ---------------------------------------- | ---------------------------------------------- |
| `size`     | `md`    | `'sm' \| 'md' \| 'lg'` or responsive map | Stat size.                                     |
| `as`       | `dl`    | Native HTML tag                          | HTML tag to render.                            |
| `asChild`  | —       | Solid render function                    | Render your own element with the root's props. |
| `unstyled` | `false` | `boolean`                                | Turn off the Lever UI styles.                  |

Also takes `class`, `style`, standard HTML attributes, and a callback `ref`.

## Customize with CSS

Import `@leverui/components/styles.css`, then write plain CSS for the stable
part classes: `.lui-stat__group`, `.lui-stat__root`,
`.lui-stat__label`, `.lui-stat__valueText`, `.lui-stat__valueUnit`,
`.lui-stat__helpText`, and `.lui-stat__indicator`.

The root has `data-size`, plus `data-size-sm` through `data-size-2xl` for
responsive sizes. Indicators have `data-type="up"` or `"down"`. Colors and
spacing come from public `--lui-*` variables. Override them for a whole
theme or one stat. To give your own element a part's default styles, put that
part's class on it.

```css
.lui-stat__label {
  color: rebeccapurple;
}
```

## Explorer

Click a part name to highlight it in the preview.
