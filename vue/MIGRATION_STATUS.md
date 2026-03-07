# Vue 3 组件迁移状态

## 当前结论

- 目标范围内的组件迁移已完成
- 本轮完成: `Autocomplete`、`Command`
- `vue/src/components/ui/index.ts` 已补齐对应导出

## 本轮完成

### 1. Autocomplete

已补齐以下文件:

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

实现说明:

- 使用 `radix-vue` 的 `Combobox` 组件族替代 `@base-ui/react/autocomplete`
- `AutocompleteInput` 改为直接绑定真实 `ComboboxInput`，避免 `as-child + Input.vue` 导致输入行为落不到原生 `<input>`
- 保持现有迁移约定: `TypeScript`、`script setup`、`class`、`v-bind="$attrs"`、`lucide-vue-next`

### 2. Command

已补齐以下文件:

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

实现说明:

- 使用 `radix-vue` 的 `Dialog` 组件族替代 `@base-ui/react/dialog`
- `Command` 基于新的 `Autocomplete` 封装构建
- 保留原 React 版的结构语义和主要样式层级

## 当前完成状态

已完成组件族:

- `NativeSelect`
- `ScrollArea`
- `Sheet`
- `DropdownMenu`
- `Sidebar`
- `Autocomplete`
- `Command`

当前迁移状态:

- 计划内待迁移组件: `0`
- 组件迁移任务: `完成`

## 验证结果

已验证:

- `pnpm exec vite build` 通过

未完全通过:

- `pnpm build` 仍被仓库内既有 TypeScript 问题阻塞，与本次迁移无直接关系
- 现存错误:
  - `src/components/ui/SidebarProvider.vue`
  - `src/composables/index.ts`

## 迁移约定

所有新增/更新文件均遵循以下规则:

- `className` → `class`
- `v-bind="$attrs"` 透传
- `script setup + TypeScript`
- `lucide-react` → `lucide-vue-next`
- 保留 `data-slot`
- 优先使用 `radix-vue` 替代 React Primitive
