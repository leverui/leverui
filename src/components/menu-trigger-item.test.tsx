import { cleanup, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  MenuTriggerItem,
} from './menu-exports';

afterEach(cleanup);

/** Keep the child menu's anchor attribute once it links to its parent menu. */
async function verifiesTriggerItemAnchor(): Promise<void> {
  render(
    /** Mount a nested menu under an open parent menu. */
    () => (
      <MenuRoot defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuPositioner>
          <MenuContent>
            <MenuItem value="rename">Rename</MenuItem>
            <MenuRoot>
              <MenuTriggerItem data-testid="trigger-item">More</MenuTriggerItem>
              <MenuPositioner>
                <MenuContent>
                  <MenuItem value="duplicate">Duplicate</MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    ),
  );
  const item = screen.getByTestId('trigger-item');
  await waitFor(
    /** Wait for the child menu to link to its parent and mark its trigger item. */
    () => expect(item.getAttribute('data-menu-trigger-item')).toBeTruthy(),
  );
  expect(item).toHaveAttribute('aria-haspopup', 'menu');
}

it('keeps the nested menu anchored to its trigger item', verifiesTriggerItemAnchor);
