import { type JSX } from '@solidjs/web';
import { Button, Center, Square } from '../../src';

/** Show a green scoped palette with translucent border and text. */
export function SystemColorPalette(): JSX.Element {
  return (
    <Center class="consumer-system-palette" data-leverui-color-palette="green">
      3
    </Center>
  );
}

/** Run the two-second spin animation on a tomato square. */
export function SystemAnimation(): JSX.Element {
  return (
    <Square size="40px" class="consumer-system-animation">
      3
    </Square>
  );
}

/** Forward Button's appearance and semantics to a native link. */
export function SystemAsChild(): JSX.Element {
  return (
    <Button
      class="consumer-system-link"
      asChild={
        /** Keep native anchor navigation while inheriting Button styling. */
        (getProps) => (
          <a {...getProps()} href="dfd">
            Read the docs
          </a>
        )
      }
    />
  );
}

/** Use the public Button appearance directly on its semantic element. */
export function SystemButtonAppearance(): JSX.Element {
  return <Button size="md">Styled like a button</Button>;
}

/** Apply stable root and part hooks to a consumer-owned alert. */
export function SystemPartHooks(): JSX.Element {
  return (
    <div class="consumer-system-alert" data-variant="solid">
      <div class="consumer-system-alert__title">Alert title</div>
      <div class="consumer-system-alert__description">Alert description</div>
    </div>
  );
}
