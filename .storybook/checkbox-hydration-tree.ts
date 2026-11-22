import { createComponent, createSignal, merge } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  CheckboxCheckedChangeDetails,
  CheckboxCheckedState,
  CheckboxControl as ControlExport,
  CheckboxHiddenInput as HiddenInputExport,
  CheckboxIndicator as IndicatorExport,
  CheckboxGroup as GroupExport,
  CheckboxLabel as LabelExport,
  CheckboxRoot as RootExport,
  CheckboxRootProvider as RootProviderExport,
  CheckboxIndicatorMark,
  useCheckbox as UseCheckboxExport,
} from '../src';

type CheckboxHydrationComponents = {
  CheckboxControl: typeof ControlExport;
  CheckboxHiddenInput: typeof HiddenInputExport;
  CheckboxIndicator: typeof IndicatorExport;
  CheckboxGroup: typeof GroupExport;
  CheckboxLabel: typeof LabelExport;
  CheckboxRoot: typeof RootExport;
  CheckboxRootProvider: typeof RootProviderExport;
  useCheckbox: typeof UseCheckboxExport;
};

/** Give the checked custom SVG the indicator's live attributes. */
const renderCheckedMark: CheckboxIndicatorMark = (getProps) =>
  createComponent(
    Dynamic,
    merge({ component: 'svg' as const }, getProps({ 'data-testid': 'hydrated-checked-mark' }), {
      /** Keep custom checked geometry inside its forwarded SVG root. */
      get children() {
        return createComponent(Dynamic, { component: 'circle', cx: '12', cy: '12', r: '5' });
      },
    }),
  );

/** Give the mixed custom SVG the same native indicator contract. */
const renderMixedMark: CheckboxIndicatorMark = (getProps) =>
  createComponent(
    Dynamic,
    merge({ component: 'svg' as const }, getProps({ 'data-testid': 'hydrated-mixed-mark' }), {
      /** Keep custom mixed geometry inside its forwarded SVG root. */
      get children() {
        return createComponent(Dynamic, { component: 'path', d: 'M5 12h14' });
      },
    }),
  );

/** Build identical Checkbox machines and parts on the server and client. */
export function renderCheckboxHydrationTree({
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxRootProvider,
  useCheckbox,
}: CheckboxHydrationComponents): JSX.Element {
  const [checked, setChecked] = createSignal<CheckboxCheckedState>(false);
  const external = useCheckbox({ defaultChecked: true, name: 'external', value: 'yes' });

  /** Write a controlled primitive change back to the Solid signal. */
  function updateChecked(details: CheckboxCheckedChangeDetails): void {
    setChecked(details.checked);
  }

  /** Build a native input and its visible parts under the current machine. */
  function renderPlainParts(label: string): JSX.Element[] {
    return [
      createComponent(CheckboxControl, {}),
      createComponent(CheckboxLabel, { children: label }),
      createComponent(CheckboxHiddenInput, {}),
    ];
  }

  return [
    createComponent(CheckboxRoot, {
      defaultChecked: true,
      name: 'hydrated-updates',
      /** Create the uncontrolled parts under the primitive's provider. */
      get children() {
        return [
          createComponent(CheckboxControl, {
            /** Render custom content beneath the primitive's control provider. */
            get children() {
              return createComponent(CheckboxIndicator, { checked: renderCheckedMark });
            },
          }),
          createComponent(CheckboxLabel, { children: 'Hydrated updates' }),
          createComponent(CheckboxHiddenInput, {}),
        ];
      },
    }),
    createComponent(CheckboxRoot, {
      /** Follow the consumer-controlled signal. */
      get checked() {
        return checked();
      },
      onCheckedChange: updateChecked,
      name: 'hydrated-consent',
      /** Create the controlled parts under the primitive's provider. */
      get children() {
        return [
          createComponent(CheckboxControl, {}),
          createComponent(CheckboxLabel, { children: 'Hydrated consent' }),
          createComponent(CheckboxHiddenInput, {}),
        ];
      },
    }),
    createComponent(CheckboxRoot, {
      checked: 'indeterminate' as const,
      name: 'hydrated-mixed',
      /** Create mixed-state parts under the primitive's provider. */
      get children() {
        return [
          createComponent(CheckboxControl, {
            /** Render a custom mixed SVG beneath the primitive's provider. */
            get children() {
              return createComponent(CheckboxIndicator, { indeterminate: renderMixedMark });
            },
          }),
          createComponent(CheckboxLabel, { children: 'Hydrated mixed' }),
          createComponent(CheckboxHiddenInput, {}),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'form',
      'data-testid': 'hydrated-composition-form',
      /** Keep grouped controls in a native form on both render paths. */
      get children() {
        return [
          createComponent(CheckboxGroup, {
            name: 'topics',
            'aria-label': 'Topics',
            defaultValue: ['alpha'],
            maxSelectedValues: 1,
            'data-testid': 'hydrated-group',
            /** Build the group items under its selection context. */
            get children() {
              return [
                createComponent(CheckboxRoot, {
                  value: 'alpha',
                  /** Keep the first grouped control under the primitive's provider. */
                  get children() {
                    return renderPlainParts('Hydrated alpha');
                  },
                }),
                createComponent(CheckboxRoot, {
                  value: 'beta',
                  /** Keep the second grouped control under the primitive's provider. */
                  get children() {
                    return renderPlainParts('Hydrated beta');
                  },
                }),
              ];
            },
          }),
          createComponent(CheckboxRootProvider, {
            value: external,
            /** Render parts from the caller-owned machine. */
            get children() {
              return renderPlainParts('Hydrated external');
            },
          }),
        ];
      },
    }),
  ];
}
