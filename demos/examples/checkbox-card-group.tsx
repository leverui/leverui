import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GlobeIcon, LockIcon, ShieldCheckIcon, UserIcon } from '@lucide/solid';
import { CheckboxCard, CheckboxGroup, Flex, Float, SimpleGrid, Text } from '../../src';
import './checkbox-card-layout.css';

const frameworks = [
  { value: 'next', title: 'Next.js', description: 'For full-stack apps' },
  { value: 'vite', title: 'Vite', description: 'For single-page apps' },
  { value: 'astro', title: 'Astro', description: 'For content sites' },
] as const;

const roles = [
  { icon: ShieldCheckIcon, label: 'Admin', description: 'Can change everything' },
  { icon: UserIcon, label: 'User', description: 'Can edit their own work' },
  { icon: GlobeIcon, label: 'Guest', description: 'Can view but not edit' },
  { icon: LockIcon, label: 'Blocked', description: 'Cannot sign in' },
] as const;

/** Let one Checkbox Group own selection across three framework cards. */
export function CheckboxCardWithGroup(): JSX.Element {
  return (
    <CheckboxGroup defaultValue={['next']}>
      <Text textStyle="sm" class="example-checkbox-card-group-label">
        Select frameworks
      </Text>
      <Flex class="example-checkbox-card-options">
        <For each={frameworks}>
          {
            /** Preserve each framework's checkbox value in the group. */
            (item) => (
              <CheckboxCard.Root value={item.value}>
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control>
                  <CheckboxCard.Content>
                    <CheckboxCard.Label>{item.title}</CheckboxCard.Label>
                    <CheckboxCard.Description>{item.description}</CheckboxCard.Description>
                  </CheckboxCard.Content>
                  <CheckboxCard.Indicator />
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            )
          }
        </For>
      </Flex>
    </CheckboxGroup>
  );
}

/** Compare four access roles in a responsive Checkbox Card grid. */
export function CheckboxCardWithIcon(): JSX.Element {
  return (
    <CheckboxGroup defaultValue={['Guest']}>
      <SimpleGrid minChildWidth="200px" class="example-checkbox-card-options">
        <For each={roles}>
          {
            /** Keep each role's icon and copy together. */
            (item) => (
              <CheckboxCard.Root align="center" value={item.label}>
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control>
                  <CheckboxCard.Content>
                    <item.icon class="example-checkbox-card-icon" />
                    <CheckboxCard.Label>{item.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{item.description}</CheckboxCard.Description>
                  </CheckboxCard.Content>
                  <Float placement="top-end" offset="6">
                    <CheckboxCard.Indicator />
                  </Float>
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            )
          }
        </For>
      </SimpleGrid>
    </CheckboxGroup>
  );
}
