# Vue 3 Component Migration Status

## Current Conclusion

- Migration of target components is complete
- This round completed: `Autocomplete`, `Command`
- `vue/src/components/ui/index.ts` exports updated accordingly

## This Round Completed

### 1. Autocomplete

Added the following files:

- `Autocomplete.vue`
- `AutocompleteInput.vue`
- `AutocompleteTrigger.vue`
- `AutocompletePopup.vue`
- `AutocompleteItem.vue`
- `AutocompleteSeparator.vue`
- `AutocompleteGroup.vue`
- `AutocompleteGroupLabel.vue`
- `AutocompleteEmpty.vue`
- `AutocompleteRow.vue`
- `AutocompleteValue.vue`
- `AutocompleteList.vue`
- `AutocompleteClear.vue`
- `AutocompleteStatus.vue`
- `AutocompleteCollection.vue`
- `useAutocompleteFilter.ts`

Implementation notes:

- Uses `Combobox` component family from `radix-vue` to replace `@base-ui/react/autocomplete`
- `AutocompleteInput` now directly binds to real `ComboboxInput`, avoiding input behavior issues from `as-child + Input.vue`
- Maintains existing migration conventions: `TypeScript`, `script setup`, `class`, `v-bind="$attrs"`, `lucide-vue-next`

### 2. Command

Added the following files:

- `CommandDialog.vue`
- `CommandDialogTrigger.vue`
- `CommandDialogPortal.vue`
- `CommandDialogBackdrop.vue`
- `CommandDialogViewport.vue`
- `CommandDialogPopup.vue`
- `Command.vue`
- `CommandInput.vue`
- `CommandList.vue`
- `CommandEmpty.vue`
- `CommandPanel.vue`
- `CommandGroup.vue`
- `CommandGroupLabel.vue`
- `CommandCollection.vue`
- `CommandItem.vue`
- `CommandSeparator.vue`
- `CommandShortcut.vue`
- `CommandFooter.vue`

Implementation notes:

- Uses `Dialog` component family from `radix-vue` to replace `@base-ui/react/dialog`
- `Command` is built on the new `Autocomplete` wrapper
- Preserves structural semantics and main style hierarchy from the original React version

## Current Completion Status

Completed component families:

- `NativeSelect`
- `ScrollArea`
- `Sheet`
- `DropdownMenu`
- `Sidebar`
- `Autocomplete`
- `Command`

Current migration status:

- Components pending migration in plan: `0`
- Component migration task: `Complete`

## Verification Results

Verified:

- `pnpm exec vite build` passed

Not fully passed:

- `pnpm build` is still blocked by existing TypeScript issues in the repository, not directly related to this migration
- Existing errors:
  - `src/components/ui/SidebarProvider.vue`
  - `src/composables/index.ts`

## Migration Conventions

All new/updated files follow these rules:

- `className` → `class`
- `v-bind="$attrs"` pass-through
- `script setup + TypeScript`
- `lucide-react` → `lucide-vue-next`
- Preserve `data-slot`
- Prefer `radix-vue` over React Primitives
