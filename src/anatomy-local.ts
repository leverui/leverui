import { createAnatomy } from './primitives/components/anatomy';

export const actionBarAnatomy = createAnatomy('action-bar').parts(
  'positioner',
  'content',
  'separator',
  'selectionTrigger',
  'closeTrigger',
);

export const alertAnatomy = createAnatomy('alert').parts(
  'title',
  'description',
  'root',
  'indicator',
  'content',
);

export const breadcrumbAnatomy = createAnatomy('breadcrumb').parts(
  'link',
  'currentLink',
  'item',
  'list',
  'root',
  'ellipsis',
  'separator',
);

export const blockquoteAnatomy = createAnatomy('blockquote').parts(
  'root',
  'icon',
  'content',
  'caption',
);

export const cardAnatomy = createAnatomy('card').parts(
  'root',
  'header',
  'body',
  'footer',
  'title',
  'description',
);

export const checkboxCardAnatomy = createAnatomy('checkbox-card', [
  'root',
  'control',
  'label',
  'description',
  'addon',
  'indicator',
  'content',
]);

export const commandAnatomy = createAnatomy('command').parts(
  'root',
  'label',
  'control',
  'indicator',
  'input',
  'clearTrigger',
  'list',
  'item',
  'itemText',
  'itemCommand',
  'itemGroup',
  'itemGroupLabel',
  'empty',
  'loading',
  'separator',
  'footer',
);

export const dataListAnatomy = createAnatomy('data-list').parts(
  'root',
  'item',
  'itemLabel',
  'itemValue',
);

export const emptyStateAnatomy = createAnatomy('empty-state', [
  'root',
  'content',
  'indicator',
  'title',
  'description',
]);

export const listAnatomy = createAnatomy('list').parts('root', 'item', 'indicator');

export const nativeSelectAnatomy = createAnatomy('select').parts('root', 'field', 'indicator');

export const statAnatomy = createAnatomy('stat').parts(
  'root',
  'label',
  'helpText',
  'valueText',
  'valueUnit',
  'indicator',
);

export const statusAnatomy = createAnatomy('status').parts('root', 'indicator');

export const stepsAnatomy = createAnatomy('steps', [
  'root',
  'list',
  'item',
  'trigger',
  'indicator',
  'separator',
  'content',
  'title',
  'description',
  'nextTrigger',
  'prevTrigger',
  'progress',
]);

export const tableAnatomy = createAnatomy('table').parts(
  'root',
  'header',
  'body',
  'row',
  'columnHeader',
  'cell',
  'footer',
  'caption',
);

export const toastAnatomy = createAnatomy('toast').parts(
  'root',
  'title',
  'description',
  'indicator',
  'closeTrigger',
  'actionTrigger',
);

export const tabsAnatomy = createAnatomy('tabs').parts(
  'root',
  'trigger',
  'list',
  'content',
  'contentGroup',
  'indicator',
);

export const tagAnatomy = createAnatomy('tag').parts(
  'root',
  'label',
  'closeTrigger',
  'startElement',
  'endElement',
);

export const timelineAnatomy = createAnatomy('timeline').parts(
  'root',
  'item',
  'content',
  'separator',
  'indicator',
  'connector',
  'title',
  'description',
);

export const codeBlockAnatomy = createAnatomy('code-block', [
  'root',
  'content',
  'title',
  'header',
  'footer',
  'control',
  'overlay',
  'code',
  'codeText',
  'copyTrigger',
  'copyIndicator',
  'collapseTrigger',
  'collapseIndicator',
  'collapseText',
]);
