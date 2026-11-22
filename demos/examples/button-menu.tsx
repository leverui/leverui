import { type JSX } from '@solidjs/web';
import { ChevronDownIcon } from '@lucide/solid';
import {
  Button,
  Group,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from '../../src';

/** Pair a primary Save action with the attached menu trigger. */
export function ButtonWithSplitMenu(): JSX.Element {
  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <Group attached>
        <Button variant="outline" size="sm">
          Save
        </Button>
        <MenuTrigger
          asChild={
            /** Render the menu trigger on the attached IconButton. */
            (getProps) => (
              <IconButton {...getProps()} variant="outline" size="sm" aria-label="Save options">
                <ChevronDownIcon />
              </IconButton>
            )
          }
        />
      </Group>
      <Portal>
        <MenuPositioner>
          <MenuContent>
            <MenuItem value="draft">Save as draft</MenuItem>
            <MenuItem value="publish">Save and publish</MenuItem>
            <MenuItem value="schedule">Save and schedule</MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
}
