import { createUniqueId, omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Checkbox, Switch, Tooltip } from '../../src';

/** Attach a Tooltip to the avatar root that owns its trigger id. */
export function TooltipWithAvatar(): JSX.Element {
  const id = createUniqueId();
  return (
    <Tooltip ids={{ trigger: id }} content="Mara Ellison is online">
      {
        /** Let `ids.root` own the avatar's id while keeping Tooltip events. */
        (getProps) => {
          const triggerProps = omit(getProps(), 'id');
          return (
            <Avatar.Root {...triggerProps} ids={{ root: id }}>
              <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
              <Avatar.Fallback name="Mara Ellison" />
            </Avatar.Root>
          );
        }
      }
    </Tooltip>
  );
}

/** Attach a Tooltip to the Checkbox label and its native input. */
export function TooltipWithCheckbox(): JSX.Element {
  const id = createUniqueId();
  return (
    <Tooltip ids={{ trigger: id }} content="We send one email every Monday">
      {
        /** Let `ids.root` own the Checkbox id while keeping hover and focus. */
        (getProps) => {
          const triggerProps = omit(getProps(), 'id');
          return (
            <Checkbox.Root {...triggerProps} ids={{ root: id }}>
              <Checkbox.HiddenInput aria-describedby={getProps()['aria-describedby']} />
              <Checkbox.Control />
              <Checkbox.Label>Weekly summary</Checkbox.Label>
            </Checkbox.Root>
          );
        }
      }
    </Tooltip>
  );
}

/** Attach a Tooltip to the Switch label and native control. */
export function TooltipWithSwitch(): JSX.Element {
  const id = createUniqueId();
  return (
    <Tooltip ids={{ trigger: id }} content="Saves your changes every few seconds">
      {
        /** Let `ids.root` own the Switch id while keeping Tooltip events. */
        (getProps) => {
          const triggerProps = omit(getProps(), 'id');
          return (
            <Switch.Root {...triggerProps} ids={{ root: id }}>
              <Switch.HiddenInput aria-describedby={getProps()['aria-describedby']} />
              <Switch.Control />
              <Switch.Label>Auto-save</Switch.Label>
            </Switch.Root>
          );
        }
      }
    </Tooltip>
  );
}
