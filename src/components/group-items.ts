import { groupAttributes } from './group-names';
import { createGroupItemOwnership } from './group-item-ownership';

export type GroupItemElement = HTMLElement | SVGElement | MathMLElement;
/** Decide whether a rendered direct child is excluded from Group positions. */
export type GroupSkip = (child: GroupItemElement) => boolean | undefined;

interface GroupItemSync {
  /** Index the current root's direct native children. */
  sync(group: HTMLElement, skip?: GroupSkip): void;
  /** Restore owned attributes and variables on disposal. */
  dispose(): void;
}

/** Create one group-scoped synchronizer that leaves consumer inline values intact. */
export function createGroupItemSync(): GroupItemSync {
  const ownership = createGroupItemOwnership();

  /** Mark direct children with the indices used by stacking styles. */
  function sync(group: HTMLElement, skip?: GroupSkip): void {
    const children = Array.from(group.children).filter(
      /** Keep only native elements managed as direct group items. */
      (child): child is GroupItemElement =>
        (child instanceof HTMLElement ||
          child instanceof SVGElement ||
          child instanceof MathMLElement) &&
        child.tagName !== 'STYLE',
    );
    ownership.releaseMissing(new Set(children));
    for (const child of children) {
      ownership.track(child);
      ownership.writeAttribute(child, groupAttributes.autoSkip, skip?.(child) ? '' : null);
    }
    const items = children.filter(
      /** Honor the Solid skip predicate and explicit skip marker. */
      (child) =>
        !child.hasAttribute(groupAttributes.skip) && !child.hasAttribute(groupAttributes.autoSkip),
    );

    for (const child of children) {
      const index = items.length < 2 ? -1 : items.indexOf(child);
      if (index < 0) {
        ownership.writeAttribute(child, groupAttributes.item, null);
        ownership.writeAttribute(child, groupAttributes.first, null);
        ownership.writeAttribute(child, groupAttributes.last, null);
        ownership.writeAttribute(child, groupAttributes.between, null);
        ownership.writeVariable(child, 'count');
        ownership.writeVariable(child, 'index');
        continue;
      }
      ownership.writeAttribute(child, groupAttributes.item, '');
      ownership.writeAttribute(child, groupAttributes.first, index === 0 ? '' : null);
      ownership.writeAttribute(child, groupAttributes.last, index === items.length - 1 ? '' : null);
      ownership.writeAttribute(
        child,
        groupAttributes.between,
        index > 0 && index < items.length - 1 ? '' : null,
      );
      ownership.writeVariable(child, 'count', String(items.length));
      ownership.writeVariable(child, 'index', String(index));
    }
  }

  return { sync, dispose: ownership.dispose };
}
