# Steps

Shows the steps of a process, such as a checkout, and which step the user is on.

```tsx
import { Steps } from '@leverui/components';
```

```tsx
<Steps.Root items={[{ value: 'account' }, { value: 'review' }]}>
  <Steps.List>
    <Steps.Item value="account">
      <Steps.Trigger>
        <Steps.Indicator />
        <Steps.Title />
        <Steps.Description />
      </Steps.Trigger>
      <Steps.Separator />
    </Steps.Item>
  </Steps.List>
  <Steps.Content value="account" />
  <Steps.CompletedContent />
  <Steps.PrevTrigger />
  <Steps.NextTrigger />
</Steps.Root>
```

## Guides

Each step in `items` has a `value`. Give the matching `Steps.Item` and
`Steps.Content` the same `value`. In a form, set `linear` and mark a step
`invalid: true` in `items` until its fields are valid: an invalid step blocks
moving forward, and `onNavigationBlocked` says why. Give each step a short title
and show each validation error next to its field.

## Props

### Root

| Prop                     | Default      | Type                                                                                                     | Description                                                                                  |
| ------------------------ | ------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `items`                  | —            | `StepItem[]`                                                                                             | The steps. Each has a `value`, plus optional `title`, `disabled`, `optional`, and `invalid`. |
| `value`                  | —            | `string`                                                                                                 | Current step, when you control it.                                                           |
| `defaultValue`           | first step   | `string`                                                                                                 | Current step on first render, when uncontrolled.                                             |
| `onValueChange`          | —            | `(details: ValueChangeDetails) => void`                                                                  | Called when the current step changes.                                                        |
| `completedValues`        | —            | `string[]`                                                                                               | Completed steps, when you control them.                                                      |
| `defaultCompletedValues` | `[]`         | `string[]`                                                                                               | Completed steps on first render, when uncontrolled.                                          |
| `onCompletedChange`      | —            | `(details: CompletedChangeDetails) => void`                                                              | Called when the completed steps change.                                                      |
| `onComplete`             | —            | `(details: CompleteDetails) => void`                                                                     | Called when the user moves past the last step.                                               |
| `onNavigationBlocked`    | —            | `(details: NavigationBlockedDetails) => void`                                                            | Called when a move is blocked, with the reason.                                              |
| `linear`                 | `false`      | `boolean`                                                                                                | Require the steps to be completed in order.                                                  |
| `orientation`            | `horizontal` | `'vertical' \| 'horizontal'`                                                                             | Steps run across the page or down it.                                                        |
| `ids`                    | —            | `ElementIds`                                                                                             | Your own ids for the elements inside.                                                        |
| `translations`           | —            | `IntlTranslations`                                                                                       | Text for the progress announcement.                                                          |
| `colorPalette`           | `gray`       | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | Color palette.                                                                               |
| `variant`                | `solid`      | `'solid' \| 'subtle'` or responsive map                                                                  | Steps style.                                                                                 |
| `size`                   | `md`         | `'xs' \| 'sm' \| 'md' \| 'lg'` or responsive map                                                         | Steps size.                                                                                  |
| `as`                     | `div`        | Native HTML tag                                                                                          | HTML tag to render.                                                                          |
| `asChild`                | —            | Solid render function                                                                                    | Render your own element with the root's props.                                               |
| `unstyled`               | `false`      | `boolean`                                                                                                | Turn off the Lever UI styles.                                                                |

Accepts `class` and `style`. `unstyled` also works on a single part.

## Customize with CSS

Override the public variables or style the part classes. Every public part,
including `Number` and `CompletedContent`, has a stable `.lui-steps__*`
class.

```css
.my-steps {
  --lui-colors-color-palette-solid: #145a80;
}

.my-steps .lui-steps__indicator {
  border-radius: 0.5rem;
}
```

Put the `my-steps` class on `Steps.Root`.

## Explorer

Click a part name to highlight it in the preview.
